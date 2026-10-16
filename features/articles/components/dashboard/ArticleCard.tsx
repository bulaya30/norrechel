"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import {
  BarChart3,
  CalendarDays,
  Eye,
} from "lucide-react";

import ComponentActions from "@/components/actions/ComponentActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Article } from "@/features/interfaces/article";
import { readableDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface ArticleCardProps {
  article: Article;
  locale: SupportedLocale;
}

type LocalizedValue = {
  en?: string;
  fr?: string;
};

function getLocalizedValue(
  value: string | LocalizedValue | undefined | null,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  return value?.[locale] ?? value?.en ?? value?.fr ?? "";
}

export default function ArticleCard({
  article,
  locale,
}: ArticleCardProps) {
  const t = useTranslations("DashboardArticleCard");

  const title = getLocalizedValue(article.title, locale);
  const slug = getLocalizedValue(article.slug, locale);
  const category = getLocalizedValue(
    article.category?.name,
    locale,
  );

  const views = Array.isArray(article.views)
    ? article.views.length
    : 0;

  const engagements = Array.isArray(article.engagements)
    ? article.engagements.length
    : 0;

  const publishedDate =
    article.publishedAt ?? article.createdAt;

  const isPublished = article.status === "published";

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
      <div
        className="
          relative aspect-[16/9]
          overflow-hidden bg-slate-100
        "
      >
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={title || t("coverImage")}
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
              {t("noCoverImage")}
            </span>
          </div>
        )}

        <div className="absolute left-4 top-4">
          <Badge
            variant="secondary"
            className={
              isPublished
                ? `
                    border border-emerald-200
                    bg-emerald-50 text-emerald-700
                  `
                : `
                    border border-amber-200
                    bg-amber-50 text-amber-700
                  `
            }
          >
            {isPublished ? t("published") : t("draft")}
          </Badge>
        </div>
      </div>

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
          {title || t("untitledArticle")}
        </h2>

        <div
          className="
            mt-5 flex flex-wrap
            items-center gap-x-5 gap-y-2
            border-y border-slate-100 py-4
          "
        >
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Eye
              className="size-4 text-slate-400"
              aria-hidden="true"
            />
            <span className="font-semibold text-slate-900">
              {views.toLocaleString(locale)}
            </span>
            <span>{t("views")}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <BarChart3
              className="size-4 text-slate-400"
              aria-hidden="true"
            />
            <span className="font-semibold text-slate-900">
              {engagements.toLocaleString(locale)}
            </span>
            <span>{t("engagements")}</span>
          </div>
        </div>

        <footer
          className="
            mt-4 flex flex-wrap
            items-center justify-between gap-3
          "
        >
          {publishedDate && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays
                className="size-4"
                aria-hidden="true"
              />
              <span>
                {t("dateLabel")}{" "}
                {readableDate(publishedDate, locale)}
              </span>
            </div>
          )}

          {slug && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="
                text-blue-700 hover:bg-blue-50
                hover:text-blue-900
              "
            >
              <Link
                href={`/dashboard/articles/${slug}`}
              >
                {t("preview")}
              </Link>
            </Button>
          )}
        </footer>

        {article.id && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <ComponentActions
              itemId={article.id}
              slug={article.slug}
              component="articles"
              active={article.active ?? false}
              locale={locale}
            />
          </div>
        )}
      </div>
    </article>
  );
}