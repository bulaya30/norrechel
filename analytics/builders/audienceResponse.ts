import type { Engagement } from "@/features/interfaces/engagement";
import type { View } from "@/features/interfaces/view";

import { normalizeDate } from "@/lib/dates/utils";

import type { AnalyticsPeriod } from "@/analytics/types";

export interface AudienceResponsePoint {
  name: string;
  views: number;
  engagements: number;
}

type Granularity = "day" | "week" | "month";

function getGranularity(
  period: AnalyticsPeriod,
): Granularity {
  switch (period) {
    case "7d":
    case "30d":
      return "day";

    case "90d":
      return "week";

    case "1y":
      return "month";

    default:
      throw new Error(
        `Unsupported analytics period: ${period}`,
      );
  }
}

function getDayKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getMonthKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
  ].join("-");
}

function getDateLabel(
  date: Date,
  granularity: Granularity,
): string {
  if (granularity === "month") {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        year: "numeric",
      },
    ).format(date);
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

function startOfDay(date: Date): Date {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function startOfMonth(date: Date): Date {
  const result = new Date(date);

  result.setDate(1);
  result.setHours(0, 0, 0, 0);

  return result;
}

function addDays(
  date: Date,
  days: number,
): Date {
  const result = new Date(date);

  result.setDate(
    result.getDate() + days,
  );

  return result;
}

function addMonths(
  date: Date,
  months: number,
): Date {
  const result = new Date(date);

  result.setMonth(
    result.getMonth() + months,
  );

  return result;
}

function getBucketKey(
  date: Date,
  rangeStart: Date,
  granularity: Granularity,
): string {
  if (granularity === "day") {
    return getDayKey(date);
  }

  if (granularity === "month") {
    return getMonthKey(date);
  }

  /*
   * Weekly buckets are relative to the selected
   * range rather than calendar weeks.
   *
   * This gives us predictable buckets for 90d.
   */
  const start = startOfDay(rangeStart);
  const current = startOfDay(date);

  const difference =
    current.getTime() - start.getTime();

  const daysElapsed = Math.floor(
    difference / (1000 * 60 * 60 * 24),
  );

  const weekIndex = Math.floor(
    daysElapsed / 7,
  );

  const bucketStart = addDays(
    start,
    weekIndex * 7,
  );

  return getDayKey(bucketStart);
}

function getBucketStart(
  rangeStart: Date,
  index: number,
  granularity: Granularity,
): Date {
  if (granularity === "day") {
    return addDays(
      startOfDay(rangeStart),
      index,
    );
  }

  if (granularity === "week") {
    return addDays(
      startOfDay(rangeStart),
      index * 7,
    );
  }

  return addMonths(
    startOfMonth(rangeStart),
    index,
  );
}

function isWithinRange(
  date: Date,
  start: Date,
  end: Date,
): boolean {
  return (
    date.getTime() >= start.getTime() &&
    date.getTime() <= end.getTime()
  );
}

/**
 * Builds audience-response data for the selected
 * analytics period.
 *
 * 7d  -> daily
 * 30d -> daily
 * 90d -> weekly
 * 1y  -> monthly
 */
export function buildAudienceResponse(
  views: View[],
  engagements: Engagement[],
  start: Date,
  end: Date,
  period: AnalyticsPeriod,
): AudienceResponsePoint[] {
  const granularity =
    getGranularity(period);

  const buckets = new Map<
    string,
    AudienceResponsePoint
  >();

  /*
   * Create empty buckets first so days/weeks/months
   * with zero activity still appear on the chart.
   */
  if (granularity === "day") {
    let current = startOfDay(start);
    let index = 0;

    while (current <= end) {
      const key = getBucketKey(
        current,
        start,
        granularity,
      );

      buckets.set(key, {
        name: getDateLabel(
          current,
          granularity,
        ),
        views: 0,
        engagements: 0,
      });

      index += 1;

      current = getBucketStart(
        start,
        index,
        granularity,
      );
    }
  }

  if (granularity === "week") {
    let index = 0;
    let current = getBucketStart(
      start,
      index,
      granularity,
    );

    while (current <= end) {
      const key = getBucketKey(
        current,
        start,
        granularity,
      );

      buckets.set(key, {
        name: getDateLabel(
          current,
          granularity,
        ),
        views: 0,
        engagements: 0,
      });

      index += 1;

      current = getBucketStart(
        start,
        index,
        granularity,
      );
    }
  }

  if (granularity === "month") {
    let index = 0;
    let current = getBucketStart(
      start,
      index,
      granularity,
    );

    while (current <= end) {
      const key = getBucketKey(
        current,
        start,
        granularity,
      );

      buckets.set(key, {
        name: getDateLabel(
          current,
          granularity,
        ),
        views: 0,
        engagements: 0,
      });

      index += 1;

      current = getBucketStart(
        start,
        index,
        granularity,
      );
    }
  }

  /*
   * Add views to their respective buckets.
   */
  views.forEach((view) => {
    const date = normalizeDate(
      view.viewed_at,
    );

    if (!date) return;

    if (!isWithinRange(date, start, end)) {
      return;
    }

    const key = getBucketKey(
      date,
      start,
      granularity,
    );

    const bucket = buckets.get(key);

    if (bucket) {
      bucket.views += 1;
    }
  });

  /*
   * Add engagements to their respective buckets.
   *
   * createdAt is preferred, with date as fallback.
   */
  engagements.forEach((engagement) => {
    const date = normalizeDate(
      engagement.createdAt ??
        engagement.date,
    );

    if (!date) return;

    if (!isWithinRange(date, start, end)) {
      return;
    }

    const key = getBucketKey(
      date,
      start,
      granularity,
    );

    const bucket = buckets.get(key);

    if (bucket) {
      bucket.engagements += 1;
    }
  });

  return Array.from(
    buckets.values(),
  );
}