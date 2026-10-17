
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  useController,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "@/features/categories/schema/category.schema";

import { createCategoryAction } from "@/features/categories/actions/category.actions";

import CategoryFields from "@/features/categories/components/create/CategoryFields";
import FormActions from "@/components/form/FormActions";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface CreateCategoryFormProps {
  locale: SupportedLocale;
}

export default function CreateCategoryForm({
  locale,
}: CreateCategoryFormProps) {
  const router = useRouter();

  const t = useTranslations("CreateCategoryForm");

  const [isSaving, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const nameField = useController({
    control,
    name: "name",
  }).field;

  async function submitCategory() {
    clearErrors();
    setServerError(null);

    const values = getValues();
    const validation = createCategorySchema.safeParse(values);

    if (!validation.success) {
      const firstError = validation.error.issues[0];

      if (firstError) {
        setError(
          firstError.path[0] as keyof CreateCategoryFormValues,
          {
            type: "manual",
            message: firstError.message,
          },
        );
      }

      return;
    }

    clearErrors();

    startTransition(async () => {
      const result = await createCategoryAction(validation.data);

      if (!result.success) {
        setServerError(result.message);

        requestAnimationFrame(() => {
          document
            .getElementById("category-server-error")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
        });

        return;
      }

      reset();

      router.push(`/${locale}/dashboard/categories`);
      router.refresh();
    });
  }

  function handleSaveCategory() {
    void submitCategory();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSaveCategory();
      }}
      noValidate
      className="space-y-6"
    >
      {serverError && (
        <div
          id="category-server-error"
          role="alert"
          className="
            mb-6 rounded-lg
            border border-red-200
            bg-red-50 px-4 py-3
            text-sm text-red-700
            dark:border-red-900/50
            dark:bg-red-950/30
            dark:text-red-400
          "
        >
          {serverError}
        </div>
      )}

      <Card
        id="category-basic-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardContent>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-950">
              {t("categoryTitle")}
            </h2>
          </div>

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

      <FormActions
        locale={locale}
        component="categories"
        isCategory
        mode="create"
        isSaving={isSaving}
        onSaveDraft={handleSaveCategory}
      />
    </form>
  );
}
