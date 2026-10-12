import Header from "@/components/header/Header";
import ProjectHero from "@/features/projects/components/home/ProjectsHero";
import ProjectsBrowser from "@/features/projects/components/home/ProjectsBrowser";

import { getLocale } from "next-intl/server";

import { getCachedPublishedProjects } from "@/features/projects/queries/project.queries";
import { getCachedCategories } from "@/features/categories/queries/category.queries";

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

      <ProjectHero
        projectCount={projectCount}
        categoryCount={categories.length}
      />

      <div className="container mx-auto px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <section
          aria-labelledby="projects-page-heading"
          className="mx-auto max-w-6xl"
        >
          <ProjectsBrowser
            projects={projects}
            categories={categories}
            locale={locale}
          />
        </section>
      </div>
    </main>
  );
}