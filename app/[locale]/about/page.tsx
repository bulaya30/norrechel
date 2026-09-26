import Image from "next/image";
import Link from "next/link";

import { getLocale } from "next-intl/server";

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

type SupportedLocale = "en" | "fr";

interface LocalizedText {
  en: string;
  fr: string;
}

interface ServiceItem {
  title: LocalizedText;
  description: LocalizedText;
  highlights: LocalizedText[];
  href: string;
  linkLabel: LocalizedText;
  icon: LucideIcon;
}

interface ApproachItem {
  title: LocalizedText;
  description: LocalizedText;
  icon: LucideIcon;
}

const services: ServiceItem[] = [
  {
    title: {
      en: "Technical Writing & Insights",
      fr: "Rédaction technique et réflexions",
    },
    description: {
      en: "I turn technical concepts, project experiences, and lessons learned into practical content that helps people understand and apply technology with confidence.",
      fr: "Je transforme des concepts techniques, des expériences de projet et des leçons apprises en contenus pratiques qui aident chacun à comprendre et à utiliser la technologie avec confiance.",
    },
    highlights: [
      {
        en: "Software engineering lessons",
        fr: "Leçons de génie logiciel",
      },
      {
        en: "Practical development guides",
        fr: "Guides pratiques de développement",
      },
      {
        en: "Project reflections",
        fr: "Retours d’expérience sur les projets",
      },
    ],
    href: "/blogs",
    linkLabel: {
      en: "Explore articles",
      fr: "Explorer les articles",
    },
    icon: BookOpenText,
  },
  {
    title: {
      en: "Data Analysis & Decision Support",
      fr: "Analyse de données et aide à la décision",
    },
    description: {
      en: "I organize, analyze, and interpret data to reveal patterns, measure performance, and support clearer, evidence-based decisions.",
      fr: "J’organise, j’analyse et j’interprète les données afin de révéler des tendances, mesurer les performances et soutenir des décisions plus claires fondées sur des faits.",
    },
    highlights: [
      {
        en: "Performance analysis",
        fr: "Analyse des performances",
      },
      {
        en: "Dashboards and reporting",
        fr: "Tableaux de bord et rapports",
      },
      {
        en: "Actionable insights",
        fr: "Informations exploitables",
      },
    ],
    href: "/projects",
    linkLabel: {
      en: "View data projects",
      fr: "Voir les projets de données",
    },
    icon: BarChart3,
  },
  {
    title: {
      en: "Web Applications & Digital Systems",
      fr: "Applications web et systèmes numériques",
    },
    description: {
      en: "I design and build maintainable digital products focused on usability, accessibility, performance, and real operational needs.",
      fr: "Je conçois et développe des produits numériques maintenables, axés sur la facilité d’utilisation, l’accessibilité, la performance et les besoins opérationnels réels.",
    },
    highlights: [
      {
        en: "Modern web applications",
        fr: "Applications web modernes",
      },
      {
        en: "Accessible user interfaces",
        fr: "Interfaces utilisateur accessibles",
      },
      {
        en: "Scalable application architecture",
        fr: "Architecture applicative évolutive",
      },
    ],
    href: "/projects",
    linkLabel: {
      en: "Explore software projects",
      fr: "Explorer les projets logiciels",
    },
    icon: CodeXml,
  },
];

