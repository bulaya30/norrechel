import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Header from "@/components/header/Header";
import ArticleHeader from "@/features/articles/components/ArticleHeader";
import ArticleMeta from "@/features/articles/components/ArticleMeta";
import ArticleContent from "@/features/articles/components/ArticleContent";
import AuthorCard from "@/features/articles/components/AuthorCard";
import ArticleCTA from "@/features/articles/components/ArticleCTA";

import ContentViewTracker from "@/features/views/components/ContentViewTracker";
import ContentEngagementTracker from "@/features/engagements/components/ContentEngagementTracker";

import { getCachedArticleBySlug } from "@/features/articles/queries/article.queries";
import { normalizeDate } from "@/lib/dates/utils";
import { getAuthenticatedUser } from "@/features/auth/lib/getAuthenticatedUser";

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

function createMetaDescription(
  html: string,
  fallback: string,
): string {
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.slice(0, 160) || fallback;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Blogs.ArticlePage",
  });

  const article = await getCachedArticleBySlug(
    slug,
    locale,
    null,
  );

  if (!article) {
    return {
      title: t("notFoundTitle"),
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

  const content = getLocalizedValue(
    article.content as LocalizedValue,
    locale,
  );

  const description = createMetaDescription(
    content,
    t("metaDescription", { title }),
  );

  const imageUrl =
    typeof article.cover_image === "string"
      ? article.cover_image
      : undefined;

  const canonical = `/${locale}/blogs/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
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

  const t = await getTranslations({
    locale,
    namespace: "Blogs.ArticlePage",
  });

  const user = await getAuthenticatedUser();
  const uid = user?.userId ?? null;

  const article = await getCachedArticleBySlug(
    slug,
    locale,
    uid,
  );

  if (!article) {
    return (
      <main id="main" className="min-h-screen">
        <Header />

        <div className="container mx-auto px-4 pb-20 pt-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {t("notFoundTitle")}
            </h1>

            <p className="mt-3 text-slate-600">
              {t("notFoundDescription")}
            </p>
          </div>
        </div>
      </main>
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

  const category =
    typeof article.category === "string"
      ? article.category
      : getLocalizedValue(
          article.category?.name as LocalizedValue,
          locale,
        );

  const authorBio = getLocalizedValue(
    article.author?.title as LocalizedValue,
    locale,
  );

  const publishedAt =
    normalizeDate(
      article.publishedAt ?? article.createdAt,
    ) ?? new Date().toISOString();

  const readingTime = calculateReadingTime(content);

  const authorId = article.author?.id;

  const imageUrl =
    typeof article.cover_image === "string"
      ? article.cover_image
      : undefined;

  return (
    <main id="main" className="min-h-screen">
      <Header />

      <ContentViewTracker
        contentId={article.id}
        contentType="article"
        slug={slug}
      />

      <ContentEngagementTracker
        contentId={article.id}
        contentType="article"
      />

      <div className="container mx-auto px-4 pb-20 pt-24">
        <div className="mx-auto max-w-4xl">
          <ArticleHeader
            title={title}
            category={category}
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
            locale={locale}
          />

          <ArticleCTA
            title={t("ctaTitle")}
            description={t("ctaDescription")}
            buttonLabel={t("ctaButton")}
            href={`/${locale}/contact`}
          />
        </div>
      </div>
    </main>
  );
}