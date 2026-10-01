import type { Metadata } from "next";
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en", {
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

  const authorResult = await getCachedUserById(id);

  const author = Array.isArray(authorResult)
    ? authorResult[0]
    : authorResult;

  if (!author) {
    return {
      title:
        locale === "fr"
          ? "Auteur introuvable"
          : "Author not found",
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
    getLocalizedValue(
      author.bio as LocalizedValue,
      locale,
    ) ||
    (locale === "fr"
      ? `Découvrez les articles et les projets de ${fullName}.`
      : `Explore articles and projects by ${fullName}.`);

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

  // console.log(articlesResult)
  const author = Array.isArray(authorResult)
    ? authorResult[0]
    : authorResult;

  if (!author) {
    notFound();
  }

  const articles = Array.isArray(articlesResult)
    ? articlesResult.filter(Boolean)
    : [];

  const articleViews = await Promise.all(
    articles.map(async (article) => {
      if (!article.id) {
        return {
          id: "",
          count: 0,
        };
      }

      const views = await getCachedViewsByContent(
        article.id,
      );

      return {
        id: article.id,
        count: Array.isArray(views)
          ? views.length
          : 0,
      };
    }),
  );

  const viewsByArticle = Object.fromEntries(
    articleViews
      .filter((item) => item.id)
      .map((item) => [
        item.id,
        item.count,
      ]),
  );

  const projects = Array.isArray(projectsResult)
    ? projectsResult.filter(Boolean)
    : [];
  const projectViews = await Promise.all(
      articles.map(async (article) => {
        if (!article.id) {
          return {
            id: "",
            count: 0,
          };
        }

        const views = await getCachedViewsByContent(
          article.id,
        );

        return {
          id: article.id,
          count: Array.isArray(views)
            ? views.length
            : 0,
        };
      }),
    );

    const viewsByProject = Object.fromEntries(
      articleViews
        .filter((item) => item.id)
        .map((item) => [
          item.id,
          item.count,
        ]),
    );
  const subscribers = Array.isArray(subscribersResult)
    ? subscribersResult.filter(Boolean)
    : [];

  /*
   * Article currently exposes `views?: View[]`,
   * not an `analytics` property.
   *
   * Therefore total views are calculated from the
   * stored article view records.
   */
  const totalArticleViews = articles.reduce(
    (total, article) => {
      const articleViews = Array.isArray(article.views)
        ? article.views.length
        : 0;

      return total + articleViews;
    },
    0,
  );

  const fullName = [
    author.firstName,
    author.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const bio = getLocalizedValue(
    author.bio as LocalizedValue,
    locale,
  );

  const authorTitle = getLocalizedValue(
    author.title as LocalizedValue,
    locale,
  );

  const skills = [
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "Firebase",
    "Data Analytics",
  ];

  return (
    <main
      id="main"
      className="min-h-screen"
    >
      <Header />

      <div className="container mx-auto px-4 pb-20 pt-24">
        <div className="mx-auto max-w-7xl">
          <AuthorHero
            firstName={author.firstName ?? ""}
            lastName={author.lastName ?? ""}
            title={
              authorTitle ||
              "Software Engineer · Builder · Entrepreneur"
            }
            description={bio}
            photo={author.photo}
            email={author.email}
            github={author.github}
            linkedin={author.linkedin}
            website={author.website}
            skills={skills}
          />

          <AuthorStats
            articles={formatNumber(articles.length)}
            projects={formatNumber(projects.length)}
            views={formatNumber(totalArticleViews)}
            subscribers={formatNumber(subscribers.length)}
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