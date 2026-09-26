import "server-only";

import { getCachedCategories } from "@/features/categories/queries/category.queries";
import { getCachedArticlesByCategory } from "@/features/articles/queries/article.queries";
import { getCachedProjectsByCategory } from "@/features/projects/queries/project.queries";

import type { CategoryDashboardItem } from "@/features/interfaces/category";
import CategoryManager from "@/features/categories/components/dashboard/CategoryManager";

type SupportedLocale = "en" | "fr";

interface CategoriesPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function CategoriesPage({
  params,
}: CategoriesPageProps) {
  const { locale } = await params;

  const categories = await getCachedCategories();

  const categoriesWithContent: CategoryDashboardItem[] =
    await Promise.all(
        categories.map(async (category) => {
          if (!category.id) {
            return {
              category,
              articles: [],
              projects: [],
            };
          }
          
          const [articles, projects] = await Promise.all([
            getCachedArticlesByCategory(category.id),
            getCachedProjectsByCategory(category.id),
          ]);
          
          console.log(articles)
        return {
            category,
            articles,
            projects,
        };
        })
    );

    // console.log(categoriesWithContent)

  return (
    <CategoryManager
      categories={categoriesWithContent}
      locale={locale}
    />
  );
}