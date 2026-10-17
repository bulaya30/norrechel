"use client";

import { useTranslations } from "next-intl";
import {
  CalendarDays,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import StatusBadge from "@/components/StatusBadge";
import { readableDate } from "@/lib/dates/utils";

import type { User } from "@/features/interfaces/user";

interface ProfileAccountCardProps {
  user: User;
}

export default function ProfileAccountCard({
  user,
}: ProfileAccountCardProps) {
  const t = useTranslations("ProfileAccountCard");

  const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const isActive = user.active !== false;

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {t("title")}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Role */}
        <div className="flex items-center justify-between gap-4 rounded-xl border bg-background/50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <UserCheck className="h-4 w-4" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("role")}
              </p>

              <p className="mt-1 text-sm font-semibold">{role}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between gap-4 rounded-xl border bg-background/50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("status")}
              </p>

              <div className="mt-1">
                <StatusBadge status={isActive ? "active" : "inactive"} />
              </div>
            </div>
          </div>
        </div>

        {/* Created */}
        <div className="flex items-center justify-between gap-4 rounded-xl border bg-background/50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("created")}
              </p>

              <p className="mt-1 text-sm font-semibold">
                {readableDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between gap-4 rounded-xl border bg-background/50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("lastUpdated")}
              </p>

              <p className="mt-1 text-sm font-semibold">
                {readableDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}