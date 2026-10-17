import { getTranslations } from "next-intl/server";

import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import CreateCategoryForm from "@/features/categories/components/create/CreateCategoryForm";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface NewCategoryPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function NewCategoryPage({
  params,
}: NewCategoryPageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "NewCategoryPage",
  });

  return (
    <>
      <DashboardPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <CreateCategoryForm locale={locale} />
    </>
  );
}