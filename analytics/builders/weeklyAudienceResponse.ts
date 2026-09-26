import type { Engagement } from "@/features/interfaces/engagement";
import type { View } from "@/features/interfaces/view";
import { isInCurrentWeek, normalizeDate, weekDays } from "@/lib/dates/utils";

export interface WeeklyAudienceResponse {
  name: string;
  views: number;
  engagements: number;
}

/**
 * Builds a day-by-day view of audience response for the current week.
 *
 * Each day contains:
 * - total views
 * - total engagement events
 *
 * The result is ordered according to `weekDays`.
 */
export function buildWeeklyAudienceResponse(
  views: View[],
  engagements: Engagement[],
): WeeklyAudienceResponse[] {
  const weeklyData = weekDays.map((day) => ({
    name: day,
    views: 0,
    engagements: 0,
  }));

  views.forEach((view) => {
    if (!isInCurrentWeek(view.viewed_at)) {
      return;
    }

    const date = normalizeDate(view.viewed_at);

    if (!date) {
      return;
    }

    const day = weeklyData[date.getDay()];

    if (day) {
      day.views += 1;
    }
  });

  engagements.forEach((engagement) => {
    if (!isInCurrentWeek(engagement.createdAt)) {
      return;
    }

    const date = normalizeDate(engagement.createdAt);

    if (!date) {
      return;
    }

    const day = weeklyData[date.getDay()];

    if (day) {
      day.engagements += 1;
    }
  });

  return weeklyData;
}