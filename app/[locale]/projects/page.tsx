import Header from "@/components/header/Header";

import ProjectSummary from "@/features/projects/components/Summary";

import { getLocale } from "next-intl/server";

import { getCachedPublishedProjects } from "@/features/projects/queries/project.queries";
import { getCachedCategories } from "@/features/categories/queries/category.queries";

import {
  CodeXml,
  FolderOpen,
} from "lucide-react";

type SupportedLocale = "en" | "fr";

export default async function ProjectsPage() {
  const locale = (await getLocale()) as SupportedLocale;

  const [projects, categories] = await Promise.all([
    getCachedPublishedProjects(),
    getCachedCategories(),
  ]);

  const projectCount = Array.isArray(projects)
    ? projects.length
    : 0;

  return (
    <main
      id="main"
      className="min-h-screen bg-slate-50 text-slate-950"
    >
      <Header />

      <div className="container mx-auto px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <section
          aria-labelledby="projects-page-heading"
          className="mx-auto max-w-6xl"
        >
          {/* Page introduction */}
          <header className="mb-12 max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <span
                className="
                  flex size-10 items-center justify-center
                  rounded-xl bg-blue-50 text-blue-700
                "
              >
                <CodeXml
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                  {locale === "fr"
                    ? "Portfolio de projets"
                    : "Project Portfolio"}
                </p>
              </div>
            </div>

            <h1
              id="projects-page-heading"
              className="
                max-w-3xl
                text-4xl font-bold
                leading-[1.02]
                tracking-[-0.04em]
                text-slate-950
                sm:text-5xl
                lg:text-6xl
              "
            >
              {locale === "fr"
                ? "Projets, systèmes et produits numériques"
                : "Projects, systems and digital products"}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {locale === "fr"
                ? "Une collection de projets conçus pour résoudre des problèmes pratiques et explorer des idées à travers la technologie."
                : "A collection of projects built to solve practical problems and explore ideas through technology."}
            </p>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {locale === "fr"
                ? `${projectCount} projet${projectCount > 1 ? "s" : ""} publié${projectCount > 1 ? "s" : ""}`
                : `${projectCount} published project${projectCount === 1 ? "" : "s"}`}
            </p>
          </header>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            {/* Categories */}
            <aside
              aria-labelledby="project-categories-heading"
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <FolderOpen
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2
                      id="project-categories-heading"
                      className="font-bold text-slate-900"
                    >
                      {locale === "fr"
                        ? "Catégories"
                        : "Categories"}
                    </h2>

                    <p className="text-xs text-slate-500">
                      {locale === "fr"
                        ? "Explorer les projets"
                        : "Browse projects"}
                    </p>
                  </div>
                </div>

                <nav
                  aria-label={
                    locale === "fr"
                      ? "Catégories de projets"
                      : "Project categories"
                  }
                >
                  <ul className="space-y-1.5">
                    <li>
                      <button
                        type="button"
                        className="
                          flex w-full items-center justify-between
                          rounded-lg bg-slate-950 px-4 py-3
                          text-left text-sm font-semibold text-white
                        "
                      >
                        <span>
                          {locale === "fr"
                            ? "Tous les projets"
                            : "All projects"}
                        </span>

                        <span
                          className="
                            rounded-full bg-white/10
                            px-2 py-0.5 text-xs font-bold
                          "
                        >
                          {projectCount}
                        </span>
                      </button>
                    </li>

                    {categories.map((category) => (
                      <li key={category.id}>
                        <button
                          type="button"
                          className="
                            flex w-full items-center
                            rounded-lg px-4 py-3
                            text-left text-sm font-medium
                            text-slate-700
                            transition-colors
                            hover:bg-slate-100
                            hover:text-blue-700
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-blue-600
                            focus-visible:ring-offset-2
                          "
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Projects */}
            <section
              aria-labelledby="published-projects-heading"
              className="min-w-0"
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
                    {locale === "fr"
                      ? "Projets publiés"
                      : "Published Projects"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {locale === "fr"
                      ? "Découvrez les projets et les technologies utilisées."
                      : "Explore the projects and technologies behind them."}
                  </p>
                </div>
              </header>

              <ProjectSummary projects={projects} />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}