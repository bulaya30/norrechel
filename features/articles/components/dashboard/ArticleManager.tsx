"use client";

import { useMemo, useState } from "react";

import ArticleToolbar from "@/components/dashboard/CustomToolbar";
import ArticleList from "./ArticleList";

import type { Article } from "@/features/interfaces/article";

type SupportedLocale = "en" | "fr";

interface CategoryOption {
  id: string;
  name: string;
}

interface ArticleManagerProps {
  articles: Article[];
  categories?: CategoryOption[];
  locale: SupportedLocale;
}

type LocalizedValue =
  | string
  | Record<string, string>
  | null
  | undefined;

function getLocalizedValue(
  value: LocalizedValue,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return (
    value[locale] ??
    value.en ??
    value.fr ??
    Object.values(value)[0] ??
    ""
  );
}

function getArticleViewCount(
  article: Article,
): number {
  if (Array.isArray(article.views)) {
    return article.views.length;
  }

  return 0;
}

function getArticleDate(
  article: Article,
): number {
  const value =
    article.publishedAt ??
    article.createdAt ??
    article.updatedAt ??
    article.date;

  if (!value) {
    return 0;
  }

  if (
    typeof value === "object" &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    return value.toMillis();
  }

  if (
    typeof value === "object" &&
    "_seconds" in value &&
    typeof value._seconds === "number"
  ) {
    return value._seconds * 1000;
  }

  if (
    typeof value === "object" &&
    "seconds" in value &&
    typeof value.seconds === "number"
  ) {
    return value.seconds * 1000;
  }

  const parsed = new Date(
    value as unknown as string,
  ).getTime();

  return Number.isNaN(parsed)
    ? 0
    : parsed;
}

export default function ArticleManager({
  articles,
  categories = [],
  locale,
}: ArticleManagerProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const filteredArticles = useMemo(() => {
    let result = Array.isArray(articles)
      ? [...articles]
      : [];

    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((article) => {
        const title = getLocalizedValue(
          article.title,
          locale,
        ).toLowerCase();

        const content = getLocalizedValue(
          article.content,
          locale,
        ).toLowerCase();

        return (
          title.includes(normalizedSearch) ||
          content.includes(normalizedSearch)
        );
      });
    }

    if (status !== "all") {
      result = result.filter(
        (article) =>
          article.status === status,
      );
    }

    if (category !== "all") {
      result = result.filter(
        (article) =>
          article.categoryId === category,
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            getArticleDate(a) -
            getArticleDate(b)
          );

        case "views":
          return (
            getArticleViewCount(b) -
            getArticleViewCount(a)
          );

        case "newest":
        default:
          return (
            getArticleDate(b) -
            getArticleDate(a)
          );
      }
    });

    return result;
  }, [
    articles,
    search,
    status,
    category,
    sort,
    locale,
  ]);

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setSort("newest");
  }

  return (
    <>
      <ArticleToolbar
        locale={locale}
        categories={categories}
        component={'articles'}
        search={search}
        status={status}
        category={category}
        sort={sort}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onResetFilters={resetFilters}
      />

      <ArticleList
        articles={filteredArticles}
        locale={locale}
      />
    </>
  );
}
