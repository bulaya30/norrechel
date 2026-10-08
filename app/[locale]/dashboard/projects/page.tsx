import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import ProjectManager from "@/features/projects/components/dashboard/ProjectManager";

import { getCachedProjects } from "@/features/projects/queries/project.queries";
import { getCachedCategories } from "@/features/categories/queries/category.queries";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

type SupportedLocale = "en" | "fr";

interface ProjectsPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function ProjectsPage({
  params,
}: ProjectsPageProps) {

  const { locale } = await params;

  const { userId } = await requireAuthenticatedUser();

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
      name: category.name ?? "Unnamed category",
    }));

  return (
    <>
      <DashboardPageHeader
        eyebrow={
          locale === "fr"
            ? "Gestion du contenu"
            : "Content management"
        }
        title={
          locale === "fr"
            ? "Projets"
            : "Projects"
        }
        description={
          locale === "fr"
            ? "Créez, recherchez, filtrez et gérez vos projets publiés et vos brouillons."
            : "Create, search, filter, and manage your published projects and drafts."
        }
      />

      <ProjectManager
        projects={safeProjects}
        categories={categoryOptions}
        locale={locale}
      />
    </>
  );
}