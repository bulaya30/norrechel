
import { getTranslations } from "next-intl/server";

import { processSteps } from "@/features/services/data/services.data";

export default async function WorkProcess() {
  const t = await getTranslations("ServicesPage");

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">
          {t("process.eyebrow")}
        </p>

        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {t("process.title")}
        </h2>

        <p className="mt-4 leading-7 text-slate-600">
          {t("process.description")}
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map(({ key, number }) => (
          <article
            key={key}
            className="border-t-2 border-slate-200 pt-5"
          >
            <span className="text-sm font-bold text-orange-600">
              {number}
            </span>

            <h3 className="mt-4 text-lg font-bold">
              {t(`process.steps.${key}.title`)}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              {t(`process.steps.${key}.description`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
