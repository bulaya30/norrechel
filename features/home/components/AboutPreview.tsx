import { ArrowRight, ChartColumn, CodeXml, Lightbulb } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

const focusAreas = [
  {
    key: "buildingSoftware",
    icon: CodeXml,
    iconClassName: "bg-blue-50 text-blue-700",
  },
  {
    key: "workingWithData",
    icon: ChartColumn,
    iconClassName: "bg-cyan-50 text-cyan-700",
  },
  {
    key: "buildingIdeas",
    icon: Lightbulb,
    iconClassName: "bg-orange-50 text-orange-600",
  },
] as const;

export default async function AboutPreview() {
  const t = await getTranslations("Home.AboutPreview");

  return (
    <section
      aria-labelledby="about-heading"
      className="
        border-t border-slate-200
        bg-white/80 backdrop-blur-[2px]
        px-4 py-20 sm:px-6 sm:py-24
        lg:px-8 lg:py-18
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            MAIN INTRODUCTION
        ===================================================== */}
        <div
          className="
            grid items-start gap-12
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-20
          "
        >
          {/* Left column */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
              {t("label")}
            </p>

            <h2
              id="about-heading"
              className="
                max-w-xl
                text-3xl font-bold
                leading-tight
                tracking-[-0.035em]
                text-slate-950
                sm:text-4xl
                lg:text-5xl
              "
            >
              {t("title")}
            </h2>

            <p
              className="
                mt-6
                text-lg font-medium
                leading-8
                text-slate-700
              "
            >
              {t("intro")}
            </p>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              {t("description1")}
            </p>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              {t("description2")}
            </p>

            {/* CTA */}
            <div className="mt-4">
              <Link
                href="/about"
                className="
                  group
                  inline-flex items-center gap-2
                  rounded-lg
                  bg-slate-950
                  px-5 py-3
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-orange-600
                  hover:shadow-lg
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-600
                  focus-visible:ring-offset-2
                "
              >
                {t("moreAboutMe")}

                <ArrowRight
                  className="
                    size-4
                    transition-transform duration-200
                    group-hover:translate-x-1
                  "
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* ===================================================
              RIGHT COLUMN — FOCUS AREAS
          =================================================== */}
          <div className="lg:pt-4">
            <div
              className="
                overflow-hidden
                rounded-3xl
                border border-slate-200
                bg-slate-50/70
              "
            >
              <div className="border-b border-slate-200 px-6 py-5 sm:px-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {t("focusTitle")}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("focusDescription")}
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {focusAreas.map((area) => {
                  const Icon = area.icon;

                  return (
                    <article
                      key={area.key}
                      className="
                        group
                        flex gap-4
                        px-6 py-6
                        transition-colors duration-200
                        hover:bg-white
                        sm:px-7
                      "
                    >
                      <div
                        className={`
                          flex size-11 shrink-0
                          items-center justify-center
                          rounded-xl
                          ${area.iconClassName}
                        `}
                      >
                        <Icon
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <h3
                          className="
                            text-base font-bold
                            tracking-tight
                            text-slate-950
                          "
                        >
                          {t(`focusAreas.${area.key}.title`)}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {t(`focusAreas.${area.key}.description`)}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATEMENT
        ===================================================== */}
        <div className="mt-4">
          <div
            className="
              relative mx-auto
              overflow-hidden
              rounded-sm
              border border-slate-200
              bg-blue-500/[0.08]
              px-2
            "
          >
            <div className="relative mx-auto">
              <blockquote>
                <p
                  className="
                    text-center
                    text-xl
                    font-sm
                    leading-8
                    italic
                    text-slate-500
                    sm:leading-9
                  "
                >
                  “ {t("philosophyQuote")} ”
                </p>
              </blockquote>

              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t("philosophy")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}