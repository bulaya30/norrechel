import ContentNotFound from "@/components/ContentNotFound";
import ContentDeleted from "@/components/ContentDeleted";

import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import EditArticleForm from "@/features/articles/components/edit/EditArticleForm";

import { getCachedArticleById, getCachedArticleBySlug } from "@/features/articles/queries/article.queries";
import { getCachedCategories } from "@/features/categories/queries/category.queries";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

type SupportedLocale = "en" | "fr";

interface EditArticlePageProps {
  params: Promise<{
    locale: SupportedLocale;
    slug: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { locale, slug } = await params;

  const { userId } = await requireAuthenticatedUser();

  const [article, categories] = await Promise.all([
    getCachedArticleBySlug(slug, locale, userId),
    getCachedCategories(),
  ]);

  if (!article) {
    return (
      <ContentNotFound
        locale={locale}
        type="article"
      />
    );
  }

  if (article.active === false) {
    return (
      <ContentDeleted
        locale={locale}
        type="article"
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

  const articleTitle =
    article.title?.[locale] ??
    article.title?.en ??
    article.title?.fr ??
    "";

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
            ? "Modifier l’article"
            : "Update article"
        }
        description={
          articleTitle
            ? locale === "fr"
              ? `Modifiez « ${articleTitle} ».`
              : `Update “${articleTitle}”.`
            : locale === "fr"
              ? "Modifiez le contenu, la catégorie et l’image de couverture de cet article."
              : "Update the content, category, and cover image for this article."
        }
      />

      <EditArticleForm
        locale={locale}
        article={article}
        categories={categoryOptions}
      />
    </>
  );
}