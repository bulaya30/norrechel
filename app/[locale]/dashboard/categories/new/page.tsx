import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import CreateCategoryForm from "@/features/categories/components/create/CreateCategoryForm";

type SupportedLocale = "en" | "fr";

interface NewCategoryPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function NewCategoryPage({
    params,
}: NewCategoryPageProps)  {
    const { locale } = await params;
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
                    ? "Nouveau category"
                    : "New category"
                }
                description={""}
            />
            <CreateCategoryForm
                locale={locale}
            />
        </>
    )
}