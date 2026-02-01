/**
 * Get the current date in a specific timezone
 */
export function getDateInTimezone(timezone: string = "America/New_York"): Date {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("en-CA", options);
  const parts = formatter.formatToParts(now);

  const getPart = (type: string) => parts.find(p => p.type === type)?.value || "0";

  const year = parseInt(getPart("year"));
  const month = parseInt(getPart("month")) - 1;
  const day = parseInt(getPart("day"));
  const hour = parseInt(getPart("hour"));
  const minute = parseInt(getPart("minute"));
  const second = parseInt(getPart("second"));

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Get the start of the week (Sunday) for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  // Go back to Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the start of the week (Sunday) in a specific timezone
 */
export function getWeekStartInTimezone(timezone: string = "America/New_York"): Date {
  const now = getDateInTimezone(timezone);
  return getWeekStart(now);
}

/**
 * Get the end of the week (Saturday) for a given date
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Get the end of the week (Saturday) in a specific timezone
 */
export function getWeekEndInTimezone(timezone: string = "America/New_York"): Date {
  const start = getWeekStartInTimezone(timezone);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Get the day index (0 = Sunday, 6 = Saturday) for a date
 */
export function getDayIndex(date: Date = new Date()): number {
  return date.getDay(); // JavaScript's native: 0 = Sunday, 6 = Saturday
}

/**
 * Get the day index in a specific timezone
 */
export function getDayIndexInTimezone(timezone: string = "America/New_York"): number {
  const now = getDateInTimezone(timezone);
  return now.getDay();
}

/**
 * Get date for a specific day index within a week
 */
export function getDateForDayIndex(weekStart: Date, dayIndex: number): Date {
  const date = new Date(weekStart);
  date.setDate(date.getDate() + dayIndex);
  return date;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Format date range for display
 */
export function formatWeekRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const start = startDate.toLocaleDateString("en-US", options);
  const end = endDate.toLocaleDateString("en-US", {
    ...options,
    year: "numeric",
  });
  return `${start} - ${end}`;
}

/**
 * Get short day names for display (Sunday first)
 */
export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const FULL_DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is today in a specific timezone
 */
export function isTodayInTimezone(date: Date, timezone: string = "America/New_York"): boolean {
  const today = getDateInTimezone(timezone);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past (before today)
 */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is in the current week
 */
export function isCurrentWeek(weekStart: Date): boolean {
  const currentWeekStart = getWeekStart();
  return weekStart.getTime() === currentWeekStart.getTime();
}

/**
 * Get the number of weeks between two dates
 */
export function getWeeksBetween(startDate: Date, endDate: Date): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((endDate.getTime() - startDate.getTime()) / msPerWeek);
}
