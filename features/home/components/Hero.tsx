import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChartColumnIncreasing,
  CodeXml,
  Sparkles,
} from "lucide-react";

import HomeCard from "./HomeCard";
import DecorativeBackground from "@/components/ui/DecorativeBackground";

export const featuredTopics = [
  {
    title: "Practical Insights",
    content:
      "Discover thoughtful articles on software engineering, entrepreneurship, personal development, and the lessons that turn ideas into meaningful results.",
    icon: <BookOpen className="size-6" aria-hidden="true" />,
  },
  {
    title: "Data-Driven Solutions",
    content:
      "Explore analytics projects that transform raw data into meaningful insights, demonstrating how data supports smarter decisions and solves real-world challenges.",
    icon: (
      <ChartColumnIncreasing
        className="size-6"
        aria-hidden="true"
      />
    ),
  },
  {
    title: "Software That Solves Problems",
    content:
      "Explore modern web applications, desktop software, and digital solutions built to improve productivity, simplify everyday tasks, and create lasting value.",
    icon: <CodeXml className="size-6" aria-hidden="true" />,
  },
];

export default function Hero() {
  return (
    <>
      {/* =========================================================
          HERO
      ========================================================= */}
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
            <div className="max-w-3xl ">
              <div className="mb-2 mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-slate-200 shadow-sm backdrop-blur">
                <Sparkles
                  className="size-4 text-orange-400"
                  aria-hidden="true"
                />

                <span>
                  Technology · Data · Personal Development
                </span>
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
                Turning ideas into{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-orange-400 bg-clip-text text-transparent">
                  meaningful solutions.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-slate-300 sm:text-lg">
                I build websites, desktop applications, and data-driven
                solutions—and share practical insights about technology,
                entrepreneurship, and personal growth.
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
                  Explore my projects

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
                  Read my articles
                </Link>
              </div>

              {/* Small supporting line */}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-emerald-400"
                  />
                  Building useful digital products
                </span>

                <span className="hidden h-4 w-px bg-white/10 sm:block" />

                <span>
                  Technology with purpose
                </span>
              </div>
            </div>

            {/* =====================================================
                RIGHT — VISUAL CAPABILITY PANEL
            ===================================================== */}
            <div className="relative lg:justify-self-end top-8">
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
                      Focus
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white">
                      Building with purpose
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
                          Software Development
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          Modern applications designed around real
                          problems and practical user needs.
                        </p>
                      </div>
                    </div>
                  </div>

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
                          Data & Analytics
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          Turning data into clear information that
                          supports better decisions.
                        </p>
                      </div>
                    </div>
                  </div>

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
                          Knowledge & Writing
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          Practical ideas and lessons from technology,
                          work, and personal development.
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