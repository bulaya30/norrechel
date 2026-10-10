"use client";

import Image from "next/image";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/features/interfaces/article";

type SupportedLocale = "en" | "fr";
type LangValue = string | Record<string, string> | null | undefined;

interface ArticleCardProps {
  article: Article;
  locale: SupportedLocale;
}

function getLocalizedValue(
  value: LangValue,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") return value;
  if (!value) return "";

  return value[locale] ?? value.en ?? value.fr ?? "";
}

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function createExcerpt(content: string, maxLength = 145): string {
  const plainText = stripHtml(content);

  if (plainText.length <= maxLength) return plainText;

  return `${plainText.slice(0, maxLength).trimEnd()}…`;
}

function getReadingTime(content: string): number {
  const words = stripHtml(content)
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

function formatPublishedDate(
  value: Article["publishedAt"] | Article["date"] | Article["createdAt"],
  locale: SupportedLocale,
): string {
  if (!value) return "";

  let date: Date;

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    date = value.toDate();
  } else if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof value.seconds === "number"
  ) {
    date = new Date(value.seconds * 1000);
  } else {
    date = new Date(value as string | number | Date);
  }

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

export default function ArticleCard({
  article,
  locale,
}: ArticleCardProps) {
  const t = useTranslations("Blogs.Card");

  const title =
    getLocalizedValue(article.title, locale).trim() ||
    t("untitled");

  const slug = getLocalizedValue(article.slug, locale).trim();
  const content = getLocalizedValue(article.content, locale);
  const excerpt = createExcerpt(content);
  const readingTime = getReadingTime(content);

  const coverImage = article.cover_image;
  const publishedDate = formatPublishedDate(
    article.publishedAt ?? article.date ?? article.createdAt,
    locale,
  );

  if (!slug) return null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/5">
      <Link
        href={`/blogs/${slug}`}
        aria-label={t("readArticleAria", { title })}
        className="relative block aspect-[16/10] overflow-hidden bg-slate-100"
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="text-sm font-medium text-slate-400">
              {t("noCoverImage")}
            </span>
          </div>
        )}

        <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition-colors group-hover:bg-orange-600 group-hover:text-white">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {publishedDate && (
          <time
            dateTime={new Date(publishedDate).toISOString()}
            className="text-xs font-medium text-slate-500"
          >
            {publishedDate}
          </time>
        )}

        <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-orange-700">
          <Link href={`/blogs/${slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
            {title}
          </Link>
        </h3>

        {excerpt && (
          <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
            {excerpt}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {t("readingTime", { minutes: readingTime })}
          </span>

          <Link
            href={`/blogs/${slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 transition-colors hover:text-orange-900"
          >
            {t("readArticle")}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}