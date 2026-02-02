"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Calendar, Zap, Plus, Trash2, Trophy } from "lucide-react";
import { useState } from "react";
import { formatWeekRange, getDayNames, getWeekStart } from "@/lib/week-utils";
import { cn } from "@/lib/utils";
import { HabitIcon } from "@/lib/habit-icons";
import { getTrophyTier, getTrophyColor, getTrophyName, TrophyTier, TROPHY_THRESHOLDS } from "@/lib/trophies";

interface WeekSnapshot {
  id: string;
  habitId: string;
  name: string;
  color: string;
  icon: string;
  sortOrder: number;
}

interface Completion {
  habitId: string;
  dayIndex: number;
}

interface WeekScore {
  totalCompletions: number;
  possibleCompletions: number;
  percentage: number;
  xpEarned: number;
}

interface Week {
  id: string;
  startDate: string;
  endDate: string;
  snapshots: WeekSnapshot[];
  completions: Completion[];
  score: WeekScore | null;
  isCurrentWeek?: boolean;
  currentDayIndex?: number;
}

interface WeeksResponse {
  weeks: Week[];
  total: number;
  hasMore: boolean;
  weekStartDay: number; // 0 = Sunday, 1 = Monday
}

function TrophyBadge({ tier, size = "md" }: { tier: TrophyTier; size?: "sm" | "md" | "lg" }) {
  const color = getTrophyColor(tier);
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (tier === "none") {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
        style={{ backgroundColor: "rgba(74, 74, 88, 0.2)", border: "2px dashed #3A3A48" }}
      >
        <Trophy className={size === "lg" ? "w-8 h-8" : size === "md" ? "w-6 h-6" : "w-4 h-4"} style={{ color: "#3A3A48" }} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center`}
      style={{
        backgroundColor: `${color}20`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 15px ${color}40`,
      }}
    >
      <Trophy className={size === "lg" ? "w-8 h-8" : size === "md" ? "w-6 h-6" : "w-4 h-4"} style={{ color }} />
    </div>
  );
}

function HistoryCheckbox({
  isCompleted,
  canEdit,
  isLoading,
  onClick,
}: {
  isCompleted: boolean;
  canEdit: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canEdit || isLoading}
      className={cn(
        "w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200 border-2",
        isCompleted
          ? "border-[#10B981] bg-[#10B981]/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          : canEdit
          ? "border-[#3A3A48] bg-[#1A1A24] hover:border-[#00F0FF] hover:bg-[#00F0FF]/10 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          : "border-[#2A2A38] bg-[#1A1A24]/50 opacity-30 cursor-not-allowed"
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#00F0FF' }} />
      ) : isCompleted ? (
        <Check className="w-5 h-5" style={{ color: '#10B981' }} strokeWidth={3} />
      ) : null}
    </button>
  );
}

