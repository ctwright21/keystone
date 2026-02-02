"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Pencil, Trash2, Pause, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDayNames } from "@/lib/week-utils";
import { HabitIcon } from "@/lib/habit-icons";

interface HabitSnapshot {
  id: string;
  habitId: string;
  name: string;
  color: string;
  icon: string;
  xpValue: number;
  sortOrder: number;
}

interface Week {
  id: string;
  startDate: string;
  endDate: string;
  snapshots: HabitSnapshot[];
  completionMap: Record<string, Record<number, boolean>>;
  currentDayIndex?: number;
  timezone?: string;
  weekStartDay?: number; // 0 = Sunday, 1 = Monday
}

interface HabitGridProps {
  week: Week;
  onEditHabit: (habitId: string) => void;
}

// Get dates for each day of the week
function getWeekDates(startDate: string): number[] {
  const start = new Date(startDate);
  // Always 7 days in a week
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date.getDate();
  });
}

function HabitCheckbox({
  isCompleted,
  isToday,
  isPast,
  disabled,
  onClick,
}: {
  isCompleted: boolean;
  isToday: boolean;
  isPast: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-200 border-2",
        isCompleted
          ? "bg-[#00F0FF] border-[#00F0FF] text-[#0A0A0F] shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          : isToday
          ? "border-[#FF6B2C] bg-transparent hover:bg-[#FF6B2C]/10"
          : isPast
          ? "border-[#4A4A58] bg-transparent hover:bg-[#2A2A38]"
          : "border-[#2A2A38] bg-transparent opacity-40 cursor-not-allowed"
      )}
    >
      {isCompleted && <Check className="w-4 h-4" strokeWidth={3} />}
    </button>
  );
}

function SortableHabitRow({
  snapshot,
  weekId,
  completions,
  currentDayIndex,
  onToggle,
  onEdit,
  onDelete,
  onPause,
  dayNames,
}: {
  snapshot: HabitSnapshot;
  weekId: string;
  completions: Record<number, boolean>;
  currentDayIndex: number;
  onToggle: (habitId: string, dayIndex: number) => void;
  onEdit: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  onPause: (habitId: string) => void;
  dayNames: string[];
}) {
  const [showActions, setShowActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: snapshot.habitId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "group border-b border-[#2A2A38] hover:bg-[#1A1A24]/50 transition-colors",
        isDragging && "opacity-50 bg-[#1A1A24]"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Drag handle + Habit name */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="text-[#6A6A7A] hover:text-[#A0A0B0] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          {snapshot.icon && <HabitIcon name={snapshot.icon} className="w-5 h-5 text-[#A0A0B0]" />}
          <span className="text-[#F0F0F5] text-sm font-medium truncate max-w-[180px] lg:max-w-[280px]">
            {snapshot.name}
          </span>
          {/* Action buttons - show on hover */}
          <div
            className={cn(
              "flex items-center gap-1 ml-2 transition-opacity",
              showActions ? "opacity-100" : "opacity-0"
            )}
          >
            <button
              onClick={() => onEdit(snapshot.habitId)}
              className="p-1.5 text-[#6A6A7A] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 rounded transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPause(snapshot.habitId)}
              className="p-1.5 text-[#6A6A7A] hover:text-[#FBBF24] hover:bg-[#FBBF24]/10 rounded transition-colors"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this habit?")) {
                  onDelete(snapshot.habitId);
                }
              }}
              className="p-1.5 text-[#6A6A7A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </td>

      {/* Day checkboxes */}
      {dayNames.map((_, index) => {
        const isCompleted = completions[index] || false;
        const isToday = index === currentDayIndex;
        const isPast = index < currentDayIndex;
        const isFuture = index > currentDayIndex;

        return (
          <td key={index} className={cn("py-3 px-1 text-center", isToday && "bg-[#00F0FF]/5")}>
            <div className="flex justify-center">
              <HabitCheckbox
                isCompleted={isCompleted}
                isToday={isToday}
                isPast={isPast}
                disabled={isFuture}
                onClick={() => !isFuture && onToggle(snapshot.habitId, index)}
              />
            </div>
          </td>
        );
      })}
    </tr>
  );
}

