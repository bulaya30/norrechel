"use client";

import { useTranslations } from "next-intl";
import { FolderOpen } from "lucide-react";

import type { Category } from "@/features/interfaces/category";

interface ArticleCategoryNavProps {
  categories: Category[];
  articleCount: number;
  selectedCategoryId?: string;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function ArticleCategoryNav({
  categories,
  articleCount,
  selectedCategoryId,
  onCategoryChange,
}: ArticleCategoryNavProps) {
  const t = useTranslations("Blogs.CategoryNav");

  const allArticlesSelected = !selectedCategoryId;

  return (
    <aside
      aria-labelledby="article-categories-heading"
      className="lg:sticky lg:top-24 lg:self-start"
    >
      {/* Desktop navigation */}
      <div className="hidden lg:block">
        <div className="mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg bg-orange-50 text-orange-600
              "
            >
              <FolderOpen
                aria-hidden="true"
                className="h-4 w-4"
              />
            </div>

            <div>
              <h2
                id="article-categories-heading"
                className="text-sm font-bold text-slate-900"
              >
                {t("title")}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {t("description")}
              </p>
            </div>
          </div>
        </div>

        <nav aria-label={t("ariaLabel")}>
          <ul className="space-y-1">
            {/* All articles */}
            <li>
              <button
                type="button"
                aria-pressed={allArticlesSelected}
                onClick={() => onCategoryChange(null)}
                className={[
                  "group flex w-full items-center justify-between",
                  "rounded-xl px-3.5 py-2.5",
                  "text-left text-sm font-semibold",
                  "transition-colors duration-200",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-orange-500",
                  "focus-visible:ring-offset-2",
                  allArticlesSelected
                    ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      allArticlesSelected
                        ? "bg-orange-500"
                        : "bg-slate-300 group-hover:bg-orange-500",
                    ].join(" ")}
                  />

                  {t("allArticles")}
                </span>

                <span
                  className={[
                    "min-w-7 rounded-full px-2 py-0.5",
                    "text-center text-[11px] font-bold",
                    allArticlesSelected
                      ? "bg-white text-orange-700 shadow-sm"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {articleCount}
                </span>
              </button>
            </li>

            {/* Categories */}
            {categories.map((category) => {
              if (!category.id) return null;

              const isSelected =
                selectedCategoryId === category.id;

              return (
                <li key={category.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      onCategoryChange(category.id!)
                    }
                    className={[
                      "group flex w-full items-center",
                      "rounded-xl px-3.5 py-2.5",
                      "text-left text-sm font-semibold",
                      "transition-colors duration-200",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-orange-500",
                      "focus-visible:ring-offset-2",
                      isSelected
                        ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "mr-2.5 h-1.5 w-1.5 rounded-full",
                        isSelected
                          ? "bg-orange-500"
                          : "bg-slate-300 group-hover:bg-orange-500",
                      ].join(" ")}
                    />

                    <span className="truncate">
                      {category.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile navigation */}
      <div className="lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2
              id="article-categories-heading-mobile"
              className="text-sm font-bold text-slate-900"
            >
              {t("title")}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {t("description")}
            </p>
          </div>

          <FolderOpen
            aria-hidden="true"
            className="h-4 w-4 text-orange-500"
          />
        </div>

        <nav
          aria-label={t("ariaLabel")}
          className="-mx-4 overflow-x-auto px-4 pb-1"
        >
          <ul className="flex min-w-max items-center gap-2">
            {/* All articles */}
            <li>
              <button
                type="button"
                aria-pressed={allArticlesSelected}
                onClick={() => onCategoryChange(null)}
                className={[
                  "inline-flex items-center gap-2",
                  "rounded-full px-3.5 py-2",
                  "text-xs font-semibold whitespace-nowrap",
                  "transition-colors",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-orange-500",
                  "focus-visible:ring-offset-2",
                  allArticlesSelected
                    ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                ].join(" ")}
              >
                {t("allArticles")}

                <span
                  className={[
                    "rounded-full px-1.5 py-0.5",
                    "text-[10px] font-bold",
                    allArticlesSelected
                      ? "bg-white text-orange-700 shadow-sm"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {articleCount}
                </span>
              </button>
            </li>

            {/* Categories */}
            {categories.map((category) => {
              if (!category.id) return null;

              const isSelected =
                selectedCategoryId === category.id;

              return (
                <li key={category.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      onCategoryChange(category.id!)
                    }
                    className={[
                      "inline-flex items-center",
                      "rounded-full px-3.5 py-2",
                      "text-xs font-semibold whitespace-nowrap",
                      "transition-colors",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-orange-500",
                      "focus-visible:ring-offset-2",
                      isSelected
                        ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                    ].join(" ")}
                  >
                    {category.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}