
"use client";

import { useTranslations } from "next-intl";

import {
  FolderTree,
  Plus,
} from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import CategoryRow from "./CategoryRow";

import type { CategoryDashboardItem } from "@/features/interfaces/category";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface CategoryListProps {
  categories: CategoryDashboardItem[];
  locale: SupportedLocale;
}

export default function CategoryList({
  categories,
  locale,
}: CategoryListProps) {
  const t = useTranslations("CategoryList");

  const safeCategories = Array.isArray(categories)
    ? categories.filter(Boolean)
    : [];

  if (safeCategories.length === 0) {
    return (
      <section
        aria-labelledby="empty-categories-heading"
        className="
          rounded-2xl
          border border-dashed
          border-slate-300
          bg-white
          px-6 py-16
          text-center
          shadow-sm
        "
      >
        <div
          className="
            mx-auto flex size-14
            items-center justify-center
            rounded-2xl
            bg-slate-100
            text-slate-500
            ring-1 ring-slate-200
          "
          aria-hidden="true"
        >
          <FolderTree className="size-6" />
        </div>

        <h2
          id="empty-categories-heading"
          className="
            mt-5 text-xl
            font-bold
            text-slate-950
          "
        >
          {t("emptyTitle")}
        </h2>

        <p
          className="
            mx-auto mt-2
            max-w-md
            text-sm
            leading-6
            text-slate-600
          "
        >
          {t("emptyDescription")}
        </p>

        <Button
          asChild
          className="
            mt-6
            bg-orange-600
            font-semibold
            text-white
            hover:bg-orange-500
          "
        >
          <Link href={`/${locale}/dashboard/categories/new`}>
            <Plus
              className="size-4"
              aria-hidden="true"
            />

            {t("create")}
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="category-list-heading"
      className="
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >
      <h2
        id="category-list-heading"
        className="sr-only"
      >
        {t("listHeading")}
      </h2>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr
              className="
                border-b
                border-slate-200
                bg-slate-50/80
              "
            >
              <th
                scope="col"
                className="
                  px-6 py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {t("category")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {t("content")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {t("status")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-left
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {t("created")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-right
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {safeCategories.map((item, index) => (
              <CategoryRow
                key={item.category.id ?? index}
                item={item}
                locale={locale}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="divide-y divide-slate-100 md:hidden">
        {safeCategories.map((item, index) => (
          <CategoryRow
            key={item.category.id ?? index}
            item={item}
            locale={locale}
            mobile
          />
        ))}
      </div>
    </section>
  );
}
