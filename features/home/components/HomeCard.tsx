import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface HomeCardProps {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  url?: string;
  linkName?: string;
  className?: string;
  contentClassName?: string;
}

export default function HomeCard({
  title,
  content,
  icon,
  url,
  linkName,
  className = "",
  contentClassName = "",
}: HomeCardProps) {
  return (
    <article
      className={`
        group relative flex h-full flex-col overflow-hidden
        rounded-2xl border border-slate-200 bg-white p-6
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:border-slate-300
        hover:shadow-xl hover:shadow-slate-900/[0.07]
        sm:p-7
        ${className}
      `}
    >
      {/* Accent line */}
      <div
        aria-hidden="true"
        className="
          absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0
          bg-gradient-to-r from-blue-600 to-cyan-400
          transition-transform duration-300
          group-hover:scale-x-100
        "
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        {icon && (
          <div
            aria-hidden="true"
            className="
              flex size-12 shrink-0 items-center justify-center
              rounded-xl border border-blue-100 bg-blue-50
              text-blue-700
              transition-all duration-300
              group-hover:border-blue-200
              group-hover:bg-blue-700
              group-hover:text-white
            "
          >
            {icon}
          </div>
        )}

        {url && (
          <Link
            href={url}
            aria-label={`${linkName ?? "Learn more"}: ${title}`}
            className="
              flex size-9 shrink-0 items-center justify-center
              rounded-full border border-slate-200
              text-slate-500
              transition-all duration-200
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-900
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-600
            "
          >
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="mt-6">
        <h3
          className="
            text-xl font-bold tracking-[-0.02em]
            text-slate-950
            sm:text-2xl
          "
        >
          {title}
        </h3>

        <div
          className={`
            mt-3 text-sm leading-7 text-slate-600
            ${contentClassName}
          `}
        >
          {content}
        </div>
      </div>

      {/* Optional footer link */}
      {url && linkName && (
        <footer className="mt-auto pt-7">
          <Link
            href={url}
            className="
              inline-flex items-center gap-2
              text-sm font-semibold text-slate-900
              transition-colors
              hover:text-blue-700
              focus-visible:rounded-sm
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-600
            "
          >
            {linkName}

            <ArrowUpRight
              className="
                size-4 transition-transform duration-200
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
              aria-hidden="true"
            />
          </Link>
        </footer>
      )}
    </article>
  );
}