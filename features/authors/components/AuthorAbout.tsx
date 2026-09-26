import {
  BrainCircuit,
  CodeXml,
  Database,
  Lightbulb,
} from "lucide-react";

type SupportedLocale = "en" | "fr";

interface AuthorAboutProps {
  locale: SupportedLocale;
  bio?: string;
  skills?: string[];
}

interface FocusItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AuthorAbout({
  locale,
  bio,
  skills = [],
}: AuthorAboutProps) {
  const content =
    locale === "fr"
      ? {
          heading: "À propos de l’auteur",
          introduction:
            bio ||
            "Je conçois des applications modernes, j’explore les données et je partage des connaissances pratiques autour de la technologie, de l’entrepreneuriat et du développement personnel.",
          skillsHeading: "Compétences principales",
          focus: [
            {
              title: "Développement logiciel",
              description:
                "Conception d’applications web modernes, maintenables et centrées sur les besoins réels des utilisateurs.",
              icon: <CodeXml className="size-6" aria-hidden="true" />,
            },
            {
              title: "Données et analyse",
              description:
                "Transformation des données brutes en informations utiles pour mieux comprendre les problèmes et guider les décisions.",
              icon: <Database className="size-6" aria-hidden="true" />,
            },
            {
              title: "Résolution de problèmes",
              description:
                "Approche structurée pour transformer des idées complexes en solutions pratiques et mesurables.",
              icon: <BrainCircuit className="size-6" aria-hidden="true" />,
            },
            {
              title: "Entrepreneuriat",
              description:
                "Exploration d’idées, création de projets et apprentissage continu autour de la construction d’entreprises utiles.",
              icon: <Lightbulb className="size-6" aria-hidden="true" />,
            },
          ] satisfies FocusItem[],
        }
      : {
          heading: "About the author",
          introduction:
            bio ||
            "I build modern applications, explore data, and share practical knowledge around technology, entrepreneurship, and personal development.",
          skillsHeading: "Core skills",
          focus: [
            {
              title: "Software development",
              description:
                "Building modern, maintainable web applications around real user needs and practical business requirements.",
              icon: <CodeXml className="size-6" aria-hidden="true" />,
            },
            {
              title: "Data and analytics",
              description:
                "Turning raw data into useful insights that help explain problems and support better decisions.",
              icon: <Database className="size-6" aria-hidden="true" />,
            },
            {
              title: "Problem solving",
              description:
                "Using structured thinking to transform complex ideas into practical and measurable solutions.",
              icon: <BrainCircuit className="size-6" aria-hidden="true" />,
            },
            {
              title: "Entrepreneurship",
              description:
                "Exploring ideas, building projects, and learning how useful businesses are created and sustained.",
              icon: <Lightbulb className="size-6" aria-hidden="true" />,
            },
          ] satisfies FocusItem[],
        };

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
          {content.heading}
        </h3>

        <p className="mt-4 text-base leading-8 text-slate-600">
          {content.introduction}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {content.focus.map((item) => (
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
            {content.skillsHeading}
          </h4>

          <ul
            aria-label={content.skillsHeading}
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