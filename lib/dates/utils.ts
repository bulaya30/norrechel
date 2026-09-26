export const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export interface FirestoreTimestamp {
  seconds?: number;
  nanoseconds?: number;

  toDate?: () => Date;
  toMillis?: () => number;

  _seconds?: number;
  _nanoseconds?: number;
}

export type TimestampInput =
  | FirestoreTimestamp
  | Date
  | string
  | number
  | null
  | undefined;

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Converts a supported date value into a native Date.
 */
export function normalizeDate(
  timestamp: TimestampInput,
): Date | null {
  if (timestamp == null) {
    return null;
  }

  if (timestamp instanceof Date) {
    return Number.isNaN(timestamp.getTime())
      ? null
      : new Date(timestamp);
  }

  if (
    typeof timestamp === "string" ||
    typeof timestamp === "number"
  ) {
    const date = new Date(timestamp);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof timestamp.toDate === "function") {
    const date = timestamp.toDate();

    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof timestamp.toMillis === "function") {
    const date = new Date(timestamp.toMillis());

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const seconds =
    typeof timestamp.seconds === "number"
      ? timestamp.seconds
      : typeof timestamp._seconds === "number"
        ? timestamp._seconds
        : null;

  if (seconds === null) {
    return null;
  }

  const nanoseconds =
    typeof timestamp.nanoseconds === "number"
      ? timestamp.nanoseconds
      : typeof timestamp._nanoseconds === "number"
        ? timestamp._nanoseconds
        : 0;

  const milliseconds =
    seconds * 1000 + Math.floor(nanoseconds / 1_000_000);

  const date = new Date(milliseconds);

  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Formats a supported timestamp for display.
 */
export function readableDate(
  timestamp: TimestampInput,
  locale = "en-US",
): string {
  const date = normalizeDate(timestamp);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Returns Sunday 00:00:00 through Saturday 23:59:59.
 */
export function getCurrentWeekRange(
  referenceDate: Date = new Date(),
): DateRange {
  const start = new Date(referenceDate);

  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(start);

  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Returns the Sunday–Saturday range immediately before
 * the current reporting week.
 */
export function getLastWeekRange(
  referenceDate: Date = new Date(),
): DateRange {
  const { start: currentWeekStart } =
    getCurrentWeekRange(referenceDate);

  const start = new Date(currentWeekStart);
  start.setDate(start.getDate() - 7);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Checks whether a timestamp falls inside a date range.
 */
export function isTimestampWithinRange(
  timestamp: TimestampInput,
  start: Date,
  end: Date,
): boolean {
  const date = normalizeDate(timestamp);

  if (!date) {
    return false;
  }

  const time = date.getTime();

  return time >= start.getTime() && time <= end.getTime();
}

/**
 * Filters records using a supported date field.
 */
export function filterEventsByDate<
  T extends object,
  K extends keyof T,
>(
  events: T | T[] | null | undefined,
  start: Date,
  end: Date,
  dateField: K,
): T[] {
  const list = Array.isArray(events)
    ? events
    : events
      ? [events]
      : [];

  return list.filter((event) =>
    isTimestampWithinRange(
      event[dateField] as TimestampInput,
      start,
      end,
    ),
  );
}

/**
 * Checks whether a timestamp is within the current week.
 */
export function isInCurrentWeek(
  timestamp: TimestampInput,
  referenceDate: Date = new Date(),
): boolean {
  const { start, end } =
    getCurrentWeekRange(referenceDate);

  return isTimestampWithinRange(timestamp, start, end);
}

/**
 * Checks whether a timestamp occurs on the same local
 * calendar day as the reference date.
 */
export function isToday(
  timestamp: TimestampInput,
  referenceDate: Date = new Date(),
): boolean {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(referenceDate);
  end.setHours(23, 59, 59, 999);

  return isTimestampWithinRange(timestamp, start, end);
}

/**
 * Checks whether a timestamp occurred during the rolling
 * seven-day period ending at the reference time.
 */
export function isWithinLastSevenDays(
  timestamp: TimestampInput,
  referenceDate: Date = new Date(),
): boolean {
  const end = new Date(referenceDate);

  const start = new Date(referenceDate);
  start.setDate(start.getDate() - 7);

  return isTimestampWithinRange(timestamp, start, end);
}