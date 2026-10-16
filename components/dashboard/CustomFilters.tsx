"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SupportedLocale = "en" | "fr";

interface CategoryOption {
  id: string;
  name: string;
}

interface ArticleFiltersProps {
  locale: SupportedLocale;
  categories?: CategoryOption[];
  status?: string;
  category?: string;
  sort?: string;
  onStatusChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
}

export default function ArticleFilters({
  locale,
  categories = [],
  status = "all",
  category = "all",
  sort = "newest",
  onStatusChange,
  onCategoryChange,
  onSortChange,
}: ArticleFiltersProps) {
  const t = useTranslations("DashboardFilters");

  return (
    <div
      className="
        grid gap-3
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("status")}
        </p>

        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger
            className="w-full border-slate-300 bg-white"
            aria-label={t("status")}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              {t("allStatuses")}
            </SelectItem>
            <SelectItem value="published">
              {t("published")}
            </SelectItem>
            <SelectItem value="draft">
              {t("draft")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("category")}
        </p>

        <Select
          value={category}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger
            className="w-full border-slate-300 bg-white"
            aria-label={t("category")}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              {t("allCategories")}
            </SelectItem>

            {categories.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("sort")}
        </p>

        <Select
          value={sort}
          onValueChange={onSortChange}
        >
          <SelectTrigger
            className="w-full border-slate-300 bg-white"
            aria-label={t("sort")}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">
              {t("newest")}
            </SelectItem>
            <SelectItem value="oldest">
              {t("oldest")}
            </SelectItem>
            <SelectItem value="views">
              {t("mostViewed")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}