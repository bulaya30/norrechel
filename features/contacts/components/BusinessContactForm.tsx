
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  BriefcaseBusiness,
  CheckCircle2,
  Send,
} from "lucide-react";

import {
  createBusinessContactSchema,
  type BusinessContactFormValues,
  type SupportedLocale,
} from "@/features/contacts/schema/contact.schema";

import { submitContactAction } from "@/features/contacts/actions/contact.actions";

interface BusinessContactFormProps {
  locale: SupportedLocale;
}

const projectTypes = [
  "website",
  "custom-software",
  "dashboard",
  "management-system",
  "other",
] as const;

const projectBudgets = [
  "under-500k",
  "500k-1m",
  "1m-3m",
  "3m-5m",
  "5m-10m",
  "above-10m",
  "not-sure",
] as const;

export default function BusinessContactForm({
  locale,
}: BusinessContactFormProps) {
  const t = useTranslations("BusinessContactForm");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  const schema = createBusinessContactSchema(locale);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessContactFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      purpose: "business",
      name: "",
      email: "",
      businessName: "",
      message: "",
      budget: undefined,
    },
  });

  const getFieldClasses = (hasError: boolean) => `
    w-full rounded-xl border bg-white px-4 py-3
    text-sm text-slate-950 outline-none
    transition-colors placeholder:text-slate-400
    disabled:cursor-not-allowed disabled:bg-slate-100
    ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
    }
  `;

  const onSubmit = async (data: BusinessContactFormValues) => {
    setIsSubmitted(false);
    setSubmissionError(false);

    try {
      const result = await submitContactAction(data, locale);

      if (!result.success) {
        setSubmissionError(true);
        return;
      }

      setIsSubmitted(true);

      reset({
        purpose: "business",
        name: "",
        email: "",
        businessName: "",
        message: "",
        budget: undefined,
      });
    } catch (error) {
      console.error("Business enquiry submission failed:", error);
      setSubmissionError(true);
    }
  };

  return (
    <section
      aria-labelledby="business-contact-heading"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
    >
      {/* Form introduction */}
      <header>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <BriefcaseBusiness
            aria-hidden="true"
            className="h-6 w-6"
          />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
          {t("eyebrow")}
        </p>

        <h2
          id="business-contact-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
        >
          {t("title")}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {t("description")}
        </p>
      </header>

      {/* Success message */}
      {isSubmitted && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              {t("successTitle")}
            </p>

            <p className="mt-1 text-sm leading-6">
              {t("successMessage")}
            </p>
          </div>
        </div>
      )}

      {/* Submission error */}
      {submissionError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {t("submissionError")}
        </div>
      )}

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-6"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="business-contact-name"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {t("nameLabel")} *
          </label>

          <input
            id="business-contact-name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "business-name-error" : undefined
            }
            disabled={isSubmitting}
            className={getFieldClasses(Boolean(errors.name))}
            {...register("name")}
          />

          {errors.name && (
            <p
              id="business-name-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="business-contact-email"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {t("emailLabel")} *
          </label>

          <input
            id="business-contact-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "business-email-error" : undefined
            }
            disabled={isSubmitting}
            className={getFieldClasses(Boolean(errors.email))}
            {...register("email")}
          />

          {errors.email && (
            <p
              id="business-email-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Business name */}
        <div>
          <label
            htmlFor="business-contact-company"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {t("businessNameLabel")}
            <span className="ml-1 font-normal text-slate-400">
              ({t("optional")})
            </span>
          </label>

          <input
            id="business-contact-company"
            type="text"
            autoComplete="organization"
            placeholder={t("businessNamePlaceholder")}
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby={
              errors.businessName
                ? "business-company-error"
                : undefined
            }
            disabled={isSubmitting}
            className={getFieldClasses(Boolean(errors.businessName))}
            {...register("businessName")}
          />

          {errors.businessName && (
            <p
              id="business-company-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* Project type and budget */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Project type */}
          <div>
            <label
              htmlFor="business-project-type"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              {t("projectTypeLabel")} *
            </label>

            <select
              id="business-project-type"
              aria-invalid={Boolean(errors.projectType)}
              aria-describedby={
                errors.projectType
                  ? "business-project-type-error"
                  : undefined
              }
              disabled={isSubmitting}
              className={getFieldClasses(Boolean(errors.projectType))}
              {...register("projectType")}
            >
              <option value="">
                {t("projectTypePlaceholder")}
              </option>

              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`projectTypes.${type}`)}
                </option>
              ))}
            </select>

            {errors.projectType && (
              <p
                id="business-project-type-error"
                role="alert"
                className="mt-2 text-sm text-red-600"
              >
                {errors.projectType.message}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="business-project-budget"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              {t("budgetLabel")}
              <span className="ml-1 font-normal text-slate-400">
                ({t("optional")})
              </span>
            </label>

            <select
              id="business-project-budget"
              aria-invalid={Boolean(errors.budget)}
              aria-describedby={
                errors.budget
                  ? "business-budget-error"
                  : undefined
              }
              disabled={isSubmitting}
              className={getFieldClasses(Boolean(errors.budget))}
              {...register("budget", {
                setValueAs: (value: string) =>
                  value === "" ? undefined : value,
              })}
            >
              <option value="">
                {t("budgetPlaceholder")}
              </option>

              {projectBudgets.map((budget) => (
                <option key={budget} value={budget}>
                  {t(`budgets.${budget}`)}
                </option>
              ))}
            </select>

            {errors.budget && (
              <p
                id="business-budget-error"
                role="alert"
                className="mt-2 text-sm text-red-600"
              >
                {errors.budget.message}
              </p>
            )}
          </div>
        </div>

        {/* Project description */}
        <div>
          <label
            htmlFor="business-contact-message"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            {t("messageLabel")} *
          </label>

          <textarea
            id="business-contact-message"
            rows={7}
            placeholder={t("messagePlaceholder")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message
                ? "business-message-error"
                : "business-message-description"
            }
            disabled={isSubmitting}
            className={`${getFieldClasses(
              Boolean(errors.message),
            )} min-h-44 resize-y`}
            {...register("message")}
          />

          {errors.message && (
            <p
              id="business-message-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.message.message}
            </p>
          )}

          <p
            id="business-message-description"
            className="mt-2 text-xs leading-5 text-slate-500"
          >
            {t("messageHint")}
          </p>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-5 text-slate-500">
            {t("privacy")}
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-44 items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
          >
            <Send
              aria-hidden="true"
              className="h-4 w-4"
            />

            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </div>
      </form>
    </section>
  );
}
