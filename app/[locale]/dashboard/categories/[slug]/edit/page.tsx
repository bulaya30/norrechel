import { getTranslations } from "next-intl/server";

import ContentNotFound from "@/components/ContentNotFound";
import ContentDeleted from "@/components/ContentDeleted";

import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import { getCachedCategoryBySlug } from "@/features/categories/queries/category.queries";
import EditCategoryForm from "@/features/categories/components/edit/EditCategoryForm";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface EditCategoryPageProps {
  params: Promise<{
    locale: SupportedLocale;
    slug: string;
  }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { locale, slug } = await params;

  const t = await getTranslations({
    locale,
    namespace: "EditCategoryPage",
  });

  const category = await getCachedCategoryBySlug(slug);

  if (!category) {
    return <ContentNotFound locale={locale} component="article" />;
  }

  if (category.active === false) {
    return <ContentDeleted locale={locale} component="article" />;
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <EditCategoryForm locale={locale} category={category} />
    </>
  );
}