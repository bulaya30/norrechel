
import { getTranslations } from "next-intl/server";
import { ArrowRight, CheckCircle2, Workflow } from "lucide-react";

import { Link } from "@/i18n/navigation";

const capabilities = [
  "birds",
  "inventory",
  "vaccinations",
  "sales",
] as const;

export default async function FeaturedProject() {
  const t = await getTranslations("ServicesPage");

  return (
    <section className="border-y border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-400">
            {t("featured.eyebrow")}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold text-orange-300">
            <span className="size-1.5 rounded-full bg-orange-400" />
            {t("featured.status")}
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("featured.title")}
          </h2>

          <p className="mt-5 leading-8 text-slate-300">
            {t("featured.description")}
          </p>

          <Link
            href="/projects"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
          >
            {t("featured.cta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
              <Workflow className="size-5" aria-hidden="true" />
            </div>

            <div>
              <p className="font-semibold">{t("featured.panelTitle")}</p>
              <p className="mt-1 text-xs text-slate-400">
                {t("featured.panelSubtitle")}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            {capabilities.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-orange-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold">
                    {t(`featured.capabilities.${item}.title`)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {t(`featured.capabilities.${item}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-slate-400">
            {t("featured.disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