function PerfectDayRow({
  completionsByDay,
  habitCount,
  currentDayIndex,
  dayNames,
}: {
  completionsByDay: number[];
  habitCount: number;
  currentDayIndex: number;
  dayNames: string[];
}) {
  return (
    <tr className="border-t-2 border-[#3A3A48] bg-[#1A1A24]/30">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <div className="w-4" /> {/* Spacer for drag handle */}
          <Star className="w-5 h-5 text-[#FFD700]" />
          <span className="text-[#A0A0B0] text-sm font-semibold uppercase tracking-wide">Perfect Day</span>
        </div>
      </td>
      {dayNames.map((_, index) => {
        const completions = completionsByDay[index] || 0;
        const isPerfect = habitCount > 0 && completions === habitCount;
        const isToday = index === currentDayIndex;
        const isFuture = index > currentDayIndex;

        return (
          <td key={index} className={cn("py-3 px-1 text-center", isToday && "bg-[#00F0FF]/5")}>
            <div className="flex justify-center">
              {isFuture ? (
                <div className="w-8 h-8" />
              ) : isPerfect ? (
                <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-sm flex items-center justify-center text-[#6A6A7A] bg-[#22222E]/50">
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

export function HabitGrid({ week, onEditHabit }: HabitGridProps) {
  const queryClient = useQueryClient();
  const [habits, setHabits] = useState(week.snapshots);
  const currentDayIndex = week.currentDayIndex ?? 0;
  const weekStartDay = week.weekStartDay ?? 0;
  const dayNames = getDayNames(weekStartDay);
  const weekDates = getWeekDates(week.startDate);

  // Sync local state when week data changes
  useEffect(() => {
    setHabits(week.snapshots);
  }, [week.snapshots]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleMutation = useMutation({
    mutationFn: async ({
      habitId,
      dayIndex,
    }: {
      habitId: string;
      dayIndex: number;
    }) => {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, dayIndex, weekId: week.id }),
      });
      if (!res.ok) throw new Error("Failed to toggle completion");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (habitIds: string[]) => {
      const res = await fetch("/api/habits/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder habits");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["weeks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete habit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["weeks"] });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAUSED" }),
      });
      if (!res.ok) throw new Error("Failed to pause habit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["weeks"] });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((i) => i.habitId === active.id);
        const newIndex = items.findIndex((i) => i.habitId === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        reorderMutation.mutate(newItems.map((i) => i.habitId));
        return newItems;
      });
    }
  }

  // Calculate completions per day for Perfect Day row
  const completionsByDay = dayNames.map((_, dayIndex) => {
    return habits.filter(
      (h) => week.completionMap[h.habitId]?.[dayIndex]
    ).length;
  });

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#22222E' }}
        >
          <Star className="w-8 h-8" style={{ color: '#6A6A7A' }} />
        </div>
        <p className="mb-2" style={{ color: '#A0A0B0' }}>No habits yet</p>
        <p className="text-sm" style={{ color: '#6A6A7A' }}>
          Create your first habit to get started!
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[#6A6A7A] text-xs uppercase tracking-wider">
              <th className="text-left py-3 pr-4 font-semibold">Habit</th>
              {dayNames.map((day, index) => {
                const isToday = index === currentDayIndex;
                return (
                  <th
                    key={day}
                    className={cn(
                      "py-3 px-1 font-semibold text-center min-w-[48px]",
                      isToday && "text-[#00F0FF] bg-[#00F0FF]/5 rounded-t-md"
                    )}
                  >
                    <div>{day}</div>
                    <div className={cn("text-sm mt-0.5 font-mono", isToday ? "text-[#00F0FF]" : "text-[#6A6A7A]")}>
                      {weekDates[index]}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <SortableContext
              items={habits.map((h) => h.habitId)}
              strategy={verticalListSortingStrategy}
            >
              {habits.map((snapshot) => (
                <SortableHabitRow
                  key={snapshot.habitId}
                  snapshot={snapshot}
                  weekId={week.id}
                  completions={week.completionMap[snapshot.habitId] || {}}
                  currentDayIndex={currentDayIndex}
                  onToggle={(habitId, dayIndex) =>
                    toggleMutation.mutate({ habitId, dayIndex })
                  }
                  onEdit={onEditHabit}
                  onDelete={(habitId) => deleteMutation.mutate(habitId)}
                  onPause={(habitId) => pauseMutation.mutate(habitId)}
                  dayNames={dayNames}
                />
              ))}
            </SortableContext>
            <PerfectDayRow
              completionsByDay={completionsByDay}
              habitCount={habits.length}
              currentDayIndex={currentDayIndex}
              dayNames={dayNames}
            />
          </tbody>
        </table>
      </div>
    </DndContext>
  );
}
