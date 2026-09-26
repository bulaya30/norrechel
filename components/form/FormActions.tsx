"use client";

import Link from "next/link";

import {
  FilePenLine,
  LoaderCircle,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/*
 * -------------------------------------------
 * Shared props
 * -------------------------------------------
 */

interface BaseFormActionsProps {
  locale: "en" | "fr";
  component: string;
  isSaving?: boolean;

  onSaveDraft: () => void;
}

/*
 * -------------------------------------------
 * Create mode
 *
 * Publishing is deliberately impossible here.
 * -------------------------------------------
 */

interface CreateFormActionsProps
  extends BaseFormActionsProps {
  mode: "create";
  isCategory?:boolean;
  isPublishing?: never;
  onPublish?: never;
}

/*
 * -------------------------------------------
 * Edit mode
 *
 * Publishing is required here.
 * -------------------------------------------
 */

interface EditFormActionsProps
  extends BaseFormActionsProps {
  mode: "edit";
  isCategory?: boolean;
  isPublishing?: boolean;

  onPublish?: () => void;
}

/*
 * -------------------------------------------
 * Discriminated union
 * -------------------------------------------
 */

type FormActionsProps =
  | CreateFormActionsProps
  | EditFormActionsProps;

/*
 * -------------------------------------------
 * Component
 * -------------------------------------------
 */

export default function FormActions(
  props: FormActionsProps,
) {
  const {
    locale,
    component,
    mode,
    isCategory = false,
    isSaving = false,
    onSaveDraft,
  } = props;

  const isPublishing = mode === "edit"
      ? props.isPublishing ?? false
      : false;

  const isSubmitting = isSaving || isPublishing;

  const labels = locale === "fr"
      ? {
          cancel: "Annuler",

          draft:
            mode === "edit"
              ? "Enregistrer les modifications"
              : "Enregistrer",

          saving:
            mode === "edit"
              ? "Enregistrement..."
              : "Enregistrement...",

          publish: "Publier l’article",
          publishing: "Publication...",
        }
      : {
          cancel: "Cancel",

          draft:
            mode === "edit"
              ? "Save changes"
              : "Save",

          saving: "Saving...",

          publish: "Publish article",
          publishing: "Publishing...",
        };

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
          sm:flex-row sm:items-center
          justify-end items-end
        "
      >
        {/* Cancel */}
        <Button
          asChild
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="
            bg-red
            border-slate-300
            text-slate-700
            cursor-pointer
          "
        >
          <Link
            href={`/${locale}/dashboard/${component}`}
          >
            {labels.cancel}
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

              {labels.saving}
            </>
          ) : (
            <>
              <FilePenLine
                className="size-4"
                aria-hidden="true"
              />

              {labels.draft}
            </>
          )}
        </Button>

        {/* Publish — edit mode only */}
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

                {labels.publishing}
              </>
            ) : (
              <>
                <Send
                  className="size-4"
                  aria-hidden="true"
                />

                {labels.publish}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}