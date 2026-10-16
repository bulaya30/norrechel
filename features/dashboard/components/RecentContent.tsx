
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import {
  ArrowUpRight,
  BookOpen,
  FolderKanban,
} from "lucide-react";

import type { Article } from "@/features/interfaces/article";
import type { Project } from "@/features/interfaces/project";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

import { getLocalizedValue } from "@/lib/dates/localizedValue";

interface RecentContentProps {
  articles: Article[];
  projects: Project[];
  locale: SupportedLocale;
}

export default function RecentContent({
  articles,
  projects,
  locale,
}: RecentContentProps) {
  const t = useTranslations("DashboardOverview");

  const recentArticles = articles.slice(0, 4);
  const recentProjects = projects.slice(0, 4);

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
          {t("library")}
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">
          {t("recentContent")}
        </h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Articles */}
        <article className="border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]">
          <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
            <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <BookOpen
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <h3 className="text-sm font-bold text-slate-950">
                {t("articles")}
              </h3>

              <p className="text-xs text-slate-500">
                {recentArticles.length} {t("recent")}
              </p>
            </div>
          </header>

          {recentArticles.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              {t("noPublishedArticles")}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentArticles.map((article, index) => {
                const title =
                  getLocalizedValue(article.title, locale) ||
                  t("untitledArticle");

                const slug =
                  getLocalizedValue(article.slug, locale) ||
                  article.id;

                return (
                  <li key={article.id ?? index}>
                    <Link
                      href={`/blogs/${slug}`}
                      className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                    >
                      <span className="text-xs font-bold text-slate-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-700">
                        {title}
                      </span>

                      <ArrowUpRight
                        className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-orange-500"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        {/* Projects */}
        <article className="border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42_/_0.035)]">
          <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
            <span className="flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <FolderKanban
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <h3 className="text-sm font-bold text-slate-950">
                {t("projects")}
              </h3>

              <p className="text-xs text-slate-500">
                {recentProjects.length} {t("recent")}
              </p>
            </div>
          </header>

          {recentProjects.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              {t("noPublishedProjects")}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentProjects.map((project, index) => {
                const title =
                  getLocalizedValue(project.title, locale) ||
                  t("untitledProject");

                const slug =
                  getLocalizedValue(project.slug, locale) ||
                  project.id;

                return (
                  <li key={project.id ?? index}>
                    <Link
                      href={`/projects/${slug}`}
                      className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                    >
                      <span className="text-xs font-bold text-slate-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-700">
                        {title}
                      </span>

                      <ArrowUpRight
                        className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-orange-500"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
