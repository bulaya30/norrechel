
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  useController,
  useForm,
  type FieldPath,
} from "react-hook-form";

import { FileText, ImageIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ArticleFields from "./ArticleFields";
import ArticleContentEditor from "./ArticleContentEditor";
import ArticleCoverImage from "./ArticleCoverImage";
import FormActions from "@/components/form/FormActions";

import { getArticleSchemas } from "@/features/articles/schema/article.schema";
import { createArticleAction } from "@/features/articles/actions/article.actions";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface CategoryOption {
  id: string;
  name: string;
}

interface CreateArticleFormProps {
  locale: SupportedLocale;
  categories: CategoryOption[];
}

export interface ArticleFormValues {
  title: {
    en: string;
    fr: string;
  };
  content: {
    en: string;
    fr: string;
  };
  categoryId: string;
  coverImage: File | null;
}

export default function CreateArticleForm({
  locale,
  categories,
}: CreateArticleFormProps) {
  const router = useRouter();

  const t = useTranslations("CreateArticleForm");
  const validationT = useTranslations("ArticleValidation");

  const { draftArticleSchema } = getArticleSchemas({
    titleMin: validationT("titleMin"),
    titleMax: validationT("titleMax"),
    contentRequired: validationT("contentRequired"),
    categoryRequired: validationT("categoryRequired"),
    coverImageRequired: validationT("coverImageRequired"),
  });

  const [isSaving, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    defaultValues: {
      title: {
        en: "",
        fr: "",
      },
      content: {
        en: "",
        fr: "",
      },
      categoryId: "",
      coverImage: null,
    },
  });

  // Basic fields
  const titleEnField = useController({
    control,
    name: "title.en",
  }).field;

  const titleFrField = useController({
    control,
    name: "title.fr",
  }).field;

  const categoryField = useController({
    control,
    name: "categoryId",
  }).field;

  // Content fields
  const contentEnField = useController({
    control,
    name: "content.en",
  }).field;

  const contentFrField = useController({
    control,
    name: "content.fr",
  }).field;

  // Cover image
  const coverImageField = useController({
    control,
    name: "coverImage",
  }).field;

  // Scroll to the field containing a validation error
  function scrollToField(fieldPath: string): void {
    const fieldTargets: Record<string, string> = {
      "title.en": "article-title-en",
      "title.fr": "article-title-fr",
      categoryId: "article-category",
      "content.en": "article-content-section",
      "content.fr": "article-content-section",
      coverImage: "article-cover-section",
    };

    const targetId = fieldTargets[fieldPath];

    if (!targetId) {
      return;
    }

    requestAnimationFrame(() => {
      const element = document.getElementById(targetId);

      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLButtonElement
      ) {
        element.focus({
          preventScroll: true,
        });
      }
    });
  }

  function scrollToServerError(): void {
    requestAnimationFrame(() => {
      const element = document.getElementById("article-server-error");

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  // Save article
  async function submitArticle() {
    clearErrors();
    setServerError(null);

    const values = getValues();
    const result = draftArticleSchema.safeParse(values);

    if (!result.success) {
      const issues = result.error.issues;

      // Display all validation errors
      for (const issue of issues) {
        const fieldName = issue.path.join(
          ".",
        ) as FieldPath<ArticleFormValues>;

        setError(fieldName, {
          type: "manual",
          message: issue.message,
        });
      }

      // Scroll to the first validation error
      const firstIssue = issues[0];

      if (firstIssue) {
        scrollToField(firstIssue.path.join("."));
      }

      return;
    }

    startTransition(async () => {
      const response = await createArticleAction({
        title: result.data.title,
        content: result.data.content,
        categoryId: result.data.categoryId,
        coverImage: result.data.coverImage ?? null,
      });

      if (!response.success) {
        setServerError(response.message);
        scrollToServerError();
        return;
      }

      reset();

      router.push(`/${locale}/dashboard/articles`);
      router.refresh();
    });
  }

  function handleSaveDraft() {
    void submitArticle();
  }

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        handleSaveDraft();
      }}
    >
      {/* Server error */}
      {serverError && (
        <div
          id="article-server-error"
          role="alert"
          tabIndex={-1}
          className="
            rounded-xl border border-red-200
            bg-red-50 px-4 py-3
            text-sm font-medium text-red-700
          "
        >
          {serverError}
        </div>
      )}

      {/* Basic information */}
      <Card
        id="article-basic-section"
        className="scroll-mt-24 border-slate-200 shadow-sm"
      >
        <CardHeader>
          <SectionHeader
            icon={FileText}
            title={t("basicTitle")}
            description={t("basicDescription")}
            variant="blue"
          />
        </CardHeader>

        <CardContent>
          <ArticleFields
            locale={locale}
            titleEn={titleEnField.value}
            titleFr={titleFrField.value}
            categoryId={categoryField.value}
            categories={categories}
            onTitleEnChange={titleEnField.onChange}
            onTitleFrChange={titleFrField.onChange}
            onCategoryChange={categoryField.onChange}
            errors={{
              titleEn: errors.title?.en?.message,
              titleFr: errors.title?.fr?.message,
              categoryId: errors.categoryId?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* Article content */}
      <Card
        id="article-content-section"
        className="scroll-mt-24 border-slate-200 shadow-sm"
      >
        <CardHeader>
          <SectionHeader
            icon={FileText}
            title={t("contentTitle")}
            description={t("contentDescription")}
            variant="blue"
          />
        </CardHeader>

        <CardContent>
          <ArticleContentEditor
            locale={locale}
            contentEn={contentEnField.value}
            contentFr={contentFrField.value}
            onContentEnChange={contentEnField.onChange}
            onContentFrChange={contentFrField.onChange}
            errors={{
              contentEn: errors.content?.en?.message,
              contentFr: errors.content?.fr?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* Cover image */}
      <Card
        id="article-cover-section"
        className="scroll-mt-24 border-slate-200 shadow-sm"
      >
        <CardHeader>
          <SectionHeader
            icon={ImageIcon}
            title={t("coverTitle")}
            description={t("coverDescription")}
            variant="orange"
          />
        </CardHeader>

        <CardContent>
          <ArticleCoverImage
            locale={locale}
            value={coverImageField.value}
            onChange={coverImageField.onChange}
            error={errors.coverImage?.message}
          />
        </CardContent>
      </Card>

      {/* Form actions */}
      <FormActions
        mode="create"
        component="articles"
        locale={locale}
        isSaving={isSaving}
        onSaveDraft={handleSaveDraft}
      />
    </form>
  );
}

interface SectionHeaderProps {
  icon: typeof FileText;
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
            ? "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100"
            : "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-700 ring-1 ring-orange-100"
        }
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <div>
        <CardTitle className="text-lg font-bold text-slate-950">
          {title}
        </CardTitle>

        <CardDescription className="mt-1 leading-6">
          {description}
        </CardDescription>
      </div>
    </div>
  );
}
