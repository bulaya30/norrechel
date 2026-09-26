import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import CreateProjectForm from "@/features/projects/components/create/CreateProjectForm";

import { getCachedCategories } from "@/features/categories/queries/category.queries";

type SupportedLocale = "en" | "fr";

interface NewProjectPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function NewProjectPage({
  params,
}: NewProjectPageProps) {
     const { locale } = await params;

  const categories = await getCachedCategories();

  const categoryOptions = categories
    .filter((category) => category.id)
    .map((category) => ({
      id: category.id!,
      name:
        category.name ??
        "Unnamed category",
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
                    ? "Nouveau projet"
                    : "New project"
                }
                description={
                locale === "fr"
                    ? "Rédigez, configurez et publiez un nouveau projet."
                    : "Write, configure, and publish a new project."
                }
            />

            <CreateProjectForm
                locale={locale}
                categories={categoryOptions}
            />
        </>
    )
}