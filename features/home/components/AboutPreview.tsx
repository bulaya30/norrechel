import Link from "next/link";
import {
  ArrowRight,
  ChartColumn,
  CodeXml,
  Lightbulb,
} from "lucide-react";

const focusAreas = [
  {
    title: "Building Software",
    description:
      "Creating modern web applications while applying practical engineering techniques, sound architecture, and lessons learned from real projects.",
    icon: CodeXml,
    iconClassName: "bg-blue-50 text-blue-700",
  },
  {
    title: "Working with Data",
    description:
      "Transforming data into meaningful insights that support better decisions, continuous improvement, and measurable impact.",
    icon: ChartColumn,
    iconClassName: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Building Ideas",
    description:
      "Exploring entrepreneurship, solving everyday challenges, and turning promising ideas into useful and meaningful projects.",
    icon: Lightbulb,
    iconClassName: "bg-orange-50 text-orange-600",
  },
];

export default function AboutPreview() {
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
              About
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
              Building practical technology with purpose.
            </h2>

            <p
              className="
                mt-6
                text-lg font-medium
                leading-8
                text-slate-700
              "
            >
              I&apos;m Norbert, a software engineer, builder, and
              entrepreneur focused on turning ideas into meaningful solutions.
            </p>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              I believe technology is most valuable when it solves real
              problems and creates opportunities for people. Through this
              platform, I document my journey of building software, exploring
              data, reading great books, and developing ambitious ideas.
            </p>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Along the way, I share practical lessons, honest experiences,
              and insights that can help others learn, grow, and build with
              confidence.
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
                More about me

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
                  What drives my work
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Three areas where technology, analytical thinking, and
                  curiosity come together.
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {focusAreas.map((area) => {
                  const Icon = area.icon;

                  return (
                    <article
                      key={area.title}
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
                          {area.title}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {area.description}
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
              relative overflow-hidden
              rounded-sm
              border border-slate-200
              bg-blue-500/[0.08]
              px-2 mx-auto items-center
            "
          >
            
            <div className="relative mx-auto">
             
              <blockquote>
                <p
                  className="
                    text-xl text-center
                    font-sm
                    leading-8 italic
                    text-slate-500
                    sm:leading-9
                  "
                >
                  “ Knowledge becomes truly valuable when it is shared,
                  applied, and used to make a positive difference. ”
                </p>
              </blockquote>

              <p className="text-xs text-center font-semibold uppercase tracking-[0.2em] text-slate-500">
                Philosophy
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}