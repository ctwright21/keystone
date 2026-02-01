import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const streaks = await prisma.habitStreak.findMany({
      where: { userId: session.user.id },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            status: true,
          },
        },
      },
      orderBy: { currentStreak: "desc" },
    });

    return NextResponse.json(streaks);
  } catch (error) {
    console.error("Get streaks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch streaks" },
      { status: 500 }
    );
  }
}
