import type { Engagement } from "@/features/interfaces/engagement";
import type { View } from "@/features/interfaces/view";

import { buildAnalyticsDateRange } from "@/analytics/builders/dateRange";
import { buildAudienceResponse } from "@/analytics/builders/audienceResponse";
import { buildTopContentPerformance } from "@/analytics/builders/topContentPerformance";

import { calculateEngagementRate } from "@/analytics/calculations/engagementRate";
import { calculatePercentageChange } from "@/analytics/calculations/percentageChange";

import {
  isTimestampWithinRange,
  type TimestampInput,
} from "@/lib/dates/utils";

import type {
  AnalyticsDateRange,
  AnalyticsPeriod,
} from "@/analytics/types";

export interface RangeAnalytics {
  period: AnalyticsPeriod;

  range: {
    start: Date;
    end: Date;
  };

  overview: {
    views: number;
    engagements: number;
    uniqueVisitors: number;
    engagementRate: number;
  };

  trends: {
    views: {
      current: number;
      previous: number;
      change: number;
    };

    engagements: {
      current: number;
      previous: number;
      change: number;
    };
  };

  audience: {
    averageReadTime: number;
    averageScrollDepth: number;
    contactClicks: number;
  };

  chart: {
    name: string;
    views: number;
    engagements: number;
  }[];

  topContent: ReturnType<typeof buildTopContentPerformance>;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;

  return (
    values.reduce((total, value) => total + value, 0) /
    values.length
  );
}

function filterViews(
  views: View[],
  range: AnalyticsDateRange,
): View[] {
  return views.filter((view) =>
    isTimestampWithinRange(
      view.viewed_at,
      range.start,
      range.end,
    ),
  );
}

function filterEngagements(
  engagements: Engagement[],
  range: AnalyticsDateRange,
): Engagement[] {
  return engagements.filter((engagement) => {
    /**
     * createdAt is used when available.
     *
     * date is the fallback because the engagement service
     * also stores the event timestamp there.
     */
    const timestamp: TimestampInput =
      engagement.createdAt ?? engagement.date;

    return isTimestampWithinRange(
      timestamp,
      range.start,
      range.end,
    );
  });
}

function getAudienceMetrics(
  engagements: Engagement[],
) {
  const readTimes = engagements
    .filter(
      (engagement) =>
        engagement.event_type === "read_time",
    )
    .map((engagement) => engagement.event_value)
    .filter(
      (value): value is number =>
        typeof value === "number",
    );

  const scrollDepths = engagements
    .filter(
      (engagement) =>
        engagement.event_type === "scroll" ||
        engagement.event_type === "scroll_depth",
    )
    .map((engagement) => engagement.event_value)
    .filter(
      (value): value is number =>
        typeof value === "number",
    );

  const contactClicks = engagements.filter(
    (engagement) =>
      engagement.event_type === "contact_click",
  ).length;

  return {
    averageReadTime: Math.round(average(readTimes)),
    averageScrollDepth: Math.round(average(scrollDepths)),
    contactClicks,
  };
}

function getUniqueVisitors(views: View[]): number {
  return new Set(
    views
      .map((view) => view.visitor_id)
      .filter(Boolean),
  ).size;
}

function buildPreviousRange(
  range: AnalyticsDateRange,
): AnalyticsDateRange {
  const previousEnd = new Date(range.start);
  previousEnd.setDate(previousEnd.getDate() - 1);
  previousEnd.setHours(23, 59, 59, 999);

  const previousStart = new Date(previousEnd);

  switch (range.period) {
    case "7d":
      previousStart.setDate(previousStart.getDate() - 6);
      break;

    case "30d":
      previousStart.setDate(previousStart.getDate() - 29);
      break;

    case "90d":
      previousStart.setDate(previousStart.getDate() - 89);
      break;

    case "1y":
      previousStart.setFullYear(
        previousStart.getFullYear() - 1,
      );
      break;
  }

  previousStart.setHours(0, 0, 0, 0);

  return {
    ...range,
    start: previousStart,
    end: previousEnd,
  };
}

export function getRangeAnalytics(
  views: View[],
  engagements: Engagement[],
  period: AnalyticsPeriod,
): RangeAnalytics {
  /*
   * Current selected range
   */
  const range = buildAnalyticsDateRange(period);

  const currentViews = filterViews(
    views,
    range,
  );

  const currentEngagements = filterEngagements(
    engagements,
    range,
  );

  /*
   * Previous equivalent range
   */
  const previousRange = buildPreviousRange(range);

  const previousViews = filterViews(
    views,
    previousRange,
  );

  const previousEngagements = filterEngagements(
    engagements,
    previousRange,
  );

  /*
   * Overview
   */
  const viewCount = currentViews.length;
  const engagementCount = currentEngagements.length;

  const uniqueVisitors =
    getUniqueVisitors(currentViews);

  /*
   * Audience quality
   */
  const audience = getAudienceMetrics(
    currentEngagements,
  );

  /*
   * Chart
   */
    const chart = buildAudienceResponse(
    currentViews,
    currentEngagements,
    range.start,
    range.end,
    period,
    );

  /*
   * Top content
   *
   * Important: only events from the selected
   * period are passed to the builder.
   */
  const topContent =
    buildTopContentPerformance(
      currentViews,
      currentEngagements,
    );

  /*
   * Period comparison
   */
  const previousViewCount =
    previousViews.length;

  const previousEngagementCount =
    previousEngagements.length;

  return {
    period,

    range: {
      start: range.start,
      end: range.end,
    },

    overview: {
      views: viewCount,
      engagements: engagementCount,
      uniqueVisitors,
      engagementRate:
        calculateEngagementRate(
          engagementCount,
          viewCount,
        ),
    },

    trends: {
      views: {
        current: viewCount,
        previous: previousViewCount,
        change: calculatePercentageChange(
          previousViewCount,
          viewCount,
        ),
      },

      engagements: {
        current: engagementCount,
        previous: previousEngagementCount,
        change: calculatePercentageChange(
          previousEngagementCount,
          engagementCount,
        ),
      },
    },

    audience,

    chart,

    topContent,
  };
}