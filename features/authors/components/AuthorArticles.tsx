import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";

import type { Article } from "@/features/interfaces/article";
import { readableDate } from "@/lib/dates/utils";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface AuthorArticlesProps {
  articles: Article[];
  locale: SupportedLocale;
  views: Record<string, number>;
}

export default async function AuthorArticles({
  articles,
  locale,
  views,
}: AuthorArticlesProps) {
  const t = await getTranslations({
    locale,
    namespace: "AuthorArticles",
  });

  const safeArticles = Array.isArray(articles)
    ? articles.filter(Boolean)
    : [];

  if (safeArticles.length === 0) {
    return (
      <section
        aria-labelledby="author-articles-heading"
        className="
          rounded-2xl border border-dashed
          border-slate-300 bg-slate-50
          px-6 py-12 text-center
        "
      >
        <h3
          id="author-articles-heading"
          className="text-xl font-bold text-slate-900"
        >
          {t("emptyTitle")}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t("emptyDescription")}
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="author-articles-heading">
      <header className="mb-6">
        <h3
          id="author-articles-heading"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          {t("heading")}
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          {t("articleCount", { count: safeArticles.length })}
        </p>
      </header>

      <div className="grid gap-5">
        {safeArticles.map((article, index) => {
          const title =
            article.title?.[locale] ??
            article.title?.en ??
            article.title?.fr ??
            t("untitled");

          const slug =
            article.slug?.[locale] ??
            article.slug?.en ??
            article.slug?.fr ??
            article.id;

          const content =
            article.content?.[locale] ??
            article.content?.en ??
            article.content?.fr ??
            "";

          const plainText = content
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();

          const excerpt =
            plainText.length > 220
              ? `${plainText.slice(0, 220).trimEnd()}...`
              : plainText;

          const viewCount = article.id
            ? views[article.id] ?? 0
            : 0;

          const date =
            article.publishedAt ??
            article.createdAt ??
            article.date;

          return (
            <article
              key={article.id ?? index}
              className="
                group rounded-2xl border border-slate-200
                bg-white p-6 shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:shadow-lg
              "
            >
              <header>
                <h4 className="text-xl font-bold leading-7 text-slate-900">
                  {title}
                </h4>
              </header>

              {excerpt && (
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {excerpt}
                </p>
              )}

              <footer
                className="
                  mt-6 flex flex-col gap-4
                  border-t border-slate-100 pt-5
                  sm:flex-row sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>
                    {t("viewCount", { count: viewCount })}
                  </span>

                  {date && (
                    <time>
                      {readableDate(
                        date,
                        locale === "fr" ? "fr-FR" : "en-US",
                      )}
                    </time>
                  )}
                </div>

                <Link
                  href={`/${locale}/blogs/${slug}`}
                  aria-label={t("readArticleLabel", { title })}
                  className="
                    inline-flex items-center gap-2
                    text-sm font-semibold text-blue-700
                    transition-colors hover:text-orange-600
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-blue-600
                    focus-visible:ring-offset-2
                  "
                >
                  {t("readArticle")}

                  <ExternalLink
                    className="
                      size-4 transition-transform duration-200
                      group-hover:translate-x-0.5
                    "
                    aria-hidden="true"
                  />
                </Link>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}