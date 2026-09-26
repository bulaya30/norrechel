import type { Engagement } from "@/features/interfaces/engagement";
import type { View } from "@/features/interfaces/view";

import {
  getRangeAnalytics,
  type RangeAnalytics,
} from "@/analytics/rangeAnalytics";

import type { AnalyticsPeriod } from "@/analytics/types";

export type DashboardAnalytics = RangeAnalytics;

export function getDashboardAnalytics(
  views: View[],
  engagements: Engagement[],
  period: AnalyticsPeriod = "7d",
): DashboardAnalytics {
  return getRangeAnalytics(
    views,
    engagements,
    period,
  );
}