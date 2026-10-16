
"use client";

import {
  Clock3,
  Mail,
  MousePointerClick,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  formatDuration,
  formatCompactNumber,
} from "@/lib/dates/formatters";

import type { DashboardAnalytics } from "@/analytics/dashboardAnalytics";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface AudienceMetricsProps {
  analytics: DashboardAnalytics;
  locale: SupportedLocale;
}

export default function AudienceMetrics({
  analytics,
  locale,
}: AudienceMetricsProps) {
  const t = useTranslations("DashboardOverview");

  const metrics = [
    {
      label: t("averageReadTime"),
      value: formatDuration(
        analytics.audience.averageReadTime,
      ),
      icon: Clock3,
    },
    {
      label: t("averageScrollDepth"),
      value: `${analytics.audience.averageScrollDepth}%`,
      icon: MousePointerClick,
    },
    {
      label: t("contactClicks"),
      value: formatCompactNumber(
        analytics.audience.contactClicks,
        locale,
      ),
      icon: Mail,
    },
  ];

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
          {t("audienceQuality")}
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
          {t("visitorInteractionHeading")}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Icon
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <p className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
              {value}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
