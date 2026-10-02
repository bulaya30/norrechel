"use client";

import type { ReactNode } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface AuthorTabsProps {
  articlesContent: ReactNode;
  projectsContent: ReactNode;
  aboutContent: ReactNode;
  locale?: "en" | "fr";
}

export default function AuthorTabs({
  articlesContent,
  projectsContent,
  aboutContent,
  locale = "en",
}: AuthorTabsProps) {
  const labels =
    locale === "fr"
      ? {
          articles: "Articles",
          projects: "Projets",
          about: "À propos",
        }
      : {
          articles: "Articles",
          projects: "Projects",
          about: "About",
        };

  return (
    <section
      aria-labelledby="author-content-heading"
      className="my-10"
    >
      <h2
        id="author-content-heading"
        className="sr-only"
      >
        {locale === "fr"
          ? "Contenu de l’auteur"
          : "Author content"}
      </h2>

      <Tabs
        defaultValue="articles"
        className="w-full"
      >
        <TabsList
          aria-label={
            locale === "fr"
              ? "Sections du profil de l’auteur"
              : "Author profile sections"
          }
          className="
            h-auto w-full justify-start gap-1
            rounded-none border-b border-slate-200
            bg-transparent p-0
          "
        >
          <TabsTrigger
            value="articles"
            className="
              relative rounded-none border-b-2
              border-transparent px-4 py-3
              text-sm font-semibold text-slate-500
              shadow-none transition-colors
              hover:text-blue-700
              focus-visible:ring-2
              focus-visible:ring-blue-600
              focus-visible:ring-offset-2
              data-[state=active]:border-b-blue-700
              data-[state=active]:bg-transparent
              data-[state=active]:text-blue-700
              data-[state=active]:shadow-none
            "
          >
            {labels.articles}
          </TabsTrigger>

          <TabsTrigger
            value="projects"
            className="
              relative rounded-none border-b-2
              border-transparent px-4 py-3
              text-sm font-semibold text-slate-500
              shadow-none transition-colors
              hover:text-blue-700
              focus-visible:ring-2
              focus-visible:ring-blue-600
              focus-visible:ring-offset-2
              data-[state=active]:border-b-blue-700
              data-[state=active]:bg-transparent
              data-[state=active]:text-blue-700
              data-[state=active]:shadow-none
            "
          >
            {labels.projects}
          </TabsTrigger>

          <TabsTrigger
            value="about"
            className="
              relative rounded-none border-b-2
              border-transparent px-4 py-3
              text-sm font-semibold text-slate-500
              shadow-none transition-colors
              hover:text-blue-700
              focus-visible:ring-2
              focus-visible:ring-blue-600
              focus-visible:ring-offset-2
              data-[state=active]:border-b-blue-700
              data-[state=active]:bg-transparent
              data-[state=active]:text-blue-700
              data-[state=active]:shadow-none
            "
          >
            {labels.about}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="articles"
          className="mt-6 focus-visible:outline-none"
        >
          {articlesContent}
        </TabsContent>

        <TabsContent
          value="projects"
          className="mt-6 focus-visible:outline-none"
        >
          {projectsContent}
        </TabsContent>

        <TabsContent
          value="about"
          className="mt-6 focus-visible:outline-none"
        >
          {aboutContent}
        </TabsContent>
      </Tabs>
    </section>
  );
}