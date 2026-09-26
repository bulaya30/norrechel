"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "@/features/categories/schema/category.schema";
import { createCategoryAction } from "@/features/categories/actions/category.actions";

import CategoryFields from "@/features/categories/components/create/CategoryFields";
import FormActions from "@/components/form/FormActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SupportedLocale = "en" | "fr";

interface CreateCategoryFormProps {
  locale: SupportedLocale;
}

export default function CreateCategoryForm({
  locale,
}: CreateCategoryFormProps) {
  const router = useRouter();
  const [isSaving, startTransition] = useTransition();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
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

    const labels =
    locale === "fr"
      ? {
          categoryTitle:
            "Nom de la category",
        }
      : {
          categoryTitle:
            "Category name",
        };

  async function submitCategory() {
    clearErrors();
    setServerError(null);

    const values = getValues();
    const validation = createCategorySchema.safeParse(values);

    if (!validation.success) {
      const firstError = validation.error.issues[0];

      if (firstError) {
        setError(firstError.path[0] as keyof CreateCategoryFormValues, {
          type: "manual",
          message: firstError.message,
        });
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
      onSubmit={
        (event) => {
          event.preventDefault();
          handleSaveCategory();
        }
      } 
      noValidate
      className="space-y-6"
    >
      {serverError && (
        <div
          id="category-server-error"
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          {serverError}
        </div>
      )}

      <Card
        id="article-basic-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
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

      <FormActions
        locale={locale}
        component={"categories"}
        isCategory={true}
        mode={"create"}
        isSaving={isSaving}
        onSaveDraft={handleSaveCategory}
      />
    </form>
  );
}
