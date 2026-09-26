import type { Engagement } from "@/features/interfaces/engagement";
import type { View } from "@/features/interfaces/view";

import { buildWeeklyAudienceResponse } from "@/analytics/builders/weeklyAudienceResponse";
import { calculatePercentageChange } from "@/analytics/calculations/percentageChange";

import {
  getCurrentWeekRange,
  getLastWeekRange,
  isInCurrentWeek,
  isTimestampWithinRange,
  normalizeDate,
  type TimestampInput,
  weekDays,
} from "@/lib/dates/utils";

/**
 * Calculates the average value of a numeric array.
 */
export function avg(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return total / values.length;
}

/**
 * Filters one or more records by a timestamp field.
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

  return list.filter((event) => {
    const timestamp = event[dateField] as TimestampInput;

    return isTimestampWithinRange(
      timestamp,
      start,
      end,
    );
  });
}

/**
 * Returns a numeric timestamp for sorting.
 * Invalid timestamps are placed at the beginning.
 */
function getTimestampValue(
  timestamp: TimestampInput,
): number {
  const date = normalizeDate(timestamp);

  return date?.getTime() ?? 0;
}

/**
 * Builds the analytics report for the current week.
 */
export function getWeeklyReport(
  views: View[],
  engagements: Engagement[],
) {
  const { start, end } = getCurrentWeekRange();

  const weeklyViews = filterEventsByDate(
    views,
    start,
    end,
    "viewed_at",
  );

  const weeklyEngagements = filterEventsByDate(
    engagements,
    start,
    end,
    "createdAt",
  );

  const weeklyChart = buildWeeklyAudienceResponse(
    weeklyViews,
    weeklyEngagements,
  );

  const readTimes = weeklyEngagements
    .filter(
      (engagement) =>
        engagement.event_type === "read_time",
    )
    .map((engagement) => engagement.event_value)
    .filter(
      (value): value is number =>
        typeof value === "number",
    );

  const scrollDepths = weeklyEngagements
    .filter(
      (engagement) =>
        engagement.event_type === "scroll",
    )
    .map((engagement) => engagement.event_value)
    .filter(
      (value): value is number =>
        typeof value === "number",
    );

  const contactClicks = weeklyEngagements.filter(
    (engagement) =>
      engagement.event_type === "contact_click",
  ).length;

  const uniqueVisitors = new Set(
    weeklyViews
      .map((view) => view.visitor_id)
      .filter(Boolean),
  ).size;

  return {
    period: {
      start,
      end,
    },

    chart: weeklyChart,

    views: weeklyViews.length,

    engagements: {
      total: weeklyEngagements.length,

      readTime: Math.round(avg(readTimes)),

      scroll: Math.round(avg(scrollDepths)),

      contactClicks,
    },

    uniqueVisitors,
  };
}

/**
 * Builds detailed analytics for the supplied content.
 */
export function getContentAnalysis(
  views: View[],
  engagements: Engagement[],
) {
  const weeklyDays = weekDays.map((day) => ({
    name: day,
    views: 0,
  }));

  views.forEach((view) => {
    if (!isInCurrentWeek(view.viewed_at)) {
      return;
    }

    const date = normalizeDate(view.viewed_at);

    if (!date) {
      return;
    }

    const day = weeklyDays[date.getDay()];

    if (day) {
      day.views += 1;
    }
  });

  const sortedViews = [...views].sort(
    (firstView, secondView) =>
      getTimestampValue(firstView.viewed_at) -
      getTimestampValue(secondView.viewed_at),
  );

  const sortedEngagements = [...engagements].sort(
    (firstEngagement, secondEngagement) =>
      getTimestampValue(firstEngagement.createdAt) -
      getTimestampValue(secondEngagement.createdAt),
  );

  const uniqueVisitors = new Set(
    views
      .map((view) => view.visitor_id)
      .filter(Boolean),
  ).size;

  return {
    views: {
      count: sortedViews.length,

      firstViewedAt:
        sortedViews[0]?.viewed_at ?? null,

      lastViewedAt:
        sortedViews.at(-1)?.viewed_at ?? null,

      weekly: weeklyDays,
    },

    uniqueVisitors,

    engagements: {
      count: sortedEngagements.length,

      firstEngagedAt:
        sortedEngagements[0]?.createdAt ?? null,

      lastEngagedAt:
        sortedEngagements.at(-1)?.createdAt ?? null,
    },
  };
}

/**
 * Compares the current week against the previous week.
 */
export function getTrendComparison(
  views: View[],
  engagements: Engagement[],
) {
  const currentWeek = getCurrentWeekRange();
  const previousWeek = getLastWeekRange();

  const currentWeekViews = filterEventsByDate(
    views,
    currentWeek.start,
    currentWeek.end,
    "viewed_at",
  );

  const currentWeekEngagements = filterEventsByDate(
    engagements,
    currentWeek.start,
    currentWeek.end,
    "createdAt",
  );

  const previousWeekViews = filterEventsByDate(
    views,
    previousWeek.start,
    previousWeek.end,
    "viewed_at",
  );

  const previousWeekEngagements =
    filterEventsByDate(
      engagements,
      previousWeek.start,
      previousWeek.end,
      "createdAt",
    );

  const currentWeekViewCount =
    currentWeekViews.length;

  const previousWeekViewCount =
    previousWeekViews.length;

  const currentWeekEngagementCount =
    currentWeekEngagements.length;

  const previousWeekEngagementCount =
    previousWeekEngagements.length;

  return {
    views: {
      change: calculatePercentageChange(
        previousWeekViewCount,
        currentWeekViewCount,
      ),

      lastWeek: previousWeekViewCount,

      thisWeek: currentWeekViewCount,
    },

    engagements: {
      change: calculatePercentageChange(
        previousWeekEngagementCount,
        currentWeekEngagementCount,
      ),

      lastWeek: previousWeekEngagementCount,

      thisWeek: currentWeekEngagementCount,
    },
  };
}