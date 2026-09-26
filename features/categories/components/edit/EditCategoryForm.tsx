"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useController, useForm } from "react-hook-form";

import { Layers3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CategoryFields from "@/features/categories/components/create/CategoryFields";
import FormActions from "@/components/form/FormActions";

import { updateCategoryAction } from "@/features/categories/actions/category.actions";

import type { Category } from "@/features/interfaces/category";

type SupportedLocale = "en" | "fr";

interface EditCategoryFormProps {
  locale: SupportedLocale;
  category: Category;
}

interface EditCategoryFormValues {
  name: string;
}

export default function EditCategoryForm({
  locale,
  category,
}: EditCategoryFormProps) {
  const router = useRouter();

  const [isSaving, startSavingTransition] = useTransition();

  const [serverError, setServerError] = useState<string | null>(
    null,
  );

  const {
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EditCategoryFormValues>({
    defaultValues: {
      name: category.name ?? "",
    },
  });

  const nameField = useController({
    control,
    name: "name",
  }).field;

  


  function validateForm(): boolean {
    clearErrors();
    setServerError(null);

    if (!category.id) {
      setServerError("Category ID is missing.");

      return false;
    }

    const values = getValues();

    if (!values.name.trim()) {
      setError("name", {
        type: "manual",
        message: "Category name is required.",
      });

      return false;
    }

    return true;
  }

  function handleSave() {
    if (!validateForm()) {
      return;
    }

    const values = getValues();

    startSavingTransition(async () => {
      const response = await updateCategoryAction(category.id!, {
        name: values.name.trim(),
      });

      if (!response.success) {
        setServerError(response.message);

        return;
      }

      router.push(`/${locale}/dashboard/categories`);
      router.refresh();
    });
  }

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {/* Server error */}
      {serverError && (
        <div
          id="category-edit-server-error"
          role="alert"
          tabIndex={-1}
          className="
            rounded-xl border
            border-red-200
            bg-red-50
            px-4 py-3
            text-sm font-medium
            text-red-700
          "
        >
          {serverError}
        </div>
      )}

      {/* Category information */}
      <Card
        id="category-basic-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardHeader>
          <SectionHeader
            icon={Layers3}
            title={
              locale === "fr"
                ? "Informations de la catégorie"
                : "Category information"
            }
            description={
              locale === "fr"
                ? "Modifiez le nom de la catégorie."
                : "Update the category name."
            }
            variant="blue"
          />
        </CardHeader>

        <CardContent>
          <CategoryFields
            locale={locale}
            name={nameField.value}
            onNameChange={nameField.onChange}
            errors={{
              name: errors.name?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <FormActions
        locale={locale}
        component={"categories"}
        isCategory={true}
        mode={"edit"}
        isSaving={isSaving}
        onSaveDraft={handleSave}
      />

    </form>
  );
}

/*
 * -------------------------------------------
 * Section header
 * -------------------------------------------
 */

interface SectionHeaderProps {
  icon: typeof Layers3;
  title: string;
  description: string;
  variant: "blue" | "orange";
}

function SectionHeader({
  icon: Icon,
  title,
  description,
  variant,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={
          variant === "blue"
            ? `
                flex size-11 shrink-0
                items-center justify-center
                rounded-2xl
                bg-blue-50
                text-blue-700
                ring-1 ring-blue-100
              `
            : `
                flex size-11 shrink-0
                items-center justify-center
                rounded-2xl
                bg-orange-50
                text-orange-700
                ring-1 ring-orange-100
              `
        }
      >
        <Icon
          className="size-5"
          aria-hidden="true"
        />
      </div>

      <div>
        <CardTitle
          className="
            text-lg font-bold
            text-slate-950
          "
        >
          {title}
        </CardTitle>

        <CardDescription className="mt-1 leading-6">
          {description}
        </CardDescription>
      </div>
    </div>
  );
}