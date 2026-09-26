import {
  FolderKanban,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import ProjectCard from "./ProjectCard";

import type { Project } from "@/features/interfaces/project";

type SupportedLocale = "en" | "fr";

interface ProjectListProps {
  projects: Project[];
  locale: SupportedLocale;
}

export default function ProjectList({
  projects,
  locale,
}: ProjectListProps) {
  const safeProjects = Array.isArray(projects)
    ? projects.filter(Boolean)
    : [];

  const labels =
    locale === "fr"
      ? {
          emptyTitle: "Aucun projet trouvé",
          emptyDescription:
            "Commencez par créer votre premier projet ou modifiez vos filtres de recherche.",
          create: "Créer un projet",
        }
      : {
          emptyTitle: "No projects found",
          emptyDescription:
            "Create your first project or adjust the current search and filters.",
          create: "Create project",
        };

  /*
   * -------------------------------------------
   * Empty state
   * -------------------------------------------
   */

  if (safeProjects.length === 0) {
    return (
      <section
        aria-labelledby="empty-projects-heading"
        className="
          rounded-2xl border border-dashed
          border-slate-300 bg-white
          px-6 py-16 text-center
          shadow-sm
        "
      >
        <div
          className="
            mx-auto flex size-14
            items-center justify-center
            rounded-2xl bg-slate-100
            text-slate-500
            ring-1 ring-slate-200
          "
          aria-hidden="true"
        >
          <FolderKanban className="size-6" />
        </div>

        <h2
          id="empty-projects-heading"
          className="
            mt-5 text-xl font-bold
            text-slate-950
          "
        >
          {labels.emptyTitle}
        </h2>

        <p
          className="
            mx-auto mt-2 max-w-md
            text-sm leading-6
            text-slate-600
          "
        >
          {labels.emptyDescription}
        </p>

        <Button
          asChild
          className="
            mt-6 bg-orange-600
            font-semibold text-white
            hover:bg-orange-500
          "
        >
          <Link
            href={`/${locale}/dashboard/projects/new`}
          >
            <Plus
              className="size-4"
              aria-hidden="true"
            />

            {labels.create}
          </Link>
        </Button>
      </section>
    );
  }

  /*
   * -------------------------------------------
   * Project grid
   * -------------------------------------------
   */

  return (
    <section
      aria-labelledby="project-list-heading"
    >
      <h2
        id="project-list-heading"
        className="sr-only"
      >
        {locale === "fr"
          ? "Liste des projets"
          : "Project list"}
      </h2>

      <div
        className="
          grid gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {safeProjects.map((project, index) => (
          <ProjectCard
            key={project.id ?? index}
            project={project}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}