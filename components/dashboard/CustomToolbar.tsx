"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Plus,
  FolderPlus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import CustomFilters from "./CustomFilters";

type SupportedLocale = "en" | "fr";
type Component = "articles" | "projects";

interface CategoryOption {
  id: string;
  name: string;
}

interface ArticleToolbarProps {
  locale: SupportedLocale;
  categories?: CategoryOption[];
  component: Component;
  search: string;
  status: string;
  category: string;
  sort: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
}

export default function CustomToolbar({
  locale,
  categories = [],
  component,
  search,
  status,
  category,
  sort,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
}: ArticleToolbarProps) {
  const [showFilters, setShowFilters] =
    useState(false);

  const labels =
    locale === "fr"
      ? {
          search: `Rechercher des ${component}...`,
          filters: "Filtres",
          hideFilters: "Masquer les filtres",
          newArticle: "Nouvel article",
          clear: "Réinitialiser",
        }
      : {
          search: `Search ${component}...`,
          filters: "Filters",
          hideFilters: "Hide filters",
          newArticle: "New article",
          clear: "Reset",
        };

  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "all" ||
    category !== "all" ||
    sort !== "newest";

  return (
    <section
      aria-label={
        locale === "fr"
          ? "Outils de gestion des articles"
          : "Article management tools"
      }
      className="
        mb-6 rounded-2xl border border-slate-200
        bg-white p-4 shadow-sm sm:p-5
      "
    >
      <div
        className="
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="relative w-full lg:max-w-md">
          <Search
            className="
              pointer-events-none absolute
              left-3 top-1/2 size-4
              -translate-y-1/2
              text-slate-400
            "
            aria-hidden="true"
          />

          <Input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder={labels.search}
            aria-label={labels.search}
            className="
              h-11 border-slate-300
              bg-slate-50 pl-10
              text-slate-900
              focus-visible:border-blue-700
              focus-visible:ring-blue-700/20
            "
          />
        </div>

        <div
          className="
            flex flex-col gap-3
            sm:flex-row
            sm:items-center
          "
        >
          <Button
            type="button"
            variant="outline"
            aria-expanded={showFilters}
            onClick={() =>
              setShowFilters((current) => !current)
            }
            className="
              border-slate-300
              text-slate-700
              hover:bg-slate-100
            "
          >
            {showFilters ? (
              <X
                className="size-4"
                aria-hidden="true"
              />
            ) : (
              <SlidersHorizontal
                className="size-4"
                aria-hidden="true"
              />
            )}

            {showFilters
              ? labels.hideFilters
              : labels.filters}

            {hasActiveFilters && (
              <span
                className="
                  ml-1 size-2
                  rounded-full bg-orange-600
                "
                aria-hidden="true"
              />
            )}
          </Button>

          <Button
            asChild
            className="
              bg-orange-600
              font-semibold text-white
              hover:bg-orange-500
            "
          >
            <Link
              href={`/${locale}/dashboard/${component}/new`}
            >
            {component === 'articles' ? (
                <Plus
                  className="size-4"
                  aria-hidden="true"
                />
            ): (
                <FolderPlus
                  className="size-4"
                  aria-hidden="true"
                />
            )}

              {labels.newArticle}
            </Link>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div
          className="
            mt-5 border-t
            border-slate-200 pt-5
          "
        >
          <div
            className="
              flex flex-col gap-4
              lg:flex-row
              lg:items-end
            "
          >
            <div className="flex-1">
              <CustomFilters
                locale={locale}
                categories={categories}
                status={status}
                category={category}
                sort={sort}
                onStatusChange={onStatusChange}
                onCategoryChange={onCategoryChange}
                onSortChange={onSortChange}
              />
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={onResetFilters}
                className="
                  shrink-0 text-slate-600
                  hover:bg-slate-100
                  hover:text-slate-950
                "
              >
                <X
                  className="size-4"
                  aria-hidden="true"
                />

                {labels.clear}
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}