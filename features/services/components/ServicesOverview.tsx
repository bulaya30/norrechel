
import { getTranslations } from "next-intl/server";

import { services } from "@/features/services/data/services.data";

export default async function ServicesOverview() {
  const t = await getTranslations("ServicesPage");

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {services.map(({ key, icon: Icon, number }) => (
            <div key={key} className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm ring-1 ring-slate-200">
                <Icon className="size-5" aria-hidden="true" />
              </div>

              <div>
                <p className="text-xs font-semibold text-orange-700">
                  {number}
                </p>
                <h2 className="mt-1 font-bold">
                  {t(`services.${key}.title`)}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t(`services.${key}.shortDescription`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
