"use client";

import { useTranslations } from "next-intl";

import ArticleCard from "@/features/articles/components/home/ArticleCard";

import type { Article } from "@/features/interfaces/article";

interface ArticleGridProps {
  articles: Article[];
  locale: "en" | "fr";
}

export default function ArticleGrid({
  articles,
  locale,
}: ArticleGridProps) {
  const t = useTranslations("Blogs.Grid");

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="article-grid-heading"
      className="w-full"
    >
      <header className="mb-6">
        <p
          className="
            text-xs font-bold uppercase
            tracking-[0.16em]
            text-orange-600
          "
        >
          {t("eyebrow")}
        </p>

        <h2
          id="article-grid-heading"
          className="
            mt-2
            text-2xl font-bold
            tracking-tight
            text-slate-950
            sm:text-3xl
          "
        >
          {t("title")}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {t("description")}
        </p>
      </header>

      <div
        className="
          grid gap-5
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}