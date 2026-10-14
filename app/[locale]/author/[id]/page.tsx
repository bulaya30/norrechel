
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import Header from "@/components/header/Header";

import AuthorHero from "@/features/authors/components/AuthorHero";
import AuthorStats from "@/features/authors/components/AuthorStats";
import AuthorTabs from "@/features/authors/components/AuthorTabs";
import AuthorArticles from "@/features/authors/components/AuthorArticles";
import AuthorProjects from "@/features/authors/components/AuthorProjects";
import AuthorAbout from "@/features/authors/components/AuthorAbout";

import { getCachedUserById } from "@/features/users/queries/user.queries";
import { getCachedArticlesByAuthor } from "@/features/articles/queries/article.queries";
import { getCachedViewsByContent } from "@/features/views/queries/view.queries";
import { getCachedProjectsByAuthor } from "@/features/projects/queries/project.queries";
import { getCachedSubscribers } from "@/features/subscribers/queries/subscriber.queries";

type SupportedLocale = "en" | "fr";

interface AuthorPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

type LocalizedValue =
  | string
  | Record<string, string>
  | null
  | undefined;

function isSupportedLocale(
  locale: string,
): locale is SupportedLocale {
  return locale === "en" || locale === "fr";
}

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

function formatNumber(
  value: number,
  locale: SupportedLocale,
): string {
  return new Intl.NumberFormat(locale, {
    notation: value >= 1_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;

  if (!isSupportedLocale(rawLocale)) {
    return {
      title: "Author not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const locale = rawLocale;

  const t = await getTranslations({
    locale,
    namespace: "Authors.Page",
  });

  const authorResult = await getCachedUserById(id);

  const author = Array.isArray(authorResult)
    ? authorResult[0]
    : authorResult;

  if (!author) {
    return {
      title: t("notFoundTitle"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const fullName = [
    author.firstName,
    author.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const description =
    getLocalizedValue(author.bio, locale) ||
    t("metaDescription", {
      name: fullName,
    });

  return {
    title: fullName,
    description,
    openGraph: {
      type: "profile",
      title: fullName,
      description,
      images: author.photo
        ? [
            {
              url: author.photo,
              alt: fullName,
            },
          ]
        : undefined,
    },
  };
}

export default async function AuthorPage({
  params,
}: AuthorPageProps) {
  const { locale: rawLocale, id } = await params;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale;

  const t = await getTranslations({
    locale,
    namespace: "Authors.Page",
  });

  const [
    authorResult,
    articlesResult,
    projectsResult,
    subscribersResult,
  ] = await Promise.all([
    getCachedUserById(id),
    getCachedArticlesByAuthor(id),
    getCachedProjectsByAuthor(id),
    getCachedSubscribers(),
  ]);

  const author = Array.isArray(authorResult)
    ? authorResult[0]
    : authorResult;

  if (!author) {
    notFound();
  }

  const articles = Array.isArray(articlesResult)
    ? articlesResult.filter(Boolean)
    : [];

  const projects = Array.isArray(projectsResult)
    ? projectsResult.filter(Boolean)
    : [];

  const subscribers = Array.isArray(subscribersResult)
    ? subscribersResult.filter(Boolean)
    : [];

  const articleViews = await Promise.all(
    articles.map(async (article) => {
      if (!article.id) {
        return { id: "", count: 0 };
      }

      const views = await getCachedViewsByContent(article.id);

      return {
        id: article.id,
        count: Array.isArray(views) ? views.length : 0,
      };
    }),
  );

  const viewsByArticle = Object.fromEntries(
    articleViews
      .filter((item) => item.id)
      .map((item) => [item.id, item.count]),
  );

  const projectViews = await Promise.all(
    projects.map(async (project) => {
      if (!project.id) {
        return { id: "", count: 0 };
      }

      const views = await getCachedViewsByContent(project.id);

      return {
        id: project.id,
        count: Array.isArray(views) ? views.length : 0,
      };
    }),
  );

  const viewsByProject = Object.fromEntries(
    projectViews
      .filter((item) => item.id)
      .map((item) => [item.id, item.count]),
  );

  const totalArticleViews = articles.reduce(
    (total, article) => {
      const count = Array.isArray(article.views)
        ? article.views.length
        : 0;

      return total + count;
    },
    0,
  );

  const bio = getLocalizedValue(author.bio, locale);

  const authorTitle = getLocalizedValue(
    author.title,
    locale,
  );

  const skills = t.raw("skills") as string[];

  return (
    <main id="main" className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 pb-20 pt-24">
        <div className="mx-auto max-w-7xl">
          <AuthorHero
            firstName={author.firstName ?? ""}
            lastName={author.lastName ?? ""}
            title={authorTitle || t("defaultTitle")}
            description={bio}
            photo={author.photo}
            email={author.email}
            github={author.github}
            linkedin={author.linkedin}
            website={author.website}
            skills={skills}
          />

          <AuthorStats
            articles={formatNumber(articles.length, locale)}
            projects={formatNumber(projects.length, locale)}
            views={formatNumber(totalArticleViews, locale)}
            subscribers={formatNumber(subscribers.length, locale)}
          />

          <AuthorTabs
            locale={locale}
            articlesContent={
              <AuthorArticles
                articles={articles}
                locale={locale}
                views={viewsByArticle}
              />
            }
            projectsContent={
              <AuthorProjects
                projects={projects}
                locale={locale}
                views={viewsByProject}
              />
            }
            aboutContent={
              <AuthorAbout
                locale={locale}
                bio={bio}
                skills={skills}
              />
            }
          />
        </div>
      </div>
    </main>
  );
}
