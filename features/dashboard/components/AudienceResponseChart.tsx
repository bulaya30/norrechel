
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import type { SupportedLocale } from "@/lib/dates/localizedValue";
import { formatNumber } from "@/lib/dates/formatters";
import type { DashboardAnalytics } from "@/analytics/dashboardAnalytics";

interface AudienceResponseChartProps {
  locale: SupportedLocale;
  data: DashboardAnalytics["chart"];
  period: DashboardAnalytics["period"];
}

type PeriodTranslationKey =
  | "period7d"
  | "period30d"
  | "period90d"
  | "period1y";

function getPeriodTranslationKey(
  period: DashboardAnalytics["period"],
): PeriodTranslationKey {
  switch (period) {
    case "7d":
      return "period7d";
    case "30d":
      return "period30d";
    case "90d":
      return "period90d";
    case "1y":
      return "period1y";
  }
}

export default function AudienceResponseChart({
  locale,
  data,
  period,
}: AudienceResponseChartProps) {
  const t = useTranslations("DashboardOverview");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const periodLabel = t(getPeriodTranslationKey(period));

  const width = 900;
  const height = 300;

  const paddingLeft = 42;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 42;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.views, item.engagements]),
  );

  const pointsFor = (key: "views" | "engagements") =>
    data.map((item, index) => {
      const x =
        data.length <= 1
          ? paddingLeft + chartWidth / 2
          : paddingLeft + (index / (data.length - 1)) * chartWidth;

      const y =
        paddingTop +
        chartHeight -
        (item[key] / maxValue) * chartHeight;

      return { x, y };
    });

  const viewPoints = pointsFor("views");
  const engagementPoints = pointsFor("engagements");

  const toPath = (points: { x: number; y: number }[]) =>
    points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
      )
      .join(" ");

  const viewPath = toPath(viewPoints);
  const engagementPath = toPath(engagementPoints);

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  /*
   * Prevent labels from becoming unreadable
   * when the selected period contains many points.
   */
  const shouldShowLabel = (index: number): boolean => {
    if (period === "7d") {
      return true;
    }

    if (period === "30d") {
      return index % 5 === 0 || index === data.length - 1;
    }

    return true;
  };

  const hoveredItem =
    hoveredIndex !== null ? data[hoveredIndex] : null;

  const hoveredPoint =
    hoveredIndex !== null ? viewPoints[hoveredIndex] : null;

  const tooltipWidth = 158;
  const tooltipHeight = 88;

  const tooltipX =
    hoveredPoint !== null
      ? Math.min(
          Math.max(
            hoveredPoint.x - tooltipWidth / 2,
            paddingLeft,
          ),
          width - paddingRight - tooltipWidth,
        )
      : 0;

  const tooltipY =
    hoveredPoint !== null
      ? Math.max(
          hoveredPoint.y - tooltipHeight - 14,
          paddingTop,
        )
      : 0;

  return (
    <section className="border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]">
      <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
            {t("audienceResponse")}
          </p>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
            {t("viewsAndEngagements", {
              period: periodLabel,
            })}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("audienceInteractionDescription")}
          </p>
        </div>

        <div className="flex items-center gap-5 text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-700" />
            {t("views")}
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-orange-500" />
            {t("engagements")}
          </span>
        </div>
      </header>

      <div className="px-4 pb-5 pt-6 sm:px-6">
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
            {t("noData")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="min-w-[680px] w-full"
              role="img"
              aria-label={t("chartLabel", {
                period: periodLabel,
              })}
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
                    ? paddingLeft + chartWidth / 2
                    : paddingLeft +
                      (index / (data.length - 1)) * chartWidth;

                const step =
                  data.length <= 1
                    ? chartWidth
                    : chartWidth / Math.max(data.length - 1, 1);

                const hitWidth = Math.max(step, 40);

                return (
                  <rect
                    key={`hover-${item.name}-${index}`}
                    x={x - hitWidth / 2}
                    y={paddingTop}
                    width={hitWidth}
                    height={chartHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}

              {/* Views points */}
              {viewPoints.map((point, index) => (
                <circle
                  key={`view-${data[index]?.name ?? index}`}
                  cx={point.x}
                  cy={point.y}
                  r={hoveredIndex === index ? 6 : 4}
                  className="fill-blue-700 transition-all"
                />
              ))}

              {/* Engagement points */}
              {engagementPoints.map((point, index) => (
                <circle
                  key={`engagement-${data[index]?.name ?? index}`}
                  cx={point.x}
                  cy={point.y}
                  r={hoveredIndex === index ? 6 : 4}
                  className="fill-orange-500 transition-all"
                />
              ))}

              {/* X-axis labels */}
              {data.map((item, index) => {
                if (!shouldShowLabel(index)) {
                  return null;
                }

                const x =
                  data.length <= 1
                    ? paddingLeft + chartWidth / 2
                    : paddingLeft +
                      (index / (data.length - 1)) * chartWidth;

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

              {/* Active hover guide and tooltip */}
              {hoveredIndex !== null &&
                hoveredItem &&
                hoveredPoint && (
                  <g pointerEvents="none" role="presentation">
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

                    {/* Tooltip background */}
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
                      {t("views")}
                    </text>

                    <text
                      x={tooltipX + tooltipWidth - 12}
                      y={tooltipY + 42}
                      textAnchor="end"
                      className="fill-slate-900 text-[10px] font-bold"
                    >
                      {formatNumber(hoveredItem.views, locale)}
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
                      {t("engagements")}
                    </text>

                    <text
                      x={tooltipX + tooltipWidth - 12}
                      y={tooltipY + 64}
                      textAnchor="end"
                      className="fill-slate-900 text-[10px] font-bold"
                    >
                      {formatNumber(hoveredItem.engagements, locale)}
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
