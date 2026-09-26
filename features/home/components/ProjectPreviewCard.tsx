import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";



interface ProjectPreviewCardProps {
  title: string;
  href: string;
  coverImage?: string | null;
  description?: string;
  technologies?: string[];
  category?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  className?: string;
}

export default function ProjectPreviewCard({
  title,
  href,
  coverImage,
  description,
  technologies = [],
  category,
  liveUrl,
  githubUrl,
  className = "",
}: ProjectPreviewCardProps) {
  return (
    <article
      className={`
        group flex h-full flex-col overflow-hidden
        rounded-2xl border border-slate-200
        bg-white shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl hover:shadow-slate-900/[0.07]
        ${className}
      `}
    >
      {/* =====================================================
          COVER IMAGE
      ===================================================== */}
      <Link
        href={href}
        aria-label={`View ${title}`}
        className="
          relative block aspect-[18/10]
          overflow-hidden bg-slate-100
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-orange-600
          focus-visible:ring-inset
        "
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="
              (min-width: 1024px) 50vw,
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
              bg-gradient-to-br
              from-slate-100
              via-white
              to-orange-50
              text-sm font-medium text-slate-400
            "
          >
            No project image
          </div>
        )}

        {/* Image overlay */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-gradient-to-t
            from-slate-950/50
            via-slate-950/0
            to-transparent
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
        />

        
        {/* View icon */}
        <span
          aria-hidden="true"
          className="
            absolute bottom-4 right-4
            flex size-10 items-center justify-center
            rounded-full
            border border-white/20
            bg-slate-950/70
            text-white
            opacity-0
            translate-y-2
            backdrop-blur-md
            transition-all duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <ArrowUpRight className="size-4" />
        </span>
      </Link>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3
          className="
            text-xl font-bold
            tracking-[-0.02em]
            text-slate-950
            transition-colors duration-200
            group-hover:text-orange-600
          "
        >
          <Link
            href={href}
            className="
              focus-visible:rounded-sm
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-orange-600
            "
          >
            {title}
          </Link>
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
            {description}
          </p>
        )}

        {/* ===================================================
            TECHNOLOGY STACK
        =================================================== */}
        {technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {technologies.slice(0, 6).map((technology) => (
              <span
                key={technology}
                className="
                  rounded-md
                  border border-slate-200
                  bg-slate-50
                  px-2.5 py-1.5
                  text-[11px]
                  font-semibold
                  text-slate-600
                "
              >
                {technology}
              </span>
            ))}
          </div>
        )}

        {/* ===================================================
            FOOTER
        =================================================== */}
        <footer
          className="
            mt-auto flex flex-wrap items-center
            justify-between gap-4
            border-t border-slate-100
            pt-6
            mt-7
          "
        >
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
            View project

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

          {/* External project links */}
          {(liveUrl || githubUrl) && (
            <div className="flex items-center gap-2">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit live ${title} project`}
                  className="
                    flex size-9 items-center justify-center
                    rounded-lg
                    border border-slate-200
                    bg-white
                    text-slate-500
                    transition-all duration-200
                    hover:border-orange-200
                    hover:bg-orange-50
                    hover:text-orange-600
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-orange-600
                  "
                >
                  <ExternalLink
                    className="size-4"
                    aria-hidden="true"
                  />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${title} source code on GitHub`}
                  className="
                    flex size-9 items-center justify-center
                    rounded-lg
                    border border-slate-200
                    bg-white
                    text-slate-500
                    transition-all duration-200
                    hover:border-slate-300
                    hover:bg-slate-50
                    hover:text-slate-900
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-slate-900
                  "
                >
                  <FaGithub
                    className="size-4"
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          )}
        </footer>
      </div>
    </article>
  );
}