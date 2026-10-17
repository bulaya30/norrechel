"use client";

import { Bell, CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface NotificationSummaryProps {
  total: number;
  unread: number;
  locale: SupportedLocale;
}

export default function NotificationSummary({
  total,
  unread,
  locale,
}: NotificationSummaryProps) {
  const t = useTranslations("NotificationSummary");

  return (
    <section
      aria-label={t("ariaLabel")}
      className="
        mb-6 flex flex-col gap-4
        rounded-2xl border
        border-slate-200 bg-white
        px-5 py-4 shadow-sm
        sm:flex-row sm:items-center
        sm:justify-between
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
            flex size-12 shrink-0
            items-center justify-center
            rounded-2xl bg-blue-50
            text-blue-700 ring-1
            ring-blue-100
          "
          aria-hidden="true"
        >
          <Bell className="size-5" />
        </div>

        <div>
          <p className="font-semibold text-slate-900">
            {t("unreadLabel", { count: unread })}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {t("totalLabel", { count: total })}
          </p>
        </div>
      </div>

      {unread === 0 && (
        <div
          className="
            flex items-center gap-2
            text-sm font-semibold
            text-emerald-700
          "
        >
          <CircleCheck className="size-4" aria-hidden="true" />
          {t("allCaughtUp")}
        </div>
      )}
    </section>
  );
}