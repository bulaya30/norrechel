"use client";

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
  const labels =
    locale === "fr"
      ? {
          status: "Statut",
          category: "Catégorie",
          sort: "Trier",
          allStatuses: "Tous les statuts",
          published: "Publié",
          draft: "Brouillon",
          allCategories: "Toutes les catégories",
          newest: "Plus récents",
          oldest: "Plus anciens",
          mostViewed: "Plus vus",
        }
      : {
          status: "Status",
          category: "Category",
          sort: "Sort",
          allStatuses: "All statuses",
          published: "Published",
          draft: "Draft",
          allCategories: "All categories",
          newest: "Newest",
          oldest: "Oldest",
          mostViewed: "Most viewed",
        };

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
          {labels.status}
        </p>

        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="w-full border-slate-300 bg-white">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              {labels.allStatuses}
            </SelectItem>

            <SelectItem value="published">
              {labels.published}
            </SelectItem>

            <SelectItem value="draft">
              {labels.draft}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {labels.category}
        </p>

        <Select
          value={category}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-full border-slate-300 bg-white">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              {labels.allCategories}
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
          {labels.sort}
        </p>

        <Select
          value={sort}
          onValueChange={onSortChange}
        >
          <SelectTrigger className="w-full border-slate-300 bg-white">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">
              {labels.newest}
            </SelectItem>

            <SelectItem value="oldest">
              {labels.oldest}
            </SelectItem>

            <SelectItem value="views">
              {labels.mostViewed}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}