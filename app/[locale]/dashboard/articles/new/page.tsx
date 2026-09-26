import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import CreateArticleForm from "@/features/articles/components/create/CreateArticleForm";

import { getCachedCategories } from "@/features/categories/queries/category.queries";

type SupportedLocale = "en" | "fr";

interface NewArticlePageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function NewArticlePage({
  params,
}: NewArticlePageProps) {
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
            ? "Nouvel article"
            : "New article"
        }
        description={
          locale === "fr"
            ? "Rédigez, configurez et publiez un nouvel article."
            : "Write, configure, and publish a new article."
        }
      />

      <CreateArticleForm
        locale={locale}
        categories={categoryOptions}
      />
    </>
  );
}