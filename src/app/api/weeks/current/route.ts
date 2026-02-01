import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekStartInTimezone, getWeekEndInTimezone, getDayIndexInTimezone } from "@/lib/week-utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's timezone
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timezone: true },
    });

    const timezone = user?.timezone || "America/New_York";

    // Calculate week boundaries in user's timezone
    const weekStart = getWeekStartInTimezone(timezone);
    const weekEnd = getWeekEndInTimezone(timezone);
    const currentDayIndex = getDayIndexInTimezone(timezone);

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
        if (stats.weeksCompleted === 4) {
          await checkAndGrantAchievement(session.user.id, "weeks_4");
        } else if (stats.weeksCompleted === 12) {
          await checkAndGrantAchievement(session.user.id, "weeks_12");
        }
      }
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
