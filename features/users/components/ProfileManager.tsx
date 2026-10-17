"use client";

import { useTranslations } from "next-intl";

import ProfileHero from "@/features/users/components/ProfileHero";
import ProfileOverview from "@/features/users/components/ProfileOverview";

import type { User } from "@/features/interfaces/user";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface ProfileManagerProps {
  user: User;
  locale: SupportedLocale;
}

export default function ProfileManager({
  user,
  locale,
}: ProfileManagerProps) {
  const t = useTranslations("ProfileManager");

  return (
    <section
      aria-labelledby="profile-page-heading"
      className="w-full"
    >
      {/* Page heading */}
      <div className="mb-6">
        <h1
          id="profile-page-heading"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {t("title")}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      {/* Profile hero */}
      <ProfileHero user={user} locale={locale} />

      {/* Profile overview */}
      <div className="mt-6">
        <ProfileOverview user={user} />
      </div>
    </section>
  );
}