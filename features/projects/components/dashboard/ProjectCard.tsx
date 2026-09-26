
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


import {
  CalendarDays,
  Eye,
  SquareArrowOutUpRight
} from "lucide-react";

import { 
  FaGithub
} from "react-icons/fa";

import ProjectActions  from "@/components/actions/ComponentActions"

import type { Project } from "@/features/interfaces/project";
import ComponentActions from "@/components/actions/ComponentActions";

type SupportedLocale = "en" | "fr";

type LocalizedValue ={
  en: string,
  fr: string
}

interface ProjectCardProps {
  project: Project;
  locale: SupportedLocale;
}

function getLocalizedValue(
  value: {
    en: string;
    fr: string;
  },
  locale: SupportedLocale,
): string {
  return value[locale];
}

function getProjectDate(
  project: Project,
): Date | null {
  const value =
    project.publishedAt ??
    project.createdAt ??
    project.updatedAt ??
    project.date;

  if (!value) {
    return null;
  }

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate();
  }

  if (
    typeof value === "object" &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    return new Date(value.toMillis());
  }

  if (
    typeof value === "object" &&
    "_seconds" in value &&
    typeof value._seconds === "number"
  ) {
    return new Date(value._seconds * 1000);
  }

  if (
    typeof value === "object" &&
    "seconds" in value &&
    typeof value.seconds === "number"
  ) {
    return new Date(value.seconds * 1000);
  }

  const date = new Date(
    value as unknown as string,
  );

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatProjectDate(
  project: Project,
  locale: SupportedLocale,
): string {
  const date = getProjectDate(project);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

export default function ProjectCard({
  project,
  locale,
}: ProjectCardProps) {
  const title = getLocalizedValue(
    project.title,
    locale,
  );

  const categoryName = project.category?.name ?? "";

  const technologies =
    Array.isArray(project.tech_stack)
      ? project.tech_stack.slice(0, 4)
      : [];

  const viewCount = Array.isArray(project.views) 
    ? project.views.length
    : 0;

  const formattedDate = formatProjectDate(
    project,
    locale,
  );

  const slug = getLocalizedValue(
    project.slug as LocalizedValue,
    locale,
  );

  const publishedDate =
    project.publishedAt ??
    project.createdAt;

  const liveUrl = project.live_url ?? null;
  const githubUrl = project.github_url ?? null;

  const projectHref = slug
    ? `/${locale}/dashboard/articles/${slug}`
    : "#";

  const labels =
    locale === "fr"
      ? {
          published: "Publié",
          publishedOn: "Publié le",
          draft: "Brouillon",
          views: "vues",
          edit: "Modifier",
          viewProject: "Voir le projet",
          live: "Voir en ligne",
          github: "Voir le code",
          more: "Plus d'actions",
        }
      : {
          published: "Published",
          publishedOn: "Published",
          draft: "Draft",
          views: "views",
          viewProject: "View project",
          edit: "Edit",
          live: "View project",
          github: "View code",
          more: "More actions",
        };

  return (
    <article
      className="
        group overflow-hidden
        rounded-2xl border border-slate-200
        bg-white shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {/* Cover image */}
      <div
        className="
          relative aspect-[16/9]
          overflow-hidden
          bg-slate-100
        "
      >
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={title}
            fill
            sizes="
              (max-width: 768px) 100vw,
              (max-width: 1280px) 50vw,
              33vw
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
              flex h-full w-full
              items-center justify-center
              bg-slate-100
              text-sm text-slate-400
            "
          >
            <span
              className="
                text-sm font-medium
                text-slate-400
              "
            >
              {locale === "fr"
              ? "Aucune image"
              : "No cover image"}
            </span>
          </div>
        )}

        {/* Status */}
        <div className="absolute left-4 top-4">
          <Badge
            variant="secondary"
            className={
              project.status === 'published'
                ? `
                    border border-emerald-200
                    bg-emerald-50
                    text-emerald-700
                  `
                : `
                    border border-amber-200
                    bg-amber-50
                    text-amber-700
                  `
            }
          >
            {project.status === 'draft'
              ? labels.published
              : labels.draft}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        {categoryName && (
          <p
            className="
              text-xs font-semibold
              uppercase tracking-[0.12em]
              text-orange-600
            "
          >
            {categoryName}
          </p>
        )}

        {/* Title */}
        <h3
          className="
            mt-2 line-clamp-2
            text-lg font-bold
            tracking-tight
            text-slate-950
          "
        >
          {title}
        </h3>

        
        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="
                  rounded-md
                  bg-slate-100
                  px-2 py-1
                  text-[11px]
                  font-medium
                  text-slate-600
                "
              >
                {technology}
              </span>
            ))}

            {project.tech_stack.length >
              technologies.length && (
              <span
                className="
                  rounded-md
                  bg-slate-100
                  px-2 py-1
                  text-[11px]
                  font-medium
                  text-slate-500
                "
              >
                +{project.tech_stack.length - technologies.length}
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div
          className="
            mt-5 flex items-center
            justify-between gap-3
            border-t border-slate-100
            pt-4
            text-xs text-slate-500
          "
        >
          <div className="flex items-center gap-1.5">
            <Eye
              className="size-3.5"
              aria-hidden="true"
            />

            <span>
              {viewCount.toLocaleString()}{" "}
              {labels.views}
            </span>
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDays
                className="size-3.5"
                aria-hidden="true"
              />

              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer
          className="
            mt-4 flex flex-wrap
            items-center justify-between
            gap-3
          "
        >
          {slug && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="
                text-blue-700
                hover:bg-blue-50
                hover:text-blue-900
              "
            >
              <Link href={projectHref}>
                {labels.viewProject}
              </Link>
            </Button>
          )}
          {githubUrl && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="
                text-blue-700
                hover:bg-blue-50
                hover:text-blue-900
              "
            >
              <Link href={githubUrl}>
                <FaGithub
                  size="sm"
                />
              </Link>
            </Button>
            
          )}
          {liveUrl && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="
                text-blue-700
                hover:bg-blue-50
                hover:text-blue-900
              "
            >
              <Link href={liveUrl}>
                <SquareArrowOutUpRight
                  size="sm"
                />
              </Link>
            </Button>
            
          )}
        </footer>

        {/* Actions */}
        {project.id && (
          <div
              className="
              mt-4 border-t border-slate-100
              pt-4
              "
          >
            <ComponentActions
              itemId={project.id}
              slug={project.slug}
              component={"projects"}
              active={project.active ?? false}
              locale={locale}
            />
          </div>
        )}
      </div>
    </article>
  );
}