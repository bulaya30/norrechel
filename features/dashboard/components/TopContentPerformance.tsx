
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import type { DashboardAnalytics } from "@/analytics/dashboardAnalytics";
import { getLocalizedValue } from "@/lib/dates/localizedValue";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

import type { Article } from "@/features/interfaces/article";
import type { Project } from "@/features/interfaces/project";

import {
  formatCompactNumber,
  formatPercentage,
} from "@/lib/dates/formatters";

import type {
  TopContentPerformance as TopContentPerformanceItem,
} from "@/analytics/builders/topContentPerformance";

interface TopContentPerformanceProps {
  analytics: DashboardAnalytics;
  articles: Article[];
  projects: Project[];
  locale: SupportedLocale;
}

function getContentTypeLabel(
  contentType: string,
  t: ReturnType<typeof useTranslations<"DashboardOverview">>,
): string {
  const normalized = contentType.toLowerCase();

  if (
    normalized === "article" ||
    normalized === "articles" ||
    normalized === "blog"
  ) {
    return t("article");
  }

  if (
    normalized === "project" ||
    normalized === "projects"
  ) {
    return t("project");
  }

  return contentType;
}

export default function TopContentPerformance({
  analytics,
  articles,
  projects,
  locale,
}: TopContentPerformanceProps) {
  const t = useTranslations("DashboardOverview");

  const articleMap = new Map(
    articles
      .filter((article) => article.id)
      .map((article) => [article.id!, article]),
  );

  const projectMap = new Map(
    projects
      .filter((project) => project.id)
      .map((project) => [project.id!, project]),
  );

  const topContent: TopContentPerformanceItem[] =
    analytics.topContent.slice(0, 8);

  return (
    <section className="border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]">
      <header className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
          {t("contentPerformance")}
        </p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950">
              {t("topContentHeading")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("contentPerformanceDescription")}
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            {t("rankedByViews")}
          </span>
        </div>
      </header>

      {topContent.length === 0 ? (
        <div className="px-6 py-14 text-center text-sm text-slate-500">
          {t("noContentPerformance")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6">
                  {t("content")}
                </th>

                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {t("views")}
                </th>

                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {t("engagements")}
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6">
                  {t("rate")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {topContent.map((content, index) => {
                const normalizedType =
                  content.contentType.toLowerCase();

                const article =
                  normalizedType.includes("article") ||
                  normalizedType === "blog"
                    ? articleMap.get(content.contentId)
                    : undefined;

                const project = normalizedType.includes("project")
                  ? projectMap.get(content.contentId)
                  : undefined;

                const title = article
                  ? getLocalizedValue(article.title, locale)
                  : project
                    ? getLocalizedValue(project.title, locale)
                    : content.slug;

                const href = article
                  ? `/blogs/${getLocalizedValue(article.slug, locale)}`
                  : project
                    ? `/projects/${getLocalizedValue(project.slug, locale)}`
                    : undefined;

                return (
                  <tr
                    key={`${content.contentId}-${content.contentType}`}
                    className="group"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">
                          {href && title ? (
                            <Link
                              href={href}
                              className="block truncate text-sm font-semibold text-slate-900 transition-colors hover:text-blue-700"
                            >
                              {title}
                            </Link>
                          ) : (
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {title || content.slug || t("untitled")}
                            </p>
                          )}

                          <p className="mt-0.5 text-xs text-slate-400">
                            {getContentTypeLabel(content.contentType, t)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatCompactNumber(content.views, locale)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatCompactNumber(content.engagements, locale)}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-bold text-orange-600 sm:px-6">
                      {formatPercentage(content.engagementRate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
