import { getTranslations } from "next-intl/server";
import { ArrowDown, CodeXml } from "lucide-react";

interface ProjectHeroProps {
  projectCount: number;
  categoryCount: number;
}

export default async function ProjectHero({
  projectCount,
  categoryCount,
}: ProjectHeroProps) {
  const t = await getTranslations("Projects.Hero");

  return (
    <section
      aria-labelledby="projects-page-heading"
      className="relative mx-auto overflow-hidden border-b border-slate-200"
    >
      {/* Background effects */}
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

      {/* Hero content */}
      <div
        className="
          relative mx-auto max-w-7xl
          px-4 pb-12 pt-4
          sm:px-6 sm:pb-16 sm:pt-6
          lg:px-8 lg:pb-20
        "
      >
        <header className="max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="
                flex size-10 items-center justify-center
                rounded-xl bg-blue-50 text-blue-700
              "
            >
              <CodeXml className="size-5" aria-hidden="true" />
            </span>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
              {t("eyebrow")}
            </p>
          </div>

          <h1
            id="projects-page-heading"
            className="
              max-w-3xl text-4xl font-bold
              leading-[1.02] tracking-[-0.04em]
              text-slate-950 sm:text-5xl lg:text-6xl
            "
          >
            {t("title")}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {t("description")}
          </p>

          <p className="mt-5 text-sm font-medium text-slate-500">
            {t("publishedProjects", { count: projectCount })}
          </p>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {t("availableCategories", { count: categoryCount })}
          </p>
        </header>

        <div
          aria-hidden="true"
          className="
            mt-8 hidden items-center gap-2
            text-xs font-semibold uppercase
            tracking-[0.18em] text-slate-400
            sm:flex
          "
        >
          <span>{t("explore")}</span>
          <ArrowDown className="size-3.5" />
        </div>
      </div>
    </section>
  );
}