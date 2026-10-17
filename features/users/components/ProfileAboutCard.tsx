"use client";

import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";

import type { User } from "@/features/interfaces/user";

interface ProfileAboutCardProps {
  user: User;
}

export default function ProfileAboutCard({
  user,
}: ProfileAboutCardProps) {
  const t = useTranslations("ProfileAboutCard");

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UserRound className="h-5 w-5" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {t("title")}
          </h2>

          <p className="mt-1 text-sm italic text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {user.about ? (
          <p className="max-w-3xl text-sm leading-7 text-black/70">
            {user.about}
          </p>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("emptyDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}