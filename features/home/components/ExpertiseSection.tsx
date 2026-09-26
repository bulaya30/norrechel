import {
  ArrowUpRight,
  BookOpen,
  ChartColumnIncreasing,
  CodeXml,
} from "lucide-react";

const expertiseAreas = [
  {
    number: "01",
    title: "Software Engineering",
    description:
      "Building modern web applications around real problems, practical user needs, and maintainable architecture.",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "Firebase"],
    icon: CodeXml,
  },
  {
    number: "02",
    title: "Data & Analytics",
    description:
      "Turning raw data into dashboards, reports, and useful information that helps people understand what matters.",
    icon: ChartColumnIncreasing,
  },
  {
    number: "03",
    title: "Knowledge & Writing",
    description:
      "Sharing practical lessons and ideas from software development, technology, entrepreneurship, and personal growth.",
    icon: BookOpen,
  },
];

export default function Expertise() {
  const software = expertiseAreas[0];
  const analytics = expertiseAreas[1];
  const writing = expertiseAreas[2];

  return (
    <section
        aria-labelledby="expertise-heading"
        className="border-t border-slate-200/80 bg-white/50 px-4 py-14 backdrop-blur-[2px] sm:px-6 lg:px-8 lg:py-7"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section introduction */}
        <header className="grid gap-4 lg:grid-cols-[1.1fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-4">
              <span className="h-px w-10 bg-blue-600" />

              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700">
                Expertise
              </p>

              <span className="text-xs font-medium tracking-widest text-slate-400">
                01
              </span>
            </div>

            <h2
              id="expertise-heading"
              className="max-w-3xl text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl"
            >
              What I build,
              <br />
              analyze,{" "}
              <span className="text-blue-600">
                and share.
              </span>
            </h2>
          </div>

        
        </header>

        {/* Expertise grid */}
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Featured engineering card */}
          <article className="group relative min-h-[470px] overflow-hidden rounded-md bg-slate-950 p-10 text-white sm:p-9 lg:p-3">
            {/* Decorative glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-22 size-80 rounded-full bg-blue-600/20 blur-3xl transition-all duration-700 group-hover:bg-blue-600/30"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full border border-white/10"
            />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-md border border-white/10 bg-white/5">
                  <CodeXml
                    className="size-5 text-blue-400"
                    aria-hidden="true"
                  />
                </div>

                <span className="text-sm font-medium tracking-widest text-white/40">
                  {software.number}
                </span>
              </div>

              <div className="mt-10 max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Core discipline
                </p>

                <h3 className="text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                  {software.title}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  {software.description}
                </p>
                <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                    I combine software engineering, analytical thinking, and practical
                    knowledge to create digital products, turn data into useful
                    information, and share what I learn along the way.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {software.technologies?.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 right-0 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/30">
                <span>Engineering</span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </div>
            </div>
          </article>

          {/* Secondary expertise */}
          <div className="grid gap-4">
            <article className="group flex min-h-[225px] flex-col justify-between bg-stale-500 shadow-md rounded-md border border-slate-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/[0.06] sm:p-8">
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                  <ChartColumnIncreasing
                    className="size-5"
                    aria-hidden="true"
                  />
                </div>

                <span className="text-sm font-medium tracking-widest text-slate-300">
                  {analytics.number}
                </span>
              </div>

              <div className="mt-2">
                <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                  {analytics.title}
                </h3>

                <p className="mt-1 max-w-lg text-sm leading-6 text-slate-600">
                  {analytics.description}
                </p>
              </div>
            </article>

            <article className="group flex min-h-[225px] flex-col bg-stale-500 shadow-md justify-between rounded-md border border-slate-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/[0.06] sm:p-8">
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600">
                  <BookOpen
                    className="size-5"
                    aria-hidden="true"
                  />
                </div>

                <span className="text-sm font-medium tracking-widest text-slate-300">
                  {writing.number}
                </span>
              </div>

              <div className="mt-2">
                <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-950">
                  {writing.title}
                </h3>

                <p className="mt-1 max-w-lg text-sm leading-6 text-slate-600">
                  {writing.description}
                </p>
              </div>
            </article>
          </div>
        </div>

        {/* Technology strip */}
        <div className="mt-4 border-y border-slate-200 py-4 bg-blue-500/[0.08]">
          <div className="flex flex-col px-4 gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
              Technologies I work with
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
              {[
                "React",
                "Next.js",
                "TypeScript",
                "Node.js",
                "Firebase",
                "Tailwind CSS",
              ].map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}