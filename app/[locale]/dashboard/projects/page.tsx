import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import ProjectManager from "@/features/projects/components/dashboard/ProjectManager";

import { getCachedProjects } from "@/features/projects/queries/project.queries";
import { getCachedCategories } from "@/features/categories/queries/category.queries";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";
import type { SupportedLocale } from "@/lib/dates/localizedValue";
import { getTranslations } from "next-intl/server";

interface ProjectsPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function ProjectsPage({
  params,
}: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ProjectsPage",
  });

  await requireAuthenticatedUser();

  const [projects, categories] = await Promise.all([
    getCachedProjects(),
    getCachedCategories(),
  ]);

  const safeProjects = Array.isArray(projects)
    ? projects.filter(Boolean)
    : [];

  const safeCategories = Array.isArray(categories)
    ? categories.filter(Boolean)
    : [];

  const categoryOptions = safeCategories
    .filter((category) => category.id)
    .map((category) => ({
      id: category.id!,
      name: category.name ?? t("unnamedCategory"),
    }));

  return (
    <>
      <DashboardPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <ProjectManager
        projects={safeProjects}
        categories={categoryOptions}
        locale={locale}
      />
    </>
  );
}