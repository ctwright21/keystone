"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Lock, Trophy, Flame, Target, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface Achievement {
  code: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  category: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

interface AchievementsResponse {
  grouped: {
    habits: Achievement[];
    streaks: Achievement[];
    completions: Achievement[];
    milestones: Achievement[];
    special: Achievement[];
  };
  totalUnlocked: number;
  totalAchievements: number;
  progress: number;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }> = {
  habits: { label: "Habits", icon: Target, color: "#00F0FF" },
  streaks: { label: "Streaks", icon: Flame, color: "#FF6B2C" },
  completions: { label: "Completions", icon: Zap, color: "#10B981" },
  milestones: { label: "Milestones", icon: Star, color: "#8B5CF6" },
  special: { label: "Special", icon: Trophy, color: "#FFD700" },
};

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={cn(
        "p-4 rounded-md border transition-all relative overflow-hidden",
        achievement.unlocked
          ? "card-achievement-unlocked"
          : "card-achievement-locked"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: achievement.unlocked ? 'rgba(0, 240, 255, 0.2)' : '#22222E'
          }}
        >
          {achievement.unlocked ? (
            <Trophy className="w-6 h-6" style={{ color: '#FFD700' }} />
          ) : (
            <Lock className="w-5 h-5" style={{ color: '#6A6A7A' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold" style={{ color: '#F0F0F5' }}>{achievement.name}</h3>
            <span className="text-xs font-mono" style={{ color: '#00F0FF' }}>+{achievement.xpReward} XP</span>
          </div>
          <p className="text-sm mt-1" style={{ color: '#A0A0B0' }}>{achievement.description}</p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs mt-2 font-mono" style={{ color: '#6A6A7A' }}>
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const { data, isLoading } = useQuery<AchievementsResponse>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements");
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#00F0FF' }} />
          <p style={{ color: '#6A6A7A' }}>Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0F5' }}>Achievements</h1>
          <p className="mt-1" style={{ color: '#A0A0B0' }}>
            {data.totalUnlocked} of {data.totalAchievements} unlocked
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: '#00F0FF' }}>
            {Math.round(data.progress * 100)}%
          </div>
          <div className="text-sm uppercase tracking-wide" style={{ color: '#6A6A7A' }}>Complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar h-3 mb-8">
        <div
          className="progress-bar-fill"
          style={{ width: `${data.progress * 100}%` }}
        />
      </div>

      {/* Achievement categories */}
      <div className="space-y-8">
        {(Object.entries(data.grouped) as [string, Achievement[]][]).map(
          ([category, achievements]) => {
            const config = CATEGORY_CONFIG[category];
            const unlockedCount = achievements.filter((a) => a.unlocked).length;
            const Icon = config.icon;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                    <h2 className="text-lg font-semibold" style={{ color: config.color }}>
                      {config.label}
                    </h2>
                  </div>
                  <span className="text-sm font-mono" style={{ color: '#6A6A7A' }}>
                    {unlockedCount} / {achievements.length}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <AchievementCard key={achievement.code} achievement={achievement} />
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
