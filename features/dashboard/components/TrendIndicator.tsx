
"use client";

import { SupportedLocale } from "@/lib/dates/localizedValue";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface TrendIndicatorProps {
  value: number;
  locale: SupportedLocale
}

export default function TrendIndicator({
  value,
  locale,
}: TrendIndicatorProps) {
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