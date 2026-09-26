import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";

import type { Article } from "@/features/interfaces/article";

type SupportedLocale = "en" | "fr";

interface ArticleCardProps {
  article: Article;
  locale: SupportedLocale;
}

type LangValue =
  | string
  | Record<string, string>
  | null
  | undefined;

function getLocalizedValue(
  value: LangValue,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return (
    value[locale] ??
    value.en ??
    value.fr ??
    Object.values(value).find(
      (item): item is string => typeof item === "string",
    ) ??
    ""
  );
}

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function createExcerpt(
  content: string,
  maximumCharacters = 170,
): string {
  const plainText = stripHtml(content);

  if (!plainText) {
    return "";
  }

  if (plainText.length <= maximumCharacters) {
    return plainText;
  }

  return `${plainText
    .slice(0, maximumCharacters)
    .trimEnd()}…`;
}

function getReadingTime(content: string): number {
  const plainText = stripHtml(content);

  if (!plainText) {
    return 1;
  }

  const words = plainText
    .split(/\s+/)
    .filter(Boolean)
    .length;

  return Math.max(1, Math.ceil(words / 200));
}

function getArticleUrl(
  article: Article,
  locale: SupportedLocale,
): string {
  const slug = getLocalizedValue(
    article.slug,
    locale,
  );

  return slug
    ? `/${locale}/blogs/${slug}`
    : `/${locale}/blogs/${article.id}`;
}

function formatPublishedDate(
  article: Article,
  locale: SupportedLocale,
): string {
  const timestamp =
    article.publishedAt ?? article.createdAt;

  if (!timestamp) {
    return "";
  }

  let date: Date;

  if (
    typeof timestamp === "object" &&
    "toDate" in timestamp &&
    typeof timestamp.toDate === "function"
  ) {
    date = timestamp.toDate();
  } else if (
    typeof timestamp === "object" &&
    "seconds" in timestamp
  ) {
    date = new Date(
      Number(timestamp.seconds) * 1000,
    );
  } else {
    date = new Date(
      timestamp as string | number | Date,
    );
  }

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

export default function ArticleCard({
  article,
  locale,
}: ArticleCardProps) {
  const isFrench = locale === "fr";

  const title =
    getLocalizedValue(
      article.title,
      locale,
    ) ||
    (isFrench
      ? "Article sans titre"
      : "Untitled article");

  const content = getLocalizedValue(
    article.content,
    locale,
  );

  const excerpt = createExcerpt(content);

  const categoryName = article.category?.name ?? "";

  const articleUrl = getArticleUrl(
    article,
    locale,
  );

  const publishedDate = formatPublishedDate(
    article,
    locale,
  );

  const readingTime = getReadingTime(content);

  return (
    <article
      className="
        group flex h-full flex-col
        overflow-hidden rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl
        hover:shadow-slate-900/5
      "
    >
      {/* Cover image */}
      <Link
        href={articleUrl}
        aria-label={
          isFrench
            ? `Lire l’article : ${title}`
            : `Read article: ${title}`
        }
        className="
          relative block
          aspect-[16/9]
          overflow-hidden
          bg-slate-100
        "
      >
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt=""
            fill
            sizes="
              (max-width: 767px) 100vw,
              (max-width: 1279px) 50vw,
              33vw
            "
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.04]
            "
          />
        ) : (
          <div
            aria-hidden="true"
            className="
              absolute inset-0
              bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.25),transparent_40%)]
              bg-slate-950
            "
          >
            <div
              className="
                absolute inset-5
                rounded-xl
                border border-white/10
              "
            />

            <div
              className="
                absolute inset-0
                flex items-center justify-center
              "
            >
              <span
                className="
                  text-6xl font-black
                  tracking-[-0.08em]
                  text-white/10
                "
              >
                {String(article.id).slice(-2).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Image overlay */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-gradient-to-t
            from-slate-950/25
            via-transparent
            to-transparent
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
        />

      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3
          className="
            text-xl font-bold
            leading-snug
            tracking-[-0.015em]
            text-slate-950
          "
        >
          <Link
            href={articleUrl}
            className="
              rounded-md
              transition-colors duration-200
              hover:text-blue-700
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-600
              focus-visible:ring-offset-2
            "
          >
            {title}
          </Link>
        </h3>

        {excerpt ? (
          <p
            className="
              mt-3
              line-clamp-3
              text-sm leading-6
              text-slate-600
            "
          >
            {excerpt}
          </p>
        ) : null}

        {/* Metadata */}
        <div
          className="
            mt-5 flex flex-wrap
            items-center gap-x-3 gap-y-2
            text-xs font-medium
            text-slate-400
          "
        >
          {publishedDate ? (
            <time>{publishedDate}</time>
          ) : null}

          <span
            aria-hidden="true"
            className="h-3 w-px bg-slate-300"
          />

          <span className="inline-flex items-center gap-1.5">
            <Clock3
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            {readingTime}{" "}
            {isFrench ? "min" : "min read"}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-5 pt-1">
          <Link
            href={articleUrl}
            className="
              inline-flex items-center gap-1.5
              text-sm font-bold
              text-slate-900
              transition-colors duration-200
              hover:text-orange-600
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-orange-500
              focus-visible:ring-offset-2
            "
          >
            {isFrench
              ? "Lire l’article"
              : "Read article"}

            <ArrowUpRight
              aria-hidden="true"
              className="
                h-4 w-4
                transition-transform duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </Link>
        </div>
      </div>
    </article>
  );
}