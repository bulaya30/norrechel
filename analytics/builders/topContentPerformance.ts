import type { Engagement } from "@/features/interfaces/engagement";
import type { View } from "@/features/interfaces/view";

import { calculateEngagementRate } from "@/analytics/calculations/engagementRate";

export interface TopContentPerformance {
  contentId: string;
  contentType: string;
  slug: string;
  views: number;
  engagements: number;
  engagementRate: number;
}

/**
 * Builds aggregated performance statistics for each piece of content.
 *
 * Content is identified by `content_id`.
 *
 * Views and engagement events are aggregated independently and then
 * combined into a single performance record.
 */
export function buildTopContentPerformance(
  views: View[],
  engagements: Engagement[],
): TopContentPerformance[] {
  const contentMap = new Map<
    string,
    {
      contentType: string;
      slug: string;
      views: number;
      engagements: number;
    }
  >();

  views.forEach((view) => {
    const existing = contentMap.get(view.content_id);

    if (existing) {
      existing.views += 1;
      return;
    }

    contentMap.set(view.content_id, {
      contentType: view.content_type,
      slug: view.slug,
      views: 1,
      engagements: 0,
    });
  });

  engagements.forEach((engagement) => {
    const existing = contentMap.get(engagement.content_id);

    if (existing) {
      existing.engagements += 1;
      return;
    }

    contentMap.set(engagement.content_id, {
      contentType: engagement.content_type,
      slug: "",
      views: 0,
      engagements: 1,
    });
  });

  return Array.from(contentMap.entries())
    .map(([contentId, data]) => ({
      contentId,
      contentType: data.contentType,
      slug: data.slug,
      views: data.views,
      engagements: data.engagements,
      engagementRate: calculateEngagementRate(
        data.engagements,
        data.views,
      ),
    }))
    .sort((first, second) => {
      if (second.views !== first.views) {
        return second.views - first.views;
      }

      return second.engagements - first.engagements;
    });
}