import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekStartInTimezone } from "@/lib/week-utils";

const reorderSchema = z.object({
  habitIds: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { habitIds } = reorderSchema.parse(body);

    // Verify all habits belong to user
    const habits = await prisma.habit.findMany({
      where: {
        id: { in: habitIds },
        userId: session.user.id,
      },
    });

    if (habits.length !== habitIds.length) {
      return NextResponse.json(
        { error: "Invalid habit IDs" },
        { status: 400 }
      );
    }

    // Get user timezone and week start preference for finding current week
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timezone: true, weekStartDay: true },
    });
    const timezone = user?.timezone || "America/New_York";
    const weekStartDay = user?.weekStartDay ?? 1;
    const weekStart = getWeekStartInTimezone(timezone, weekStartDay);

    // Find current week
    const currentWeek = await prisma.week.findUnique({
      where: {
        userId_startDate: {
          userId: session.user.id,
          startDate: weekStart,
        },
      },
    });

    // Update sort orders for habits and snapshots in a transaction
    const habitUpdates = habitIds.map((id, index) =>
      prisma.habit.update({
        where: { id },
        data: { sortOrder: index },
      })
    );

    // Also update the current week's snapshots if the week exists
    const snapshotUpdates = currentWeek
      ? habitIds.map((habitId, index) =>
          prisma.weekHabitSnapshot.updateMany({
            where: {
              weekId: currentWeek.id,
              habitId: habitId,
            },
            data: { sortOrder: index },
          })
        )
      : [];

    await prisma.$transaction([...habitUpdates, ...snapshotUpdates]);

    return NextResponse.json({ message: "Habits reordered" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Reorder habits error:", error);
    return NextResponse.json(
      { error: "Failed to reorder habits" },
      { status: 500 }
    );
  }
}
