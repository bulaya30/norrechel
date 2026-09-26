/**
 * Calculates the engagement rate for a set of content interactions.
 *
 * Engagement rate represents the percentage of views that resulted
 * in an engagement event.
 *
 * @param engagements - Total number of engagement events.
 * @param views - Total number of views.
 * @returns Engagement rate as a percentage.
 */
export function calculateEngagementRate(
  engagements: number,
  views: number,
): number {
  if (views <= 0 || engagements <= 0) {
    return 0;
  }

  return Math.round((engagements / views) * 100);
}