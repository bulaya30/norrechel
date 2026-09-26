export type AnalyticsPeriod =
  | "7d"
  | "30d"
  | "90d"
  | "1y";

export interface AnalyticsDateRange {
  period: AnalyticsPeriod;
  start: Date;
  end: Date;
}

export function isAnalyticsPeriod(
  value: unknown,
): value is AnalyticsPeriod {
  return (
    value === "7d" ||
    value === "30d" ||
    value === "90d" ||
    value === "1y"
  );
}