function WeekCard({
  week,
  isExpanded,
  onToggleExpand,
  onToggleCompletion,
  onDeleteWeek,
  loadingCompletion,
  isDeleting,
  weekStartDay,
}: {
  week: Week;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleCompletion: (habitId: string, dayIndex: number) => void;
  onDeleteWeek: () => void;
  loadingCompletion: string | null;
  isDeleting: boolean;
  weekStartDay: number;
}) {
  const completionMap: Record<string, Set<number>> = {};
  week.completions.forEach((c) => {
    if (!completionMap[c.habitId]) {
      completionMap[c.habitId] = new Set();
    }
    completionMap[c.habitId].add(c.dayIndex);
  });

  const sortedSnapshots = [...week.snapshots].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  // Calculate trophy tier
  const percentage = week.score?.percentage || 0;
  const trophyTier = getTrophyTier(percentage);
  const trophyColor = getTrophyColor(trophyTier);

  // Get day names based on week start preference
  const dayNames = getDayNames(weekStartDay);

  // Determine which days can be edited
  // For current week: can edit today and past days (not future)
  // For past weeks: can edit all days
  const today = new Date();
  const weekStart = new Date(week.startDate);
  const weekEnd = new Date(week.endDate);

  const isCurrentWeek = today >= weekStart && today <= weekEnd;
  const currentDayIndex = isCurrentWeek
    ? Math.floor((today.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24))
    : 6; // Past weeks: all days editable (0-6)

  const canEditDay = (dayIndex: number) => {
    if (isCurrentWeek) {
      return dayIndex <= currentDayIndex;
    }
    // Past weeks - all days are editable
    return true;
  };

  // Get dates for each day of the week
  const getWeekDates = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date.getDate();
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="card group relative">
      {/* Header - Always visible */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between pr-10"
      >
        <div className="flex items-center gap-4">
          {/* Trophy Badge */}
          <TrophyBadge tier={trophyTier} size="md" />

          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold" style={{ color: '#F0F0F5' }}>
                {formatWeekRange(new Date(week.startDate), new Date(week.endDate))}
              </h3>
              {isCurrentWeek && (
                <span
                  className="text-xs font-normal px-2 py-0.5 rounded"
                  style={{ backgroundColor: 'rgba(0, 240, 255, 0.2)', color: '#00F0FF' }}
                >
                  Current
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              {trophyTier !== "none" && (
                <span className="text-sm font-semibold" style={{ color: trophyColor }}>
                  {getTrophyName(trophyTier)} Trophy
                </span>
              )}
              {week.score && (
                <span className="text-sm" style={{ color: '#A0A0B0' }}>
                  {week.score.totalCompletions} / {week.score.possibleCompletions}{" "}
                  ({Math.round(week.score.percentage)}%)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {week.score && (
            <div className="text-right">
              <div className="flex items-center gap-1 font-mono font-bold" style={{ color: '#00F0FF' }}>
                <Zap className="w-4 h-4" />
                +{week.score.xpEarned} XP
              </div>
            </div>
          )}
          <div style={{ color: '#6A6A7A' }}>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this week? This will remove all completions and XP earned.')) {
            onDeleteWeek();
          }
        }}
        disabled={isDeleting}
        className="absolute top-4 right-4 p-2 rounded-md transition-all opacity-0 group-hover:opacity-100"
        style={{
          color: '#6A6A7A',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#EF4444';
          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#6A6A7A';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Delete week"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && sortedSnapshots.length > 0 && (
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid #2A2A38' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pb-4 pr-6" style={{ minWidth: '280px' }}>
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6A6A7A' }}>
                      Habit
                    </span>
                  </th>
                  {dayNames.map((day, index) => {
                    const isToday = isCurrentWeek && index === currentDayIndex;
                    const canEdit = canEditDay(index);
                    return (
                      <th
                        key={day}
                        className="pb-4 px-2 text-center"
                        style={{ minWidth: '56px' }}
                      >
                        <div
                          className={cn(
                            "flex flex-col items-center justify-center py-2 px-1 rounded-md",
                            isToday && "bg-[#00F0FF]/10"
                          )}
                        >
                          <span
                            className="text-sm font-bold"
                            style={{ color: isToday ? '#00F0FF' : canEdit ? '#A0A0B0' : '#4A4A58' }}
                          >
                            {day}
                          </span>
                          <span
                            className="text-xs font-mono mt-1"
                            style={{ color: isToday ? '#00F0FF' : canEdit ? '#6A6A7A' : '#3A3A48' }}
                          >
                            {weekDates[index]}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedSnapshots.map((snapshot, rowIndex) => (
                  <tr
                    key={snapshot.id}
                    className="group"
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? 'transparent' : 'rgba(26, 26, 36, 0.3)'
                    }}
                  >
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-3">
                        {snapshot.icon ? (
                          <HabitIcon
                            name={snapshot.icon}
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: snapshot.color }}
                          />
                        ) : (
                          <div
                            className="w-5 h-5 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: snapshot.color }}
                          />
                        )}
                        <span
                          className="text-sm font-medium"
                          style={{ color: '#F0F0F5' }}
                        >
                          {snapshot.name}
                        </span>
                      </div>
                    </td>
                    {dayNames.map((_, dayIndex) => {
                      const isCompleted = completionMap[snapshot.habitId]?.has(dayIndex);
                      const canEdit = canEditDay(dayIndex);
                      const isLoading = loadingCompletion === `${snapshot.habitId}-${dayIndex}`;
                      const isToday = isCurrentWeek && dayIndex === currentDayIndex;

                      return (
                        <td
                          key={dayIndex}
                          className={cn(
                            "py-3 px-2 text-center",
                            isToday && "bg-[#00F0FF]/5"
                          )}
                        >
                          <div className="flex justify-center">
                            <HistoryCheckbox
                              isCompleted={isCompleted}
                              canEdit={canEdit}
                              isLoading={isLoading}
                              onClick={() => onToggleCompletion(snapshot.habitId, dayIndex)}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="mt-6 pt-4 flex items-center justify-between"
            style={{ borderTop: '1px solid #2A2A38' }}
          >
            <p className="text-xs" style={{ color: '#6A6A7A' }}>
              Click any checkbox to update your history. Future days cannot be marked.
            </p>
            <div className="flex items-center gap-4 text-xs" style={{ color: '#6A6A7A' }}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-[#10B981] bg-[#10B981]/20" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-[#3A3A48] bg-[#1A1A24]" />
                <span>Editable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-[#2A2A38] bg-[#1A1A24]/50 opacity-30" />
                <span>Future</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExpanded && sortedSnapshots.length === 0 && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #2A2A38' }}>
          <p className="text-sm" style={{ color: '#6A6A7A' }}>No habits tracked this week</p>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [loadingCompletion, setLoadingCompletion] = useState<string | null>(null);
  const [showAddWeekMenu, setShowAddWeekMenu] = useState(false);
  const limit = 10;

  const { data, isLoading } = useQuery<WeeksResponse>({
    queryKey: ["weeks", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/weeks?limit=${limit}&offset=${page * limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch weeks");
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      habitId,
      dayIndex,
      weekId,
    }: {
      habitId: string;
      dayIndex: number;
      weekId: string;
    }) => {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, dayIndex, weekId }),
      });
      if (!res.ok) throw new Error("Failed to toggle completion");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeks"] });
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onSettled: () => {
      setLoadingCompletion(null);
    },
  });

  const createPastWeekMutation = useMutation({
    mutationFn: async (weeksAgo: number) => {
      const res = await fetch("/api/weeks/create-past", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weeksAgo }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create past week");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["weeks"] });
      // Auto-expand the newly created week
      if (data.week?.id) {
        setExpandedWeeks((prev) => new Set([...prev, data.week.id]));
      }
      setShowAddWeekMenu(false);
    },
  });

  const [deletingWeekId, setDeletingWeekId] = useState<string | null>(null);

  const deleteWeekMutation = useMutation({
    mutationFn: async (weekId: string) => {
      const res = await fetch(`/api/weeks/${weekId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete week");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeks"] });
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onSettled: () => {
      setDeletingWeekId(null);
    },
  });

  function handleDeleteWeek(weekId: string) {
    setDeletingWeekId(weekId);
    deleteWeekMutation.mutate(weekId);
  }

  function handleToggleExpand(weekId: string) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  }

  function handleToggleCompletion(weekId: string, habitId: string, dayIndex: number) {
    setLoadingCompletion(`${habitId}-${dayIndex}`);
    toggleMutation.mutate({ habitId, dayIndex, weekId });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#00F0FF' }} />
          <p style={{ color: '#6A6A7A' }}>Loading history...</p>
        </div>
      </div>
    );
  }

  // Get weekStartDay from API response (default to Sunday)
  const weekStartDay = data?.weekStartDay ?? 0;

  // Helper to get week range text for past weeks
  function getPastWeekLabel(weeksAgo: number) {
    const now = new Date();
    const currentWeekStart = getWeekStart(now, weekStartDay);

    const pastWeekStart = new Date(currentWeekStart);
    pastWeekStart.setDate(pastWeekStart.getDate() - (weeksAgo * 7));

    const pastWeekEnd = new Date(pastWeekStart);
    pastWeekEnd.setDate(pastWeekEnd.getDate() + 6);

    return formatWeekRange(pastWeekStart, pastWeekEnd);
  }

  // Check which past weeks already exist
  function doesWeekExist(weeksAgo: number) {
    if (!data?.weeks) return false;
    const now = new Date();
    const currentWeekStart = getWeekStart(now, weekStartDay);

    const pastWeekStart = new Date(currentWeekStart);
    pastWeekStart.setDate(pastWeekStart.getDate() - (weeksAgo * 7));

    return data.weeks.some((week) => {
      const weekStart = new Date(week.startDate);
      return weekStart.toDateString() === pastWeekStart.toDateString();
    });
  }

  // Calculate trophy counts
  const trophyCounts = data?.weeks?.reduce(
    (acc, week) => {
      const tier = getTrophyTier(week.score?.percentage || 0);
      if (tier !== "none") {
        acc[tier] = (acc[tier] || 0) + 1;
      }
      return acc;
    },
    { gold: 0, silver: 0, bronze: 0 } as Record<string, number>
  ) || { gold: 0, silver: 0, bronze: 0 };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Trophy Summary Card */}
      <div
        className="mb-8 p-6 rounded-lg"
        style={{
          backgroundColor: '#12121A',
          border: '1px solid #2A2A38'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#F0F0F5' }}>History</h1>
            <p className="mt-1" style={{ color: '#A0A0B0' }}>
              {data?.total || 0} weeks tracked
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Trophy counts */}
            <div className="flex items-center gap-1">
              <TrophyBadge tier="gold" size="sm" />
              <span className="font-mono font-bold text-lg ml-1" style={{ color: getTrophyColor("gold") }}>
                {trophyCounts.gold}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrophyBadge tier="silver" size="sm" />
              <span className="font-mono font-bold text-lg ml-1" style={{ color: getTrophyColor("silver") }}>
                {trophyCounts.silver}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrophyBadge tier="bronze" size="sm" />
              <span className="font-mono font-bold text-lg ml-1" style={{ color: getTrophyColor("bronze") }}>
                {trophyCounts.bronze}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mb-4">
        <div className="relative">
          <button
            onClick={() => setShowAddWeekMenu(!showAddWeekMenu)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
            style={{
              backgroundColor: 'transparent',
              color: '#F0F0F5',
              border: '1px solid #3A3A48'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00F0FF';
              e.currentTarget.style.color = '#00F0FF';
              e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#3A3A48';
              e.currentTarget.style.color = '#F0F0F5';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Plus className="w-4 h-4" />
            Add Week
          </button>

          {/* Dropdown menu */}
          {showAddWeekMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowAddWeekMenu(false)}
              />
              <div
                className="absolute right-0 top-full mt-2 w-64 rounded-md shadow-lg z-20"
                style={{
                  backgroundColor: '#12121A',
                  border: '1px solid #2A2A38'
                }}
              >
                <div className="p-2">
                  <p className="text-xs uppercase tracking-wide px-3 py-2" style={{ color: '#6A6A7A' }}>
                    Add previous week
                  </p>
                  {[1, 2, 3, 4].map((weeksAgo) => {
                    const exists = doesWeekExist(weeksAgo);
                    return (
                      <button
                        key={weeksAgo}
                        onClick={() => !exists && createPastWeekMutation.mutate(weeksAgo)}
                        disabled={exists || createPastWeekMutation.isPending}
                        className="w-full text-left px-3 py-2 rounded-md text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          color: exists ? '#6A6A7A' : '#F0F0F5',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!exists) {
                            e.currentTarget.style.backgroundColor = '#2A2A38';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span className="block font-medium">
                          {weeksAgo === 1 ? 'Last week' : `${weeksAgo} weeks ago`}
                        </span>
                        <span className="block text-xs" style={{ color: '#6A6A7A' }}>
                          {getPastWeekLabel(weeksAgo)}
                          {exists && ' (already exists)'}
                        </span>
                      </button>
                    );
                  })}
                  {createPastWeekMutation.isPending && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#00F0FF' }} />
                      <span className="ml-2 text-sm" style={{ color: '#A0A0B0' }}>Creating...</span>
                    </div>
                  )}
                  {createPastWeekMutation.isError && (
                    <p className="px-3 py-2 text-xs" style={{ color: '#EF4444' }}>
                      {createPastWeekMutation.error?.message || 'Failed to create week'}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {data?.weeks && data.weeks.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.weeks.map((week) => (
              <WeekCard
                key={week.id}
                week={week}
                isExpanded={expandedWeeks.has(week.id)}
                onToggleExpand={() => handleToggleExpand(week.id)}
                onToggleCompletion={(habitId, dayIndex) =>
                  handleToggleCompletion(week.id, habitId, dayIndex)
                }
                onDeleteWeek={() => handleDeleteWeek(week.id)}
                loadingCompletion={loadingCompletion}
                isDeleting={deletingWeekId === week.id}
                weekStartDay={weekStartDay}
              />
            ))}
          </div>

          {/* Pagination */}
          {(data.total > limit || page > 0) && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'transparent',
                  color: '#A0A0B0',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  if (page !== 0) {
                    e.currentTarget.style.color = '#F0F0F5';
                    e.currentTarget.style.backgroundColor = '#2A2A38';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#A0A0B0';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="font-mono" style={{ color: '#A0A0B0' }}>
                Page {page + 1} of {Math.ceil((data?.total || 0) / limit)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.hasMore}
                className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'transparent',
                  color: '#A0A0B0',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  if (data?.hasMore) {
                    e.currentTarget.style.color = '#F0F0F5';
                    e.currentTarget.style.backgroundColor = '#2A2A38';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#A0A0B0';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#6A6A7A' }} />
          <p className="mb-2" style={{ color: '#A0A0B0' }}>No history yet</p>
          <p className="text-sm" style={{ color: '#6A6A7A' }}>Start tracking habits to see your progress!</p>
        </div>
      )}
    </div>
  );
}
