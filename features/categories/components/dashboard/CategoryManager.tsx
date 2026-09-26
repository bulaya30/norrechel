"use client";

import { useMemo, useState } from "react";

import CategoryToolbar from "@/features/categories/components/dashboard/CategoryToolbar";
import CategoryList from "./CategoryList";

import type { CategoryDashboardItem } from "@/features/interfaces/category";

type SupportedLocale = "en" | "fr";

interface CategoryManagerProps {
  categories: CategoryDashboardItem[];
  locale: SupportedLocale;
}

export default function CategoryManager({
  categories,
  locale,
}: CategoryManagerProps) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const result = Array.isArray(categories)
      ? [...categories]
      : [];

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return result;
    }

    return result.filter((item) => {
      const name =
        item.category.name?.toLowerCase() ?? "";

      const slug =
        item.category.slug?.toLowerCase() ?? "";

      return (
        name.includes(normalizedSearch) ||
        slug.includes(normalizedSearch)
      );
    });
  }, [categories, search]);

  function resetSearch() {
    setSearch("");
  }

  return (
    <>
      <CategoryToolbar
        locale={locale}
        search={search}
        onSearchChange={setSearch}
        onReset={resetSearch}
      />

      <CategoryList
        categories={filteredCategories}
        locale={locale}
      />
    </>
  );
}
