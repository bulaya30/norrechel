"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { FolderOpen } from "lucide-react";

import CategoryNav from "@/features/categories/components/CategoryNav";
import ProjectGrid from "./ProjectGrid";

import type { Project } from "@/features/interfaces/project";
import type { Category } from "@/features/interfaces/category";

type SupportedLocale = "en" | "fr";

interface ProjectsBrowserProps {
  projects: Project[];
  categories: Category[];
  locale: SupportedLocale;
}

export default function ProjectsBrowser({
  projects,
  categories,
  locale,
}: ProjectsBrowserProps) {
  const t = useTranslations("Projects.Browser");

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!selectedCategoryId) {
      return projects;
    }

    return projects.filter(
      (project) => project.categoryId === selectedCategoryId
    );
  }, [projects, selectedCategoryId]);

  const projectCount = filteredProjects.length;

  return (
    <section
      aria-label={t("ariaLabel")}
      className="
        mx-auto max-w-7xl
        px-4 py-8
        sm:px-6 sm:py-14
        lg:px-8 lg:py-16
      "
    >
      <div
        className="
          grid grid-cols-1
          gap-10
          lg:grid-cols-[220px_minmax(0,1fr)]
        "
      >
        <CategoryNav
          categories={categories}
          itemCount={projectCount}
          selectedCategoryId={selectedCategoryId ?? undefined}
          onCategoryChange={setSelectedCategoryId}
        />

        <div className="min-w-0">
          {projectCount > 0 ? (
            <ProjectGrid
              projects={filteredProjects}
              locale={locale}
            />
          ) : (
            <div
              className="
                flex min-h-64 flex-col
                items-center justify-center
                rounded-2xl border border-dashed
                border-slate-300 bg-white px-6 py-12
                text-center
              "
            >
              <span
                className="
                  mb-4 flex size-14 items-center
                  justify-center rounded-2xl
                  bg-slate-100 text-slate-500
                "
              >
                <FolderOpen
                  className="size-7"
                  aria-hidden="true"
                />
              </span>

              <h2 className="text-lg font-semibold text-slate-900">
                {t("emptyTitle")}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                {t("emptyDescription")}
              </p>

              {selectedCategoryId && (
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(null)}
                  className="
                    mt-5 rounded-lg px-4 py-2
                    text-sm font-semibold text-blue-700
                    transition-colors hover:bg-blue-50
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-blue-700
                  "
                >
                  {t("clearFilter")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}