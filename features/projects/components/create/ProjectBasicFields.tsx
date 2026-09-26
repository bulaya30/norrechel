"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SupportedLocale = "en" | "fr";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProjectBasicFieldsProps {
  locale: SupportedLocale;

  titleEn: string;
  titleFr: string;
  categoryId: string;

  categories: CategoryOption[];

  onTitleEnChange: (
    value: string,
  ) => void;

  onTitleFrChange: (
    value: string,
  ) => void;

  onCategoryChange: (
    value: string,
  ) => void;

  errors?: {
    titleEn?: string;
    titleFr?: string;
    categoryId?: string;
  };
}

export default function ProjectBasicFields({
  locale,
  titleEn,
  titleFr,
  categoryId,
  categories,
  onTitleEnChange,
  onTitleFrChange,
  onCategoryChange,
  errors = {},
}: ProjectBasicFieldsProps) {
  const labels =
    locale === "fr"
      ? {
          titleEn: "Titre en anglais",
          titleFr: "Titre en français",
          category: "Catégorie",
          titleEnPlaceholder:"Entrez le titre du projet en anglais",
          titleFrPlaceholder: "Entrez le titre du projet en français",
          categoryPlaceholder: "Sélectionnez une catégorie",
          required: "Ce champ est requis",
        }
      : {
          titleEn: "English title",
          titleFr: "French title",
          category: "Category",
          titleEnPlaceholder: "Enter the project title in English",
          titleFrPlaceholder: "Enter the project title in French",
          categoryPlaceholder: "Select a category",
          required: "This field is required",
        };

  return (
    <div className="space-y-6">
      {/* English title */}
      <div className="space-y-2">
        <Label htmlFor="project-title-en">
          {labels.titleEn}
        </Label>

        <Input
          id="project-title-en"
          name="title.en"
          value={titleEn}
          onChange={(event) => onTitleEnChange(event.target.value,) }
          placeholder={ labels.titleEnPlaceholder }
          aria-invalid={Boolean( errors?.titleEn, )}
          aria-describedby={
            errors?.titleEn
              ? "project-title-en-error"
              : undefined
          }
          className={
            errors?.titleEn
              ? "border-red-300 focus-visible:ring-red-500"
              : ""
          }
        />

        {errors?.titleEn && (
          <p
            id="project-title-en-error"
            role="alert"
            className="
              text-sm font-medium
              text-red-600
            "
          >
            {errors.titleEn}
          </p>
        )}
      </div>

      {/* French title */}
      <div className="space-y-2">
        <Label htmlFor="project-title-fr">
          {labels.titleFr}
        </Label>

        <Input
          id="project-title-fr"
          name="title.fr"
          value={titleFr}
          onChange={(event) =>
            onTitleFrChange(
              event.target.value,
            )
          }
          placeholder={
            labels.titleFrPlaceholder
          }
          aria-invalid={Boolean(
            errors?.titleFr,
          )}
          aria-describedby={
            errors?.titleFr
              ? "project-title-fr-error"
              : undefined
          }
          className={
            errors?.titleFr
              ? "border-red-300 focus-visible:ring-red-500"
              : ""
          }
        />

        {errors?.titleFr && (
          <p
            id="project-title-fr-error"
            role="alert"
            className="
              text-sm font-medium
              text-red-600
            "
          >
            {errors.titleFr}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="project-category">
          {labels.category}
        </Label>

        <select
          id="project-category"
          name="categoryId"
          value={categoryId}
          onChange={(event) =>
            onCategoryChange(
              event.target.value,
            )
          }
          aria-invalid={Boolean(
            errors?.categoryId,
          )}
          aria-describedby={
            errors?.categoryId
              ? "project-category-error"
              : undefined
          }
          className={`
            flex h-10 w-full
            rounded-md border
            bg-background px-3 py-2
            text-sm
            ring-offset-background
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            focus:ring-offset-2
            ${
              errors?.categoryId
                ? "border-red-300 focus:ring-red-500"
                : "border-input"
            }
          `}
        >
          <option value="">
            {labels.categoryPlaceholder}
          </option>

          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ),
          )}
        </select>

        {errors?.categoryId && (
          <p
            id="project-category-error"
            role="alert"
            className="
              text-sm font-medium
              text-red-600
            "
          >
            {errors.categoryId}
          </p>
        )}
      </div>
    </div>
  );
}