const approachItems: ApproachItem[] = [
  {
    title: {
      en: "Curiosity & Learning",
      fr: "Curiosité et apprentissage",
    },
    description: {
      en: "I approach every project with curiosity, ask the right questions, and remain open to better ways of solving the problem.",
      fr: "J’aborde chaque projet avec curiosité, je pose les bonnes questions et je reste ouvert à de meilleures manières de résoudre le problème.",
    },
    icon: Lightbulb,
  },
  {
    title: {
      en: "Collaboration & Sharing",
      fr: "Collaboration et partage",
    },
    description: {
      en: "I value clear communication, shared knowledge, and teamwork because strong solutions are rarely built in isolation.",
      fr: "J’accorde de l’importance à une communication claire, au partage des connaissances et au travail d’équipe, car les bonnes solutions sont rarement construites seules.",
    },
    icon: Handshake,
  },
  {
    title: {
      en: "Impact-Driven Work",
      fr: "Travail axé sur l’impact",
    },
    description: {
      en: "I focus on solutions that address real needs, create practical value, and remain useful beyond their initial implementation.",
      fr: "Je me concentre sur des solutions qui répondent à des besoins réels, créent une valeur pratique et restent utiles au-delà de leur mise en œuvre initiale.",
    },
    icon: Target,
  },
  {
    title: {
      en: "Continuous Growth",
      fr: "Progression continue",
    },
    description: {
      en: "Every challenge is an opportunity to improve my technical judgment, refine my process, and build with greater confidence.",
      fr: "Chaque défi est une occasion d’améliorer mon jugement technique, d’affiner ma méthode et de construire avec davantage de confiance.",
    },
    icon: TrendingUp,
  },
];

