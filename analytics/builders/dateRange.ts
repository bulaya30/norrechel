import type {
  AnalyticsDateRange,
  AnalyticsPeriod,
} from "@/analytics/types";

export function buildAnalyticsDateRange(
  period: AnalyticsPeriod,
  now = new Date(),
): AnalyticsDateRange {
  const end = new Date(now);

  end.setHours(23, 59, 59, 999);

  const start = new Date(end);

  switch (period) {
    case "7d":
      start.setDate(start.getDate() - 6);
      break;

    case "30d":
      start.setDate(start.getDate() - 29);
      break;

    case "90d":
      start.setDate(start.getDate() - 89);
      break;

    case "1y":
      start.setFullYear(start.getFullYear() - 1);
      start.setDate(start.getDate() + 1);
      break;
  }

  start.setHours(0, 0, 0, 0);

  return {
    period,
    start,
    end,
  };
}