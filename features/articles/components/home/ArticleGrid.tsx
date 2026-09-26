import ArticleCard from "@/features/articles/components/home/ArticleCard";

import type { Article } from "@/features/interfaces/article";

type SupportedLocale = "en" | "fr";

interface ArticleGridProps {
  articles: Article[];
  locale: SupportedLocale;
}

export default function ArticleGrid({
  articles,
  locale,
}: ArticleGridProps) {
  if (articles.length === 0) {
    return null;
  }

  const isFrench = locale === "fr";

  return (
    <section
      aria-labelledby="article-grid-heading"
      className="w-full"
    >
      <header className="mb-6">
        <p
          className="
            text-xs font-bold uppercase
            tracking-[0.16em]
            text-orange-600
          "
        >
          {isFrench
            ? "Bibliothèque"
            : "Library"}
        </p>

        <h2
          id="article-grid-heading"
          className="
            mt-2
            text-2xl font-bold
            tracking-tight
            text-slate-950
            sm:text-3xl
          "
        >
          {isFrench
            ? "Tous les articles"
            : "All articles"}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {isFrench
            ? "Explorez les autres articles de la bibliothèque."
            : "Explore the rest of the articles in the library."}
        </p>
      </header>

      <div
        className="
          grid gap-5
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}