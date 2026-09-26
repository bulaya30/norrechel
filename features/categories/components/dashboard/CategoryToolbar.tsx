"use client";

import Link from "next/link";

import {
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SupportedLocale = "en" | "fr";

interface CategoryToolbarProps {
  locale: SupportedLocale;
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export default function CategoryToolbar({
  locale,
  search,
  onSearchChange,
  onReset,
}: CategoryToolbarProps) {
  const labels =
    locale === "fr"
      ? {
          searchPlaceholder:
            "Rechercher des catégories...",
          create: "Nouvelle catégorie",
          clear: "Effacer",
        }
      : {
          searchPlaceholder:
            "Search categories...",
          create: "New Category",
          clear: "Clear",
        };

  return (
    <div
      className="
        mb-6 flex flex-col
        gap-3
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div className="relative w-full lg:max-w-xl">
        <Search
          className="
            pointer-events-none
            absolute left-3 top-1/2
            size-4 -translate-y-1/2
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
          placeholder={
            labels.searchPlaceholder
          }
          aria-label={
            labels.searchPlaceholder
          }
          className="
            h-11
            border-slate-200
            bg-white
            pl-10
            pr-10
            shadow-sm
            placeholder:text-slate-400
            focus-visible:border-blue-400
            focus-visible:ring-blue-100
          "
        />

        {search && (
          <button
            type="button"
            onClick={onReset}
            aria-label={labels.clear}
            className="
              absolute right-3 top-1/2
              -translate-y-1/2
              text-slate-400
              transition-colors
              hover:text-slate-700
            "
          >
            <X
              className="size-4"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <Button
        asChild
        className="
          h-11
          shrink-0
          bg-orange-600
          px-5
          font-semibold
          text-white
          hover:bg-orange-500
        "
      >
        <Link
          href={`/${locale}/dashboard/categories/new`}
        >
          <Plus
            className="size-4"
            aria-hidden="true"
          />

          {labels.create}
        </Link>
      </Button>
    </div>
  );
}
