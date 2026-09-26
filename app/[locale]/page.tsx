import "server-only";

import { getLocale } from "next-intl/server";

import HeaderWrapper from "@/components/header/Header";
import VisitorTracker from "@/features/visitors/components/VisitorTracker";

import Hero from "@/features/home/components/Hero";
import Expertise from "@/features/home/components/ExpertiseSection";
import LatestArticles from "@/features/home/components/LatestArticles";
import SelectedProjects from "@/features/home/components/SelectedProjects";
import AboutPreview from "@/features/home/components/AboutPreview";

import { getCachedPublishedArticles } from "@/features/articles/queries/article.queries";
import { getCachedPublishedProjects } from "@/features/projects/queries/project.queries";

import NewsletterSection from "@/features/newsletter/components/NewsletterSection";
import PageBackground from "@/components/PageBackground";

type SupportedLocale = "en" | "fr";

export default async function Page() {
  const locale = (await getLocale()) as SupportedLocale;

  const [articles, projects] = await Promise.all([
    getCachedPublishedArticles(),
    getCachedPublishedProjects(),
  ]);

  return (
    <main
      id="main"
      className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950"
    >
      <VisitorTracker/>

      <HeaderWrapper />

      {/* <PageBackground /> */}

      <div className="relative z-10">
        <Hero />

        <Expertise />

        <LatestArticles
          articles={articles}
          locale={locale}
        />

        <SelectedProjects
          projects={projects}
          locale={locale}
        />

        <AboutPreview />

        <NewsletterSection />
      </div>
    </main>
  );
}