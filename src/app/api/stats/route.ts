import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getLevelFromXp,
  getLevelProgress,
  getRankFromLevel,
  getXpForLevel,
} from "@/lib/achievements";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let stats = await prisma.userStats.findUnique({
      where: { userId: session.user.id },
    });

    // Create stats if they don't exist
    if (!stats) {
      stats = await prisma.userStats.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    // Calculate level info
    const level = getLevelFromXp(stats.totalXp);
    const progress = getLevelProgress(stats.totalXp);
    const rank = getRankFromLevel(level);
    const xpForNextLevel = getXpForLevel(level);

    // Update level and rank if changed
    if (level !== stats.level || rank !== stats.rank) {
      stats = await prisma.userStats.update({
        where: { userId: session.user.id },
        data: { level, rank },
      });

      // Check for level achievements
      if (level >= 5) await checkAndGrantAchievement(session.user.id, "level_5");
      if (level >= 10) await checkAndGrantAchievement(session.user.id, "level_10");
      if (level >= 25) await checkAndGrantAchievement(session.user.id, "level_25");
      if (level >= 50) await checkAndGrantAchievement(session.user.id, "level_50");
    }

    return NextResponse.json({
      ...stats,
      level,
      rank,
      progress,
      xpForNextLevel,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
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
