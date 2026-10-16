
"use client";

import { useTranslations } from "next-intl";

import type { Article } from "@/features/interfaces/article";
import type { Project } from "@/features/interfaces/project";
import type { Subscriber } from "@/features/interfaces/subscriber";
import type { DashboardAnalytics } from "@/analytics/dashboardAnalytics";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

import AudienceMetrics from "./AudienceMetrics";
import AudienceResponseChart from "./AudienceResponseChart";
import TopContentPerformance from "./TopContentPerformance";
import RecentContent from "./RecentContent";
import ContentInventory from "./ContentInventory";
import OverviewMetrics from "./OverviewMetrics";

interface DashboardOverviewProps {
  locale: SupportedLocale;
  articles?: Article[] | null;
  projects?: Project[] | null;
  subscribers?: Subscriber[] | null;
  notifications?: unknown[] | null;
  analytics: DashboardAnalytics;
}

export default function DashboardOverview({
  locale,
  articles,
  projects,
  subscribers,
  analytics,
}: DashboardOverviewProps) {
  const t = useTranslations("DashboardOverview");

  const safeArticles = Array.isArray(articles)
    ? articles.filter(Boolean)
    : [];

  const safeProjects = Array.isArray(projects)
    ? projects.filter(Boolean)
    : [];

  const safeSubscribers = Array.isArray(subscribers)
    ? subscribers.filter(Boolean)
    : [];

  const viewsTrend = analytics.trends.views.change;
  const engagementTrend = analytics.trends.engagements.change;

  const periodLabel = t(
    `period${analytics.period}` as
      | "period7d"
      | "period30d"
      | "period90d"
      | "period1y",
  );

  return (
    <div className="space-y-10">
      <OverviewMetrics
        locale={locale}
        period={analytics.period}
        views={analytics.overview.views}
        engagements={analytics.overview.engagements}
        uniqueVisitors={analytics.overview.uniqueVisitors}
        engagementRate={analytics.overview.engagementRate}
        viewsTrend={viewsTrend}
        engagementTrend={engagementTrend}
        periodLabel={periodLabel}
      />

      <AudienceResponseChart
        locale={locale}
        data={analytics.chart}
        period={analytics.period}
      />

      <AudienceMetrics
        analytics={analytics}
        locale={locale}
      />

      <TopContentPerformance
        analytics={analytics}
        articles={safeArticles}
        projects={safeProjects}
        locale={locale}
      />

      <RecentContent
        articles={safeArticles}
        projects={safeProjects}
        locale={locale}
      />

      <ContentInventory
        locale={locale}
        articles={safeArticles}
        projects={safeProjects}
        subscribers={safeSubscribers}
      />
    </div>
  );
}
