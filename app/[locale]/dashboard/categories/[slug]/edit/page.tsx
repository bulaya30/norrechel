import ContentNotFound from "@/components/ContentNotFound";
import ContentDeleted from "@/components/ContentDeleted";

import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";

import { getCachedCategoryBySlug } from "@/features/categories/queries/category.queries";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

import EditCategoryForm from "@/features/categories/components/edit/EditCategoryForm";

type SupportedLocale = "en" | "fr";

interface EditCategoryPageProps {
  params: Promise<{
    locale: SupportedLocale;
    slug: string;
  }>;
}

export default async function EditCategoryPage({
    params
}: EditCategoryPageProps) {
    const { locale, slug } = await params;

    const { userId } = await requireAuthenticatedUser();
    const category = await getCachedCategoryBySlug(slug)

    if (!category) {
      return (
        <ContentNotFound
          locale={locale}
          type="article"
        />
      );
    }
    
    if (category.active === false) {
      return (
        <ContentDeleted
          locale={locale}
          type="article"
        />
      );
    }

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
                ? "Modifier la category"
                : "Update category"
            }
            description={"" }
          />
    
          <EditCategoryForm
            locale={locale}
            category={category}
          />
        </>
      );
}