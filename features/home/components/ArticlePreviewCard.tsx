import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

interface ArticlePreviewCardProps {
  title: string;
  href: string;
  coverImage?: string | null;
  author?: string;
  date?: string;
  excerpt?: string;
  category?: string;
  readingTime?: string;
  className?: string;
}

export default function ArticlePreviewCard({
  title,
  href,
  coverImage,
  author,
  date,
  excerpt,
  category,
  readingTime,
  className = "",
}: ArticlePreviewCardProps) {
  return (
    <article
      className={`
        group flex h-full flex-col overflow-hidden
        rounded-2xl border border-slate-200 bg-white
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl hover:shadow-slate-900/[0.07]
        ${className}
      `}
    >
      {/* Cover image */}
      <Link
        href={href}
        aria-label={`Read ${title}`}
        className="
          relative block aspect-[18/10]
          overflow-hidden bg-slate-100
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-600
          focus-visible:ring-inset
        "
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="
              (min-width: 1024px) 33vw,
              (min-width: 768px) 50vw,
              100vw
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
              flex h-full w-full items-center justify-center
              bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50
              text-sm font-medium text-slate-400
            "
          >
            No cover image
          </div>
        )}

        {/* Image overlay */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-gradient-to-t
            from-slate-950/30
            via-transparent
            to-transparent
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
        />

        
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3
          className="
            text-xl font-bold
            leading-snug
            tracking-[-0.02em]
            text-slate-950
          "
        >
          <Link
            href={href}
            className="
              transition-colors duration-200
              hover:text-orange-600
              focus-visible:rounded-sm
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-600
            "
          >
            {title}
          </Link>
        </h3>

        {excerpt && (
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
            {excerpt}
          </p>
        )}

        {/* Metadata */}
        {(author || date || readingTime) && (
          <div
            className="
              mt-6 flex flex-wrap items-center
              gap-x-4 gap-y-2
              text-xs font-medium text-slate-500
            "
          >
            {author && <span>{author}</span>}

            {date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays
                  className="size-3.5"
                  aria-hidden="true"
                />
                {date}
              </span>
            )}

            {readingTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3
                  className="size-3.5"
                  aria-hidden="true"
                />
                {readingTime}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-7">
          <Link
            href={href}
            className="
              inline-flex items-center gap-2
              text-sm font-semibold
              text-slate-900
              transition-colors duration-200
              hover:text-orange-600
              focus-visible:rounded-sm
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-orange-600
            "
          >
            Read article

            <ArrowUpRight
              className="
                size-4
                transition-transform duration-200
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}