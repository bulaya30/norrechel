
"use client";

import { useTranslations } from "next-intl";
import {
  BookOpen,
  FolderKanban,
  Users,
} from "lucide-react";

import type { Article } from "@/features/interfaces/article";
import type { Project } from "@/features/interfaces/project";
import type { Subscriber } from "@/features/interfaces/subscriber";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

import { formatNumber } from "@/lib/dates/formatters";

interface ContentInventoryProps {
  locale: SupportedLocale;
  articles: Article[];
  projects: Project[];
  subscribers: Subscriber[];
}

export default function ContentInventory({
  locale,
  articles,
  projects,
  subscribers,
}: ContentInventoryProps) {
  const t = useTranslations("DashboardOverview");

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article className="border border-slate-200 bg-slate-50/60 p-5">
        <div className="flex items-center gap-3">
          <BookOpen
            className="size-5 text-blue-700"
            aria-hidden="true"
          />

          <div>
            <p className="text-2xl font-bold text-slate-950">
              {formatNumber(articles.length, locale)}
            </p>

            <p className="text-sm text-slate-500">
              {t("publishedArticles")}
            </p>
          </div>
        </div>
      </article>

      <article className="border border-slate-200 bg-slate-50/60 p-5">
        <div className="flex items-center gap-3">
          <FolderKanban
            className="size-5 text-orange-600"
            aria-hidden="true"
          />

          <div>
            <p className="text-2xl font-bold text-slate-950">
              {formatNumber(projects.length, locale)}
            </p>

            <p className="text-sm text-slate-500">
              {t("publishedProjects")}
            </p>
          </div>
        </div>
      </article>

      <article className="border border-slate-200 bg-slate-50/60 p-5">
        <div className="flex items-center gap-3">
          <Users
            className="size-5 text-slate-700"
            aria-hidden="true"
          />

          <div>
            <p className="text-2xl font-bold text-slate-950">
              {formatNumber(subscribers.length, locale)}
            </p>

            <p className="text-sm text-slate-500">
              {t("subscribers")}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
