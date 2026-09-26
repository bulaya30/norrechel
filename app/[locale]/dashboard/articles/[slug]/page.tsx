import type { Metadata } from "next";
import ContentNotFound from "@/components/ContentNotFound";
import ContentDeleted from "@/components/ContentDeleted";

import ArticleHeader from "@/features/articles/components/ArticleHeader";
import ArticleMeta from "@/features/articles/components/ArticleMeta";
import ArticleContent from "@/features/articles/components/ArticleContent";
import AuthorCard from "@/features/articles/components/AuthorCard";
import ArticleCTA from "@/features/articles/components/ArticleCTA";
import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

import { getCachedArticleBySlug } from "@/features/articles/queries/article.queries";
import { normalizeDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface ArticlePageProps {
  params: Promise<{
    locale: SupportedLocale;
    slug: string;
  }>;
}

type LocalizedValue =
  | string
  | Record<string, string>
  | null
  | undefined;

function getLocalizedValue(
  value: LocalizedValue,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return (
    value[locale] ??
    value.en ??
    value.fr ??
    Object.values(value)[0] ??
    ""
  );
}

function calculateReadingTime(html: string): number {
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 1;
  }

  const wordCount = plainText.split(" ").length;

  return Math.max(1, Math.ceil(wordCount / 200));
}



export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const article = await getCachedArticleBySlug(slug, locale);

  if (!article) {
    return {
      title:
        locale === "fr"
          ? "Article introuvable"
          : "Article not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getLocalizedValue(
    article.title as LocalizedValue,
    locale,
  );

  const description = getLocalizedValue(
    article.content as LocalizedValue,
    locale,
  );

  const imageUrl = typeof article.cover_image === "string"
      ? article.cover_image
      : undefined;

  return {
    title,
    description:
      description ||
      (locale === "fr"
        ? `Lire ${title}`
        : `Read ${title}`),

    alternates: {
      canonical: `/${locale}/blogs/${slug}`,
    },

    openGraph: {
      type: "article",
      title,
      description,
      url: `/${locale}/blogs/${slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
    const { locale, slug } = await params;

    const { userId } = await requireAuthenticatedUser();
    console.log(slug)

    const article = await getCachedArticleBySlug(slug, locale, userId);

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

    const title = getLocalizedValue(
        article.title as LocalizedValue,
        locale,
    );

    const content = getLocalizedValue(
        article.content as LocalizedValue,
        locale,
    );

  
  const category = typeof article.category === "string"
      ? article.category
      : getLocalizedValue(
          article.category?.name as LocalizedValue,
          locale,
        );

  const authorBio = getLocalizedValue(
    article.author as LocalizedValue,
    locale,
  );

  const publishedAt = normalizeDate(
      article.publishedAt ??
        article.createdAt,
    ) ?? new Date().toISOString();

  const readingTime = calculateReadingTime(content);

  const authorId = article.author?.id ;

  const imageUrl = typeof article.cover_image === "string"
      ? article.cover_image
      : undefined;

    const articleTitle = article.title?.[locale] ??
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
      <div className="container mx-auto px-4 pb-20 pt-24">
        <div className="mx-auto max-w-4xl">
          <ArticleHeader
            title={title}
            category={category}
            // excerpt={content}
            imageUrl={imageUrl}
            imageAlt={title}
          />

          <ArticleMeta
            author={{
              id: authorId,
              firstName: article.author?.firstName,
              lastName: article.author?.lastName,
            }}
            publishedAt={publishedAt}
            readingTime={readingTime}
            locale={locale}
          />

          <ArticleContent content={content} />

          <AuthorCard
            id={authorId}
            firstName={article.author?.firstName}
            lastName={article.author?.lastName}
            bio={authorBio}
            imageUrl={article.author?.photo}
            role={article.author?.role}
            locale={locale}
          />

          <ArticleCTA
            title={
              locale === "fr"
                ? "Cet article vous a intéressé ?"
                : "Interested in this article?"
            }
            description={
              locale === "fr"
                ? "Collaborons pour construire une solution pratique et utile."
                : "Let’s work together to build something practical and meaningful."
            }
            buttonLabel={
              locale === "fr"
                ? "Collaborons"
                : "Let’s Collaborate"
            }
            href={`/${locale}/contact`}
          />
          
        </div>
      </div>
    </>
  );
}