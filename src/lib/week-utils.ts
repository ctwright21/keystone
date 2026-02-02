/**
 * Week start day constants
 * 0 = Sunday, 1 = Monday
 */
export const WEEK_START_SUNDAY = 0;
export const WEEK_START_MONDAY = 1;

/**
 * Day names arrays
 */
const DAY_NAMES_SUNDAY_START = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_MONDAY_START = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const FULL_DAY_NAMES_SUNDAY_START = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const FULL_DAY_NAMES_MONDAY_START = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * Get day names based on week start day
 */
export function getDayNames(weekStartDay: number = WEEK_START_SUNDAY): string[] {
  return weekStartDay === WEEK_START_MONDAY ? DAY_NAMES_MONDAY_START : DAY_NAMES_SUNDAY_START;
}

/**
 * Get full day names based on week start day
 */
export function getFullDayNames(weekStartDay: number = WEEK_START_SUNDAY): string[] {
  return weekStartDay === WEEK_START_MONDAY ? FULL_DAY_NAMES_MONDAY_START : FULL_DAY_NAMES_SUNDAY_START;
}

// Legacy exports for backwards compatibility
export const DAY_NAMES = DAY_NAMES_SUNDAY_START;
export const FULL_DAY_NAMES = FULL_DAY_NAMES_SUNDAY_START;

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
 * Get the start of the week for a given date
 * @param date - The date to get the week start for
 * @param weekStartDay - 0 = Sunday, 1 = Monday
 */
export function getWeekStart(date: Date = new Date(), weekStartDay: number = WEEK_START_SUNDAY): Date {
  const d = new Date(date);
  const currentDay = d.getDay(); // 0 = Sunday, 6 = Saturday

  // Calculate days to subtract to get to the start of the week
  let daysToSubtract: number;
  if (weekStartDay === WEEK_START_MONDAY) {
    // For Monday start: Monday=0 days back, Sunday=6 days back
    daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  } else {
    // For Sunday start: Sunday=0 days back, Saturday=6 days back
    daysToSubtract = currentDay;
  }

  d.setDate(d.getDate() - daysToSubtract);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the start of the week in a specific timezone
 */
export function getWeekStartInTimezone(
  timezone: string = "America/New_York",
  weekStartDay: number = WEEK_START_SUNDAY
): Date {
  const now = getDateInTimezone(timezone);
  return getWeekStart(now, weekStartDay);
}

/**
 * Get the end of the week for a given date
 */
export function getWeekEnd(date: Date = new Date(), weekStartDay: number = WEEK_START_SUNDAY): Date {
  const start = getWeekStart(date, weekStartDay);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Get the end of the week in a specific timezone
 */
export function getWeekEndInTimezone(
  timezone: string = "America/New_York",
  weekStartDay: number = WEEK_START_SUNDAY
): Date {
  const start = getWeekStartInTimezone(timezone, weekStartDay);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Get the day index (0-6) within the week for a date
 * Returns 0 for the first day of the week, 6 for the last
 * @param date - The date to get the index for
 * @param weekStartDay - 0 = Sunday start, 1 = Monday start
 */
export function getDayIndex(date: Date = new Date(), weekStartDay: number = WEEK_START_SUNDAY): number {
  const jsDay = date.getDay(); // JavaScript: 0 = Sunday, 6 = Saturday

  if (weekStartDay === WEEK_START_MONDAY) {
    // Convert to Monday-based: Monday=0, Sunday=6
    return jsDay === 0 ? 6 : jsDay - 1;
  }

  // Sunday-based: Sunday=0, Saturday=6 (same as JavaScript)
  return jsDay;
}

/**
 * Get the day index in a specific timezone
 */
export function getDayIndexInTimezone(
  timezone: string = "America/New_York",
  weekStartDay: number = WEEK_START_SUNDAY
): number {
  const now = getDateInTimezone(timezone);
  return getDayIndex(now, weekStartDay);
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
export function isCurrentWeek(weekStart: Date, weekStartDay: number = WEEK_START_SUNDAY): boolean {
  const currentWeekStart = getWeekStart(new Date(), weekStartDay);
  return weekStart.getTime() === currentWeekStart.getTime();
}

/**
 * Get the number of weeks between two dates
 */
export function getWeeksBetween(startDate: Date, endDate: Date): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((endDate.getTime() - startDate.getTime()) / msPerWeek);
}
