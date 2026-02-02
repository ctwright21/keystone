import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's week start preference
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { weekStartDay: true },
    });

    const weekStartDay = user?.weekStartDay ?? 1; // 0 = Sunday, 1 = Monday

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const weeks = await prisma.week.findMany({
      where: { userId: session.user.id },
      include: {
        snapshots: {
          orderBy: { sortOrder: "asc" },
        },
        completions: true,
        score: true,
      },
      orderBy: { startDate: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.week.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      weeks,
      total,
      hasMore: offset + weeks.length < total,
      weekStartDay,
    });
  } catch (error) {
    console.error("Get weeks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weeks" },
      { status: 500 }
    );
  }
}
