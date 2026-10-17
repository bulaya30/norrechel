
"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface CategoryFieldsProps {
  locale: SupportedLocale;
  name: string;
  onNameChange: (value: string) => void;
  errors?: {
    name?: string;
  };
}

export default function CategoryFields({
  locale,
  name,
  onNameChange,
  errors = {},
}: CategoryFieldsProps) {
  const t = useTranslations("CategoryFields");

  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label
          htmlFor="category-name"
          className="font-semibold text-slate-800"
        >
          {t("name")}
        </Label>

        <Input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) =>
            onNameChange(event.target.value)
          }
          placeholder={t("namePlaceholder")}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={
            errors.name
              ? "category-name-error"
              : undefined
          }
          className="
            h-11
            border-slate-300
            bg-white
            text-slate-950
            focus-visible:border-blue-700
            focus-visible:ring-blue-700/20
          "
        />

        {errors.name && (
          <p
            id="category-name-error"
            role="alert"
            className="
              text-sm
              font-medium
              text-red-600
            "
          >
            {errors.name}
          </p>
        )}
      </div>
    </div>
  );
}
