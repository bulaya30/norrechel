import {
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import ArticleCard from "./ArticleCard";

import type { Article } from "@/features/interfaces/article";

type SupportedLocale = "en" | "fr";

interface ArticleListProps {
  articles: Article[];
  locale: SupportedLocale;
}

export default function ArticleList({
  articles,
  locale,
}: ArticleListProps) {
  const safeArticles = Array.isArray(articles)
    ? articles.filter(Boolean)
    : [];

  const labels = locale === "fr"
      ? {
          emptyTitle: "Aucun article trouvé",
          emptyDescription:
            "Commencez par créer votre premier article ou modifiez vos filtres de recherche.",
          create: "Créer un article",
        }
      : {
          emptyTitle: "No articles found",
          emptyDescription:
            "Create your first article or adjust the current search and filters.",
          create: "Create article",
        };

  if (safeArticles.length === 0) {
    return (
      <section
        aria-labelledby="empty-articles-heading"
        className="
          rounded-2xl border border-dashed
          border-slate-300 bg-white
          px-6 py-16 text-center
          shadow-sm
        "
      >
        <div
          className="
            mx-auto flex size-14
            items-center justify-center
            rounded-2xl bg-slate-100
            text-slate-500
            ring-1 ring-slate-200
          "
          aria-hidden="true"
        >
          <FileText className="size-6" />
        </div>

        <h2
          id="empty-articles-heading"
          className="
            mt-5 text-xl font-bold
            text-slate-950
          "
        >
          {labels.emptyTitle}
        </h2>

        <p
          className="
            mx-auto mt-2 max-w-md
            text-sm leading-6
            text-slate-600
          "
        >
          {labels.emptyDescription}
        </p>

        <Button
          asChild
          className="
            mt-6 bg-orange-600
            font-semibold text-white
            hover:bg-orange-500
          "
        >
          <Link
            href={`/${locale}/dashboard/articles/new`}
          >
            <Plus
              className="size-4"
              aria-hidden="true"
            />

            {labels.create}
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="article-list-heading"
    >
      <h2
        id="article-list-heading"
        className="sr-only"
      >
        {locale === "fr"
          ? "Liste des articles"
          : "Article list"}
      </h2>

      <div
        className="
          grid gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {safeArticles.map((article, index) => (
          <ArticleCard
            key={article.id ?? index}
            article={article}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}