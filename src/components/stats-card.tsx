"use client";

import { useQuery } from "@tanstack/react-query";
import { Zap, TrendingUp, Flame, Trophy } from "lucide-react";
import { RANK_INFO } from "@/lib/achievements";
import { getTrophyColor } from "@/lib/trophies";
import { cn } from "@/lib/utils";

interface Stats {
  totalXp: number;
  level: number;
  rank: string;
  progress: number;
  xpForNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  trophyCounts?: {
    gold: number;
    silver: number;
    bronze: number;
    total: number;
  };
}

export function StatsCard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="card-stat animate-pulse">
        <div className="h-6 rounded w-1/3 mb-4" style={{ backgroundColor: '#22222E' }} />
        <div className="h-4 rounded w-full mb-2" style={{ backgroundColor: '#22222E' }} />
        <div className="h-4 rounded w-2/3" style={{ backgroundColor: '#22222E' }} />
      </div>
    );
  }

  if (!stats) return null;

  const rankInfo = RANK_INFO[stats.rank] || RANK_INFO.BRONZE;

  // Map rank to badge class
  const badgeClass = {
    BRONZE: "badge-bronze",
    SILVER: "badge-silver",
    GOLD: "badge-gold",
    PLATINUM: "badge-platinum",
    DIAMOND: "badge-diamond",
  }[stats.rank] || "badge-bronze";

  return (
    <div className="card-stat">
      {/* Level and XP */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={cn("w-14 h-14 rounded-md flex items-center justify-center font-mono text-xl font-bold", badgeClass)}
          >
            {stats.level}
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: '#F0F0F5' }}>Level {stats.level}</div>
            <div className="text-sm font-semibold" style={{ color: rankInfo.color }}>
              {rankInfo.name}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5" style={{ color: '#00F0FF' }}>
            <Zap className="w-5 h-5" />
            <span className="font-mono font-bold text-xl tabular-nums">{stats.totalXp.toLocaleString()}</span>
          </div>
          <div className="text-xs uppercase tracking-wide mt-1" style={{ color: '#6A6A7A' }}>Total XP</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="font-medium" style={{ color: '#A0A0B0' }}>Progress to Level {stats.level + 1}</span>
          <span className="font-mono tabular-nums" style={{ color: '#00F0FF' }}>{Math.round(stats.progress * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${stats.progress * 100}%` }}
          />
        </div>
        <div className="text-xs mt-2 text-right font-mono" style={{ color: '#6A6A7A' }}>
          {stats.xpForNextLevel.toLocaleString()} XP needed
        </div>
      </div>

      {/* Trophy counts */}
      {stats.trophyCounts && stats.trophyCounts.total > 0 && (
        <div
          className="mb-6 p-4 rounded-md"
          style={{ backgroundColor: 'rgba(34, 34, 46, 0.5)', border: '1px solid #2A2A38' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#A0A0B0' }}>
              Trophies Earned
            </span>
            <span className="font-mono font-bold" style={{ color: '#F0F0F5' }}>
              {stats.trophyCounts.total}
            </span>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${getTrophyColor("gold")}20`,
                  border: `2px solid ${getTrophyColor("gold")}`,
                }}
              >
                <Trophy className="w-3 h-3" style={{ color: getTrophyColor("gold") }} />
              </div>
              <span className="font-mono font-bold" style={{ color: getTrophyColor("gold") }}>
                {stats.trophyCounts.gold}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${getTrophyColor("silver")}20`,
                  border: `2px solid ${getTrophyColor("silver")}`,
                }}
              >
                <Trophy className="w-3 h-3" style={{ color: getTrophyColor("silver") }} />
              </div>
              <span className="font-mono font-bold" style={{ color: getTrophyColor("silver") }}>
                {stats.trophyCounts.silver}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${getTrophyColor("bronze")}20`,
                  border: `2px solid ${getTrophyColor("bronze")}`,
                }}
              >
                <Trophy className="w-3 h-3" style={{ color: getTrophyColor("bronze") }} />
              </div>
              <span className="font-mono font-bold" style={{ color: getTrophyColor("bronze") }}>
                {stats.trophyCounts.bronze}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="text-center p-4 rounded-md"
          style={{ backgroundColor: 'rgba(34, 34, 46, 0.5)', border: '1px solid #2A2A38' }}
        >
          <Flame className="w-5 h-5 mx-auto mb-2 animate-fire-pulse" style={{ color: '#FF6B2C' }} />
          <div className="font-mono font-bold text-xl tabular-nums" style={{ color: '#F0F0F5' }}>{stats.currentStreak}</div>
          <div className="text-xs uppercase tracking-wide mt-1" style={{ color: '#6A6A7A' }}>Streak</div>
        </div>
        <div
          className="text-center p-4 rounded-md"
          style={{ backgroundColor: 'rgba(34, 34, 46, 0.5)', border: '1px solid #2A2A38' }}
        >
          <TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: '#10B981' }} />
          <div className="font-mono font-bold text-xl tabular-nums" style={{ color: '#F0F0F5' }}>{stats.totalCompletions}</div>
          <div className="text-xs uppercase tracking-wide mt-1" style={{ color: '#6A6A7A' }}>Done</div>
        </div>
        <div
          className="text-center p-4 rounded-md"
          style={{ backgroundColor: 'rgba(34, 34, 46, 0.5)', border: '1px solid #2A2A38' }}
        >
          <Trophy className="w-5 h-5 mx-auto mb-2" style={{ color: '#FFD700' }} />
          <div className="font-mono font-bold text-xl tabular-nums" style={{ color: '#F0F0F5' }}>{stats.longestStreak}</div>
          <div className="text-xs uppercase tracking-wide mt-1" style={{ color: '#6A6A7A' }}>Best</div>
        </div>
      </div>
    </div>
  );
}
