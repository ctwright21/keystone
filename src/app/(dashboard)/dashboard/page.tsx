"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2, Zap } from "lucide-react";
import { HabitGrid } from "@/components/habit-grid";
import { AddHabitModal } from "@/components/add-habit-modal";
import { StatsCard } from "@/components/stats-card";
import { WeekTrophyCard } from "@/components/week-trophy-card";
import { formatWeekRange } from "@/lib/week-utils";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<{
    id: string;
    name: string;
    description?: string;
    type: string;
    color: string;
    icon: string;
    xpValue: number;
  } | null>(null);

  const { data: week, isLoading, error } = useQuery({
    queryKey: ["currentWeek"],
    queryFn: async () => {
      const res = await fetch("/api/weeks/current");
      if (!res.ok) throw new Error("Failed to fetch current week");
      return res.json();
    },
  });

  const { data: habits } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await fetch("/api/habits");
      if (!res.ok) throw new Error("Failed to fetch habits");
      return res.json();
    },
  });

  function handleEditHabit(habitId: string) {
    const habit = habits?.find((h: { id: string }) => h.id === habitId);
    if (habit) {
      setEditHabit({
        id: habit.id,
        name: habit.name,
        description: habit.description,
        type: habit.type,
        color: habit.color,
        icon: habit.icon,
        xpValue: habit.xpValue,
      });
      setModalOpen(true);
    }
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditHabit(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#00F0FF' }} />
          <p style={{ color: '#6A6A7A' }}>Loading your habits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="mb-4" style={{ color: '#EF4444' }}>Failed to load data</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0F5' }}>Dashboard</h1>
          {week && (
            <p className="mt-1" style={{ color: '#A0A0B0' }}>
              {formatWeekRange(new Date(week.startDate), new Date(week.endDate))}
            </p>
          )}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer"
          style={{
            backgroundColor: '#00F0FF',
            color: '#0A0A0F',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00D4E0';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.4)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#00F0FF';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Plus className="w-5 h-5" />
          Add Habit
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5" style={{ color: '#00F0FF' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#F0F0F5' }}>This Week</h2>
            </div>
            {week ? (
              <HabitGrid week={week} onEditHabit={handleEditHabit} />
            ) : (
              <p style={{ color: '#6A6A7A' }}>No habits to display</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <WeekTrophyCard />
          <StatsCard />
        </div>
      </div>

      <AddHabitModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editHabit={editHabit}
      />
    </div>
  );
}
