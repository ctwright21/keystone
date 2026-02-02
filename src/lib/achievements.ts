export interface AchievementDefinition {
  code: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  category: "habits" | "streaks" | "completions" | "milestones" | "trophies" | "special";
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Habit creation achievements
  {
    code: "first_habit",
    name: "First Step",
    description: "Create your first habit",
    icon: "footprints",
    xpReward: 50,
    category: "habits",
  },
  {
    code: "five_habits",
    name: "Building Momentum",
    description: "Create 5 habits",
    icon: "layers",
    xpReward: 100,
    category: "habits",
  },
  {
    code: "ten_habits",
    name: "Habit Builder",
    description: "Create 10 habits",
    icon: "construction",
    xpReward: 200,
    category: "habits",
  },

  // Streak achievements
  {
    code: "streak_3",
    name: "Getting Started",
    description: "Reach a 3-day streak on any habit",
    icon: "flame",
    xpReward: 50,
    category: "streaks",
  },
  {
    code: "streak_7",
    name: "One Week Strong",
    description: "Reach a 7-day streak on any habit",
    icon: "zap",
    xpReward: 100,
    category: "streaks",
  },
  {
    code: "streak_14",
    name: "Two Week Warrior",
    description: "Reach a 14-day streak on any habit",
    icon: "trophy",
    xpReward: 200,
    category: "streaks",
  },
  {
    code: "streak_30",
    name: "Monthly Master",
    description: "Reach a 30-day streak on any habit",
    icon: "crown",
    xpReward: 500,
    category: "streaks",
  },
  {
    code: "streak_100",
    name: "Century Club",
    description: "Reach a 100-day streak on any habit",
    icon: "star",
    xpReward: 1000,
    category: "streaks",
  },

  // Completion achievements
  {
    code: "first_completion",
    name: "Day One",
    description: "Complete your first habit",
    icon: "check",
    xpReward: 25,
    category: "completions",
  },
  {
    code: "completions_50",
    name: "Halfway There",
    description: "Complete 50 total habit completions",
    icon: "target",
    xpReward: 150,
    category: "completions",
  },
  {
    code: "completions_100",
    name: "Century",
    description: "Complete 100 total habit completions",
    icon: "medal",
    xpReward: 300,
    category: "completions",
  },
  {
    code: "completions_500",
    name: "Dedicated",
    description: "Complete 500 total habit completions",
    icon: "award",
    xpReward: 750,
    category: "completions",
  },
  {
    code: "completions_1000",
    name: "Legendary",
    description: "Complete 1000 total habit completions",
    icon: "gem",
    xpReward: 1500,
    category: "completions",
  },

  // Trophy achievements
  {
    code: "first_bronze",
    name: "Bronze Beginner",
    description: "Earn your first bronze trophy (60%+ weekly completion)",
    icon: "trophy",
    xpReward: 50,
    category: "trophies",
  },
  {
    code: "first_silver",
    name: "Silver Seeker",
    description: "Earn your first silver trophy (75%+ weekly completion)",
    icon: "trophy",
    xpReward: 100,
    category: "trophies",
  },
  {
    code: "first_gold",
    name: "Gold Standard",
    description: "Earn your first gold trophy (85%+ weekly completion)",
    icon: "trophy",
    xpReward: 200,
    category: "trophies",
  },
  {
    code: "gold_5",
    name: "Golden Streak",
    description: "Earn 5 gold trophies",
    icon: "medal",
    xpReward: 500,
    category: "trophies",
  },
  {
    code: "gold_10",
    name: "Gold Rush",
    description: "Earn 10 gold trophies",
    icon: "crown",
    xpReward: 1000,
    category: "trophies",
  },
  {
    code: "total_trophies_10",
    name: "Trophy Collector",
    description: "Earn 10 total trophies (any tier)",
    icon: "package",
    xpReward: 150,
    category: "trophies",
  },
  {
    code: "total_trophies_25",
    name: "Trophy Hunter",
    description: "Earn 25 total trophies (any tier)",
    icon: "warehouse",
    xpReward: 400,
    category: "trophies",
  },

  // Weekly milestones
  {
    code: "weeks_4",
    name: "Monthly Tracker",
    description: "Track habits for 4 weeks",
    icon: "calendar",
    xpReward: 100,
    category: "milestones",
  },
  {
    code: "weeks_12",
    name: "Quarterly Commitment",
    description: "Track habits for 12 weeks",
    icon: "calendar-days",
    xpReward: 300,
    category: "milestones",
  },
  {
    code: "weeks_26",
    name: "Half Year Hero",
    description: "Track habits for 26 weeks",
    icon: "calendar-range",
    xpReward: 600,
    category: "milestones",
  },
  {
    code: "weeks_52",
    name: "Year of Growth",
    description: "Track habits for 52 weeks",
    icon: "calendar-heart",
    xpReward: 1500,
    category: "milestones",
  },

  // Level achievements
  {
    code: "level_5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "trending-up",
    xpReward: 100,
    category: "milestones",
  },
  {
    code: "level_10",
    name: "Experienced",
    description: "Reach level 10",
    icon: "badge",
    xpReward: 250,
    category: "milestones",
  },
  {
    code: "level_25",
    name: "Veteran",
    description: "Reach level 25",
    icon: "shield",
    xpReward: 500,
    category: "milestones",
  },
  {
    code: "level_50",
    name: "Elite",
    description: "Reach level 50",
    icon: "sword",
    xpReward: 1000,
    category: "milestones",
  },

  // Special achievements
  {
    code: "comeback_kid",
    name: "Comeback Kid",
    description: "Improve from no trophy to any trophy week over week",
    icon: "trending-up",
    xpReward: 75,
    category: "special",
  },
  {
    code: "consistency_king",
    name: "Consistency King",
    description: "Earn a trophy for 4 consecutive weeks",
    icon: "crown",
    xpReward: 300,
    category: "special",
  },
  {
    code: "upgrade_week",
    name: "Level Up",
    description: "Upgrade your trophy tier from the previous week",
    icon: "arrow-up",
    xpReward: 100,
    category: "special",
  },
];

