import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function ProjectCTA() {
  const t = await getTranslations("Home");

  return (
    <section
      aria-labelledby="project-cta-heading"
      className="border-t border-slate-200 bg-slate-50
        px-4 py-16 dark:border-white/10 dark:bg-slate-900
        sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest
          text-orange-600 dark:text-orange-400">
          {t("ProjectCTA.eyebrow")}
        </p>

        <h2
          id="project-cta-heading"
          className="mt-3 text-3xl font-bold tracking-tight
            text-slate-950 dark:text-white sm:text-4xl"
        >
          {t("ProjectCTA.title")}
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8
          text-slate-600 dark:text-slate-300 sm:text-lg">
          {t("ProjectCTA.description")}
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-flex min-h-12 items-center
            justify-center gap-2 rounded-lg bg-orange-600
            px-6 py-3 text-sm font-semibold text-white
            transition-colors hover:bg-orange-500
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-orange-400
            focus-visible:ring-offset-2"
        >
          {t("ProjectCTA.button")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {t("ProjectCTA.supportingText")}
        </p>
      </div>
    </section>
  );
}