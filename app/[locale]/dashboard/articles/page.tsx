import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import ArticleManager from "@/features/articles/components/dashboard/ArticleManager";

import { getCachedArticles } from "@/features/articles/queries/article.queries";
import { getCachedCategories } from "@/features/categories/queries/category.queries";

type SupportedLocale = "en" | "fr";

interface ArticlesPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function ArticlesPage({
  params,
}: ArticlesPageProps) {
  const { locale } = await params;

  const [articles, categories] = await Promise.all([
      getCachedArticles(),
      getCachedCategories(),
    ]);

  const safeArticles = Array.isArray(articles)
    ? articles.filter(Boolean)
    : [];

  const safeCategories = Array.isArray(categories)
    ? categories.filter(Boolean)
    : [];

  const categoryOptions = safeCategories
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
        title="Articles"
        description={
          locale === "fr"
            ? "Créez, recherchez, filtrez et gérez les articles publiés et les brouillons."
            : "Create, search, filter, and manage your published articles and drafts."
        }
      />

      <ArticleManager
        articles={safeArticles}
        categories={categoryOptions}
        locale={locale}
      />
    </>
  );
}