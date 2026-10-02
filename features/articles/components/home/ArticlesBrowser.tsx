"use client";

import { useMemo, useState } from "react";

import ArticleCategoryNav from "@/features/articles/components/home/ArticleCategoryNav";
import FeaturedArticle from "@/features/articles/components/home/FeaturedArticle";
import ArticleGrid from "@/features/articles/components/home/ArticleGrid";

import type { Article } from "@/features/interfaces/article";
import type { Category } from "@/features/interfaces/category";

type SupportedLocale = "en" | "fr";

interface ArticlesBrowserProps {
  articles: Article[];
  categories: Category[];
  locale: SupportedLocale;
}

export default function ArticlesBrowser({
  articles,
  categories,
  locale,
}: ArticlesBrowserProps) {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    if (!selectedCategoryId) {
      return articles;
    }

    return articles.filter(
      (article) =>
        article.categoryId === selectedCategoryId,
    );
  }, [articles, selectedCategoryId]);

  const articleCount = filteredArticles.length;

  return (
    <section
      aria-label={
        locale === "fr"
          ? "Bibliothèque d’articles"
          : "Article library"
      }
      className="
        mx-auto max-w-7xl
        px-4 py-8
        sm:px-6 sm:py-14
        lg:px-8 lg:py-16
      "
    >
      <div
        className="
          grid grid-cols-1
          gap-10
          lg:grid-cols-[220px_minmax(0,1fr)]
        "
      >
        <ArticleCategoryNav
          locale={locale}
          categories={categories}
          articleCount={articleCount}
          selectedCategoryId={selectedCategoryId ?? undefined}
          onCategoryChange={setSelectedCategoryId}
        />

        <div className="min-w-0 space-y-14">
          {/* {latestArticles.length > 0 ? (
            <FeaturedArticle
              articles={latestArticles}
              locale={locale}
            />
          ) : (
            <section
              aria-live="polite"
              className="
                rounded-2xl
                border border-slate-200
                bg-white
                px-6 py-12
                text-center
              "
            >
              <h2 className="text-lg font-bold text-slate-900">
                {locale === "fr"
                  ? "Aucun article trouvé"
                  : "No articles found"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {locale === "fr"
                  ? "Cette catégorie ne contient actuellement aucun article publié."
                  : "This category currently has no published articles."}
              </p>
            </section>
          )} */}

          {articleCount > 0 ? (
            <ArticleGrid
              articles={filteredArticles}
              locale={locale}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}