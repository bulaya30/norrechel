
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";

export default async function ServicesCTA() {
  const t = await getTranslations("ServicesPage");

  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-orange-600 px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-100">
              {t("cta.eyebrow")}
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("cta.title")}
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-orange-50">
              {t("cta.description")}
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600 md:self-center"
          >
            {t("cta.button")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
