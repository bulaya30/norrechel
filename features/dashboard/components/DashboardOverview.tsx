"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  Eye,
  FolderKanban,
  Mail,
  MousePointerClick,
  Users,
} from "lucide-react";

import type { Article, Lang } from "@/features/interfaces/article";
import type { Project } from "@/features/interfaces/project";
import type { Subscriber } from "@/features/interfaces/subscriber";

import type { DashboardAnalytics } from "@/analytics/dashboardAnalytics";

import AnalyticsPeriodSelector from "./AnalyticsPeriodSelector";

type SupportedLocale = "en" | "fr";

interface DashboardOverviewProps {
  locale: SupportedLocale;
  articles?: Article[] | null;
  projects?: Project[] | null;
  subscribers?: Subscriber[] | null;
  notifications?: unknown[] | null;
  analytics: DashboardAnalytics;
}

type LocalizedValue =
  | string
  | Lang
  | Record<string, string>
  | null
  | undefined;

function getLocalizedValue(
  value: LocalizedValue,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return (
    value[locale] ??
    value.en ??
    value.fr ??
    Object.values(value)[0] ??
    ""
  );
}

function formatNumber(
  value: number,
  locale: SupportedLocale,
): string {
  return new Intl.NumberFormat(
    locale === "fr" ? "fr-FR" : "en-US",
  ).format(value);
}

function formatCompactNumber(
  value: number,
  locale: SupportedLocale,
): string {
  return new Intl.NumberFormat(
    locale === "fr" ? "fr-FR" : "en-US",
    {
      notation: value >= 1_000 ? "compact" : "standard",
      maximumFractionDigits: 1,
    },
  ).format(value);
}

