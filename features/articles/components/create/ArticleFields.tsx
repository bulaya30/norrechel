
"use client";

import { useTranslations } from "next-intl";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryOption {
  id: string;
  name: string;
}

interface ArticleBasicFieldsProps {
  locale: SupportedLocale;

  titleEn: string;
  titleFr: string;
  categoryId: string;

  categories: CategoryOption[];

  onTitleEnChange: (value: string) => void;
  onTitleFrChange: (value: string) => void;
  onCategoryChange: (value: string) => void;

  errors?: {
    titleEn?: string;
    titleFr?: string;
    categoryId?: string;
  };
}

export default function ArticleBasicFields({
  locale,
  titleEn,
  titleFr,
  categoryId,
  categories,
  onTitleEnChange,
  onTitleFrChange,
  onCategoryChange,
  errors = {},
}: ArticleBasicFieldsProps) {
  const t = useTranslations("ArticleBasicFields");

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="article-title-en"
            className="font-semibold text-slate-800"
          >
            {t("englishTitle")}
          </Label>

          <Input
            id="article-title-en"
            type="text"
            value={titleEn}
            onChange={(event) =>
              onTitleEnChange(event.target.value)
            }
            placeholder={t("englishPlaceholder")}
            aria-invalid={errors.titleEn ? "true" : "false"}
            aria-describedby={
              errors.titleEn
                ? "article-title-en-error"
                : undefined
            }
            className="
              h-11 border-slate-300
              bg-white text-slate-950
              focus-visible:border-blue-700
              focus-visible:ring-blue-700/20
            "
          />

          {errors.titleEn && (
            <p
              id="article-title-en-error"
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {errors.titleEn}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="article-title-fr"
            className="font-semibold text-slate-800"
          >
            {t("frenchTitle")}
          </Label>

          <Input
            id="article-title-fr"
            type="text"
            value={titleFr}
            onChange={(event) =>
              onTitleFrChange(event.target.value)
            }
            placeholder={t("frenchPlaceholder")}
            aria-invalid={errors.titleFr ? "true" : "false"}
            aria-describedby={
              errors.titleFr
                ? "article-title-fr-error"
                : undefined
            }
            className="
              h-11 border-slate-300
              bg-white text-slate-950
              focus-visible:border-blue-700
              focus-visible:ring-blue-700/20
            "
          />

          {errors.titleFr && (
            <p
              id="article-title-fr-error"
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {errors.titleFr}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="article-category"
          className="font-semibold text-slate-800"
        >
          {t("category")}
        </Label>

        <Select
          value={categoryId}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger
            id="article-category"
            aria-invalid={errors.categoryId ? "true" : "false"}
            className="
              h-11 w-full border-slate-300
              bg-white text-slate-950
            "
          >
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>

          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.categoryId && (
          <p
            role="alert"
            className="text-sm font-medium text-red-600"
          >
            {errors.categoryId}
          </p>
        )}
      </div>
    </div>
  );
}
