import {
  BrainCircuit,
  CodeXml,
  Database,
  Lightbulb,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface AuthorAboutProps {
  locale: SupportedLocale;
  bio?: string;
  skills?: string[];
}

interface FocusItem {
  title: string;
  description: string;
  icon: ReactNode;
}

const focusItems = [
  {
    key: "softwareDevelopment",
    icon: CodeXml,
  },
  {
    key: "dataAnalytics",
    icon: Database,
  },
  {
    key: "problemSolving",
    icon: BrainCircuit,
  },
  {
    key: "entrepreneurship",
    icon: Lightbulb,
  },
] as const;

export default async function AuthorAbout({
  locale,
  bio,
  skills = [],
}: AuthorAboutProps) {
  const t = await getTranslations({
    locale,
    namespace: "AuthorAbout",
  });

  const focus: FocusItem[] = focusItems.map((item) => {
    const Icon = item.icon;

    return {
      title: t(`focus.${item.key}.title`),
      description: t(`focus.${item.key}.description`),
      icon: <Icon className="size-6" aria-hidden="true" />,
    };
  });

  const introduction = bio || t("introduction");

  return (
    <section
      aria-labelledby="author-about-heading"
      className="space-y-10"
    >
      <header className="max-w-3xl">
        <h3
          id="author-about-heading"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          {t("heading")}
        </h3>

        <p className="mt-4 text-base leading-8 text-slate-600">
          {introduction}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {focus.map((item) => (
          <article
            key={item.title}
            className="
              rounded-2xl border border-slate-200
              bg-white p-6 shadow-sm
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-blue-200
              hover:shadow-md
            "
          >
            <div
              className="
                flex size-12 items-center justify-center
                rounded-2xl bg-blue-50 text-blue-700
                ring-1 ring-blue-100
              "
              aria-hidden="true"
            >
              {item.icon}
            </div>

            <h4 className="mt-5 text-lg font-bold text-slate-900">
              {item.title}
            </h4>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      {skills.length > 0 && (
        <section aria-labelledby="author-skills-heading">
          <h4
            id="author-skills-heading"
            className="text-lg font-bold text-slate-900"
          >
            {t("skillsHeading")}
          </h4>

          <ul
            aria-label={t("skillsHeading")}
            className="mt-4 flex flex-wrap gap-2"
          >
            {skills.map((skill) => (
              <li
                key={skill}
                className="
                  rounded-full border border-slate-200
                  bg-slate-50 px-3 py-1.5
                  text-sm font-medium text-slate-700
                "
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}