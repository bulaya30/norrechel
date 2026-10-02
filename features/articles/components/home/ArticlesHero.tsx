import { BookOpen, ArrowDown } from "lucide-react";

type SupportedLocale = "en" | "fr";

interface ArticleHeroProps {
  locale: SupportedLocale;
  articleCount: number;
  categoryCount: number;
}

export default function ArticleHero({
  locale,
  articleCount,
  categoryCount,
}: ArticleHeroProps) {
  const isFrench = locale === "fr";

  return (
    <section
      aria-labelledby="articles-page-heading"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />

        <div
          className="
            absolute inset-0 opacity-[0.035]
            [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />
      </div>

      <div
        className="
          relative mx-auto max-w-7xl px-4
          pb-14 pt-28
          sm:px-6 sm:pb-16 sm:pt-32
          lg:px-8 lg:pb-20 lg:pt-36
        "
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div
            className="
              mb-6 inline-flex items-center gap-2
              rounded-full border border-blue-100
              bg-blue-50/80 px-3.5 py-1.5
              text-sm font-semibold text-blue-700
            "
          >
            <BookOpen
              aria-hidden="true"
              className="h-4 w-4"
            />

            <span>
              {isFrench
                ? "Bibliothèque d’articles"
                : "Article Library"}
            </span>
          </div>

          {/* Main heading */}
          <h1
            id="articles-page-heading"
            className="
              max-w-4xl
              text-4xl font-bold tracking-[-0.035em] text-slate-950
              sm:text-5xl
              lg:text-6xl
              lg:leading-[1.05]
            "
          >
            {isFrench
              ? "Des idées à explorer. Des leçons à partager."
              : "Ideas worth exploring. Lessons worth sharing."}
          </h1>

          {/* Description */}
          <p
            className="
              mt-6 max-w-2xl
              text-base leading-7 text-slate-600
              sm:text-lg sm:leading-8
            "
          >
            {isFrench
              ? "Découvrez des articles pratiques sur le développement logiciel, les données, l’entrepreneuriat, la productivité et les enseignements tirés de projets réels."
              : "Explore practical writing on software development, data, entrepreneurship, productivity, and lessons learned from building real projects."}
          </p>

          {/* Metadata */}
          <div
            className="
              mt-8 flex flex-wrap items-center gap-x-5 gap-y-3
              text-sm font-medium text-slate-500
            "
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-orange-500"
              />

              <span>
                {articleCount}{" "}
                {isFrench
                  ? articleCount === 1
                    ? "article publié"
                    : "articles publiés"
                  : articleCount === 1
                    ? "published article"
                    : "published articles"}
              </span>
            </div>

            <span
              aria-hidden="true"
              className="hidden h-4 w-px bg-slate-300 sm:block"
            />

            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-blue-500"
              />

              <span>
                {categoryCount}{" "}
                {isFrench
                  ? categoryCount === 1
                    ? "catégorie"
                    : "catégories"
                  : categoryCount === 1
                    ? "category"
                    : "categories"}
              </span>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          className="
            mt-12 hidden items-center gap-2
            text-xs font-semibold uppercase
            tracking-[0.18em] text-slate-400
            sm:flex
          "
        >
          <span>
            {isFrench ? "Explorer les articles" : "Explore articles"}
          </span>

          <ArrowDown className="h-3.5 w-3.5" />
        </div>
      </div>
    </section>
  );
}