import Link from "next/link";
import { ArrowRight, CodeXml } from "lucide-react";

import type { Project } from "@/features/interfaces/project";
import ProjectPreviewCard from "./ProjectPreviewCard";

type SupportedLocale = "en" | "fr";

interface SelectedProjectsProps {
  projects: Project[];
  locale: SupportedLocale;
}

function getLocalizedValue(
  value: Project["title"] | Project["slug"] | Project["details"],
  locale: SupportedLocale,
): string {
  return value?.[locale] ?? value?.en ?? value?.fr ?? "";
}

function getLocalizedCategoryName(
  category: Project["category"],
  locale: SupportedLocale,
): string | undefined {
  if (!category?.name) {
    return undefined;
  }

  return (
    category.name ?? undefined
  );
}

export default function SelectedProjects({
  projects,
  locale,
}: SelectedProjectsProps) {
  const visibleProjects = projects.slice(0, 3);

  return (
    <section
      aria-labelledby="selected-projects-heading"
      className="
        border-t border-slate-200
        bg-slate-50/70
        px-4 py-10
        sm:px-6 sm:py-8
        lg:px-8 lg:py-10      
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <header
          className="
            mb-5
            flex flex-col gap-5
            sm:mb-12
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="
                  flex size-9 items-center justify-center
                  rounded-lg
                  bg-orange-50
                  text-orange-600
                "
              >
                <CodeXml className="size-4" />
              </span>

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-600">
                Selected work
              </p>
            </div>

            <h2
              id="selected-projects-heading"
              className="
                text-3xl font-bold
                tracking-[-0.03em]
                text-slate-950
                sm:text-4xl
              "
            >
              Projects built to solve problems.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              A selection of applications and digital solutions built around
              practical needs, real-world challenges, and meaningful outcomes.
            </p>
          </div>

          {/* View all */}
          <Link
            href={`/${locale}/projects`}
            className="
              group inline-flex shrink-0
              items-center gap-2
              self-start
              text-sm font-semibold
              text-slate-900
              transition-colors
              hover:text-orange-600
              sm:self-auto
            "
          >
            View all projects

            <ArrowRight
              className="
                size-4
                transition-transform duration-200
                group-hover:translate-x-1
              "
              aria-hidden="true"
            />
          </Link>
        </header>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}
        {visibleProjects.length === 0 ? (
          <div
            className="
              flex min-h-56
              items-center justify-center
              rounded-2xl
              border border-dashed border-slate-300
              bg-white
              px-6 py-12
              text-center
            "
          >
            <div>
              <CodeXml
                className="mx-auto size-8 text-slate-400"
                aria-hidden="true"
              />

              <p className="mt-4 text-sm font-semibold text-slate-700">
                {locale === "fr"
                  ? "Aucun projet publié pour le moment."
                  : "No projects published yet."}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {locale === "fr"
                  ? "De nouveaux projets seront bientôt disponibles."
                  : "New projects will appear here when they are published."}
              </p>
            </div>
          </div>
        ) : (
          /* ===================================================
             PROJECT GRID
          =================================================== */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => {
              const title = getLocalizedValue(
                project.title,
                locale,
              );

              const slug = getLocalizedValue(
                project.slug,
                locale,
              );

              const description = getLocalizedValue(
                project.details,
                locale,
              );

              const category = getLocalizedCategoryName(
                project.category,
                locale,
              );

              return (
                <ProjectPreviewCard
                  key={project.id}
                  title={title}
                  href={`/${locale}/projects/${slug}`}
                  coverImage={project.cover_image}
                  description={description}
                  technologies={project.tech_stack}
                  category={category}
                  liveUrl={project.live_url}
                  githubUrl={project.github_url}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}