import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
}

export default function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: DashboardStatCardProps) {
  const isPositiveTrend =
    trend !== undefined && trend.value >= 0;

  return (
    <article
      className={cn(
        `
          group rounded-2xl border border-slate-200
          bg-white p-5 shadow-sm
          transition-all duration-300
          hover:-translate-y-0.5
          hover:border-blue-200
          hover:shadow-lg
        `,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className="
            flex size-12 shrink-0 items-center
            justify-center rounded-2xl
            bg-blue-50 text-blue-700
            ring-1 ring-blue-100
            transition-colors duration-300
            group-hover:bg-blue-100
          "
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </div>
      </div>

      {(description || trend) && (
        <footer className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          {trend && (
            <span
              className={cn(
                "text-sm font-semibold",
                isPositiveTrend
                  ? "text-emerald-700"
                  : "text-red-600",
              )}
            >
              {isPositiveTrend ? "+" : ""}
              {trend.value}%
            </span>
          )}

          {(trend?.label || description) && (
            <p className="text-sm text-slate-500">
              {trend?.label ?? description}
            </p>
          )}
        </footer>
      )}
    </article>
  );
}