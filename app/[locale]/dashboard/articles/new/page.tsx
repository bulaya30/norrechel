
import { getTranslations } from "next-intl/server";

import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import CreateArticleForm from "@/features/articles/components/create/CreateArticleForm";

import { getCachedCategories } from "@/features/categories/queries/category.queries";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface NewArticlePageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function NewArticlePage({
  params,
}: NewArticlePageProps) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "NewArticlePage",
  });

  const categories = await getCachedCategories();

  const categoryOptions = categories
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

      <CreateArticleForm
        locale={locale}
        categories={categoryOptions}
      />
    </>
  );
}