/**
 * Get achievement definition by code
 */
export function getAchievementByCode(
  code: string
): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.code === code);
}

/**
 * Calculate XP required for a given level
 * Uses a quadratic formula: XP = 100 * level^1.5
 */
export function getXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate total XP required to reach a level from level 1
 */
export function getTotalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i);
  }
  return total;
}

/**
 * Get level from total XP
 */
export function getLevelFromXp(totalXp: number): number {
  let level = 1;
  let xpNeeded = 0;
  while (xpNeeded <= totalXp) {
    xpNeeded += getXpForLevel(level);
    if (xpNeeded <= totalXp) {
      level++;
    }
  }
  return level;
}

/**
 * Get progress towards next level (0-1)
 */
export function getLevelProgress(totalXp: number): number {
  const level = getLevelFromXp(totalXp);
  const xpForCurrentLevel = getTotalXpForLevel(level);
  const xpForNextLevel = getXpForLevel(level);
  const progressXp = totalXp - xpForCurrentLevel;
  return Math.min(1, progressXp / xpForNextLevel);
}

/**
 * Get rank tier based on level
 */
export function getRankFromLevel(
  level: number
): "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER" | "GRANDMASTER" {
  if (level >= 100) return "GRANDMASTER";
  if (level >= 75) return "MASTER";
  if (level >= 50) return "DIAMOND";
  if (level >= 35) return "PLATINUM";
  if (level >= 20) return "GOLD";
  if (level >= 10) return "SILVER";
  return "BRONZE";
}

/**
 * Get rank display info
 */
export const RANK_INFO: Record<
  string,
  { name: string; color: string; minLevel: number }
> = {
  BRONZE: { name: "Bronze", color: "#CD7F32", minLevel: 1 },
  SILVER: { name: "Silver", color: "#C0C0C0", minLevel: 10 },
  GOLD: { name: "Gold", color: "#FFD700", minLevel: 20 },
  PLATINUM: { name: "Platinum", color: "#E5E4E2", minLevel: 35 },
  DIAMOND: { name: "Diamond", color: "#B9F2FF", minLevel: 50 },
  MASTER: { name: "Master", color: "#FF6B6B", minLevel: 75 },
  GRANDMASTER: { name: "Grandmaster", color: "#9B59B6", minLevel: 100 },
};