function formatPercentage(value: number): string {
  return `${value}%`;
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) {
    return "0s";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function getPeriodLabel(
  period: DashboardAnalytics["period"],
  locale: SupportedLocale,
): string {
  if (locale === "fr") {
    switch (period) {
      case "7d":
        return "7 derniers jours";

      case "30d":
        return "30 derniers jours";

      case "90d":
        return "90 derniers jours";

      case "1y":
        return "12 derniers mois";
    }
  }

  switch (period) {
    case "7d":
      return "last 7 days";

    case "30d":
      return "last 30 days";

    case "90d":
      return "last 90 days";

    case "1y":
      return "last 12 months";
  }
}

function getContentTypeLabel(
  contentType: string,
  locale: SupportedLocale,
): string {
  const normalized = contentType.toLowerCase();

  if (
    normalized === "article" ||
    normalized === "articles" ||
    normalized === "blog"
  ) {
    return "Article";
  }

  if (
    normalized === "project" ||
    normalized === "projects"
  ) {
    return locale === "fr" ? "Projet" : "Project";
  }

  return contentType;
}

function TrendIndicator({
  value,
  locale,
}: {
  value: number;
  locale: SupportedLocale;
}) {
  if (value === 0) {
    return (
      <span className="text-xs font-semibold text-slate-400">
        {locale === "fr"
          ? "Aucun changement"
          : "No change"}
      </span>
    );
  }

  const positive = value > 0;

  return (
    <span
      className={[
        "inline-flex items-center gap-1 text-xs font-bold",
        positive
          ? "text-emerald-600"
          : "text-red-600",
      ].join(" ")}
    >
      {positive ? (
        <ArrowUpRight
          className="size-3.5"
          aria-hidden="true"
        />
      ) : (
        <ArrowDownRight
          className="size-3.5"
          aria-hidden="true"
        />
      )}

      {Math.abs(value)}%
    </span>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  locale,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Eye;
  trend?: number;
  locale: SupportedLocale;
}) {
  return (
    <article className="border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42_/_0.035)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">
            {value}
          </p>
        </div>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon
            className="size-5"
            aria-hidden="true"
          />
        </span>
      </div>

      <div className="mt-4 flex min-h-5 items-center justify-between gap-3">
        <p className="text-xs leading-5 text-slate-500">
          {description}
        </p>

        {trend !== undefined && (
          <TrendIndicator
            value={trend}
            locale={locale}
          />
        )}
      </div>
    </article>
  );
}

function AudienceResponseChart({
  data,
  locale,
  period,
}: {
  data: DashboardAnalytics["chart"];
  locale: SupportedLocale;
  period: DashboardAnalytics["period"];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(
    null,
  );

  const width = 900;
  const height = 300;

  const paddingLeft = 42;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 42;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [
      item.views,
      item.engagements,
    ]),
  );

  const pointsFor = (
    key: "views" | "engagements",
  ) =>
    data.map((item, index) => {
      const x =
        data.length <= 1
          ? paddingLeft + chartWidth / 2
          : paddingLeft +
            (index / (data.length - 1)) *
              chartWidth;

      const y =
        paddingTop +
        chartHeight -
        (item[key] / maxValue) *
          chartHeight;

      return {
        x,
        y,
      };
    });

  const viewPoints = pointsFor("views");

  const engagementPoints =
    pointsFor("engagements");

  const toPath = (
    points: { x: number; y: number }[],
  ) =>
    points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
      )
      .join(" ");

  const viewPath = toPath(viewPoints);

  const engagementPath =
    toPath(engagementPoints);

  const gridLines = [
    0,
    0.25,
    0.5,
    0.75,
    1,
  ];

  /*
   * Prevent labels from becoming unreadable
   * when the selected period contains many points.
   */
  const shouldShowLabel = (
    index: number,
  ): boolean => {
    if (period === "7d") {
      return true;
    }

    if (period === "30d") {
      return (
        index % 5 === 0 ||
        index === data.length - 1
      );
    }

    return true;
  };

  const hoveredItem =
    hoveredIndex !== null
      ? data[hoveredIndex]
      : null;

  const hoveredPoint =
    hoveredIndex !== null
      ? viewPoints[hoveredIndex]
      : null;

  const tooltipWidth = 158;
  const tooltipHeight = 88;

  const tooltipX =
    hoveredPoint !== null
      ? Math.min(
          Math.max(
            hoveredPoint.x -
              tooltipWidth / 2,
            paddingLeft,
          ),
          width -
            paddingRight -
            tooltipWidth,
        )
      : 0;

  const tooltipY =
    hoveredPoint !== null
      ? Math.max(
          hoveredPoint.y -
            tooltipHeight -
            14,
          paddingTop,
        )
      : 0;

  return (
    <section className="border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]">
      <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
            {locale === "fr"
              ? "Réponse de l’audience"
              : "Audience response"}
          </p>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
            {locale === "fr"
              ? `Vues et engagements — ${getPeriodLabel(
                  period,
                  locale,
                )}`
              : `Views and engagements — ${getPeriodLabel(
                  period,
                  locale,
                )}`}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {locale === "fr"
              ? "Suivez la façon dont votre audience interagit avec votre contenu."
              : "See how your audience interacts with your content."}
          </p>
        </div>

        <div className="flex items-center gap-5 text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-700" />

            {locale === "fr"
              ? "Vues"
              : "Views"}
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-orange-500" />

            {locale === "fr"
              ? "Engagements"
              : "Engagements"}
          </span>
        </div>
      </header>

      <div className="px-4 pb-5 pt-6 sm:px-6">
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
            {locale === "fr"
              ? "Aucune donnée disponible."
              : "No data available."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="min-w-[680px] w-full"
              role="img"
              aria-label={
                locale === "fr"
                  ? `Graphique des vues et engagements — ${getPeriodLabel(
                      period,
                      locale,
                    )}`
                  : `Views and engagements chart — ${getPeriodLabel(
                      period,
                      locale,
                    )}`
              }
            >
              {/* Grid */}
              {gridLines.map((position) => {
                const y =
                  paddingTop +
                  chartHeight -
                  position * chartHeight;

                return (
                  <line
                    key={position}
                    x1={paddingLeft}
                    x2={width - paddingRight}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Views line */}
              <path
                d={viewPath}
                fill="none"
                stroke="currentColor"
                className="text-blue-700"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Engagement line */}
              <path
                d={engagementPath}
                fill="none"
                stroke="currentColor"
                className="text-orange-500"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover zones */}
              {data.map((item, index) => {
                const x =
                  data.length <= 1
                    ? paddingLeft +
                      chartWidth / 2
                    : paddingLeft +
                      (index /
                        (data.length - 1)) *
                        chartWidth;

                const step =
                  data.length <= 1
                    ? chartWidth
                    : chartWidth /
                      Math.max(
                        data.length - 1,
                        1,
                      );

                const hitWidth =
                  Math.max(step, 40);

                return (
                  <rect
                    key={`hover-${item.name}-${index}`}
                    x={x - hitWidth / 2}
                    y={paddingTop}
                    width={hitWidth}
                    height={chartHeight}
                    fill="transparent"
                    onMouseEnter={() =>
                      setHoveredIndex(index)
                    }
                    onMouseLeave={() =>
                      setHoveredIndex(null)
                    }
                  />
                );
              })}

              {/* Views points */}
              {viewPoints.map(
                (point, index) => (
                  <circle
                    key={`view-${data[index]?.name ?? index}`}
                    cx={point.x}
                    cy={point.y}
                    r={
                      hoveredIndex === index
                        ? 6
                        : 4
                    }
                    className="fill-blue-700 transition-all"
                  />
                ),
              )}

              {/* Engagement points */}
              {engagementPoints.map(
                (point, index) => (
                  <circle
                    key={`engagement-${data[index]?.name ?? index}`}
                    cx={point.x}
                    cy={point.y}
                    r={
                      hoveredIndex === index
                        ? 6
                        : 4
                    }
                    className="fill-orange-500 transition-all"
                  />
                ),
              )}

              {/* X-axis labels */}
              {data.map((item, index) => {
                if (
                  !shouldShowLabel(index)
                ) {
                  return null;
                }

                const x =
                  data.length <= 1
                    ? paddingLeft +
                      chartWidth / 2
                    : paddingLeft +
                      (index /
                        (data.length - 1)) *
                        chartWidth;

                return (
                  <text
                    key={item.name}
                    x={x}
                    y={height - 14}
                    textAnchor="middle"
                    className="fill-slate-400 text-[11px] font-medium"
                  >
                    {item.name}
                  </text>
                );
              })}

              {/* Active hover guide + tooltip */}
              {hoveredIndex !== null &&
                hoveredItem &&
                hoveredPoint && (
                  <g
                    pointerEvents="none"
                    role="presentation"
                  >
                    {/* Vertical guide */}
                    <line
                      x1={hoveredPoint.x}
                      x2={hoveredPoint.x}
                      y1={paddingTop}
                      y2={height - paddingBottom}
                      stroke="currentColor"
                      className="text-slate-200"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />

                    {/* Tooltip shadow/background */}
                    <rect
                      x={tooltipX}
                      y={tooltipY}
                      width={tooltipWidth}
                      height={tooltipHeight}
                      rx="10"
                      className="fill-white"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeOpacity="0.08"
                    />

                    {/* Date */}
                    <text
                      x={tooltipX + 12}
                      y={tooltipY + 19}
                      className="fill-slate-900 text-[11px] font-bold"
                    >
                      {hoveredItem.name}
                    </text>

                    {/* Views indicator */}
                    <circle
                      cx={tooltipX + 14}
                      cy={tooltipY + 38}
                      r="3"
                      className="fill-blue-700"
                    />

                    <text
                      x={tooltipX + 23}
                      y={tooltipY + 42}
                      className="fill-slate-500 text-[10px]"
                    >
                      {locale === "fr"
                        ? "Vues"
                        : "Views"}
                    </text>

                    <text
                      x={
                        tooltipX +
                        tooltipWidth -
                        12
                      }
                      y={tooltipY + 42}
                      textAnchor="end"
                      className="fill-slate-900 text-[10px] font-bold"
                    >
                      {formatNumber(
                        hoveredItem.views,
                        locale,
                      )}
                    </text>

                    {/* Engagement indicator */}
                    <circle
                      cx={tooltipX + 14}
                      cy={tooltipY + 60}
                      r="3"
                      className="fill-orange-500"
                    />

                    <text
                      x={tooltipX + 23}
                      y={tooltipY + 64}
                      className="fill-slate-500 text-[10px]"
                    >
                      {locale === "fr"
                        ? "Engagements"
                        : "Engagements"}
                    </text>

                    <text
                      x={
                        tooltipX +
                        tooltipWidth -
                        12
                      }
                      y={tooltipY + 64}
                      textAnchor="end"
                      className="fill-slate-900 text-[10px] font-bold"
                    >
                      {formatNumber(
                        hoveredItem.engagements,
                        locale,
                      )}
                    </text>
                  </g>
                )}
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}

function AudienceMetrics({
  analytics,
  locale,
}: {
  analytics: DashboardAnalytics;
  locale: SupportedLocale;
}) {
  const metrics = [
    {
      label:
        locale === "fr"
          ? "Temps de lecture moyen"
          : "Average read time",
      value: formatDuration(
        analytics.audience.averageReadTime,
      ),
      icon: Clock3,
    },
    {
      label:
        locale === "fr"
          ? "Profondeur de défilement"
          : "Average scroll depth",
      value: `${analytics.audience.averageScrollDepth}%`,
      icon: MousePointerClick,
    },
    {
      label:
        locale === "fr"
          ? "Clics de contact"
          : "Contact clicks",
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
          {locale === "fr"
            ? "Qualité de l’audience"
            : "Audience quality"}
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
          {locale === "fr"
            ? "Comment les visiteurs interagissent"
            : "How visitors interact"}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (
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
          ),
        )}
      </div>
    </section>
  );
}

function TopContentPerformance({
  analytics,
  articles,
  projects,
  locale,
}: {
  analytics: DashboardAnalytics;
  articles: Article[];
  projects: Project[];
  locale: SupportedLocale;
}) {
  const articleMap = new Map(
    articles
      .filter((article) => article.id)
      .map((article) => [
        article.id!,
        article,
      ]),
  );

  const projectMap = new Map(
    projects
      .filter((project) => project.id)
      .map((project) => [
        project.id!,
        project,
      ]),
  );

  const topContent =
    analytics.topContent.slice(0, 8);

  return (
    <section className="border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]">
      <header className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
          {locale === "fr"
            ? "Performance du contenu"
            : "Content performance"}
        </p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950">
              {locale === "fr"
                ? "Contenu qui attire l’attention"
                : "Content attracting attention"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {locale === "fr"
                ? "Vues et interactions par contenu."
                : "Views and interactions by content."}
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            {locale === "fr"
              ? "Classé par vues"
              : "Ranked by views"}
          </span>
        </div>
      </header>

      {topContent.length === 0 ? (
        <div className="px-6 py-14 text-center text-sm text-slate-500">
          {locale === "fr"
            ? "Aucune performance de contenu disponible."
            : "No content performance data available."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6">
                  {locale === "fr"
                    ? "Contenu"
                    : "Content"}
                </th>

                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {locale === "fr"
                    ? "Vues"
                    : "Views"}
                </th>

                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {locale === "fr"
                    ? "Engagements"
                    : "Engagements"}
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6">
                  {locale === "fr"
                    ? "Taux"
                    : "Rate"}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {topContent.map(
                (content, index) => {
                  const article =
                    content.contentType
                      .toLowerCase()
                      .includes("article")
                      ? articleMap.get(
                          content.contentId,
                        )
                      : undefined;

                  const project =
                    content.contentType
                      .toLowerCase()
                      .includes("project")
                      ? projectMap.get(
                          content.contentId,
                        )
                      : undefined;

                  const title = article
                    ? getLocalizedValue(
                        article.title,
                        locale,
                      )
                    : project
                      ? getLocalizedValue(
                          project.title,
                          locale,
                        )
                      : content.slug;

                  const href = article
                    ? `/${locale}/blogs/${getLocalizedValue(
                        article.slug,
                        locale,
                      )}`
                    : project
                      ? `/${locale}/projects/${getLocalizedValue(
                          project.slug,
                          locale,
                        )}`
                      : undefined;

                  return (
                    <tr
                      key={`${content.contentId}-${content.contentType}`}
                      className="group"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500">
                            {String(
                              index + 1,
                            ).padStart(2, "0")}
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
                                {title ||
                                  content.slug ||
                                  "Untitled"}
                              </p>
                            )}

                            <p className="mt-0.5 text-xs text-slate-400">
                              {getContentTypeLabel(
                                content.contentType,
                                locale,
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                        {formatCompactNumber(
                          content.views,
                          locale,
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                        {formatCompactNumber(
                          content.engagements,
                          locale,
                        )}
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-bold text-orange-600 sm:px-6">
                        {formatPercentage(
                          content.engagementRate,
                        )}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function RecentContent({
  articles,
  projects,
  locale,
}: {
  articles: Article[];
  projects: Project[];
  locale: SupportedLocale;
}) {
  const recentArticles =
    articles.slice(0, 4);

  const recentProjects =
    projects.slice(0, 4);

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
          {locale === "fr"
            ? "Bibliothèque"
            : "Library"}
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
          {locale === "fr"
            ? "Contenu récent"
            : "Recent content"}
        </h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]">
          <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
            <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <BookOpen
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <h3 className="text-sm font-bold text-slate-950">
                Articles
              </h3>

              <p className="text-xs text-slate-500">
                {recentArticles.length}{" "}
                {locale === "fr"
                  ? "récents"
                  : "recent"}
              </p>
            </div>
          </header>

          {recentArticles.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              {locale === "fr"
                ? "Aucun article publié."
                : "No published articles."}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentArticles.map(
                (article, index) => {
                  const title =
                    getLocalizedValue(
                      article.title,
                      locale,
                    ) ||
                    (locale === "fr"
                      ? "Article sans titre"
                      : "Untitled article");

                  const slug =
                    getLocalizedValue(
                      article.slug,
                      locale,
                    ) || article.id;

                  return (
                    <li
                      key={
                        article.id ?? index
                      }
                    >
                      <Link
                        href={`/${locale}/blogs/${slug}`}
                        className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                      >
                        <span className="text-xs font-bold text-slate-300">
                          {String(
                            index + 1,
                          ).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-700">
                          {title}
                        </span>

                        <ArrowUpRight
                          className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-orange-500"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          )}
        </article>

        <article className="border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]">
          <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
            <span className="flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <FolderKanban
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <h3 className="text-sm font-bold text-slate-950">
                {locale === "fr"
                  ? "Projets"
                  : "Projects"}
              </h3>

              <p className="text-xs text-slate-500">
                {recentProjects.length}{" "}
                {locale === "fr"
                  ? "récents"
                  : "recent"}
              </p>
            </div>
          </header>

          {recentProjects.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              {locale === "fr"
                ? "Aucun projet publié."
                : "No published projects."}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentProjects.map(
                (project, index) => {
                  const title =
                    getLocalizedValue(
                      project.title,
                      locale,
                    ) ||
                    (locale === "fr"
                      ? "Projet sans titre"
                      : "Untitled project");

                  const slug =
                    getLocalizedValue(
                      project.slug,
                      locale,
                    ) || project.id;

                  return (
                    <li
                      key={
                        project.id ?? index
                      }
                    >
                      <Link
                        href={`/${locale}/projects/${slug}`}
                        className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                      >
                        <span className="text-xs font-bold text-slate-300">
                          {String(
                            index + 1,
                          ).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-700">
                          {title}
                        </span>

                        <ArrowUpRight
                          className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-orange-500"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}

export default function DashboardOverview({
  locale,
  articles,
  projects,
  subscribers,
  analytics,
}: DashboardOverviewProps) {
  const safeArticles = Array.isArray(
    articles,
  )
    ? articles.filter(Boolean)
    : [];

  const safeProjects = Array.isArray(
    projects,
  )
    ? projects.filter(Boolean)
    : [];

  const safeSubscribers = Array.isArray(
    subscribers,
  )
    ? subscribers.filter(Boolean)
    : [];

  const viewsTrend =
    analytics.trends.views.change;

  const engagementTrend =
    analytics.trends.engagements.change;

  const periodLabel = getPeriodLabel(
    analytics.period,
    locale,
  );

  return (
    <div className="space-y-10">
      {/* PERFORMANCE OVERVIEW */}

      <section aria-labelledby="dashboard-performance-heading">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
            Performance
          </p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="dashboard-performance-heading"
                className="text-xl font-bold tracking-tight text-slate-950"
              >
                {locale === "fr"
                  ? "Vue d’ensemble de l’audience"
                  : "Audience overview"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {locale === "fr"
                  ? `Performances enregistrées sur ${periodLabel.toLowerCase()}.`
                  : `Performance recorded over ${periodLabel}.`}
              </p>
            </div>

            <AnalyticsPeriodSelector
              locale={locale}
              period={analytics.period}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={
              locale === "fr"
                ? "Vues"
                : "Views"
            }
            value={formatCompactNumber(
              analytics.overview.views,
              locale,
            )}
            description={
              locale === "fr"
                ? "Vues de contenu"
                : "Content views"
            }
            icon={Eye}
            trend={viewsTrend}
            locale={locale}
          />

          <MetricCard
            label={
              locale === "fr"
                ? "Engagements"
                : "Engagements"
            }
            value={formatCompactNumber(
              analytics.overview.engagements,
              locale,
            )}
            description={
              locale === "fr"
                ? "Interactions enregistrées"
                : "Recorded interactions"
            }
            icon={MousePointerClick}
            trend={engagementTrend}
            locale={locale}
          />

          <MetricCard
            label={
              locale === "fr"
                ? "Visiteurs uniques"
                : "Unique visitors"
            }
            value={formatCompactNumber(
              analytics.overview.uniqueVisitors,
              locale,
            )}
            description={
              locale === "fr"
                ? "Visiteurs ayant consulté le contenu"
                : "Visitors who viewed content"
            }
            icon={Users}
            locale={locale}
          />

          <MetricCard
            label={
              locale === "fr"
                ? "Taux d’engagement"
                : "Engagement rate"
            }
            value={formatPercentage(
              analytics.overview
                .engagementRate,
            )}
            description={
              locale === "fr"
                ? "Engagements par rapport aux vues"
                : "Engagements relative to views"
            }
            icon={MousePointerClick}
            locale={locale}
          />
        </div>
      </section>

      {/* AUDIENCE RESPONSE */}

      <AudienceResponseChart
        data={analytics.chart}
        locale={locale}
        period={analytics.period}
      />

      {/* AUDIENCE QUALITY */}

      <AudienceMetrics
        analytics={analytics}
        locale={locale}
      />

      {/* TOP CONTENT */}

      <TopContentPerformance
        analytics={analytics}
        articles={safeArticles}
        projects={safeProjects}
        locale={locale}
      />

      {/* CONTENT LIBRARY */}

      <RecentContent
        articles={safeArticles}
        projects={safeProjects}
        locale={locale}
      />

      {/* CONTENT INVENTORY */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="border border-slate-200 bg-slate-50/60 p-5">
          <div className="flex items-center gap-3">
            <BookOpen
              className="size-5 text-blue-700"
              aria-hidden="true"
            />

            <div>
              <p className="text-2xl font-bold text-slate-950">
                {formatNumber(
                  safeArticles.length,
                  locale,
                )}
              </p>

              <p className="text-sm text-slate-500">
                {locale === "fr"
                  ? "Articles publiés"
                  : "Published articles"}
              </p>
            </div>
          </div>
        </article>

        <article className="border border-slate-200 bg-slate-50/60 p-5">
          <div className="flex items-center gap-3">
            <FolderKanban
              className="size-5 text-orange-600"
              aria-hidden="true"
            />

            <div>
              <p className="text-2xl font-bold text-slate-950">
                {formatNumber(
                  safeProjects.length,
                  locale,
                )}
              </p>

              <p className="text-sm text-slate-500">
                {locale === "fr"
                  ? "Projets publiés"
                  : "Published projects"}
              </p>
            </div>
          </div>
        </article>

        <article className="border border-slate-200 bg-slate-50/60 p-5">
          <div className="flex items-center gap-3">
            <Users
              className="size-5 text-slate-700"
              aria-hidden="true"
            />

            <div>
              <p className="text-2xl font-bold text-slate-950">
                {formatNumber(
                  safeSubscribers.length,
                  locale,
                )}
              </p>

              <p className="text-sm text-slate-500">
                {locale === "fr"
                  ? "Abonnés"
                  : "Subscribers"}
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
