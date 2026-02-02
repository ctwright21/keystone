import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS, getAchievementByCode } from "@/lib/achievements";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's unlocked achievements
    const unlockedAchievements = await prisma.achievement.findMany({
      where: { userId: session.user.id },
    });

    const unlockedCodes = new Set(unlockedAchievements.map((a) => a.code));

    // Map all achievements with unlock status
    const achievements = ACHIEVEMENTS.map((achievement) => {
      const unlocked = unlockedCodes.has(achievement.code);
      const unlockedAt = unlockedAchievements.find(
        (a) => a.code === achievement.code
      )?.unlockedAt;

      return {
        ...achievement,
        unlocked,
        unlockedAt: unlockedAt || null,
      };
    });

    // Group by category
    const grouped = {
      habits: achievements.filter((a) => a.category === "habits"),
      streaks: achievements.filter((a) => a.category === "streaks"),
      completions: achievements.filter((a) => a.category === "completions"),
      trophies: achievements.filter((a) => a.category === "trophies"),
      milestones: achievements.filter((a) => a.category === "milestones"),
      special: achievements.filter((a) => a.category === "special"),
    };

    const totalUnlocked = unlockedAchievements.length;
    const totalAchievements = ACHIEVEMENTS.length;

    return NextResponse.json({
      achievements,
      grouped,
      totalUnlocked,
      totalAchievements,
      progress: totalUnlocked / totalAchievements,
    });
  } catch (error) {
    console.error("Get achievements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
