import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { getTranslations } from "next-intl/server";

interface ProjectLinksProps {
  liveUrl?: string | null;
  githubUrl?: string | null;
  locale?: "en" | "fr";
}

export default async function ProjectLinks({
  liveUrl,
  githubUrl,
  locale = "en",
}: ProjectLinksProps) {
  const t = await getTranslations({
    locale,
    namespace: "projects.ProjectLinks",
  });

  if (!liveUrl && !githubUrl) {
    return null;
  }

  return (
    <section
      aria-label={t("sectionLabel")}
      className="border-t border-slate-200 pt-6"
    >
      <div className="flex flex-wrap gap-3">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              rounded-lg bg-slate-950 px-5 py-2.5
              text-sm font-semibold text-white
              transition-colors hover:bg-orange-600
            "
          >
            <ExternalLink
              className="size-4"
              aria-hidden="true"
            />
            {t("viewProject")}
          </a>
        )}

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              rounded-lg border border-slate-200
              bg-white px-5 py-2.5 text-sm
              font-semibold text-slate-700
              transition-colors hover:border-slate-300
              hover:bg-slate-50
            "
          >
            <FaGithub
              className="size-4"
              aria-hidden="true"
            />
            {t("github")}
          </a>
        )}
      </div>
    </section>
  );
}