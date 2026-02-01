"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { HABIT_ICON_CATEGORIES, getHabitIcon } from "@/lib/habit-icons";

const COLORS = [
  "#00F0FF", // Electric Cyan (Primary)
  "#8B5CF6", // Ultraviolet (Secondary)
  "#FF6B2C", // Ember Orange (Tertiary)
  "#10B981", // Success Green
  "#FBBF24", // Warning Yellow
  "#EF4444", // Error Red
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#14B8A6", // Teal
  "#A855F7", // Purple
];

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  editHabit?: {
    id: string;
    name: string;
    description?: string;
    type: string;
    color: string;
    icon: string;
    xpValue: number;
  } | null;
}

export function AddHabitModal({ isOpen, onClose, editHabit }: AddHabitModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("POSITIVE");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState("star");
  const [xpValue, setXpValue] = useState(10);
  const [error, setError] = useState("");

  // Sync state when editHabit changes
  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name || "");
      setDescription(editHabit.description || "");
      setType(editHabit.type || "POSITIVE");
      setColor(editHabit.color || COLORS[0]);
      setIcon(editHabit.icon || "star");
      setXpValue(editHabit.xpValue || 10);
    } else {
      setName("");
      setDescription("");
      setType("POSITIVE");
      setColor(COLORS[0]);
      setIcon("star");
      setXpValue(10);
    }
    setError("");
  }, [editHabit, isOpen]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, type, color, icon, xpValue }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create habit");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/habits/${editHabit?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, type, color, icon, xpValue }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update habit");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (editHabit) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  }

  if (!isOpen) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A0A0F]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
        style={{
          backgroundColor: '#12121A',
          border: '1px solid #2A2A38'
        }}
      >
        {/* Header gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
          style={{ background: 'linear-gradient(135deg, #00F0FF 0%, #8B5CF6 100%)' }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#F0F0F5' }}>
              {editHabit ? "Edit Habit" : "New Habit"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md transition-colors hover:bg-[#2A2A38]"
              style={{ color: '#6A6A7A' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444'
                }}
              >
                {error}
              </div>
            )}

            {/* Name field */}
            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: '#A0A0B0' }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Exercise"
                className="w-full px-4 py-3 rounded-sm text-sm transition-all outline-none"
                style={{
                  backgroundColor: '#22222E',
                  border: '1px solid #3A3A48',
                  color: '#F0F0F5'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00F0FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 240, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A48';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Description field */}
            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: '#A0A0B0' }}
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={2}
                className="w-full px-4 py-3 rounded-sm text-sm transition-all outline-none resize-none"
                style={{
                  backgroundColor: '#22222E',
                  border: '1px solid #3A3A48',
                  color: '#F0F0F5'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00F0FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 240, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A48';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Type selector */}
            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: '#A0A0B0' }}
              >
                Type
              </label>
              <div className="flex gap-2">
                {[
                  { value: "POSITIVE", label: "Build", activeColor: "#10B981" },
                  { value: "NEGATIVE", label: "Break", activeColor: "#EF4444" },
                  { value: "NEUTRAL", label: "Track", activeColor: "#A0A0B0" },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className="flex-1 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
                    style={{
                      backgroundColor: type === t.value ? `${t.activeColor}20` : '#22222E',
                      color: type === t.value ? t.activeColor : '#6A6A7A',
                      border: `1px solid ${type === t.value ? `${t.activeColor}50` : '#2A2A38'}`
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: '#A0A0B0' }}
              >
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-md transition-all",
                      color === c && "ring-2 ring-[#00F0FF] ring-offset-2 ring-offset-[#12121A] scale-110"
                    )}
                    style={{
                      backgroundColor: c,
                      border: color === c ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: '#A0A0B0' }}
              >
                Icon
              </label>
              <div className="space-y-2">
                {/* Selected icon preview */}
                <div
                  className="flex items-center gap-3 p-3 rounded-md"
                  style={{
                    backgroundColor: '#22222E',
                    border: '1px solid #2A2A38'
                  }}
                >
                  {(() => {
                    const SelectedIcon = getHabitIcon(icon);
                    return <SelectedIcon className="w-6 h-6" style={{ color: '#F0F0F5' }} />;
                  })()}
                  <span className="text-sm" style={{ color: '#A0A0B0' }}>
                    Selected: {icon}
                  </span>
                </div>

                {/* Icon categories */}
                <div
                  className="max-h-48 overflow-y-auto space-y-3 p-3 rounded-md"
                  style={{
                    backgroundColor: 'rgba(34, 34, 46, 0.5)',
                    border: '1px solid #2A2A38'
                  }}
                >
                  {Object.entries(HABIT_ICON_CATEGORIES).map(([category, icons]) => (
                    <div key={category}>
                      <div
                        className="text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: '#6A6A7A' }}
                      >
                        {category}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {icons.map((iconName) => {
                          const IconComponent = getHabitIcon(iconName);
                          const isSelected = icon === iconName;
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setIcon(iconName)}
                              className="w-8 h-8 rounded-md flex items-center justify-center transition-all"
                              style={{
                                backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.2)' : '#1A1A24',
                                color: isSelected ? '#00F0FF' : '#A0A0B0',
                                border: isSelected ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid #2A2A38',
                                boxShadow: isSelected ? '0 0 0 1px #00F0FF' : 'none'
                              }}
                              title={iconName}
                            >
                              <IconComponent className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* XP Value slider */}
            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: '#A0A0B0' }}
              >
                XP Value
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={xpValue}
                  onChange={(e) => setXpValue(parseInt(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: '#00F0FF' }}
                />
                <div
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md min-w-[70px] justify-center"
                  style={{
                    backgroundColor: '#22222E',
                    border: '1px solid #2A2A38'
                  }}
                >
                  <Zap className="w-4 h-4" style={{ color: '#00F0FF' }} />
                  <span className="font-mono font-bold" style={{ color: '#F0F0F5' }}>
                    {xpValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#00F0FF',
                  color: '#0A0A0F',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isPending) {
                    e.currentTarget.style.backgroundColor = '#00D4E0';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00F0FF';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isPending ? "Saving..." : editHabit ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
