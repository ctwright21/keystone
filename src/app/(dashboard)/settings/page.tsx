"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, User, Mail, LogOut, Trash2, Globe, Check, Settings, Calendar } from "lucide-react";

const TIMEZONES = [
  { value: "Pacific/Honolulu", label: "Hawaii (HST)" },
  { value: "America/Anchorage", label: "Alaska (AKST)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PST)" },
  { value: "America/Denver", label: "Mountain Time (MST)" },
  { value: "America/Chicago", label: "Central Time (CST)" },
  { value: "America/New_York", label: "Eastern Time (EST)" },
  { value: "America/Halifax", label: "Atlantic Time (AST)" },
  { value: "America/St_Johns", label: "Newfoundland (NST)" },
  { value: "America/Sao_Paulo", label: "Brasilia (BRT)" },
  { value: "Atlantic/Azores", label: "Azores (AZOT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Helsinki", label: "Helsinki (EET)" },
  { value: "Europe/Moscow", label: "Moscow (MSK)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Karachi", label: "Karachi (PKT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
  { value: "Pacific/Auckland", label: "Auckland (NZDT)" },
];

interface UserSettings {
  id: string;
  name: string;
  email: string;
  timezone: string;
  weekStartDay: number; // 0 = Sunday, 1 = Monday
  image: string | null;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [selectedWeekStart, setSelectedWeekStart] = useState(0);
  const [saved, setSaved] = useState(false);

  const { data: settings, isLoading: settingsLoading } = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: async () => {
      const res = await fetch("/api/user/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (settings?.timezone) {
      setSelectedTimezone(settings.timezone);
    }
    if (settings?.weekStartDay !== undefined) {
      setSelectedWeekStart(settings.weekStartDay);
    }
  }, [settings?.timezone, settings?.weekStartDay]);

  const updateMutation = useMutation({
    mutationFn: async (data: { timezone?: string; weekStartDay?: number }) => {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      queryClient.invalidateQueries({ queryKey: ["currentWeek"] });
      queryClient.invalidateQueries({ queryKey: ["weeks"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  function handleTimezoneChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTimezone = e.target.value;
    setSelectedTimezone(newTimezone);
    updateMutation.mutate({ timezone: newTimezone });
  }

  function handleWeekStartChange(newWeekStart: number) {
    setSelectedWeekStart(newWeekStart);
    updateMutation.mutate({ weekStartDay: newWeekStart });
  }

  if (status === "loading" || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#00F0FF' }} />
          <p style={{ color: '#6A6A7A' }}>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="w-6 h-6" style={{ color: '#00F0FF' }} />
        <h1 className="text-2xl font-bold" style={{ color: '#F0F0F5' }}>Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#F0F0F5' }}>Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-md flex items-center justify-center"
              style={{ backgroundColor: '#22222E', border: '1px solid #3A3A48' }}
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-md"
                />
              ) : (
                <span className="text-2xl font-bold" style={{ color: '#F0F0F5' }}>
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 font-medium" style={{ color: '#F0F0F5' }}>
                <User className="w-4 h-4" style={{ color: '#6A6A7A' }} />
                {session?.user?.name || "User"}
              </div>
              <div className="flex items-center gap-2 mt-1" style={{ color: '#A0A0B0' }}>
                <Mail className="w-4 h-4" style={{ color: '#6A6A7A' }} />
                {session?.user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timezone Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#F0F0F5' }}>Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#A0A0B0' }}>
              <Globe className="w-4 h-4" />
              Timezone
            </label>
            <div className="relative">
              <select
                value={selectedTimezone}
                onChange={handleTimezoneChange}
                disabled={updateMutation.isPending}
                className="input appearance-none cursor-pointer disabled:opacity-50 pr-10"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {updateMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#6A6A7A' }} />
                ) : saved ? (
                  <Check className="w-5 h-5" style={{ color: '#10B981' }} />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6A6A7A' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: '#6A6A7A' }}>
              This affects when your daily and weekly habits reset.
            </p>
          </div>

          {/* Week Start Day */}
          <div className="pt-4" style={{ borderTop: '1px solid #2A2A38' }}>
            <label className="flex items-center gap-2 text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: '#A0A0B0' }}>
              <Calendar className="w-4 h-4" />
              Week Starts On
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleWeekStartChange(0)}
                disabled={updateMutation.isPending}
                className="flex-1 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50"
                style={{
                  backgroundColor: selectedWeekStart === 0 ? 'rgba(0, 240, 255, 0.2)' : '#22222E',
                  color: selectedWeekStart === 0 ? '#00F0FF' : '#6A6A7A',
                  border: `1px solid ${selectedWeekStart === 0 ? 'rgba(0, 240, 255, 0.5)' : '#3A3A48'}`,
                }}
              >
                Sunday
              </button>
              <button
                onClick={() => handleWeekStartChange(1)}
                disabled={updateMutation.isPending}
                className="flex-1 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50"
                style={{
                  backgroundColor: selectedWeekStart === 1 ? 'rgba(0, 240, 255, 0.2)' : '#22222E',
                  color: selectedWeekStart === 1 ? '#00F0FF' : '#6A6A7A',
                  border: `1px solid ${selectedWeekStart === 1 ? 'rgba(0, 240, 255, 0.5)' : '#3A3A48'}`,
                }}
              >
                Monday
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: '#6A6A7A' }}>
              Choose which day your week begins. This affects the dashboard and history views.
            </p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#F0F0F5' }}>Account</h2>
        <div className="space-y-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all text-sm font-semibold uppercase tracking-wide"
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
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>

          <div className="pt-4" style={{ borderTop: '1px solid #2A2A38' }}>
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#EF4444' }}>Danger Zone</h3>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all text-sm font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
              >
                <Trash2 className="w-5 h-5" />
                Delete Account
              </button>
            ) : (
              <div
                className="p-4 rounded-md"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <p className="text-sm mb-4" style={{ color: '#EF4444' }}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="flex-1 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
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
                    onClick={() => {
                      alert("Account deletion not yet implemented");
                    }}
                    className="flex-1 px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
                    style={{
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#DC2626';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#EF4444';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
