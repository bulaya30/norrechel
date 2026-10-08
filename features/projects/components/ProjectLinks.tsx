import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ProjectLinksProps {
  liveUrl?: string | null;
  githubUrl?: string | null;
  locale?: "en" | "fr";
}

export default function ProjectLinks({
  liveUrl,
  githubUrl,
  locale = "en",
}: ProjectLinksProps) {
  if (!liveUrl && !githubUrl) {
    return null;
  }

  return (
    <section
      aria-label={
        locale === "fr"
          ? "Liens du projet"
          : "Project links"
      }
      className="border-t border-slate-200 pt-6"
    >
      <div className="flex flex-wrap gap-3">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-slate-950
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-orange-600
            "
          >
            <ExternalLink
              className="size-4"
              aria-hidden="true"
            />

            {locale === "fr"
              ? "Voir le projet"
              : "View project"}
          </a>
        )}

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              px-5
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              transition-colors
              hover:border-slate-300
              hover:bg-slate-50
            "
          >
            <FaGithub
              className="size-4"
              aria-hidden="true"
            />

            GitHub
          </a>
        )}
      </div>
    </section>
  );
}