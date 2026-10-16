
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  FileText,
  Send,
} from "lucide-react";

import {
  createContactSchema,
  type ContactFormValues,
  type SupportedLocale,
} from "@/features/contacts/schema/contact.schema";

import { submitContactAction } from "@/features/contacts/actions/contact.actions";

export interface ContentContactContext {
  contentType: "article" | "project";
  contentId: string;
  title: string;
  sourcePage: string;
}

interface ContentContactFormProps {
  locale: SupportedLocale;
  context: ContentContactContext;
}

export default function ContentContactForm({
  locale,
  context,
}: ContentContactFormProps) {
  const t = useTranslations("ContentContactForm");
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  const schema = createContactSchema(locale);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const fieldClasses = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-950
    outline-none transition-colors placeholder:text-slate-400
    disabled:cursor-not-allowed disabled:bg-slate-100
    ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
    }`;

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitted(false);
    setSubmissionError(false);

    try {
      const result = await submitContactAction(data, locale, {
        contentType: context.contentType,
        contentId: context.contentId,
        sourcePage: context.sourcePage,
        title: context.title,
      });

      if (!result.success) {
        setSubmissionError(true);
        return;
      }

      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("Content contact submission failed:", error);
      setSubmissionError(true);
    }
  };

  return (
    <section
      aria-labelledby="content-contact-heading"
      className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
    >
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
          {t("eyebrow")}
        </p>

        <h2
          id="content-contact-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
        >
          {t("title")}
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          {t("description")}
        </p>
      </header>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4">
        <FileText
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-orange-700"
        />

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-800">
            {context.contentType === "article"
              ? t("articleReference")
              : t("projectReference")}
          </p>

          <p className="mt-1 break-words font-semibold text-slate-900">
            {context.title}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {t("referenceDescription")}
          </p>
        </div>
      </div>

      {submitted && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0"
          />
          <div>
            <p className="font-semibold">{t("successTitle")}</p>
            <p className="mt-1 text-sm leading-6">
              {t("successMessage")}
            </p>
          </div>
        </div>
      )}

      {submissionError && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {t("submissionError")}
        </p>
      )}

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-6"
      >
        <div>
          <label
            htmlFor="content-contact-name"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {t("nameLabel")} *
          </label>

          <input
            id="content-contact-name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            disabled={isSubmitting}
            className={fieldClasses(Boolean(errors.name))}
            {...register("name")}
          />

          {errors.name && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="content-contact-email"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {t("emailLabel")} *
          </label>

          <input
            id="content-contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            disabled={isSubmitting}
            className={fieldClasses(Boolean(errors.email))}
            {...register("email")}
          />

          {errors.email && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="content-contact-message"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {t("messageLabel")} *
          </label>

          <textarea
            id="content-contact-message"
            rows={6}
            placeholder={t("messagePlaceholder")}
            aria-invalid={Boolean(errors.message)}
            disabled={isSubmitting}
            className={`${fieldClasses(Boolean(errors.message))} min-h-40 resize-y`}
            {...register("message")}
          />

          {errors.message && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-5 text-slate-500">
            {t("privacy")}
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </div>
      </form>
    </section>
  );
}
