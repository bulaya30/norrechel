"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

type SubscriberFilter = "all" | "active" | "unsubscribed";

interface SubscriberFiltersProps {
  searchQuery: string;
  statusFilter: SubscriberFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: SubscriberFilter) => void;
}

export default function SubscriberFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: SubscriberFiltersProps) {
  const t = useTranslations("Subscriber.SubscriberFilters");

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchLabel")}
          className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(event.target.value as SubscriberFilter)
        }
        aria-label={t("statusLabel")}
        className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      >
        <option value="all">{t("all")}</option>
        <option value="active">{t("active")}</option>
        <option value="unsubscribed">{t("unsubscribed")}</option>
      </select>
    </div>
  );
}