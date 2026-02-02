// Weekly Trophy Scoring System
// Bronze: 60% completion
// Silver: 75% completion
// Gold: 85% completion

export type TrophyTier = "none" | "bronze" | "silver" | "gold";

export const TROPHY_THRESHOLDS = {
  bronze: 60,
  silver: 75,
  gold: 85,
} as const;

export const TROPHY_COLORS = {
  none: "#4A4A58",
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
} as const;

export const TROPHY_NAMES = {
  none: "No Trophy",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
} as const;

export function getTrophyTier(percentage: number): TrophyTier {
  if (percentage >= TROPHY_THRESHOLDS.gold) return "gold";
  if (percentage >= TROPHY_THRESHOLDS.silver) return "silver";
  if (percentage >= TROPHY_THRESHOLDS.bronze) return "bronze";
  return "none";
}

export function getTrophyColor(tier: TrophyTier): string {
  return TROPHY_COLORS[tier];
}

export function getTrophyName(tier: TrophyTier): string {
  return TROPHY_NAMES[tier];
}

export function getNextTrophyThreshold(percentage: number): {
  tier: TrophyTier;
  threshold: number;
  percentageNeeded: number;
} | null {
  if (percentage >= TROPHY_THRESHOLDS.gold) {
    return null; // Already at max
  }

  if (percentage >= TROPHY_THRESHOLDS.silver) {
    return {
      tier: "gold",
      threshold: TROPHY_THRESHOLDS.gold,
      percentageNeeded: TROPHY_THRESHOLDS.gold - percentage,
    };
  }

  if (percentage >= TROPHY_THRESHOLDS.bronze) {
    return {
      tier: "silver",
      threshold: TROPHY_THRESHOLDS.silver,
      percentageNeeded: TROPHY_THRESHOLDS.silver - percentage,
    };
  }

  return {
    tier: "bronze",
    threshold: TROPHY_THRESHOLDS.bronze,
    percentageNeeded: TROPHY_THRESHOLDS.bronze - percentage,
  };
}

// Calculate how many more completions needed for next trophy
export function getCompletionsNeededForNextTrophy(
  currentCompletions: number,
  possibleCompletions: number
): { tier: TrophyTier; completionsNeeded: number } | null {
  if (possibleCompletions === 0) return null;

  const currentPercentage = (currentCompletions / possibleCompletions) * 100;
  const nextTrophy = getNextTrophyThreshold(currentPercentage);

  if (!nextTrophy) return null;

  const completionsNeededForThreshold = Math.ceil((nextTrophy.threshold / 100) * possibleCompletions);
  const completionsNeeded = completionsNeededForThreshold - currentCompletions;

  return {
    tier: nextTrophy.tier,
    completionsNeeded: Math.max(0, completionsNeeded),
  };
}
