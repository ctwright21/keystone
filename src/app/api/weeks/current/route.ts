import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekStartInTimezone, getWeekEndInTimezone, getDayIndexInTimezone } from "@/lib/week-utils";
import { TROPHY_THRESHOLDS, getTrophyTier } from "@/lib/trophies";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's timezone and week start preference
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timezone: true, weekStartDay: true },
    });

    const timezone = user?.timezone || "America/New_York";
    const weekStartDay = user?.weekStartDay ?? 1; // 0 = Sunday, 1 = Monday

    // Calculate week boundaries in user's timezone
    const weekStart = getWeekStartInTimezone(timezone, weekStartDay);
    const weekEnd = getWeekEndInTimezone(timezone, weekStartDay);
    const currentDayIndex = getDayIndexInTimezone(timezone, weekStartDay);

    // Try to find existing week
    let week = await prisma.week.findUnique({
      where: {
        userId_startDate: {
          userId: session.user.id,
          startDate: weekStart,
        },
      },
      include: {
        snapshots: {
          orderBy: { sortOrder: "asc" },
        },
        completions: true,
        score: true,
      },
    });

    // If no week exists, create one with snapshots
    if (!week) {
      const activeHabits = await prisma.habit.findMany({
        where: {
          userId: session.user.id,
          status: "ACTIVE",
        },
        orderBy: { sortOrder: "asc" },
      });

      week = await prisma.week.create({
        data: {
          userId: session.user.id,
          startDate: weekStart,
          endDate: weekEnd,
          snapshots: {
            create: activeHabits.map((habit) => ({
              habitId: habit.id,
              name: habit.name,
              description: habit.description,
              type: habit.type,
              color: habit.color,
              icon: habit.icon,
              sortOrder: habit.sortOrder,
              xpValue: habit.xpValue,
            })),
          },
          score: {
            create: {
              possibleCompletions: activeHabits.length * 7,
            },
          },
        },
        include: {
          snapshots: {
            orderBy: { sortOrder: "asc" },
          },
          completions: true,
          score: true,
        },
      });

      // Update user stats for weeks completed
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          weeksCompleted: { increment: 1 },
        },
      });

      // Check for week achievements
      const stats = await prisma.userStats.findUnique({
        where: { userId: session.user.id },
      });

      if (stats) {
        if (stats.weeksCompleted >= 4) {
          await checkAndGrantAchievement(session.user.id, "weeks_4");
        }
        if (stats.weeksCompleted >= 12) {
          await checkAndGrantAchievement(session.user.id, "weeks_12");
        }
        if (stats.weeksCompleted >= 26) {
          await checkAndGrantAchievement(session.user.id, "weeks_26");
        }
        if (stats.weeksCompleted >= 52) {
          await checkAndGrantAchievement(session.user.id, "weeks_52");
        }
      }

      // Check for consecutive trophy achievements
      await checkConsecutiveTrophyAchievements(session.user.id);
    }

    // Build completion map for easy lookup
    const completionMap: Record<string, Record<number, boolean>> = {};
    for (const completion of week.completions) {
      if (!completionMap[completion.habitId]) {
        completionMap[completion.habitId] = {};
      }
      completionMap[completion.habitId][completion.dayIndex] = true;
    }

    return NextResponse.json({
      ...week,
      completionMap,
      timezone,
      weekStartDay,
      currentDayIndex,
    });
  } catch (error) {
    console.error("Get current week error:", error);
    return NextResponse.json(
      { error: "Failed to fetch current week" },
      { status: 500 }
    );
  }
}

async function checkAndGrantAchievement(userId: string, code: string) {
  const existing = await prisma.achievement.findUnique({
    where: { userId_code: { userId, code } },
  });

  if (!existing) {
    await prisma.achievement.create({
      data: { userId, code },
    });
  }
}

async function checkConsecutiveTrophyAchievements(userId: string) {
  // Get the last 5 weeks with scores, ordered by date
  const recentWeeks = await prisma.week.findMany({
    where: { userId },
    include: { score: true },
    orderBy: { startDate: "desc" },
    take: 5,
  });

  if (recentWeeks.length < 2) return;

  // Check for "consistency_king" - 4 consecutive trophy weeks
  if (recentWeeks.length >= 4) {
    const last4HaveTrophies = recentWeeks.slice(0, 4).every(
      (w) => w.score && w.score.percentage >= TROPHY_THRESHOLDS.bronze
    );
    if (last4HaveTrophies) {
      await checkAndGrantAchievement(userId, "consistency_king");
    }
  }

  // Check for "comeback_kid" - went from no trophy to trophy
  const currentWeek = recentWeeks[0];
  const previousWeek = recentWeeks[1];

  if (currentWeek?.score && previousWeek?.score) {
    const currentHasTrophy = currentWeek.score.percentage >= TROPHY_THRESHOLDS.bronze;
    const previousHadNoTrophy = previousWeek.score.percentage < TROPHY_THRESHOLDS.bronze;

    if (currentHasTrophy && previousHadNoTrophy) {
      await checkAndGrantAchievement(userId, "comeback_kid");
    }

    // Check for "upgrade_week" - improved trophy tier
    const currentTier = getTrophyTier(currentWeek.score.percentage);
    const previousTier = getTrophyTier(previousWeek.score.percentage);

    const tierOrder = { none: 0, bronze: 1, silver: 2, gold: 3 };
    if (tierOrder[currentTier] > tierOrder[previousTier]) {
      await checkAndGrantAchievement(userId, "upgrade_week");
    }
  }
}
