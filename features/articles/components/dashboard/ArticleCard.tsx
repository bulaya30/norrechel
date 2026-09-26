"use client"
import Image from "next/image";
import Link from "next/link";

import {
  BarChart3,
  CalendarDays,
  Eye,
} from "lucide-react";

import ArticleActions from "@/components/actions/ComponentActions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Article } from "@/features/interfaces/article";
import { readableDate } from "@/lib/dates/utils";
import ComponentActions from "@/components/actions/ComponentActions";

type SupportedLocale = "en" | "fr";

interface ArticleCardProps {
  article: Article;
  locale: SupportedLocale;
}

type LocalizedValue ={
  en: string,
  fr: string
}

function getLocalizedValue(
  value: LocalizedValue | undefined,
  locale: SupportedLocale,
): string {
    return value?.[locale] ?? "";
}

export default function ArticleCard({
  article,
  locale,
}: ArticleCardProps) {
  const title = getLocalizedValue(
    article.title as LocalizedValue,
    locale,
  );

  const slug = getLocalizedValue(
    article.slug as LocalizedValue,
    locale,
  );

  const category = article.category?.name ?? "";

  const views = Array.isArray(article.views) 
    ? article.views.length
    : 0;
    
  const engagements = Array.isArray(article.engagements) ? article.engagements.length : 0;

  const publishedDate =
    article.publishedAt ??
    article.createdAt;

  const articleHref = slug
    ? `/${locale}/dashboard/articles/${slug}`
    : "#";

  const labels = locale === "fr"
      ? {
          published: "Publié",
          draft: "Brouillon",
          views: "Vues",
          engagements: "Engagements",
          publishedOn: "Publié le",
          preview: "Voir l’article",
        }
      : {
          published: "Published",
          draft: "Draft",
          views: "Views",
          engagements: "Engagements",
          publishedOn: "Published",
          preview: "View article",
        };

  return (
    <article
      className="
        group overflow-hidden rounded-2xl
        border border-slate-200 bg-white
        shadow-sm transition-all duration-300
        hover:border-blue-200
        hover:shadow-lg hover:shadow-slate-900/5
      "
    >
      {/* Cover image */}
      <div
        className="
          relative aspect-[16/9]
          overflow-hidden bg-slate-100
        "
      >
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={title}
            fill
            sizes="
              (max-width: 768px) 100vw,
              (max-width: 1280px) 50vw,
              33vw
            "
            className="
              object-cover
              transition-transform duration-500
              group-hover:scale-[1.03]
            "
          />
        ) : (
          <div
            className="
              flex h-full items-center
              justify-center
              bg-gradient-to-br
              from-slate-100 to-slate-200
            "
            aria-hidden="true"
          >
            <span
              className="
                text-sm font-medium
                text-slate-400
              "
            >
              {locale === "fr"
              ? "Aucune image"
              : "No cover image"}
            </span>
          </div>
        )}

        <div className="absolute left-4 top-4">
          <Badge
            variant="secondary"
            className={
              article.status === 'draft'
                ? `
                    border border-emerald-200
                    bg-emerald-50
                    text-emerald-700
                  `
                : `
                    border border-amber-200
                    bg-amber-50
                    text-amber-700
                  `
            }
          >
            {article.status ==='published'
              ? labels.published
              : labels.draft}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {category && (
          <p
            className="
              mb-2 text-xs font-bold
              uppercase tracking-wider
              text-orange-600
            "
          >
            {category}
          </p>
        )}

        <h2
          className="
            line-clamp-2 text-lg
            font-bold leading-7
            tracking-tight text-slate-950
          "
        >
          {title || "Untitled article"}
        </h2>

        {/* Metrics */}
        <div
          className="
            mt-5 flex flex-wrap
            items-center gap-x-5 gap-y-2
            border-y border-slate-100
            py-4
          "
        >
          <div
            className="
              flex items-center gap-1.5
              text-sm text-slate-600
            "
          >
            <Eye
              className="size-4 text-slate-400"
              aria-hidden="true"
            />

            <span className="font-semibold text-slate-900">
              {views.toLocaleString()}
            </span>

            <span>{labels.views}</span>
          </div>

          <div
            className="
              flex items-center gap-1.5
              text-sm text-slate-600
            "
          >
            <BarChart3
              className="size-4 text-slate-400"
              aria-hidden="true"
            />

            <span className="font-semibold text-slate-900">
              {engagements.toLocaleString()}
            </span>

            <span>{labels.engagements}</span>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="
            mt-4 flex flex-wrap
            items-center justify-between
            gap-3
          "
        >
          {publishedDate && (
            <div
              className="
                flex items-center gap-2
                text-xs text-slate-500
              "
            >
              <CalendarDays
                className="size-4"
                aria-hidden="true"
              />

              <span>
                {labels.publishedOn}{" "}
                {readableDate(
                  publishedDate,
                  locale,
                )}
              </span>
            </div>
          )}

          {slug && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="
                text-blue-700
                hover:bg-blue-50
                hover:text-blue-900
              "
            >
              <Link href={articleHref}>
                {labels.preview}
              </Link>
            </Button>
          )}
        </footer>
        {article.id && (
            <div
                className="
                mt-4 border-t border-slate-100
                pt-4
                "
            >
                <ComponentActions
                itemId={article.id}
                slug={article.slug}
                component={"articles"}
                active={article.active ?? false}
                locale={locale}
                />
            </div>
            )}
      </div>
    </article>
  );
}