"use client";

import {
  CircleCheck,
  Eye,
  EyeOff,
  FilePenLine,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

export type ArticlePublishStatus = "draft" | "published";

interface ArticlePublishingProps {
  locale: SupportedLocale;
  status: ArticlePublishStatus;
  active: boolean;
  onStatusChange: (status: ArticlePublishStatus) => void;
  onActiveChange: (active: boolean) => void;
  errors?: {
    status?: string;
    active?: string;
  };
}

export default function ArticlePublishing({
  locale,
  status,
  active,
  onStatusChange,
  onActiveChange,
  errors = {},
}: ArticlePublishingProps) {
  const t = useTranslations("ArticlePublishing");

  return (
    <div className="space-y-7">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-900">
          {t("status")}
        </legend>

        <RadioGroup
          value={status}
          onValueChange={(value: string) => {
            if (value === "draft" || value === "published") {
              onStatusChange(value);
            }
          }}
          className="grid gap-3"
        >
          <Label
            htmlFor="article-status-draft"
            className={cn(
              `
                flex cursor-pointer
                items-start gap-3
                rounded-xl border
                p-4 transition-colors
              `,
              status === "draft"
                ? "border-blue-300 bg-blue-50/60"
                : "border-slate-200 hover:bg-slate-50",
            )}
          >
            <RadioGroupItem
              id="article-status-draft"
              value="draft"
              className="mt-1"
            />

            <FilePenLine
              className="mt-0.5 size-5 shrink-0 text-slate-500"
              aria-hidden="true"
            />

            <span className="space-y-1">
              <span className="block text-sm font-semibold text-slate-900">
                {t("draft")}
              </span>

              <span className="block text-xs font-normal leading-5 text-slate-500">
                {t("draftDescription")}
              </span>
            </span>
          </Label>

          <Label
            htmlFor="article-status-published"
            className={cn(
              `
                flex cursor-pointer
                items-start gap-3
                rounded-xl border
                p-4 transition-colors
              `,
              status === "published"
                ? "border-blue-300 bg-blue-50/60"
                : "border-slate-200 hover:bg-slate-50",
            )}
          >
            <RadioGroupItem
              id="article-status-published"
              value="published"
              className="mt-1"
            />

            <CircleCheck
              className="mt-0.5 size-5 shrink-0 text-blue-700"
              aria-hidden="true"
            />

            <span className="space-y-1">
              <span className="block text-sm font-semibold text-slate-900">
                {t("published")}
              </span>

              <span className="block text-xs font-normal leading-5 text-slate-500">
                {t("publishedDescription")}
              </span>
            </span>
          </Label>
        </RadioGroup>

        {errors.status && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {errors.status}
          </p>
        )}
      </fieldset>

      <div className="border-t border-slate-200" />

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">
          {t("visibility")}
        </p>

        <div
          className="
            flex items-start justify-between
            gap-4 rounded-xl
            border border-slate-200
            bg-slate-50/60 p-4
          "
        >
          <div className="flex min-w-0 gap-3">
            <div
              className={cn(
                `
                  flex size-10 shrink-0
                  items-center justify-center
                  rounded-xl
                `,
                active
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-200 text-slate-500",
              )}
              aria-hidden="true"
            >
              {active ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </div>

            <div>
              <Label
                htmlFor="article-active"
                className="text-sm font-semibold text-slate-900"
              >
                {t("active")}
              </Label>

              <p
                id="article-active-description"
                className="mt-1 text-xs leading-5 text-slate-500"
              >
                {active
                  ? t("activeDescription")
                  : t("inactiveDescription")}
              </p>
            </div>
          </div>

          <Switch
            id="article-active"
            checked={active}
            onCheckedChange={onActiveChange}
            aria-describedby="article-active-description"
          />
        </div>

        {errors.active && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {errors.active}
          </p>
        )}
      </div>
    </div>
  );
}