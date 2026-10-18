"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useController, useForm } from "react-hook-form";
import { FileText, ImageIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ArticleFields from "@/features/articles/components/create/ArticleFields";
import ArticleContentEditor from "@/features/articles/components/create/ArticleContentEditor";
import ArticleCoverImage from "@/features/articles/components/create/ArticleCoverImage";
import ArticleFormActions from "@/components/form/FormActions";

import {
  updateArticleAction,
  publishArticleAction,
} from "@/features/articles/actions/article.actions";

import type { Article } from "@/features/interfaces/article";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface CategoryOption {
  id: string;
  name: string;
}

interface EditArticleFormProps {
  locale: SupportedLocale;
  article: Article;
  categories: CategoryOption[];
}

interface EditArticleFormValues {
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

interface SectionHeaderProps {
  icon: typeof FileText;
  title: string;
  description: string;
  variant: "blue" | "orange";
}

export default function EditArticleForm({
  locale,
  article,
  categories,
}: EditArticleFormProps) {
  const t = useTranslations("EditArticleForm");
  const router = useRouter();

  const [isSaving, startSavingTransition] = useTransition();
  const [isPublishing, startPublishingTransition] = useTransition();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EditArticleFormValues>({
    defaultValues: {
      title: {
        en: article.title?.en ?? "",
        fr: article.title?.fr ?? "",
      },
      content: {
        en: article.content?.en ?? "",
        fr: article.content?.fr ?? "",
      },
      categoryId: article.categoryId ?? "",
      coverImage: null,
    },
  });

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

  const contentEnField = useController({
    control,
    name: "content.en",
  }).field;

  const contentFrField = useController({
    control,
    name: "content.fr",
  }).field;

  const coverImageField = useController({
    control,
    name: "coverImage",
  }).field;

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

    if (!targetId) return;

    requestAnimationFrame(() => {
      const element = document.getElementById(targetId);

      if (!element) return;

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLButtonElement
      ) {
        element.focus({ preventScroll: true });
      }
    });
  }

  function scrollToServerError(): void {
    requestAnimationFrame(() => {
      document
        .getElementById("article-edit-server-error")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    });
  }

  function validateForm(): boolean {
    clearErrors();
    setServerError(null);

    if (!article.id) {
      setServerError(t("validation.articleIdMissing"));
      scrollToServerError();
      return false;
    }

    const values = getValues();

    if (!values.title.en.trim()) {
      setError("title.en", {
        type: "manual",
        message: t("validation.englishTitleRequired"),
      });

      scrollToField("title.en");
      return false;
    }

    if (!values.title.fr.trim()) {
      setError("title.fr", {
        type: "manual",
        message: t("validation.frenchTitleRequired"),
      });

      scrollToField("title.fr");
      return false;
    }

    return true;
  }

  function handleSaveDraft(): void {
    if (!validateForm() || !article.id) return;

    const values = getValues();

    startSavingTransition(async () => {
      try {
        const response = await updateArticleAction(article.id!, {
          title: values.title,
          content: values.content,
          categoryId: values.categoryId,
          ...(values.coverImage && {
            coverImage: values.coverImage,
          }),
        });

        if (!response.success) {
          setServerError(
            response.message || t("messages.saveError"),
          );
          scrollToServerError();
          return;
        }

        router.push(`/${locale}/dashboard/articles`);
        router.refresh();
      } catch {
        setServerError(t("messages.saveError"));
        scrollToServerError();
      }
    });
  }

  function handlePublish(): void {
    if (!validateForm() || !article.id) return;

    startPublishingTransition(async () => {
      try {
        const response = await publishArticleAction(article.id!);

        if (!response.success) {
          setServerError(
            response.message || t("messages.publishError"),
          );
          scrollToServerError();
          return;
        }

        router.push(`/${locale}/dashboard/articles`);
        router.refresh();
      } catch {
        setServerError(t("messages.publishError"));
        scrollToServerError();
      }
    });
  }

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(event) => event.preventDefault()}
    >
      {serverError && (
        <div
          id="article-edit-server-error"
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
            title={t("sections.basic.title")}
            description={t("sections.basic.description")}
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
            title={t("sections.content.title")}
            description={t("sections.content.description")}
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
            title={t("sections.cover.title")}
            description={t("sections.cover.description")}
            variant="orange"
          />
        </CardHeader>

        <CardContent>
          <ArticleCoverImage
            locale={locale}
            value={coverImageField.value}
            existingImageUrl={article.cover_image}
            onChange={coverImageField.onChange}
            error={errors.coverImage?.message}
          />
        </CardContent>
      </Card>

      {/* Form actions */}
      <ArticleFormActions
        locale={locale}
        component="articles"
        mode="edit"
        isSaving={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
    </form>
  );
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
                rounded-2xl bg-blue-50
                text-blue-700 ring-1 ring-blue-100
              `
            : `
                flex size-11 shrink-0
                items-center justify-center
                rounded-2xl bg-orange-50
                text-orange-700 ring-1 ring-orange-100
              `
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