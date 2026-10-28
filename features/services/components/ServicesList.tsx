
import { getTranslations } from "next-intl/server";

import { services } from "@/features/services/data/services.data";

export default async function ServicesList() {
  const t = await getTranslations("ServicesPage");

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">
          {t("servicesSection.eyebrow")}
        </p>

        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {t("servicesSection.title")}
        </h2>

        <p className="mt-4 leading-7 text-slate-600">
          {t("servicesSection.description")}
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {services.map(({ key, number, icon: Icon }) => (
          <article
            key={key}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/50 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-700 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                <Icon className="size-6" aria-hidden="true" />
              </div>

              <span className="text-sm font-semibold text-slate-300">
                {number}
              </span>
            </div>

            <h3 className="mt-7 text-xl font-bold">
              {t(`services.${key}.title`)}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              {t(`services.${key}.description`)}
            </p>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t("servicesSection.outcomeLabel")}
              </p>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-800">
                {t(`services.${key}.outcome`)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
