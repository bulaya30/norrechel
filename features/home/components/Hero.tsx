import {
  ArrowRight,
  BookOpen,
  ChartColumnIncreasing,
  CodeXml,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import DecorativeBackground from "@/components/ui/DecorativeBackground";

export default async function Hero() {
  const t = await getTranslations("Home");

  const featuredTopics = [
    {
      title: t("FeaturedTopics.practicalInsights.title"),
      content: t("FeaturedTopics.practicalInsights.content"),
      icon: <BookOpen className="size-6" aria-hidden="true" />,
    },
    {
      title: t("FeaturedTopics.dataDrivenSolutions.title"),
      content: t("FeaturedTopics.dataDrivenSolutions.content"),
      icon: (
        <ChartColumnIncreasing
          className="size-6"
          aria-hidden="true"
        />
      ),
    },
    {
      title: t("FeaturedTopics.softwareThatSolvesProblems.title"),
      content: t("FeaturedTopics.softwareThatSolvesProblems.content"),
      icon: <CodeXml className="size-6" aria-hidden="true" />,
    },
  ];

  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="relative isolate overflow-hidden bg-slate-950 text-white"
      >
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

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-14 lg:px-8 lg:py-14">
          <div className="grid items-center gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">

            {/* =====================================================
                LEFT — PRIMARY MESSAGE
            ===================================================== */}

            <div className="max-w-3xl">
              <div className="mb-2 mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-slate-200 shadow-sm backdrop-blur">
                <Sparkles
                  className="size-4 text-orange-400"
                  aria-hidden="true"
                />

                <span>{t("Hero.eyebrow")}</span>
              </div>

              <h1
                id="hero-heading"
                className="
                  mt-4
                  max-w-4xl
                  text-balance
                  text-4xl
                  font-bold
                  leading-[1.08]
                  tracking-[-0.03em]
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                  xl:text-7xl
                "
              >
                {t("Hero.titleLine1")}{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-orange-400 bg-clip-text text-transparent">
                  {t("Hero.titleLine2")}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-slate-300 sm:text-lg">
                {t("Hero.description")}
              </p>

              {/* CTA */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/projects"
                  className="
                    group
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-orange-600
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-orange-950/30
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-orange-500
                    hover:shadow-xl
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-orange-400
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-slate-950
                  "
                >
                  {t("Hero.projectsButton")}

                  <ArrowRight
                    className="
                      size-4
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                    "
                    aria-hidden="true"
                  />
                </Link>

                <Link
                  href="/blogs"
                  className="
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/15
                    bg-white/[0.04]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    backdrop-blur-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-white/25
                    hover:bg-white/[0.08]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-white
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-slate-950
                  "
                >
                  {t("Hero.articlesButton")}
                </Link>
              </div>

              {/* Small supporting line */}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-emerald-400"
                  />

                  {t("Hero.supportingText")}
                </span>

                <span className="hidden h-4 w-px bg-white/10 sm:block" />

                <span>{t("Hero.supportingLabel")}</span>
              </div>
            </div>

            {/* =====================================================
                RIGHT — VISUAL CAPABILITY PANEL
            ===================================================== */}

            <div className="relative top-8 lg:justify-self-end">
              <div
                className="
                  relative
                  w-full
                  max-w-md
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-5
                  shadow-2xl
                  shadow-black/20
                  backdrop-blur-xl
                  sm:p-6
                "
              >
                {/* Panel header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {t("Capabilities.label")}
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white">
                      {t("Capabilities.title")}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                  >
                    <CodeXml className="size-5 text-cyan-300" />
                  </div>
                </div>

                {/* Capability items */}
                <div className="mt-5 space-y-3">
                  {/* Software Development */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-colors hover:bg-white/[0.06]">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                        <CodeXml
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          {t(
                            "Capabilities.softwareDevelopment.title"
                          )}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {t(
                            "Capabilities.softwareDevelopment.description"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data & Analytics */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-colors hover:bg-white/[0.06]">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                        <ChartColumnIncreasing
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          {t("Capabilities.dataAnalytics.title")}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {t(
                            "Capabilities.dataAnalytics.description"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Knowledge & Writing */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-colors hover:bg-white/[0.06]">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300">
                        <BookOpen
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          {t("Capabilities.knowledgeWriting.title")}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {t(
                            "Capabilities.knowledgeWriting.description"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative bottom accent */}
                <div
                  aria-hidden="true"
                  className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom transition */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </section>
    </>
  );
}