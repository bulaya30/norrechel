import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Sparkles,
} from "lucide-react";

import type { Article } from "@/features/interfaces/article";
import { readableDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface FeaturedArticleProps {
  articles: Article[];
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

function getExcerpt(
  content: string,
  maximumCharacters = 220,
): string {
//   const plainText = stripHtml(content);
  const plainText = content;

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

function getCategoryName(
  article: Article,
): string {
  if (!article.category) {
    return "";
  }

  return article.category.name ?? "";
}

export default function FeaturedArticle({
  articles,
  locale,
}: FeaturedArticleProps) {
  const isFrench = locale === "fr";

  const latestArticles = articles
    .filter(Boolean)
    .slice(0, 3);

  if (latestArticles.length === 0) {
    return null;
  }

  const [featuredArticle, ...secondaryArticles] =
    latestArticles;

  const featuredTitle =
    getLocalizedValue(
      featuredArticle.title,
      locale,
    ) ||
    (isFrench
      ? "Article sans titre"
      : "Untitled article");

  const featuredContent = getLocalizedValue(
    featuredArticle.content,
    locale,
  );

  const featuredExcerpt = getExcerpt(
    featuredContent,
    280,
  );

  const featuredUrl = getArticleUrl(
    featuredArticle,
    locale,
  );

  const featuredCategory =
    getCategoryName(featuredArticle);

//   const featuredDate = formatPublishedDate(
//     featuredArticle,
//     locale,
//   );
  const featuredDate = readableDate(featuredArticle.createdAt)

  const featuredReadingTime =
    getReadingTime(featuredContent);

  return (
    <section
      aria-labelledby="latest-articles-heading"
      className="w-full"
    >
      {/* Section heading */}
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div
            className="
              mb-2 inline-flex items-center gap-2
              text-xs font-bold uppercase
              tracking-[0.16em] text-orange-600
            "
          >
            <Sparkles
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            {isFrench
              ? "Dernières publications"
              : "Latest publications"}
          </div>

          <h2
            id="latest-articles-heading"
            className="
              text-2xl font-bold tracking-tight
              text-slate-950 sm:text-3xl
            "
          >
            {isFrench
              ? "À découvrir"
              : "Worth exploring"}
          </h2>
        </div>

        <span className="hidden text-sm font-medium text-slate-400 sm:block">
          {latestArticles.length}{" "}
          {isFrench ? "articles" : "articles"}
        </span>
      </header>

      {/* Featured article */}
      <article
        className="
          group relative overflow-hidden
          rounded-3xl border border-slate-200
          bg-white shadow-sm
          transition-all duration-300
          hover:-translate-y-0.5
          hover:border-slate-300
          hover:shadow-xl
          hover:shadow-slate-900/5
        "
      >
        <div className="grid lg:grid-cols-[1.25fr_1fr]">
          {/* Cover */}
          <Link
            href={featuredUrl}
            aria-label={
              isFrench
                ? `Lire l’article : ${featuredTitle}`
                : `Read article: ${featuredTitle}`
            }
            className="
              relative block
              aspect-[16/10]
              overflow-hidden
              bg-slate-100
              lg:aspect-auto
              lg:min-h-[380px]
            "
          >
            {featuredArticle.cover_image ? (
              <Image
                src={featuredArticle.cover_image}
                alt=""
                fill
                sizes="
                  (max-width: 1023px) 100vw,
                  50vw
                "
                className="
                  object-cover
                  transition-transform duration-700
                  group-hover:scale-[1.03]
                "
              />
            ) : (
              <div
                className="
                  absolute inset-0
                  bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(249,115,22,0.3),transparent_40%)]
                  bg-slate-950
                "
              >
                <div
                  className="
                    absolute inset-8
                    rounded-2xl
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
                      text-8xl font-black
                      tracking-[-0.08em]
                      text-white/10
                    "
                  >
                    01
                  </span>
                </div>
              </div>
            )}

            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-slate-950/35
                via-transparent
                to-transparent
              "
            />

            {featuredCategory ? (
              <span
                className="
                  absolute left-5 top-5
                  rounded-full
                  bg-white/95
                  px-3 py-1.5
                  text-xs font-bold
                  text-slate-800
                  shadow-sm
                  backdrop-blur
                "
              >
                {featuredCategory}
              </span>
            ) : null}
          </Link>

          {/* Content */}
          <div
            className="
              flex flex-col
              justify-center
              p-6 sm:p-8
              lg:p-10
            "
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="
                  inline-flex items-center gap-1.5
                  text-xs font-bold uppercase
                  tracking-[0.14em]
                  text-orange-600
                "
              >
                <Sparkles
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />

                {isFrench
                  ? "Article à la une"
                  : "Featured article"}
              </span>
            </div>

            <h3
              className="
                mt-4
                text-2xl font-bold
                tracking-[-0.025em]
                text-slate-950
                sm:text-3xl
                lg:text-[2.15rem]
                lg:leading-[1.12]
              "
            >
              <Link
                href={featuredUrl}
                className="
                  rounded-lg
                  transition-colors
                  hover:text-blue-700
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-600
                  focus-visible:ring-offset-4
                "
              >
                {featuredTitle}
              </Link>
            </h3>

            {featuredExcerpt ? (
              <p
                className="
                  mt-5
                  text-base leading-7
                  text-slate-600
                "
              >
                {featuredExcerpt}
              </p>
            ) : null}

            <div
              className="
                mt-6 flex flex-wrap
                items-center gap-x-4 gap-y-2
                text-xs font-medium
                text-slate-500
              "
            >
              {featuredDate ? (
                <time>{featuredDate}</time>
              ) : null}

              <span
                aria-hidden="true"
                className="h-3.5 w-px bg-slate-300"
              />

              <span className="inline-flex items-center gap-1.5">
                <Clock3
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />

                {featuredReadingTime}{" "}
                {isFrench
                  ? "min de lecture"
                  : "min read"}
              </span>
            </div>

            <Link
              href={featuredUrl}
              className="
                mt-7 inline-flex w-fit
                items-center gap-2
                text-sm font-bold
                text-slate-950
                transition-colors
                hover:text-orange-600
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-orange-500
                focus-visible:ring-offset-4
              "
            >
              {isFrench
                ? "Lire l’article"
                : "Read article"}

              <ArrowRight
                aria-hidden="true"
                className="
                  h-4 w-4
                  transition-transform duration-200
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </div>
      </article>

      {/* Second + third articles */}
      {secondaryArticles.length > 0 ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {secondaryArticles.map((article, index) => {
            const title =
              getLocalizedValue(
                article.title,
                locale,
              ) ||
              (isFrench
                ? "Article sans titre"
                : "Untitled article");

            const content =
              getLocalizedValue(
                article.content,
                locale,
              );

            const excerpt = getExcerpt(
              content,
              170,
            );

            const url = getArticleUrl(
              article,
              locale,
            );

            const category = getCategoryName(article);

            const date = readableDate(article.createdAt);

            const readingTime = getReadingTime(content);

            return (
              <article
                key={article.id}
                className="
                  group flex flex-col
                  overflow-hidden
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-slate-300
                  hover:shadow-lg
                  hover:shadow-slate-900/5
                "
              >
                {article.cover_image ? (
                  <Link
                    href={url}
                    aria-label={
                      isFrench
                        ? `Lire l’article : ${title}`
                        : `Read article: ${title}`
                    }
                    className="
                      relative block
                      aspect-[12/9]
                      overflow-hidden
                      bg-slate-100
                    "
                  >
                    <Image
                      src={article.cover_image}
                      alt=""
                      fill
                      sizes="
                        (max-width: 767px) 100vw,
                        50vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-[1.03]
                      "
                    />
                  </Link>
                ) : null}

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {category ? (
                    <span
                      className="
                        text-[11px] font-bold
                        uppercase tracking-[0.14em]
                        text-orange-600
                      "
                    >
                      {category}
                    </span>
                  ) : null}

                  <h3
                    className="
                      mt-2
                      text-lg font-bold
                      leading-snug
                      text-slate-950
                    "
                  >
                    <Link
                      href={url}
                      className="
                        rounded-md
                        transition-colors
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

                  <div
                    className="
                      mt-5 flex flex-wrap
                      items-center gap-x-3 gap-y-2
                      text-xs font-medium
                      text-slate-400
                    "
                  >
                    {date ? (
                      <time>{date}</time>
                    ) : null}

                    <span
                      aria-hidden="true"
                      className="h-3 w-px bg-slate-300"
                    />

                    <span>
                      {readingTime}{" "}
                      {isFrench
                        ? "min"
                        : "min read"}
                    </span>
                  </div>

                  <Link
                    href={url}
                    className="
                      mt-5 inline-flex w-fit
                      items-center gap-2
                      text-sm font-semibold
                      text-slate-900
                      transition-colors
                      hover:text-orange-600
                    "
                  >
                    {isFrench
                      ? "Lire"
                      : "Read"}

                    <ArrowRight
                      aria-hidden="true"
                      className="
                        h-3.5 w-3.5
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}