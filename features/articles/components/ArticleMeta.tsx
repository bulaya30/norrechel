import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppTimestamp } from "@/features/interfaces/article";
import { normalizeDate, readableDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface Author {
  id?: string;
  firstName?: string;
  lastName?: string;
}

interface ArticleMetaProps {
  author?: Author;
  publishedAt: AppTimestamp;
  readingTime?: number;
  locale?: SupportedLocale;
}

export default async function ArticleMeta({
  author,
  publishedAt,
  readingTime,
  locale = "en",
}: ArticleMetaProps) {
  const t = await getTranslations({
    locale,
    namespace: "Blogs.ArticleMeta",
  });

  const authorName =
    [author?.firstName, author?.lastName]
      .filter(Boolean)
      .join(" ") || t("unknownAuthor");

  const normalizedDate = normalizeDate(publishedAt);

  return (
    <section
      aria-label={t("ariaLabel")}
      className="
        mb-10
        flex flex-col gap-3
        border-y border-slate-200
        py-5
        text-sm text-slate-600
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      <div className="flex flex-wrap items-center gap-2">
        <span>{t("by")}</span>

        {author?.id ? (
          <Link
            href={`/author/${author.id}`}
            className="
              font-semibold
              text-blue-700
              hover:text-blue-900
              hover:underline
            "
          >
            {authorName}
          </Link>
        ) : (
          <span className="font-semibold">
            {authorName}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <time dateTime={readableDate(publishedAt, locale) ?? undefined}>
          {readableDate(publishedAt, locale)}
        </time>

        {readingTime !== undefined && (
          <span>
            {t("readingTime", { minutes: readingTime })}
          </span>
        )}
      </div>
    </section>
  );
}