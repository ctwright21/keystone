import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Find the week and verify ownership
    const week = await prisma.week.findUnique({
      where: { id },
      include: {
        completions: true,
        score: true,
      },
    });

    if (!week) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    if (week.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Calculate XP to remove from user stats
    const xpToRemove = week.completions.reduce((sum, c) => sum + c.xpEarned, 0);
    const completionsToRemove = week.completions.length;

    // Delete the week (cascades to snapshots, completions, and score)
    await prisma.week.delete({
      where: { id },
    });

    // Update user stats
    if (xpToRemove > 0 || completionsToRemove > 0) {
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          totalXp: { decrement: xpToRemove },
          totalCompletions: { decrement: completionsToRemove },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete week error:", error);
    return NextResponse.json(
      { error: "Failed to delete week" },
      { status: 500 }
    );
  }
}
