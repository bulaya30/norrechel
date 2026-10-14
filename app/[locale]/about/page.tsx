
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/header/Header";

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpenText,
  CheckCircle2,
  CodeXml,
  Handshake,
  Lightbulb,
  Rocket,
  Target,
  TrendingUp,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type ServiceKey = "writing" | "data" | "web";
type ApproachKey = "curiosity" | "collaboration" | "impact" | "growth";

const services: {
  key: ServiceKey;
  href: "/blogs" | "/projects";
  icon: LucideIcon;
}[] = [
  { key: "writing", href: "/blogs", icon: BookOpenText },
  { key: "data", href: "/projects", icon: BarChart3 },
  { key: "web", href: "/projects", icon: CodeXml },
];

const approachItems: {
  key: ApproachKey;
  icon: LucideIcon;
}[] = [
  { key: "curiosity", icon: Lightbulb },
  { key: "collaboration", icon: Handshake },
  { key: "impact", icon: Target },
  { key: "growth", icon: TrendingUp },
];

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <main id="main" className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 pt-22">
        <Header />

        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <section
            aria-labelledby="about-page-heading"
            className="max-w-3xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
              <UserRound aria-hidden="true" className="h-4 w-4" />
              {t("eyebrow")}
            </div>

            <h1
              id="about-page-heading"
              className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
            >
              {t("hero.title")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {t("hero.description")}
            </p>

            <Link
              href="/blogs"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
            >
              {t("hero.cta")}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </section>

          {/* Profile and mission */}
          <section
            aria-labelledby="profile-heading"
            className="mt-14 grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[320px_minmax(0,1fr)] md:p-8 lg:gap-12"
          >
            <div className="relative min-h-80 overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src="/img/aboutPhoto.png"
                alt={t("profile.imageAlt")}
                fill
                priority
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover"
              />

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/60 to-transparent"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                  {t("profile.eyebrow")}
                </p>

                <h2
                  id="profile-heading"
                  className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
                >
                  {t("profile.title")}
                </h2>

                <p className="mt-5 text-base leading-8 text-slate-600">
                  {t("profile.paragraph1")}
                </p>

                <p className="mt-4 text-base leading-8 text-slate-600">
                  {t("profile.paragraph2")}
                </p>
              </div>

              <div className="my-8 h-px bg-slate-200" />

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  {t("mission.eyebrow")}
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  {t("mission.title")}
                </h2>

                <p className="mt-4 text-base leading-8 text-slate-600">
                  {t("mission.description")}
                </p>
              </div>
            </div>
          </section>

          {/* Services */}
          <section
            aria-labelledby="services-heading"
            className="mt-20"
          >
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                {t("services.eyebrow")}
              </p>

              <h2
                id="services-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-950"
              >
                {t("services.title")}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {t("services.description")}
              </p>
            </header>

            <ul
              role="list"
              className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {services.map(({ key, href, icon: Icon }) => {
                const highlights = t.raw(
                  `services.items.${key}.highlights`,
                ) as string[];

                return (
                  <li key={key}>
                    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white">
                        <Icon
                          aria-hidden="true"
                          className="h-6 w-6"
                        />
                      </div>

                      <h3 className="mt-5 text-xl font-bold text-slate-950">
                        {t(`services.items.${key}.title`)}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {t(`services.items.${key}.description`)}
                      </p>

                      <ul className="mt-5 space-y-2">
                        {highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <CheckCircle2
                              aria-hidden="true"
                              className="mt-0.5 h-4 w-4 shrink-0 text-orange-600"
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-6">
                        <Link
                          href={href}
                          className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                        >
                          {t(`services.items.${key}.linkLabel`)}

                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Working principles */}
          <section
            aria-labelledby="approach-heading"
            className="mt-20"
          >
            <header className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                {t("approach.eyebrow")}
              </p>

              <h2
                id="approach-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-950"
              >
                {t("approach.title")}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {t("approach.description")}
              </p>
            </header>

            <ol className="relative mt-10 space-y-6">
              <div
                aria-hidden="true"
                className="absolute bottom-8 left-6 top-8 w-px bg-slate-200 md:left-7"
              />

              {approachItems.map(({ key, icon: Icon }, index) => (
                <li
                  key={key}
                  className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-4 md:grid-cols-[56px_minmax(0,1fr)]"
                >
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 bg-blue-900 text-white shadow-sm md:h-14 md:w-14">
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </div>

                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                          {t("approach.itemLabel", {
                            number: index + 1,
                          })}
                        </p>

                        <h3 className="mt-2 text-lg font-bold text-slate-950">
                          {t(`approach.items.${key}.title`)}
                        </h3>
                      </div>

                      <CheckCircle2
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-blue-700"
                      />
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {t(`approach.items.${key}.description`)}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </section>

          {/* Contact call to action */}
          <section
            aria-labelledby="collaboration-heading"
            className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 px-6 py-12 text-white shadow-lg sm:px-10 lg:px-14"
          >
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-orange-300">
                  <Rocket
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                </div>

                <h2
                  id="collaboration-heading"
                  className="mt-5 text-3xl font-bold tracking-tight"
                >
                  {t("collaboration.title")}
                </h2>

                <p className="mt-4 text-base leading-8 text-blue-100">
                  {t("collaboration.description")}
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950"
              >
                {t("collaboration.cta")}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