export default async function AboutPage() {
  const locale = (await getLocale()) as SupportedLocale;

  return (
    <main id="main" className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 pt-22">
        <Header />

        <div className="mx-auto max-w-6xl">
          <section
            aria-labelledby="about-page-heading"
            className="max-w-3xl"
          >
            <div
              className="
                mb-4 inline-flex items-center gap-2 rounded-full
                bg-orange-50 px-4 py-2 text-sm font-semibold
                text-orange-700
              "
            >
              <UserRound aria-hidden="true" className="h-4 w-4" />

              {locale === "fr" ? "À propos de moi" : "About Me"}
            </div>

            <h1
                id="about-page-heading"
                className="
                    text-3xl font-bold tracking-tight text-slate-950
                    sm:text-4xl lg:text-5xl
                "
                >
                {locale === "fr"
                    ? "Technologie, données et solutions conçues pour des besoins réels"
                    : "Technology, Data, and Solutions Built for Real Needs"}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {locale === "fr"
                    ? "Je réunis l’ingénierie des télécommunications, le développement logiciel et l’analyse de données pour créer des systèmes pratiques, accessibles et capables de produire une valeur durable."
                    : "I bring together telecommunications engineering, software development, and data analysis to create practical, accessible systems that deliver lasting value."}
            </p>

            <Link
              href={`/${locale}/blogs`}
              className="
                mt-7 inline-flex items-center gap-2 rounded-lg
                bg-orange-600 px-5 py-3 text-sm font-semibold
                text-white transition-colors hover:bg-orange-700
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-orange-600
                focus-visible:ring-offset-2
              "
            >
              {locale === "fr"
                ? "Explorer mes articles"
                : "Explore my articles"}

              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </section>

          <section
            aria-labelledby="profile-heading"
            className="
              mt-14 grid gap-8 rounded-3xl border border-slate-200
              bg-white p-6 shadow-sm
              md:grid-cols-[320px_minmax(0,1fr)]
              md:p-8 lg:gap-12
            "
          >
            <div className="relative min-h-80 overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src="/img/aboutPhoto.png"
                alt={
                  locale === "fr"
                    ? "Portrait de Norbert Bulaya"
                    : "Portrait of Norbert Bulaya"
                }
                fill
                priority
                sizes="(min-width: 768px) 320px, 100vw"
                className="object-cover"
              />

              <div
                aria-hidden="true"
                className="
                  absolute inset-x-0 bottom-0 h-1/3
                  bg-gradient-to-t from-slate-950/60
                  to-transparent
                "
              />
            </div>

            <div className="flex flex-col justify-center">
              <div>
                <p
                  className="
                    text-sm font-semibold uppercase
                    tracking-[0.18em] text-orange-600
                  "
                >
                  {locale === "fr" ? "Mon parcours" : "My Background"}
                </p>

                <h2
                  id="profile-heading"
                  className="
                    mt-2 text-2xl font-bold tracking-tight
                    text-slate-950 sm:text-3xl
                  "
                >
                  {locale === "fr" ? "Qui suis-je ?" : "Who I Am"}
                </h2>

                <p className="mt-5 text-base leading-8 text-slate-600">
                    {locale === "fr"
                        ? "Je suis ingénieur en télécommunications, développeur web et analyste de données. Je conçois des solutions numériques qui répondent à des problèmes concrets et améliorent la manière dont les personnes et les organisations travaillent."
                        : "I am a telecommunications engineer, web developer, and data analyst. I design digital solutions that address real problems and improve how people and organizations work."}
                </p>

                <p className="mt-4 text-base leading-8 text-slate-600">
                    {locale === "fr"
                        ? "Mon expérience dans les logiciels, les réseaux et les données me permet de combiner raisonnement analytique, créativité et expertise technique afin de construire des produits utiles, fiables et durables."
                        : "My experience across software, networks, and data allows me to combine analytical thinking, creativity, and technical expertise to build useful, reliable, and sustainable products."}
                </p>
              </div>

              <div className="my-8 h-px bg-slate-200" />

              <div>
                <p
                  className="
                    text-sm font-semibold uppercase
                    tracking-[0.18em] text-blue-700
                  "
                >
                  {locale === "fr" ? "Ma mission" : "My Mission"}
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  {locale === "fr"
                    ? "Relier l’innovation aux besoins réels"
                    : "Connecting Innovation to Real Needs"}
                </h2>

                <p className="mt-4 text-base leading-8 text-slate-600">
                  {locale === "fr"
                    ? "Ma mission est d’utiliser la technologie comme un outil de résolution de problèmes, de création d’opportunités et de partage des connaissances. Je cherche à développer des solutions pratiques, accessibles et centrées sur les besoins réels des utilisateurs."
                    : "My mission is to use technology as a tool for solving problems, creating opportunities, and sharing knowledge. I aim to build practical, accessible solutions centered on genuine user needs."}
                </p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="services-heading"
            className="mt-20"
          >
            <header className="mx-auto max-w-2xl text-center">
              <p
                className="
                  text-sm font-semibold uppercase
                  tracking-[0.18em] text-orange-600
                "
              >
                {locale === "fr"
                  ? "Domaines d’expertise"
                  : "Areas of Expertise"}
              </p>

              <h2
                id="services-heading"
                className="
                  mt-3 text-3xl font-bold tracking-tight
                  text-slate-950
                "
              >
                {locale === "fr"
                  ? "Comment je crée de la valeur"
                  : "How I Create Value"}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {locale === "fr"
                  ? "Mon travail combine développement logiciel, analyse de données et partage de connaissances pour transformer des besoins réels en solutions utiles."
                  : "My work combines software development, data analysis, and knowledge sharing to turn real needs into useful solutions."}
              </p>
            </header>

            <ul
              role="list"
              className="
                mt-10 grid grid-cols-1 gap-6
                md:grid-cols-2 lg:grid-cols-3
              "
            >
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <li key={service.title.en}>
                    <article
                      className="
                        group flex h-full flex-col rounded-2xl
                        border border-slate-200 bg-white p-6
                        shadow-sm transition-all duration-300
                        hover:-translate-y-1
                        hover:border-orange-200 hover:shadow-lg
                      "
                    >
                      <div
                        className="
                          flex h-12 w-12 items-center justify-center
                          rounded-xl bg-orange-50 text-orange-600
                          transition-colors duration-300
                          group-hover:bg-orange-600
                          group-hover:text-white
                        "
                      >
                        <Icon
                          aria-hidden="true"
                          className="h-6 w-6"
                        />
                      </div>

                      <h3 className="mt-5 text-xl font-bold text-slate-950">
                        {service.title[locale]}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {service.description[locale]}
                      </p>

                      <ul className="mt-5 space-y-2">
                        {service.highlights.map((highlight) => (
                          <li
                            key={highlight.en}
                            className="
                              flex items-start gap-2
                              text-sm text-slate-600
                            "
                          >
                            <CheckCircle2
                              aria-hidden="true"
                              className="
                                mt-0.5 h-4 w-4 shrink-0
                                text-orange-600
                              "
                            />

                            <span>{highlight[locale]}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-6">
                        <Link
                          href={`/${locale}${service.href}`}
                          className="
                            inline-flex items-center gap-2
                            rounded-sm text-sm font-semibold
                            text-orange-600 transition-colors
                            hover:text-orange-700
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-orange-600
                            focus-visible:ring-offset-2
                          "
                        >
                          {service.linkLabel[locale]}

                          <ArrowUpRight
                            aria-hidden="true"
                            className="
                              h-4 w-4 transition-transform
                              group-hover:-translate-y-0.5
                              group-hover:translate-x-0.5
                            "
                          />
                        </Link>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            aria-labelledby="approach-heading"
            className="mt-20"
          >
            <header className="max-w-2xl">
              <p
                className="
                  text-sm font-semibold uppercase
                  tracking-[0.18em] text-blue-700
                "
              >
                {locale === "fr"
                  ? "Principes de travail"
                  : "Working Principles"}
              </p>

              <h2
                id="approach-heading"
                className="
                  mt-3 text-3xl font-bold tracking-tight
                  text-slate-950
                "
              >
                {locale === "fr" ? "Mon approche" : "My Approach"}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {locale === "fr"
                  ? "Ces principes guident la manière dont j’apprends, collabore et construis des solutions."
                  : "These principles guide how I learn, collaborate, and build solutions."}
              </p>
            </header>

            <ol className="relative mt-10 space-y-6">
              <div
                aria-hidden="true"
                className="
                  absolute bottom-8 left-6 top-8
                  w-px bg-slate-200 md:left-7
                "
              />

              {approachItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <li
                    key={item.title.en}
                    className="
                      relative grid
                      grid-cols-[48px_minmax(0,1fr)] gap-4
                      md:grid-cols-[56px_minmax(0,1fr)]
                    "
                  >
                    <div
                      className="
                        relative z-10 flex h-12 w-12
                        items-center justify-center rounded-full
                        border-4 border-slate-50 bg-blue-900
                        text-white shadow-sm md:h-14 md:w-14
                      "
                    >
                      <Icon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </div>

                    <article
                      className="
                        rounded-2xl border border-slate-200
                        bg-white p-5 shadow-sm
                        transition-shadow hover:shadow-md
                        md:p-6
                      "
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className="
                              text-xs font-bold uppercase
                              tracking-[0.16em] text-orange-600
                            "
                          >
                            {locale === "fr"
                              ? `Principe ${index + 1}`
                              : `Principle ${index + 1}`}
                          </p>

                          <h3 className="mt-2 text-lg font-bold text-slate-950">
                            {item.title[locale]}
                          </h3>
                        </div>

                        <CheckCircle2
                          aria-hidden="true"
                          className="
                            h-5 w-5 shrink-0 text-blue-700
                          "
                        />
                      </div>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.description[locale]}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ol>
          </section>

          <section
            aria-labelledby="collaboration-heading"
            className="
              mt-20 overflow-hidden rounded-3xl
              bg-gradient-to-br from-blue-950
              via-blue-900 to-slate-900
              px-6 py-12 text-white shadow-lg
              sm:px-10 lg:px-14
            "
          >
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <div
                  className="
                    inline-flex h-12 w-12 items-center
                    justify-center rounded-xl bg-white/10
                    text-orange-300
                  "
                >
                  <Rocket
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                </div>

                <h2
                  id="collaboration-heading"
                  className="
                    mt-5 text-3xl font-bold
                    tracking-tight
                  "
                >
                  {locale === "fr"
                    ? "Construisons quelque chose d’utile ensemble"
                    : "Let’s Build Something Useful Together"}
                </h2>

                <p className="mt-4 text-base leading-8 text-blue-100">
                  {locale === "fr"
                    ? "Je suis ouvert aux collaborations, aux projets ambitieux, aux opportunités professionnelles et aux échanges constructifs autour de la technologie, des données et de l’innovation."
                    : "I am open to collaboration, ambitious projects, professional opportunities, and constructive conversations about technology, data, and innovation."}
                </p>
              </div>

              <Link
                href={`/${locale}/contact`}
                className="
                  inline-flex w-fit items-center gap-2
                  rounded-lg bg-orange-600 px-6 py-3
                  font-semibold text-white transition-colors
                  hover:bg-orange-500
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-400
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-blue-950
                "
              >
                {locale === "fr"
                  ? "Me contacter"
                  : "Contact me"}

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