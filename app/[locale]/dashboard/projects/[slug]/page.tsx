import type { Metadata } from "next";

import ContentNotFound from "@/components/ContentNotFound";
import ContentDeleted from "@/components/ContentDeleted";

import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";
import ProjectHeader from "@/features/projects/components/ProjectHeader";
import ProjectMeta from "@/features/projects/components/ProjectMeta";
import ProjectContent from "@/features/projects/components/ProjectContent";

import { getAuthenticatedUser } from "@/features/auth/lib/getAuthenticatedUser";
import { getCachedProjectBySlug } from "@/features/projects/queries/project.queries";

import { normalizeDate } from "@/lib/dates/utils";

import type { Lang } from "@/features/interfaces/project";
type SupportedLocale = "en" | "fr";

interface ProjectPageProps {
  params: Promise<{
    locale: SupportedLocale;
    slug: string;
  }>;
}

function getLocalizedValue(
  value: Lang | null | undefined,
  locale: SupportedLocale,
): string {
  if (!value) {
    return "";
  }

  return (
    value[locale] ??
    value.en ??
    value.fr ??
    ""
  );
}

function calculateReadingTime(text: string): number {
  const plainText = text
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
}: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const user = await getAuthenticatedUser();

  const project = await getCachedProjectBySlug(
    slug,
    locale,
    user?.userId ?? null,
  );

  if (!project) {
    return {
      title:
        locale === "fr"
          ? "Projet introuvable"
          : "Project not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getLocalizedValue(
    project.title,
    locale,
  );

  const content = getLocalizedValue(
    project.content,
    locale,
  );

  const imageUrl =
    typeof project.cover_image === "string"
      ? project.cover_image
      : undefined;

  return {
    title,

    description:
      content ||
      (locale === "fr"
        ? `Découvrir ${title}`
        : `Explore ${title}`),

    alternates: {
      canonical: `/${locale}/projects/${slug}`,
    },

    openGraph: {
      type: "website",
      title,
      description: content,
      url: `/${locale}/projects/${slug}`,
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

  const user = await getAuthenticatedUser();

  const project = await getCachedProjectBySlug(
    slug,
    locale,
    user?.userId ?? null,
  );

  if (!project) {
    return (
      <ContentNotFound
        locale={locale}
        component="project"
      />
    );
  }

  if (project.active === false) {
    return (
      <ContentDeleted
        locale={locale}
        component="project"
      />
    );
  }

  const title = getLocalizedValue(
    project.title,
    locale,
  );

  const content = getLocalizedValue(
    project.content,
    locale,
  );

 const details = getLocalizedValue(
    project.details,
    locale,
  );

  const category =
  typeof project.category === "string"
    ? project.category
    : project.category?.name ?? "";

  const publishedAt =
    normalizeDate(
      project.publishedAt ??
        project.createdAt,
    ) ?? new Date().toISOString();

  const readingTime = calculateReadingTime(
    content || details,
  );

  const authorId = project.author?.id;

  const imageUrl =
    typeof project.cover_image === "string"
      ? project.cover_image
      : undefined;

  const projectTitle =
    project.title?.[locale] ??
    project.title?.en ??
    project.title?.fr ??
    "";

  return (
    <>
      <DashboardPageHeader
        eyebrow={
          locale === "fr"
            ? "Gestion des projets"
            : "Project management"
        }
        title={
          locale === "fr"
            ? "Modifier le projet"
            : "Update project"
        }
        description={
          projectTitle
            ? locale === "fr"
              ? `Modifiez « ${projectTitle} ».`
              : `Update “${projectTitle}”.`
            : locale === "fr"
              ? "Modifiez les informations, le contenu et les détails de ce projet."
              : "Update the information, content, and details for this project."
        }
      />
      <div className="container mx-auto px-4 pb-20 pt-24">
        <div className="mx-auto max-w-4xl">

          <ProjectHeader
            title={title}
            category={category}
            excerpt={details}
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
            readingTime={readingTime}
            locale={locale}
            status={project.status}
          />

          <div className="space-y-8">

            

            <div>
              <p className="mb-2 text-sm font-medium text-orange-600">
                {category}
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {title}
              </h1>
            </div>

            {details && (
              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-950">
                  {locale === "fr"
                    ? "Détails du projet"
                    : "Project details"}
                </h2>

                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: details,
                  }}
                />
              </section>
            )}

            <ProjectContent content={content} />

            {Array.isArray(project.tech_stack) &&
              project.tech_stack.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-xl font-semibold text-slate-950">
                    {locale === "fr"
                      ? "Technologies"
                      : "Technology stack"}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </section>
              )}

            <div className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {locale === "fr"
                    ? "Publié"
                    : "Published"}
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {new Date(publishedAt).toLocaleDateString(
                    locale,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

            </div>

            {project.live_url && (
              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  {locale === "fr"
                    ? "Voir le projet"
                    : "View project"}
                </a>

                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}