import Header from "@/components/header/Header";

import ArticleHero from "@/features/articles/components/home/ArticlesHero";
import ArticlesBrowser from "@/features/articles/components/home/ArticlesBrowser";

import { getLocale } from "next-intl/server";

import { getCachedPublishedArticles } from "@/features/articles/queries/article.queries";
import { getCachedCategories } from "@/features/categories/queries/category.queries";

type SupportedLocale = "en" | "fr";

export default async function Page() {
  const locale = (await getLocale()) as SupportedLocale;

  const [articles, categories] = await Promise.all([
    getCachedPublishedArticles(),
    getCachedCategories(),
  ]);

  return (
    <main
      id="main"
      className="min-h-screen bg-slate-50"
    >
      <Header />

      <ArticleHero
        articleCount={articles.length}
        categoryCount={categories.length}
      />

      <ArticlesBrowser
        articles={articles}
        categories={categories}
        locale={locale}
      />
    </main>
  );
}