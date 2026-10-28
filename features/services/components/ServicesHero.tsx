
import { getTranslations } from "next-intl/server";
import {
  ArrowDownRight,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

import DecorativeBackground from "@/components/ui/DecorativeBackground";

import { Link } from "@/i18n/navigation";

export default async function ServicesHero() {
  const t = await getTranslations("ServicesPage");

  return (
    <section  className="relative isolate overflow-hidden bg-slate-950 text-white">
        <DecorativeBackground />
      {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-20 h-66 w-96 rounded-full bg-blue-600/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl"
        />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8 lg:py-32">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-orange-600" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
              {t("hero.eyebrow")}
            </p>
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero.title")}{" "}
            <span className="text-orange-600">
              {t("hero.titleAccent")}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            {t("hero.description")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
            >
              {t("hero.cta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <Link
              href="/projects"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:text-orange-700"
            >
              {t("hero.secondaryCta")}
              <ArrowDownRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.25)] sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {t("overview.eyebrow")}
              </p>
              <h2 className="mt-2 text-xl font-bold">
                {t("overview.title")}
              </h2>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Lightbulb className="size-5" aria-hidden="true" />
            </div>
          </div>

          <p className="pt-6 text-sm leading-7 text-slate-600">
            {t("overview.note")}
          </p>
        </div>
      </div>
    </section>
  );
}
