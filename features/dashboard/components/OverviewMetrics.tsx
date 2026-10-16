
"use client";

import {
  Eye,
  MousePointerClick,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

import MetricCard from "./MetricCard";
import AnalyticsPeriodSelector from "./AnalyticsPeriodSelector";

import type { DashboardAnalytics } from "@/analytics/dashboardAnalytics";

interface OverviewMetricsProps {
  locale: SupportedLocale;
  period: DashboardAnalytics["period"];
  views: number;
  engagements: number;
  uniqueVisitors: number;
  engagementRate: number;
  viewsTrend: number;
  engagementTrend: number;
  periodLabel: string;
}

export default function OverviewMetrics({
  locale,
  period,
  views,
  engagements,
  uniqueVisitors,
  engagementRate,
  viewsTrend,
  engagementTrend,
  periodLabel,
}: OverviewMetricsProps) {
  const t = useTranslations("DashboardOverview");

  return (
    <section aria-labelledby="dashboard-performance-heading">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
          {t("performance")}
        </p>

        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="dashboard-performance-heading"
              className="text-xl font-bold tracking-tight text-slate-950"
            >
              {t("audienceOverview")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("performanceOverPeriod", {
                period: periodLabel,
              })}
            </p>
          </div>

          <AnalyticsPeriodSelector
            locale={locale}
            period={period}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          locale={locale}
          label={t("views")}
          value={views}
          description={t("contentViews")}
          icon={Eye}
          trend={viewsTrend}
        />

        <MetricCard
          locale={locale}
          label={t("engagements")}
          value={engagements}
          description={t("recordedInteractions")}
          icon={MousePointerClick}
          trend={engagementTrend}
        />

        <MetricCard
          locale={locale}
          label={t("uniqueVisitors")}
          value={uniqueVisitors}
          description={t("visitorsViewedContent")}
          icon={Users}
        />

        <MetricCard
          locale={locale}
          label={t("engagementRate")}
          value={engagementRate}
          description={t("engagementsRelativeToViews")}
          icon={MousePointerClick}
        />
      </div>
    </section>
  );
}
