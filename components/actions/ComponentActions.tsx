"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";

import {
  BarChart3,
  LoaderCircle,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Article } from "@/features/interfaces/article";
import type { Project } from "@/features/interfaces/project";

import {
  deleteArticleAction,
  restoreArticleAction,
} from "@/features/articles/actions/article.actions";

import {
  deleteProjectAction,
  restoreProjectAction,
} from "@/features/projects/actions/project.actions";

type SupportedLocale = "en" | "fr";
type Component = "articles" | "projects"

interface ComponentActionsProps {
  itemId: string;
  slug: { en: string; fr: string };
  component: Component;
  active: boolean;
  locale: SupportedLocale;
}

export default function ComponentActions({
  itemId,
  slug,
  component,
  active,
  locale,
}: ComponentActionsProps) {
  const [isPending, startTransition] = useTransition();

  const [
    optimisticActive,
    setOptimisticActive,
  ] = useOptimistic(
    active,
    (_, nextValue: boolean) => nextValue,
  );

  const labels = locale === "fr"
      ? {
          edit: "Modifier",
          analytics: "Analyses",
          delete: "Supprimer",
          restore: "Restaurer",
          processing: "Traitement...",
        }
      : {
          edit: "Edit",
          analytics: "Analytics",
          delete: "Delete",
          restore: "Restore",
          processing: "Processing...",
        };

  function handleDeleteOrRestore() {
    startTransition(async () => {
      setOptimisticActive(!optimisticActive);
      let result;
      if(component === "articles") {
        result = optimisticActive
          ? await deleteArticleAction(itemId)
          : await restoreArticleAction(itemId);

      } else {
        result = optimisticActive
          ? await deleteProjectAction(itemId)
          : await restoreProjectAction(itemId);
      }

      if (!result.success) {
        setOptimisticActive(optimisticActive);
      }
    });
  }

  return (
    <div
      aria-label={
        locale === "fr"
          ? "Actions de l’article"
          : "Article actions"
      }
      className="flex flex-row items-center gap-2"
    >
      <Button
        asChild
        variant="outline"
        size="sm"
        disabled={!optimisticActive}
        className="
          border-slate-300 text-slate-700
          hover:border-blue-200
          hover:bg-blue-50
          hover:text-blue-800
        "
      >
        {slug ? ( 
          <Link
            href={`/${locale}/dashboard/${component}/${slug[locale]}/edit`}
          >
            <Pencil
              className="size-3.5"
              aria-hidden="true"
            />

            {labels.edit}
          </Link>
        
        ) : (
          <Link
            href={`/${locale}/dashboard/${component}/${itemId}/edit`}
          >
            <Pencil
              className="size-3.5"
              aria-hidden="true"
            />

            {labels.edit}
          </Link>
        )}
      </Button>

      <Button
        asChild
        variant="outline"
        size="sm"
        className="
          border-slate-300 text-slate-700
          hover:border-blue-200
          hover:bg-blue-50
          hover:text-blue-800
        "
      >
        <Link
          href={`/${locale}/dashboard/${component}/${itemId}/analytics`}
        >
          <BarChart3
            className="size-3.5"
            aria-hidden="true"
          />

          {labels.analytics}
        </Link>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleDeleteOrRestore}
        className={
          optimisticActive
            ? `
                border-red-200 text-red-700
                hover:border-red-300
                hover:bg-red-50
                hover:text-red-800
              `
            : `
                border-emerald-200
                text-emerald-700
                hover:border-emerald-300
                hover:bg-emerald-50
                hover:text-emerald-800
              `
        }
      >
        {isPending ? (
          <>
            <LoaderCircle
              className="size-3.5 animate-spin"
              aria-hidden="true"
            />

            {labels.processing}
          </>
        ) : optimisticActive ? (
          <>
            <Trash2
              className="size-3.5"
              aria-hidden="true"
            />

            {labels.delete}
          </>
        ) : (
          <>
            <RotateCcw
              className="size-3.5"
              aria-hidden="true"
            />

            {labels.restore}
          </>
        )}
      </Button>
    </div>
  );
}