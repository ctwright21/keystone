import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/week-utils";

const createPastWeekSchema = z.object({
  weeksAgo: z.number().int().min(1).max(52), // Can go back up to 1 year
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { weeksAgo } = createPastWeekSchema.parse(body);

    // Get user's week start preference
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { weekStartDay: true },
    });

    const weekStartDay = user?.weekStartDay ?? 1; // 0 = Sunday, 1 = Monday

    // Calculate the start and end date for the past week
    const now = new Date();
    const currentWeekStart = getWeekStart(now, weekStartDay);

    // Go back the specified number of weeks
    const pastWeekStart = new Date(currentWeekStart);
    pastWeekStart.setDate(pastWeekStart.getDate() - (weeksAgo * 7));

    const pastWeekEnd = new Date(pastWeekStart);
    pastWeekEnd.setDate(pastWeekEnd.getDate() + 6);
    pastWeekEnd.setHours(23, 59, 59, 999);

    // Check if this week already exists
    const existingWeek = await prisma.week.findUnique({
      where: {
        userId_startDate: {
          userId: session.user.id,
          startDate: pastWeekStart,
        },
      },
    });

    if (existingWeek) {
      return NextResponse.json(
        { error: "This week already exists", week: existingWeek },
        { status: 400 }
      );
    }

    // Get active habits to create snapshots
    const activeHabits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      orderBy: { sortOrder: "asc" },
    });

    if (activeHabits.length === 0) {
      return NextResponse.json(
        { error: "No active habits to track. Create some habits first!" },
        { status: 400 }
      );
    }

    // Create the past week
    const week = await prisma.week.create({
      data: {
        userId: session.user.id,
        startDate: pastWeekStart,
        endDate: pastWeekEnd,
        snapshots: {
          create: activeHabits.map((h) => ({
            habitId: h.id,
            name: h.name,
            description: h.description,
            type: h.type,
            color: h.color,
            icon: h.icon,
            sortOrder: h.sortOrder,
            xpValue: h.xpValue,
          })),
        },
        score: {
          create: {
            possibleCompletions: activeHabits.length * 7,
            totalCompletions: 0,
            percentage: 0,
            xpEarned: 0,
          },
        },
      },
      include: {
        snapshots: true,
        completions: true,
        score: true,
      },
    });

    return NextResponse.json({ week });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create past week error:", error);
    return NextResponse.json(
      { error: "Failed to create past week" },
      { status: 500 }
    );
  }
}
