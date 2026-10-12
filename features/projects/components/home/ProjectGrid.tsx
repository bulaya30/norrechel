"use client";

import { useTranslations } from "next-intl";

import ProjectSummary from "../Summary";

import type { Project } from "@/features/interfaces/project";

interface ProjectGridProps {
  projects: Project[];
  locale: "en" | "fr";
}

export default function ProjectGrid({
  projects,
  locale,
}: ProjectGridProps) {
  const t = useTranslations("Projects.Grid");

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="published-projects-heading"
      className="min-w-0"
      lang={locale}
    >
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2
            id="published-projects-heading"
            className="
              text-2xl font-bold
              tracking-[-0.025em]
              text-slate-950
            "
          >
            {t("title")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("description")}
          </p>
        </div>
      </header>

      <ProjectSummary projects={projects} />
    </section>
  );
}