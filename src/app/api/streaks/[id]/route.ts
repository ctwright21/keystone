import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const streak = await prisma.habitStreak.findFirst({
      where: {
        habitId: id,
        userId: session.user.id,
      },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!streak) {
      // Return default streak if none exists
      const habit = await prisma.habit.findFirst({
        where: {
          id,
          userId: session.user.id,
        },
      });

      if (!habit) {
        return NextResponse.json({ error: "Habit not found" }, { status: 404 });
      }

      return NextResponse.json({
        habitId: id,
        currentStreak: 0,
        longestStreak: 0,
        lastCompleted: null,
        habit: {
          id: habit.id,
          name: habit.name,
          color: habit.color,
          icon: habit.icon,
        },
      });
    }

    return NextResponse.json(streak);
  } catch (error) {
    console.error("Get streak error:", error);
    return NextResponse.json(
      { error: "Failed to fetch streak" },
      { status: 500 }
    );
  }
}
