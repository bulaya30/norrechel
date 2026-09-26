import Link from "next/link";
import { AppTimestamp } from "../../interfaces/article";
import { normalizeDate, readableDate } from "@/lib/dates/utils";

interface Author {
  id?: string;
  firstName?: string;
  lastName?: string;
}

interface ArticleMetaProps {
  author?: Author;
  publishedAt: AppTimestamp;
  readingTime?: number;
  locale?: string;
}

export default function ArticleMeta({
  author,
  publishedAt,
  readingTime,
  locale = "en",
}: ArticleMetaProps) {
  const authorName =
    [author?.firstName, author?.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown Author";

 

  return (
    <section
      aria-label="Article information"
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
        <span>By</span>

        {author?.id ? (
          <Link
            href={`/${locale}/author/${author.id}`}
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

      <div
        className="
          flex flex-wrap
          items-center
          gap-4
        "
      >
        <time dateTime={readableDate(publishedAt, locale)}>
          {readableDate(publishedAt)}
        </time>

        {readingTime !== undefined && (
          <span>
            {readingTime} min read
          </span>
        )}
      </div>
    </section>
  );
}