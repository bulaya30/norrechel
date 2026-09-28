import Link from "next/link";
import {
  ExternalLink,
  Globe,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import type { Project } from "@/features/interfaces/project";
import { readableDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface AuthorProjectsProps {
  projects: Project[];
  locale: SupportedLocale;
  views: Record<string, number>;
}

function createPlainTextPreview(
  html: string,
  maximumLength = 240,
): string {
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maximumLength) {
    return plainText;
  }

  return `${plainText.slice(0, maximumLength).trimEnd()}...`;
}

export default function AuthorProjects({
  projects,
  views,
  locale,
}: AuthorProjectsProps) {
  const safeProjects = Array.isArray(projects)
    ? projects.filter(Boolean)
    : [];

  if (safeProjects.length === 0) {
    return (
      <section
        aria-labelledby="author-projects-heading"
        className="
          rounded-2xl border border-dashed border-slate-300
          bg-slate-50 px-6 py-12 text-center
        "
      >
        <h3
          id="author-projects-heading"
          className="text-xl font-bold text-slate-900"
        >
          {locale === "fr"
            ? "Aucun projet publié"
            : "No published projects"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {locale === "fr"
            ? "Les projets publiés par cet auteur apparaîtront ici."
            : "Projects published by this author will appear here."}
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="author-projects-heading">
      <header className="mb-6">
        <h3
          id="author-projects-heading"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          {locale === "fr"
            ? "Projets publiés"
            : "Published projects"}
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          {locale === "fr"
            ? `${safeProjects.length} projet${
                safeProjects.length > 1 ? "s" : ""
              }`
            : `${safeProjects.length} project${
                safeProjects.length > 1 ? "s" : ""
              }`}
        </p>
      </header>

      <div className="grid gap-5">
        {safeProjects.map((project, index) => {
          const title =
            project.title?.[locale] ??
            project.title?.en ??
            project.title?.fr ??
            (locale === "fr"
              ? "Projet sans titre"
              : "Untitled project");

          const slug =
            project.slug?.[locale] ??
            project.slug?.en ??
            project.slug?.fr ??
            project.id;

          const rawContent =
            project.details?.[locale] ??
            project.details?.en ??
            project.details?.fr ??
            project.content?.[locale] ??
            project.content?.en ??
            project.content?.fr ??
            "";

          const preview = createPlainTextPreview(rawContent);

          const technologies = Array.isArray(project.tech_stack)
            ? project.tech_stack
                .map((technology) => technology.trim())
                .filter(Boolean)
            : [];


            const viewCount = project.id
            ? views[project.id] ?? 0
            : 0;
          const date =
            project.publishedAt ??
            project.createdAt ??
            project.date;

          return (
            <article
              key={project.id ?? index}
              className="
                group rounded-2xl border border-slate-200
                bg-white p-6 shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:shadow-lg
              "
            >
              <header>
                <h4 className="text-xl font-bold leading-7 text-slate-900">
                  {title}
                </h4>
              </header>

              {preview && (
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {preview}
                </p>
              )}

              {technologies.length > 0 && (
                <ul
                  aria-label={
                    locale === "fr"
                      ? "Technologies utilisées"
                      : "Technologies used"
                  }
                  className="mt-5 flex flex-wrap gap-2"
                >
                  {technologies.map((technology) => (
                    <li
                      key={technology}
                      className="
                        rounded-full bg-slate-100
                        px-3 py-1 text-xs font-medium
                        text-slate-700
                      "
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              )}

              <footer
                className="
                  mt-6 flex flex-col gap-4
                  border-t border-slate-100 pt-5
                  sm:flex-row sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>
                    {viewCount}{" "}
                    {locale === "fr"
                      ? "vues"
                      : viewCount === 1
                        ? "view"
                        : "views"}
                  </span>
                  {date && (
                    <time>
                      {readableDate(
                        date,
                        locale === "fr"
                          ? "fr-FR"
                          : "en-US",
                      )}
                    </time>
                  )}

                  <span
                    className={
                      project.status === "published"
                        ? "font-medium text-emerald-700"
                        : "font-medium text-amber-700"
                    }
                  >
                    {project.status === "published"
                      ? locale === "fr"
                        ? "Publié"
                        : "Published"
                      : locale === "fr"
                        ? "Brouillon"
                        : "Draft"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {project.github_url && (
                    <Link
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${title} source code`}
                      className="
                        inline-flex items-center gap-2
                        text-sm font-semibold text-slate-600
                        transition-colors
                        hover:text-slate-950
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-slate-600
                        focus-visible:ring-offset-2
                      "
                    >
                    <FaGithub
                        className="size-4"
                        aria-hidden="true"
                    />
                      GitHub
                    </Link>
                  )}

                  {project.live_url && (
                    <Link
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${title} live website`}
                      className="
                        inline-flex items-center gap-2
                        text-sm font-semibold text-slate-600
                        transition-colors
                        hover:text-slate-950
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-slate-600
                        focus-visible:ring-offset-2
                      "
                    >
                      <Globe
                        className="size-4"
                        aria-hidden="true"
                      />
                      {locale === "fr"
                        ? "Démo"
                        : "Live demo"}
                    </Link>
                  )}

                  {slug && (
                    <Link
                      href={`/${locale}/projects/${slug}`}
                      className="
                        inline-flex items-center gap-2
                        text-sm font-semibold text-blue-700
                        transition-colors
                        hover:text-orange-600
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-blue-600
                        focus-visible:ring-offset-2
                      "
                    >
                      {locale === "fr"
                        ? "Voir le projet"
                        : "View project"}

                      <ExternalLink
                        className="
                          size-4 transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}