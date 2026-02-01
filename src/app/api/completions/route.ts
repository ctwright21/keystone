import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekStart, getWeekEnd, getDayIndex } from "@/lib/week-utils";

const toggleCompletionSchema = z.object({
  habitId: z.string(),
  dayIndex: z.number().int().min(0).max(6),
  weekId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { habitId, dayIndex, weekId: providedWeekId } = toggleCompletionSchema.parse(body);

    // Verify habit ownership
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Get or create current week
    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd();

    let week = await prisma.week.findUnique({
      where: {
        userId_startDate: {
          userId: session.user.id,
          startDate: weekStart,
        },
      },
    });

    if (!week) {
      week = await prisma.week.create({
        data: {
          userId: session.user.id,
          startDate: weekStart,
          endDate: weekEnd,
        },
      });

      // Create snapshots for all active habits
      const activeHabits = await prisma.habit.findMany({
        where: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      });

      await prisma.weekHabitSnapshot.createMany({
        data: activeHabits.map((h) => ({
          weekId: week!.id,
          habitId: h.id,
          name: h.name,
          description: h.description,
          type: h.type,
          color: h.color,
          icon: h.icon,
          sortOrder: h.sortOrder,
          xpValue: h.xpValue,
        })),
      });

      // Create week score
      await prisma.weekScore.create({
        data: {
          weekId: week.id,
          possibleCompletions: activeHabits.length * 7,
        },
      });
    }

    const weekId = providedWeekId || week.id;

    // Check if completion exists
    const existingCompletion = await prisma.habitCompletion.findUnique({
      where: {
        weekId_habitId_dayIndex: {
          weekId,
          habitId,
          dayIndex,
        },
      },
    });

    let completion;
    let xpChange = 0;

    if (existingCompletion) {
      // Toggle off - delete completion
      await prisma.habitCompletion.delete({
        where: { id: existingCompletion.id },
      });
      xpChange = -existingCompletion.xpEarned;
      completion = null;
    } else {
      // Toggle on - create completion
      const xpEarned = habit.xpValue;
      completion = await prisma.habitCompletion.create({
        data: {
          weekId,
          habitId,
          dayIndex,
          xpEarned,
        },
      });
      xpChange = xpEarned;

      // Log XP
      await prisma.xPLog.create({
        data: {
          userId: session.user.id,
          amount: xpEarned,
          source: "HABIT_COMPLETION",
          sourceId: habitId,
        },
      });
    }

    // Update user stats
    await prisma.userStats.update({
      where: { userId: session.user.id },
      data: {
        totalXp: { increment: xpChange },
        totalCompletions: { increment: completion ? 1 : -1 },
      },
    });

    // Update week score
    const completionCount = await prisma.habitCompletion.count({
      where: { weekId },
    });

    const weekScore = await prisma.weekScore.findUnique({
      where: { weekId },
    });

    if (weekScore) {
      await prisma.weekScore.update({
        where: { weekId },
        data: {
          totalCompletions: completionCount,
          percentage: weekScore.possibleCompletions > 0
            ? (completionCount / weekScore.possibleCompletions) * 100
            : 0,
          xpEarned: { increment: xpChange },
        },
      });
    }

    // Update habit streak
    await updateHabitStreak(session.user.id, habitId);

    // Check for completion achievements
    const stats = await prisma.userStats.findUnique({
      where: { userId: session.user.id },
    });

    if (stats && completion) {
      if (stats.totalCompletions === 1) {
        await checkAndGrantAchievement(session.user.id, "first_completion");
      } else if (stats.totalCompletions === 50) {
        await checkAndGrantAchievement(session.user.id, "completions_50");
      } else if (stats.totalCompletions === 100) {
        await checkAndGrantAchievement(session.user.id, "completions_100");
      } else if (stats.totalCompletions === 500) {
        await checkAndGrantAchievement(session.user.id, "completions_500");
      } else if (stats.totalCompletions === 1000) {
        await checkAndGrantAchievement(session.user.id, "completions_1000");
      }
    }

    return NextResponse.json({
      completion,
      xpChange,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Toggle completion error:", error);
    return NextResponse.json(
      { error: "Failed to toggle completion" },
      { status: 500 }
    );
  }
}

async function updateHabitStreak(userId: string, habitId: string) {
  const today = getDayIndex();
  const weekStart = getWeekStart();

  // Get all completions for this habit in the current week
  const week = await prisma.week.findUnique({
    where: {
      userId_startDate: {
        userId,
        startDate: weekStart,
      },
    },
    include: {
      completions: {
        where: { habitId },
        orderBy: { dayIndex: "desc" },
      },
    },
  });

  if (!week) return;

  // Calculate current streak
  let streak = 0;
  const completedDays = new Set(week.completions.map((c) => c.dayIndex));

  // Count consecutive days from today backwards
  for (let day = today; day >= 0; day--) {
    if (completedDays.has(day)) {
      streak++;
    } else {
      break;
    }
  }

  // Update or create streak record
  const existingStreak = await prisma.habitStreak.findUnique({
    where: {
      userId_habitId: { userId, habitId },
    },
  });

  if (existingStreak) {
    await prisma.habitStreak.update({
      where: { id: existingStreak.id },
      data: {
        currentStreak: streak,
        longestStreak: Math.max(existingStreak.longestStreak, streak),
        lastCompleted: streak > 0 ? new Date() : existingStreak.lastCompleted,
      },
    });

    // Check for streak achievements
    const maxStreak = Math.max(existingStreak.longestStreak, streak);
    if (maxStreak >= 3) await checkAndGrantAchievement(userId, "streak_3");
    if (maxStreak >= 7) await checkAndGrantAchievement(userId, "streak_7");
    if (maxStreak >= 14) await checkAndGrantAchievement(userId, "streak_14");
    if (maxStreak >= 30) await checkAndGrantAchievement(userId, "streak_30");
    if (maxStreak >= 100) await checkAndGrantAchievement(userId, "streak_100");
  } else {
    await prisma.habitStreak.create({
      data: {
        userId,
        habitId,
        currentStreak: streak,
        longestStreak: streak,
        lastCompleted: streak > 0 ? new Date() : null,
      },
    });
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
