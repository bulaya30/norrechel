import type { Metadata } from "next";
import type { Lang } from "@/features/interfaces/article";
import { getTranslations } from "next-intl/server";

import Header from "@/components/header/Header";

import ProjectHeader from "@/features/projects/components/ProjectHeader";
import ProjectMeta from "@/features/projects/components/ProjectMeta";
import ProjectContent from "@/features/projects/components/ProjectContent";
import AuthorCard from "@/features/articles/components/AuthorCard";

import ContentViewTracker from "@/features/views/components/ContentViewTracker";
import ContentEngagementTracker from "@/features/engagements/components/ContentEngagementTracker";

import { getCachedProjectBySlug } from "@/features/projects/queries/project.queries";
import { normalizeDate } from "@/lib/dates/utils";
import { getAuthenticatedUser } from "@/features/auth/lib/getAuthenticatedUser";

type SupportedLocale = "en" | "fr";

interface ProjectPageProps {
  params: Promise<{
    locale: SupportedLocale;
    slug: string;
  }>;
}

type LocalizedValue = string | Lang | null | undefined;

function getLocalizedValue(
  value: LocalizedValue,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value) {
    return "";
  }

  return value[locale] ?? value.en ?? value.fr ?? "";
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
}: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Projects.ProjectPage",
  });

  const project = await getCachedProjectBySlug(
    slug,
    locale,
    null,
  );

  if (!project) {
    return {
      title: t("notFoundTitle"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getLocalizedValue(project.title, locale);

  const content = getLocalizedValue(
    project.details,
    locale,
  );

  const description = createMetaDescription(
    content,
    t("metaDescription", { title }),
  );

  const imageUrl =
    typeof project.cover_image === "string"
      ? project.cover_image
      : undefined;

  const canonical = `/${locale}/projects/${slug}`;

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

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { locale, slug } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Projects.ProjectPage",
  });

  const user = await getAuthenticatedUser();
  const uid = user?.userId ?? null;

  const project = await getCachedProjectBySlug(
    slug,
    locale,
    uid,
  );

  if (!project) {
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

  const title = getLocalizedValue(project.title, locale);

  const content = getLocalizedValue(
    project.content,
    locale,
  );

  const category =
    typeof project.category === "string"
      ? project.category
      : getLocalizedValue(
          project.category?.name,
          locale,
        );

  const authorBio = getLocalizedValue(
    project.author?.title,
    locale,
  );

  const publishedAt =
    normalizeDate(
      project.publishedAt ?? project.createdAt,
    ) ?? new Date().toISOString();

  const authorId = project.author?.id;

  const imageUrl =
    typeof project.cover_image === "string"
      ? project.cover_image
      : undefined;

  return (
    <main id="main" className="min-h-screen">
      <Header />

      <ContentViewTracker
        contentId={project.id}
        contentType="project"
        slug={slug}
      />

      <ContentEngagementTracker
        contentId={project.id}
        contentType="project"
      />

      <div className="container mx-auto px-4 pb-20 pt-24">
        <div className="mx-auto max-w-4xl">
          <ProjectHeader
            title={title}
            category={category}
            imageUrl={imageUrl}
            imageAlt={title}
          />

          <ProjectMeta
            author={{
              id: authorId,
              firstName: project.author?.firstName,
              lastName: project.author?.lastName,
            }}
            publishedAt={publishedAt}
            locale={locale}
          />

          <ProjectContent content={content} />

          <AuthorCard
            id={authorId}
            firstName={project.author?.firstName}
            lastName={project.author?.lastName}
            bio={authorBio}
            imageUrl={project.author?.photo}
            locale={locale}
          />
        </div>
      </div>
    </main>
  );
}