"use client";

import { useTranslations } from "next-intl";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  UserRound,
} from "lucide-react";

import type { ComponentType } from "react";
import type { User } from "@/features/interfaces/user";

interface ProfileProfessionalCardProps {
  user: User;
}

interface ProfessionalItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}

function ProfessionalItem({
  icon: Icon,
  label,
  value,
}: ProfessionalItemProps) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border bg-background/50 p-4 transition-colors hover:bg-muted/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function ProfileProfessionalCard({
  user,
}: ProfileProfessionalCardProps) {
  const t = useTranslations("ProfileProfessionalCard");

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ProfessionalItem
          icon={UserRound}
          label={t("fullName")}
          value={fullName}
        />

        <ProfessionalItem
          icon={BriefcaseBusiness}
          label={t("jobTitle")}
          value={user.title}
        />

        <ProfessionalItem
          icon={Building2}
          label={t("company")}
          value={user.company}
        />

        <ProfessionalItem
          icon={MapPin}
          label={t("address")}
          value={user.address}
        />
      </div>
    </section>
  );
}