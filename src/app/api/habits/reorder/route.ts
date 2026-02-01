import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Update sort orders in a transaction
    await prisma.$transaction(
      habitIds.map((id, index) =>
        prisma.habit.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

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
