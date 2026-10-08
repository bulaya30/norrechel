import Link from "next/link";
import { normalizeDate, readableDate } from "@/lib/dates/utils";
import { AppTimestamp } from "@/features/interfaces/article";

interface Author {
  id?: string;
  firstName?: string;
  lastName?: string;
}

interface ProjectMetaProps {
  author?: Author;
  publishedAt: AppTimestamp;
  readingTime?: number;
  locale?: string;
  status?: string;
}

export default function ProjectMeta({
  author,
  publishedAt,
  readingTime,
  locale = "en",
  status,
}: ProjectMetaProps) {
  const authorName = [author?.firstName, author?.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown Author";

//   const normalizedPublishedAt = normalizeDate(publishedAt);

  return (
    <section
      aria-label="Project information"
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
              text-orange-700
              hover:text-orange-900
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
        <time
          dateTime={
            readableDate(publishedAt) ??
            undefined
          }
        >
          {readableDate(
            publishedAt,
            locale,
          )}
        </time>

        {readingTime !== undefined && (
          <span>
            {readingTime} min read
          </span>
        )}

        {status && (
          <span
            className="
              rounded-full
              border border-slate-200
              bg-slate-50
              px-2.5 py-1
              text-xs
              font-semibold
              capitalize
              text-slate-600
            "
          >
            {status}
          </span>
        )}
      </div>
    </section>
  );
}