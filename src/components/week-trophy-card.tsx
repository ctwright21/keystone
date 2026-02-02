"use client";

import { useQuery } from "@tanstack/react-query";
import { Trophy, Target, Zap } from "lucide-react";
import {
  getTrophyTier,
  getTrophyColor,
  getTrophyName,
  getNextTrophyThreshold,
  getCompletionsNeededForNextTrophy,
  TROPHY_THRESHOLDS,
  TrophyTier,
} from "@/lib/trophies";

interface WeekData {
  id: string;
  score: {
    totalCompletions: number;
    possibleCompletions: number;
    percentage: number;
    xpEarned: number;
  } | null;
}

function TrophyBadge({ tier, size = "md" }: { tier: TrophyTier; size?: "sm" | "md" | "lg" }) {
  const color = getTrophyColor(tier);
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  if (tier === "none") {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
        style={{ backgroundColor: "rgba(74, 74, 88, 0.3)", border: "2px dashed #4A4A58" }}
      >
        <Trophy className={size === "lg" ? "w-8 h-8" : size === "md" ? "w-5 h-5" : "w-3 h-3"} style={{ color: "#4A4A58" }} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
      style={{
        backgroundColor: `${color}20`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}40`,
      }}
    >
      <Trophy className={size === "lg" ? "w-8 h-8" : size === "md" ? "w-5 h-5" : "w-3 h-3"} style={{ color }} />
    </div>
  );
}

function TrophyProgress({
  percentage,
  tier,
}: {
  percentage: number;
  tier: TrophyTier;
}) {
  const currentColor = getTrophyColor(tier);

  // Create markers for each threshold
  const markers = [
    { percent: TROPHY_THRESHOLDS.bronze, tier: "bronze" as TrophyTier },
    { percent: TROPHY_THRESHOLDS.silver, tier: "silver" as TrophyTier },
    { percent: TROPHY_THRESHOLDS.gold, tier: "gold" as TrophyTier },
  ];

  return (
    <div className="relative">
      {/* Progress bar background */}
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: "#22222E" }}
      >
        {/* Progress fill */}
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, percentage)}%`,
            background: `linear-gradient(90deg, ${currentColor}80 0%, ${currentColor} 100%)`,
            boxShadow: `0 0 10px ${currentColor}60`,
          }}
        />
      </div>

      {/* Trophy threshold markers */}
      <div className="relative h-6 mt-1">
        {markers.map(({ percent, tier: markerTier }) => {
          const markerColor = getTrophyColor(markerTier);
          const isAchieved = percentage >= percent;
          return (
            <div
              key={markerTier}
              className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${percent}%` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isAchieved ? markerColor : "#3A3A48",
                  boxShadow: isAchieved ? `0 0 8px ${markerColor}` : "none",
                }}
              />
              <span
                className="text-xs font-mono mt-1"
                style={{ color: isAchieved ? markerColor : "#6A6A7A" }}
              >
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeekTrophyCard() {
  const { data: week, isLoading } = useQuery<WeekData>({
    queryKey: ["currentWeek"],
    queryFn: async () => {
      const res = await fetch("/api/weeks/current");
      if (!res.ok) throw new Error("Failed to fetch current week");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 rounded w-1/3 mb-4" style={{ backgroundColor: "#22222E" }} />
        <div className="h-16 rounded w-full mb-4" style={{ backgroundColor: "#22222E" }} />
        <div className="h-4 rounded w-2/3" style={{ backgroundColor: "#22222E" }} />
      </div>
    );
  }

  const score = week?.score;
  const totalCompletions = score?.totalCompletions || 0;
  const possibleCompletions = score?.possibleCompletions || 0;
  const percentage = score?.percentage || 0;
  const xpEarned = score?.xpEarned || 0;

  const currentTier = getTrophyTier(percentage);
  const nextTrophy = getNextTrophyThreshold(percentage);
  const completionsNeeded = getCompletionsNeededForNextTrophy(totalCompletions, possibleCompletions);

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5" style={{ color: "#00F0FF" }} />
        <h2 className="text-lg font-semibold" style={{ color: "#F0F0F5" }}>
          This Week&apos;s Goal
        </h2>
      </div>

      {/* Main trophy display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <TrophyBadge tier={currentTier} size="lg" />
          <div>
            <div className="font-bold text-2xl" style={{ color: getTrophyColor(currentTier) }}>
              {currentTier === "none" ? "No Trophy Yet" : `${getTrophyName(currentTier)} Trophy`}
            </div>
            <div className="text-sm" style={{ color: "#A0A0B0" }}>
              {Math.round(percentage)}% completed
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 font-mono font-bold text-lg" style={{ color: "#00F0FF" }}>
            <Zap className="w-4 h-4" />
            +{xpEarned}
          </div>
          <div className="text-xs uppercase tracking-wide" style={{ color: "#6A6A7A" }}>
            XP Earned
          </div>
        </div>
      </div>

      {/* Progress bar with markers */}
      <TrophyProgress percentage={percentage} tier={currentTier} />

      {/* Completion stats */}
      <div
        className="flex items-center justify-between mt-6 pt-4"
        style={{ borderTop: "1px solid #2A2A38" }}
      >
        <div>
          <span className="font-mono font-bold text-xl" style={{ color: "#F0F0F5" }}>
            {totalCompletions}
          </span>
          <span className="text-sm ml-1" style={{ color: "#6A6A7A" }}>
            / {possibleCompletions}
          </span>
          <span className="text-sm ml-2" style={{ color: "#A0A0B0" }}>
            completions
          </span>
        </div>

        {/* Next trophy hint */}
        {completionsNeeded && completionsNeeded.completionsNeeded > 0 && (
          <div className="text-right">
            <div className="flex items-center gap-2">
              <TrophyBadge tier={completionsNeeded.tier} size="sm" />
              <span className="text-sm" style={{ color: "#A0A0B0" }}>
                <span className="font-mono font-bold" style={{ color: getTrophyColor(completionsNeeded.tier) }}>
                  {completionsNeeded.completionsNeeded}
                </span>{" "}
                more for {getTrophyName(completionsNeeded.tier)}
              </span>
            </div>
          </div>
        )}

        {currentTier === "gold" && (
          <div className="text-sm font-semibold" style={{ color: "#FFD700" }}>
            Maximum achieved!
          </div>
        )}
      </div>

      {/* Trophy tier legend */}
      <div
        className="flex justify-center gap-6 mt-4 pt-4"
        style={{ borderTop: "1px solid #2A2A38" }}
      >
        {(["bronze", "silver", "gold"] as const).map((tier) => {
          const isAchieved = percentage >= TROPHY_THRESHOLDS[tier];
          return (
            <div
              key={tier}
              className="flex items-center gap-2"
              style={{ opacity: isAchieved ? 1 : 0.4 }}
            >
              <TrophyBadge tier={tier} size="sm" />
              <span className="text-xs uppercase tracking-wide" style={{ color: getTrophyColor(tier) }}>
                {tier}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
