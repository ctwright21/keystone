import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekStartInTimezone, getWeekEndInTimezone } from "@/lib/week-utils";

const createHabitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]).default("POSITIVE"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#6366f1"),
  icon: z.string().default("star"),
  xpValue: z.number().int().min(1).max(100).default(10),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
        status: { not: "ARCHIVED" },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error("Get habits error:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createHabitSchema.parse(body);

    // Get user's timezone and week start preference
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timezone: true, weekStartDay: true },
    });
    const timezone = user?.timezone || "America/New_York";
    const weekStartDay = user?.weekStartDay ?? 1;

    // Get current max sort order
    const maxSortOrder = await prisma.habit.aggregate({
      where: { userId: session.user.id },
      _max: { sortOrder: true },
    });

    const sortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

    const habit = await prisma.habit.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        sortOrder,
      },
    });

    // Add habit to current week's snapshots if week exists
    const weekStart = getWeekStartInTimezone(timezone, weekStartDay);
    const weekEnd = getWeekEndInTimezone(timezone, weekStartDay);

    let currentWeek = await prisma.week.findUnique({
      where: {
        userId_startDate: {
          userId: session.user.id,
          startDate: weekStart,
        },
      },
    });

    // Create week if it doesn't exist
    if (!currentWeek) {
      currentWeek = await prisma.week.create({
        data: {
          userId: session.user.id,
          startDate: weekStart,
          endDate: weekEnd,
        },
      });

      // Create week score
      await prisma.weekScore.create({
        data: {
          weekId: currentWeek.id,
          possibleCompletions: 7, // Will be updated below
        },
      });
    }

    // Add snapshot for this habit to current week
    await prisma.weekHabitSnapshot.create({
      data: {
        weekId: currentWeek.id,
        habitId: habit.id,
        name: habit.name,
        description: habit.description,
        type: habit.type,
        color: habit.color,
        icon: habit.icon,
        sortOrder: habit.sortOrder,
        xpValue: habit.xpValue,
      },
    });

    // Update week score's possible completions
    const snapshotCount = await prisma.weekHabitSnapshot.count({
      where: { weekId: currentWeek.id },
    });

    await prisma.weekScore.update({
      where: { weekId: currentWeek.id },
      data: {
        possibleCompletions: snapshotCount * 7,
      },
    });

    // Update user stats
    await prisma.userStats.update({
      where: { userId: session.user.id },
      data: {
        totalHabitsCreated: { increment: 1 },
      },
    });

    // Check for habit count achievements
    const habitCount = await prisma.habit.count({
      where: { userId: session.user.id },
    });

    if (habitCount === 1) {
      await checkAndGrantAchievement(session.user.id, "first_habit");
    } else if (habitCount === 5) {
      await checkAndGrantAchievement(session.user.id, "five_habits");
    } else if (habitCount === 10) {
      await checkAndGrantAchievement(session.user.id, "ten_habits");
    }

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create habit error:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
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
