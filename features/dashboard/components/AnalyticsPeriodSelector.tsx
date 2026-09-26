import Link from "next/link";

import type { AnalyticsPeriod } from "@/analytics/types";

type SupportedLocale = "en" | "fr";

interface AnalyticsPeriodSelectorProps {
  locale: SupportedLocale;
  period: AnalyticsPeriod;
}

const periods: {
  value: AnalyticsPeriod;
  label: string;
}[] = [
  {
    value: "7d",
    label: "7D",
  },
  {
    value: "30d",
    label: "30D",
  },
  {
    value: "90d",
    label: "90D",
  },
  {
    value: "1y",
    label: "1Y",
  },
];

export default function AnalyticsPeriodSelector({
  locale,
  period,
}: AnalyticsPeriodSelectorProps) {
  return (
    <nav
      aria-label="Analytics period"
      className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1"
    >
      {periods.map((option) => {
        const isActive =
          option.value === period;

        return (
          <Link
            key={option.value}
            href={`/${locale}/dashboard?period=${option.value}`}
            aria-current={
              isActive ? "page" : undefined
            }
            className={[
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              isActive
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-900",
            ].join(" ")}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}