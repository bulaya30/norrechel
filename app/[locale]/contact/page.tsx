import "server-only";

import { getLocale } from "next-intl/server";

import Header from "@/components/header/Header";
import ContactForm from "@/features/contacts/components/ContactForm";
import ContentContactForm, {
  type ContentContactContext,
} from "@/features/contacts/components/ContentContactForm";

import { getCachedPublishedArticles } from "@/features/articles/queries/article.queries";
import { getCachedPublishedProjects } from "@/features/projects/queries/project.queries";

type SupportedLocale = "en" | "fr";
type ContentType = "article" | "project";

interface ContactPageProps {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
}

function getLocalizedValue(
  value: unknown,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const localized = value as Record<string, unknown>;
  const result =
    localized[locale] ?? localized.en ?? localized.fr;

  return typeof result === "string" ? result : "";
}

function getSingleParam(
  value: string | string[] | undefined,
): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const locale = (await getLocale()) as SupportedLocale;
  const params = await searchParams;

  const typeParam = getSingleParam(params.type);
  const contentId = getSingleParam(params.id);

  const contentType: ContentType | undefined =
    typeParam === "article" || typeParam === "project"
      ? typeParam
      : undefined;

  let context: ContentContactContext | null = null;

  if (contentType && contentId) {
    if (contentType === "article") {
      const articles = await getCachedPublishedArticles();

      const article = articles.find(
        (item) => item.id === contentId,
      );

      if (article) {
        const title = getLocalizedValue(
          article.title,
          locale,
        );

        const slug = getLocalizedValue(
          article.slug,
          locale,
        );

        if (title) {
          context = {
            contentType: "article",
            contentId,
            title,
            sourcePage: `/${locale}/blogs/${slug || contentId}`,
          };
        }
      }
    }

    if (contentType === "project") {
      const projects = await getCachedPublishedProjects();

      const project = projects.find(
        (item) => item.id === contentId,
      );

      if (project) {
        const title = getLocalizedValue(
          project.title,
          locale,
        );

        const slug = getLocalizedValue(
          project.slug,
          locale,
        );

        if (title) {
          context = {
            contentType: "project",
            contentId,
            title,
            sourcePage: `/${locale}/projects/${slug || contentId}`,
          };
        }
      }
    }
  }

  return (
    <main
      id="main"
      className="min-h-screen bg-slate-50"
    >
      <div className="container mx-auto px-4 pt-22">
        <Header />

        {context ? (
          <ContentContactForm
            locale={locale}
            context={context}
          />
        ) : (
          <ContactForm locale={locale} />
        )}
      </div>
    </main>
  );
}