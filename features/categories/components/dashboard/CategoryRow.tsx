"use client";

import Link from "next/link";

import {
  CheckCircle2,
  CircleSlash2,
  Pencil,
  Layers3,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { CategoryDashboardItem } from "@/features/interfaces/category";

import { readableDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface CategoryRowProps {
  item: CategoryDashboardItem;
  locale: SupportedLocale;
  mobile?: boolean;
}

export default function CategoryRow({
  item,
  locale,
  mobile = false,
}: CategoryRowProps) {
  const { category, articles, projects } = item;

  const isActive = category.active !== false;

  const articleCount = articles.length;
  const projectCount = projects.length;

  const labels =
    locale === "fr"
      ? {
          active: "Active",
          inactive: "Inactive",
          articles: "Articles",
          projects: "Projets",
          edit: "Modifier",
          delete: "Supprimer",
          restore: "Restaurer",
          noDate: "—",
        }
      : {
          active: "Active",
          inactive: "Inactive",
          articles: "Articles",
          projects: "Projects",
          edit: "Edit",
          delete: "Delete",
          restore: "Restore",
          noDate: "—",
        };

  const createdDate = category.createdAt ?? category.date;

  if (mobile) {
    return (
      <article className="p-5">
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div className="flex min-w-0 gap-3">
            <div
              className="
                flex size-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-orange-50
                text-orange-600
              "
            >
              <Layers3
                className="size-5"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h3
                className="
                  truncate
                  text-sm
                  font-bold
                  text-slate-950
                "
              >
                {category.name}
              </h3>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-slate-500
                "
              >
                {category.slug}
              </p>
            </div>
          </div>

          <StatusBadge
            active={isActive}
            labels={labels}
          />
        </div>

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-3
            rounded-xl
            bg-slate-50
            p-3
          "
        >
          <div>
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              {labels.articles}
            </p>

            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-slate-900
              "
            >
              {articleCount}
            </p>
          </div>

          <div>
            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              {labels.projects}
            </p>

            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-slate-900
              "
            >
              {projectCount}
            </p>
          </div>
        </div>

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <span
            className="
              text-xs
              text-slate-500
            "
          >
            {createdDate
              ? readableDate(
                  createdDate,
                  locale,
                )
              : labels.noDate}
          </span>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="
                border-slate-300
                text-slate-700
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-800
              "
            >
              <Link
                href={`/${locale}/dashboard/categories/${category.slug ?? category.id}/edit`}
              >
                <Pencil
                  className="size-3.5"
                  aria-hidden="true"
                />

                {labels.edit}
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="
                border-red-200
                text-red-700
                hover:border-red-300
                hover:bg-red-50
              "
            >
              {isActive ? (
                <>
                  <Trash2
                    className="size-3.5"
                    aria-hidden="true"
                  />

                  {labels.delete}
                </>
              ) : (
                <>
                  <CircleSlash2
                    className="size-3.5"
                    aria-hidden="true"
                  />

                  {labels.restore}
                </>
              )}
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <tr
      className="
        transition-colors
        hover:bg-slate-50/70
      "
    >
      {/* Category */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="
              flex size-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-orange-50
              text-orange-600
            "
          >
            <Layers3
              className="size-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                font-semibold
                text-slate-950
              "
            >
              {category.name}
            </p>

            <p
              className="
                mt-0.5
                max-w-[220px]
                truncate
                text-xs
                text-slate-500
              "
            >
              {category.slug}
            </p>
          </div>
        </div>
      </td>

      {/* Content */}
      <td className="px-6 py-5">
        <div
          className="
            flex
            flex-col
            gap-1
            text-sm
          "
        >
          <span className="text-slate-700">
            {articleCount} {labels.articles}
          </span>

          <span className="text-slate-500">
            {projectCount} {labels.projects}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <StatusBadge
          active={isActive}
          labels={labels}
        />
      </td>

      {/* Created */}
      <td className="whitespace-nowrap px-6 py-5">
        <span
          className="
            text-sm
            text-slate-600
          "
        >
          {createdDate
            ? readableDate(
                createdDate,
                locale,
              )
            : labels.noDate}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <div
          className="
            flex
            justify-end
            gap-2
          "
        >
          <Button
            asChild
            variant="outline"
            size="sm"
            className="
              border-slate-300
              text-slate-700
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-800
            "
          >
            <Link
              href={`/${locale}/dashboard/categories/${category.slug ?? category.id}/edit`}
            >
              <Pencil
                className="size-3.5"
                aria-hidden="true"
              />

              {labels.edit}
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="
              border-red-200
              text-red-700
              hover:border-red-300
              hover:bg-red-50
              hover:cursor-pointer
            "
          >
            {isActive ? (
              <>
                <Trash2
                  className="size-3.5"
                  aria-hidden="true"
                />

                {labels.delete}
              </>
            ) : (
              <>
                <CircleSlash2
                  className="size-3.5"
                  aria-hidden="true"
                />

                {labels.restore}
              </>
            )}
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface StatusBadgeProps {
  active: boolean;
  labels: {
    active: string;
    inactive: string;
  };
}

function StatusBadge({
  active,
  labels,
}: StatusBadgeProps) {
  return (
    <span
      className={
        active
          ? `
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-emerald-200
              bg-emerald-50
              px-2.5
              py-1
              text-xs
              font-semibold
              text-emerald-700
            `
          : `
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-slate-200
              bg-slate-100
              px-2.5
              py-1
              text-xs
              font-semibold
              text-slate-600
            `
      }
    >
      {active ? (
        <CheckCircle2
          className="size-3.5"
          aria-hidden="true"
        />
      ) : (
        <CircleSlash2
          className="size-3.5"
          aria-hidden="true"
        />
      )}

      {active
        ? labels.active
        : labels.inactive}
    </span>
  );
}
