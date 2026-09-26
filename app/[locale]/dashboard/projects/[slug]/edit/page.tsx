import ContentNotFound from "@/components/ContentNotFound";
import ContentDeleted from "@/components/ContentDeleted";

import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";

import EditProjectForm from "@/features/projects/components/edit/EditProjectForm";

import { getCachedProjectBySlug } from "@/features/projects/queries/project.queries";
import { getCachedCategories } from "@/features/categories/queries/category.queries";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

type SupportedLocale = "en" | "fr";

interface EditProjectPageProps {
  params: Promise<{
    locale: SupportedLocale;
    slug: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
    const { locale, slug } = await params;
    const { userId } = await requireAuthenticatedUser();
    
    const [project, categories] = await Promise.all([
      getCachedProjectBySlug(slug, locale, userId),
      getCachedCategories(),
    ]);
    
    if (!project) {
      return (
        <ContentNotFound
          locale={locale}
          component="project"
        />
      );
    }

    if (project.active === false) {
        return (
          <ContentDeleted
            locale={locale}
            component="project"
          />
        );
    }

    const categoryOptions = categories
    .filter((category) =>
      Boolean(category.id),
    )
    .map((category) => ({
      id: category.id!,

      name:
        typeof category.name === "string"
          ? category.name
          : category.name ?? "Unnamed category",
    }));

    const projectTitle =
        project.title?.[locale] ??
        project.title?.en ??
        project.title?.fr ??
        "";

    return(
        <>
          <DashboardPageHeader
              eyebrow={
                locale === "fr"
                  ? "Gestion du contenu"
                  : "Content management"
              }
              title={
                locale === "fr"
                  ? "Modifier le project"
                  : "Update project"
              }
              description={
                projectTitle
                  ? locale === "fr"
                    ? `Modifiez « ${projectTitle} ».`
                    : `Update “${projectTitle}”.`
                  : locale === "fr"
                    ? "Modifiez le contenu, la catégorie et l’image de couverture de ce projet."
                    : "Update the content, category, and cover image for this project."
              }
          />

          <EditProjectForm
              locale={locale}
              project={project}
              categories={categoryOptions}
          />
        </>
    )
}