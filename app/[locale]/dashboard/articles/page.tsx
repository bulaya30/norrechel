import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations({
    locale,
    namespace: "DashboardArticles",
  });

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
      name: category.name ?? t("unnamedCategory"),
    }));

  return (
    <>
      <DashboardPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <ArticleManager
        articles={safeArticles}
        categories={categoryOptions}
        locale={locale}
      />
    </>
  );
}