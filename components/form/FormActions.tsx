
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  FilePenLine,
  LoaderCircle,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

/*
 * Shared props
 */
interface BaseFormActionsProps {
  locale: SupportedLocale;
  component: string;
  isSaving?: boolean;
  onSaveDraft: () => void;
}

/*
 * Create mode — publishing is unavailable.
 */
interface CreateFormActionsProps extends BaseFormActionsProps {
  mode: "create";
  isCategory?: boolean;
  isPublishing?: never;
  onPublish?: never;
}

/*
 * Edit mode — publishing is available.
 */
interface EditFormActionsProps extends BaseFormActionsProps {
  mode: "edit";
  isCategory?: boolean;
  isPublishing?: boolean;
  onPublish?: () => void;
}

/*
 * Discriminated union
 */
type FormActionsProps =
  | CreateFormActionsProps
  | EditFormActionsProps;

export default function FormActions(props: FormActionsProps) {
  const {
    locale,
    component,
    mode,
    isCategory = false,
    isSaving = false,
    onSaveDraft,
  } = props;

  const t = useTranslations("FormActions");

  const isPublishing =
    mode === "edit" ? props.isPublishing ?? false : false;

  const isSubmitting = isSaving || isPublishing;

  return (
    <div
      className="
        flex flex-col-reverse gap-2
        rounded-2xl border border-slate-200
        bg-white p-4 shadow-sm
        sm:flex-row sm:items-center
        sm:justify-between
      "
    >
      <div
        className="
          flex flex-col gap-2
          items-end justify-end
          sm:flex-row sm:items-center
        "
      >
        {/* Cancel */}
        <Button
          asChild
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="
            border-slate-300
            text-slate-700
            cursor-pointer
          "
        >
          <Link href={`/${locale}/dashboard/${component}`}>
            {t("cancel")}
          </Link>
        </Button>

        {/* Save */}
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={onSaveDraft}
          className="
            bg-blue-900
            border-slate-300
            text-white
            hover:bg-blue-800
            cursor-pointer
          "
        >
          {isSaving ? (
            <>
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
              {t("saving")}
            </>
          ) : (
            <>
              <FilePenLine
                className="size-4"
                aria-hidden="true"
              />
              {mode === "edit"
                ? t("saveChanges")
                : t("save")}
            </>
          )}
        </Button>

        {/* Publish — edit mode only, except categories */}
        {mode === "edit" && !isCategory && (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={props.onPublish}
            className="
              bg-blue-900
              text-white
              hover:bg-blue-800
              cursor-pointer
            "
          >
            {isPublishing ? (
              <>
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                {t("publishing")}
              </>
            ) : (
              <>
                <Send
                  className="size-4"
                  aria-hidden="true"
                />
                {t("publishArticle")}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
