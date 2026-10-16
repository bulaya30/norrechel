
"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  type LucideIcon,
} from "lucide-react";

import TrendIndicator from "./TrendIndicator";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

import { formatPercentage } from "@/lib/dates/formatters";

interface MetricCardProps {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  trend?: number;
  locale: SupportedLocale;
}

export default function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  locale,
}: MetricCardProps) {
  return (
    <article className="border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42_/_0.035)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">
            {formatPercentage(value)}
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
