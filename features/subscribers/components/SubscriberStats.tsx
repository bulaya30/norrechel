"use client";

import { useTranslations } from "next-intl";
import { Users, UserCheck, UserX } from "lucide-react";
import type { ReactNode } from "react";

interface SubscriberStatsProps {
  total: number;
  active: number;
  unsubscribed: number;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SubscriberStats({
  total,
  active,
  unsubscribed,
}: SubscriberStatsProps) {
  const t = useTranslations("SubscriberPage.SubscriberStats");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label={t("totalSubscribers")}
        value={total}
        icon={<Users className="h-5 w-5" />}
      />

      <StatCard
        label={t("active")}
        value={active}
        icon={<UserCheck className="h-5 w-5" />}
      />

      <StatCard
        label={t("unsubscribed")}
        value={unsubscribed}
        icon={<UserX className="h-5 w-5" />}
      />
    </div>
  );
}