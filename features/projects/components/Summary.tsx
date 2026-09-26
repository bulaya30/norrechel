"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

import {
  ArrowUpRight,
  ExternalLink,
  FolderOpen,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import type { Project } from "../../interfaces/project";

interface ProjectSummaryProps {
  projects?: Project | Project[] | null;
}

type SupportedLocale = "en" | "fr";

const DESCRIPTION_MAX_LENGTH = 180;
const MAX_TECHNOLOGIES = 5;

function getLocalizedValue(
  value: Project["title"],
  locale: SupportedLocale,
): string {
  return (
    value?.[locale] ??
    value?.en ??
    value?.fr ??
    ""
  );
}

function stripHtml(html: string): string {
  return html
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

function createDescription(
  content: string,
  maximumLength = DESCRIPTION_MAX_LENGTH,
): string {
  const plainText = stripHtml(content);

  if (!plainText) {
    return "";
  }

  if (plainText.length <= maximumLength) {
    return plainText;
  }

  return `${plainText.slice(0, maximumLength).trimEnd()}…`;
}

function getCategoryName(
  category: Project["category"],
  locale: SupportedLocale,
): string {
  if (!category) {
    return "";
  }

  if (typeof category === "string") {
    return category;
  }

  return (
    category.name ?? ""
  );
}

function getStatusLabel(
  status: Project["status"],
  locale: SupportedLocale,
): string {
  const value = String(status ?? "").toLowerCase();

  switch (value) {
    case "published":
    case "completed":
      return locale === "fr" ? "Terminé" : "Completed";

    case "draft":
      return locale === "fr" ? "Brouillon" : "Draft";

    case "archived":
      return locale === "fr" ? "Archivé" : "Archived";

    case "in_progress":
    case "in-progress":
      return locale === "fr" ? "En cours" : "In progress";

    default:
      return status ? String(status) : "";
  }
}

export default function ProjectSummary({
  projects,
}: ProjectSummaryProps) {
  const locale = useLocale() as SupportedLocale;

  const safeProjects: Project[] = Array.isArray(projects)
    ? projects
    : projects
      ? [projects]
      : [];

  if (safeProjects.length === 0) {
    return (
      <div
        role="status"
        className="
          flex flex-col items-center justify-center
          rounded-2xl border border-dashed
          border-slate-300 bg-white
          px-6 py-16 text-center
        "
      >
        <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <FolderOpen
            className="size-5"
            aria-hidden="true"
          />
        </div>

        <p className="mt-4 text-sm font-medium text-slate-600">
          {locale === "fr"
            ? "Aucun projet publié pour le moment."
            : "No published projects are currently available."}
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="project-summary-heading"
      className="w-full"
    >
      <h2
        id="project-summary-heading"
        className="sr-only"
      >
        {locale === "fr"
          ? "Liste des projets"
          : "Project list"}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {safeProjects.map((project) => {
          const title =
            getLocalizedValue(project.title, locale) ||
            (locale === "fr"
              ? "Projet sans titre"
              : "Untitled project");

          const content = getLocalizedValue(
            project.content,
            locale,
          );

          const description = createDescription(content);

          const slug = getLocalizedValue(
            project.slug,
            locale,
          );

          const projectUrl = slug
            ? `/${locale}/projects/${slug}`
            : `/${locale}/projects/${project.id}`;

          const category = getCategoryName(
            project.category,
            locale,
          );

          const status = getStatusLabel(
            project.status,
            locale,
          );

          const technologies = Array.isArray(project.tech_stack)
            ? project.tech_stack.slice(0, MAX_TECHNOLOGIES)
            : [];

          const remainingTechnologies =
            Math.max(
              0,
              project.tech_stack.length -
                MAX_TECHNOLOGIES,
            );

          return (
            <article
              key={project.id}
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
                hover:shadow-slate-900/[0.07]
              "
            >
              {/* Cover */}
              <Link
                href={projectUrl}
                aria-label={
                  locale === "fr"
                    ? `Voir le projet : ${title}`
                    : `View project: ${title}`
                }
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {project.cover_image ? (
                    <>
                      <Image
                        src={project.cover_image}
                        alt={title}
                        fill
                        sizes="
                          (max-width: 768px) 100vw,
                          (max-width: 1280px) 45vw,
                          520px
                        "
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-[1.035]
                        "
                      />

                      <div
                        aria-hidden="true"
                        className="
                          absolute inset-0
                          bg-gradient-to-t
                          from-slate-950/30
                          via-transparent
                          to-transparent
                        "
                      />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderOpen
                        className="size-10 text-slate-300"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  {category && (
                    <span
                      className="
                        absolute left-4 top-4
                        rounded-full
                        border border-white/20
                        bg-slate-950/75
                        px-3 py-1.5
                        text-[11px] font-bold
                        uppercase tracking-[0.12em]
                        text-white
                        backdrop-blur-md
                      "
                    >
                      {category}
                    </span>
                  )}

                  <span
                    aria-hidden="true"
                    className="
                      absolute bottom-4 right-4
                      flex size-10
                      translate-y-2 items-center
                      justify-center rounded-full
                      bg-white text-slate-950
                      opacity-0 shadow-lg
                      transition-all duration-300
                      group-hover:translate-y-0
                      group-hover:opacity-100
                    "
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="min-w-0">
                    <Link
                      href={projectUrl}
                      className="
                        text-xl font-bold
                        tracking-[-0.025em]
                        text-slate-950
                        transition-colors
                        hover:text-blue-700
                      "
                    >
                      {title}
                    </Link>
                  </h3>

                  {status && (
                    <span
                      className="
                        shrink-0 rounded-full
                        bg-slate-100 px-2.5 py-1
                        text-[10px] font-bold
                        uppercase tracking-[0.1em]
                        text-slate-500
                      "
                    >
                      {status}
                    </span>
                  )}
                </div>

                {description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                )}

                {/* Technologies */}
                {technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {technologies.map((technology) => (
                      <span
                        key={technology}
                        className="
                          rounded-full
                          border border-slate-200
                          bg-slate-50
                          px-2.5 py-1
                          text-[11px] font-medium
                          text-slate-600
                        "
                      >
                        {technology}
                      </span>
                    ))}

                    {remainingTechnologies > 0 && (
                      <span
                        className="
                          rounded-full
                          border border-slate-200
                          bg-white
                          px-2.5 py-1
                          text-[11px] font-medium
                          text-slate-400
                        "
                      >
                        +{remainingTechnologies}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <footer className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <Link
                    href={projectUrl}
                    className="
                      inline-flex items-center gap-1.5
                      text-sm font-semibold
                      text-slate-900
                      transition-colors
                      hover:text-blue-700
                    "
                  >
                    {locale === "fr"
                      ? "Voir le projet"
                      : "View project"}

                    <ArrowUpRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={
                          locale === "fr"
                            ? `Ouvrir ${title}`
                            : `Open ${title}`
                        }
                        className="
                          flex size-9 items-center
                          justify-center rounded-full
                          border border-slate-200
                          text-slate-500
                          transition-all
                          hover:border-slate-300
                          hover:bg-slate-50
                          hover:text-slate-950
                        "
                      >
                        <ExternalLink
                          className="size-4"
                          aria-hidden="true"
                        />
                      </a>
                    )}

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={
                          locale === "fr"
                            ? `Voir le code source de ${title}`
                            : `View source code for ${title}`
                        }
                        className="
                          flex size-9 items-center
                          justify-center rounded-full
                          border border-slate-200
                          text-slate-500
                          transition-all
                          hover:border-slate-300
                          hover:bg-slate-50
                          hover:text-slate-950
                        "
                      >
                        <FaGithub
                          className="size-4"
                          aria-hidden="true"
                        />
                      </a>
                    )}
                  </div>
                </footer>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}