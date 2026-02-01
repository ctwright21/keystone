import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeekStartInTimezone } from "@/lib/week-utils";

const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
  xpValue: z.number().int().min(1).max(100).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateHabitSchema.parse(body);

    // Verify ownership
    const habit = await prisma.habit.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: validatedData,
    });

    // Also update the current week's snapshot if it exists
    // This ensures changes to icon, name, color, etc. are reflected immediately
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timezone: true },
    });
    const timezone = user?.timezone || "America/New_York";
    const weekStart = getWeekStartInTimezone(timezone);

    const currentWeek = await prisma.week.findUnique({
      where: {
        userId_startDate: {
          userId: session.user.id,
          startDate: weekStart,
        },
      },
    });

    if (currentWeek) {
      // Update the snapshot with the new habit data
      const snapshotUpdateData: Record<string, unknown> = {};
      if (validatedData.name !== undefined) snapshotUpdateData.name = validatedData.name;
      if (validatedData.description !== undefined) snapshotUpdateData.description = validatedData.description;
      if (validatedData.type !== undefined) snapshotUpdateData.type = validatedData.type;
      if (validatedData.color !== undefined) snapshotUpdateData.color = validatedData.color;
      if (validatedData.icon !== undefined) snapshotUpdateData.icon = validatedData.icon;
      if (validatedData.xpValue !== undefined) snapshotUpdateData.xpValue = validatedData.xpValue;

      if (Object.keys(snapshotUpdateData).length > 0) {
        await prisma.weekHabitSnapshot.updateMany({
          where: {
            weekId: currentWeek.id,
            habitId: id,
          },
          data: snapshotUpdateData,
        });
      }
    }

    return NextResponse.json(updatedHabit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Update habit error:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const habit = await prisma.habit.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Soft delete by archiving
    await prisma.habit.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ message: "Habit archived" });
  } catch (error) {
    console.error("Delete habit error:", error);
    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 }
    );
  }
}
