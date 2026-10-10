"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import ArticleCategoryNav from "@/features/articles/components/home/ArticleCategoryNav";
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
  const t = useTranslations("Blogs.Browser");

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
      aria-label={t("ariaLabel")}
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
          categories={categories}
          articleCount={articleCount}
          selectedCategoryId={
            selectedCategoryId ?? undefined
          }
          onCategoryChange={setSelectedCategoryId}
        />

        <div className="min-w-0 space-y-14">
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