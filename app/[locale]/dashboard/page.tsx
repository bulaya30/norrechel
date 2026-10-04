import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import DashboardOverview from "@/features/dashboard/components/DashboardOverview";

import { getCachedPublishedArticles } from "@/features/articles/queries/article.queries";
import { getCachedPublishedProjects } from "@/features/projects/queries/project.queries";
import { getCachedSubscribers } from "@/features/subscribers/queries/subscriber.queries";
import { getCachedUserNotifications } from "@/features/notifications/queries/notification.queries";

import { getCachedViews } from "@/features/views/queries/view.queries";
import { getCachedEngagements } from "@/features/engagements/queries/engagement.queries";

import { getDashboardAnalytics } from "@/analytics/dashboardAnalytics";
import {
  isAnalyticsPeriod,
  type AnalyticsPeriod,
} from "@/analytics/types";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

type SupportedLocale = "en" | "fr";

interface DashboardPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;

  searchParams: Promise<{
    period?: string | string[];
  }>;
}

export default async function DashboardPage({
  params,
  searchParams,
}: DashboardPageProps) {
  const { locale } = await params;

  const { userId } =
    await requireAuthenticatedUser();

  const { period: periodParam } =
    await searchParams;

  /*
   * Normalize the query parameter.
   */
  const requestedPeriod = Array.isArray(
    periodParam,
  )
    ? periodParam[0]
    : periodParam;

  /*
   * Only allow supported analytics periods.
   *
   * Invalid or missing values fall back to 7d.
   */
  const period: AnalyticsPeriod =
    isAnalyticsPeriod(requestedPeriod)
      ? requestedPeriod
      : "7d";

  const [
    articles,
    projects,
    subscribers,
    notifications,
    views,
    engagements,
  ] = await Promise.all([
    getCachedPublishedArticles(),
    getCachedPublishedProjects(),
    getCachedSubscribers(),
    getCachedUserNotifications(userId),

    getCachedViews(),
    getCachedEngagements(),
  ]);

  /*
   * Analytics are calculated for the selected
   * period only.
   */
  const analytics =
    getDashboardAnalytics(
      views,
      engagements,
      period,
    );

  return (
    <>
      <DashboardPageHeader
        eyebrow="Dashboard"
        title="Overview"
        description="Monitor audience activity, content performance, and engagement across your platform."
      />

      <DashboardOverview
        locale={locale}
        articles={articles}
        projects={projects}
        subscribers={subscribers}
        notifications={notifications}
        analytics={analytics}
      />
    </>
  );
}