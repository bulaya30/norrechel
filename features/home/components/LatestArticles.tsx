import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import type { Article } from "@/features/interfaces/article";
import ArticlePreviewCard from "./ArticlePreviewCard";
import { readableDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface LatestArticlesProps {
  articles: Article[];
  locale: SupportedLocale;
}

function getLocalizedValue(
  value: Article["title"] | Article["slug"],
  locale: SupportedLocale,
): string {
  return (
    value?.[locale] ??
    value?.en ??
    value?.fr ??
    ""
  );
}

function getLocalizedCategoryName(
  category: Article["category"],
  locale: SupportedLocale,
): string | undefined {
  if (!category?.name) {
    return undefined;
  }

  return (
    category.name ?? undefined
  );
}

function getArticleExcerpt(
  content: Article["content"],
  locale: SupportedLocale,
): string | undefined {
  const localizedContent =
    content?.[locale] ??
    content?.en ??
    content?.fr ??
    "";

  if (!localizedContent) {
    return undefined;
  }

  /*
   * Remove basic HTML markup before displaying the content
   * as a short homepage preview.
   */
  const plainText = localizedContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return undefined;
  }

  const maxLength = 150;

  return plainText.length > maxLength
    ? `${plainText.slice(0, maxLength).trim()}…`
    : plainText;
}

export default function LatestArticles({
  articles,
  locale,
}: LatestArticlesProps) {
  const visibleArticles = articles.slice(0, 3);

  return (
    <section
      aria-labelledby="latest-articles-heading"
      className="
        border-t border-slate-200
        bg-white
        px-4 py-10
        sm:px-6 sm:py-8
        lg:px-8 lg:py-10
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <header
          className="
            mb-5
            flex flex-col gap-5
            sm:mb-12
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="
                  flex size-9 items-center justify-center
                  rounded-lg
                  bg-blue-50
                  text-blue-700
                "
              >
                <BookOpen className="size-4" />
              </span>

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                From the journal
              </p>
            </div>

            <h2
              id="latest-articles-heading"
              className="
                text-3xl font-bold
                tracking-[-0.03em]
                text-slate-950
                sm:text-4xl
              "
            >
              Latest Articles
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Practical thoughts, lessons, and ideas from technology,
              entrepreneurship, software development, and personal growth.
            </p>
          </div>

          {/* View all */}
          <Link
            href={`/${locale}/blogs`}
            className="
              group inline-flex shrink-0
              items-center gap-2
              self-start
              text-sm font-semibold
              text-slate-900
              transition-colors
              hover:text-orange-600
              sm:self-auto
            "
          >
            View all articles

            <ArrowRight
              className="
                size-4
                transition-transform duration-200
                group-hover:translate-x-1
              "
              aria-hidden="true"
            />
          </Link>
        </header>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}
        {visibleArticles.length === 0 ? (
          <div
            className="
              flex min-h-56
              items-center justify-center
              rounded-2xl
              border border-dashed border-slate-300
              bg-slate-50/70
              px-6 py-12
              text-center
            "
          >
            <div>
              <BookOpen
                className="mx-auto size-8 text-slate-400"
                aria-hidden="true"
              />

              <p className="mt-4 text-sm font-semibold text-slate-700">
                {locale === "fr"
                  ? "Aucun article publié pour le moment."
                  : "No articles published yet."}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {locale === "fr"
                  ? "De nouveaux articles seront bientôt disponibles."
                  : "New articles will appear here when they are published."}
              </p>
            </div>
          </div>
        ) : (
          /* ===================================================
             ARTICLE GRID
          =================================================== */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleArticles.map((article) => {
              const title = getLocalizedValue(
                article.title,
                locale,
              );

              const slug = getLocalizedValue(
                article.slug,
                locale,
              );

              const authorName = [
                article.author?.firstName,
                article.author?.lastName,
              ]
                .filter(Boolean)
                .join(" ");

              const category = getLocalizedCategoryName(
                article.category,
                locale,
              );

              const excerpt = getArticleExcerpt(
                article.content,
                locale,
              );

              return (
                <ArticlePreviewCard
                  key={article.id}
                  title={title}
                  href={`/${locale}/blogs/${slug}`}
                  coverImage={article.cover_image}
                  author={authorName || undefined}
                  date={
                    article.createdAt
                      ? readableDate(article.createdAt, locale)
                      : undefined
                  }
                  category={category}
                  excerpt={excerpt}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}