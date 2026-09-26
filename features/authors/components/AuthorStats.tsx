import {
  BookOpen,
  Eye,
  FolderKanban,
  Users,
} from "lucide-react";

interface AuthorStatsProps {
  articles: number | string;
  projects: number | string;
  views: number | string;
  subscribers: number | string;
}

interface StatItemProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

function StatItem({
  label,
  value,
  icon,
}: StatItemProps) {
  return (
    <article
      className="
        rounded-2xl border border-slate-200
        bg-white p-5 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:border-blue-200
        hover:shadow-lg
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className="
            flex size-12 shrink-0 items-center justify-center
            rounded-2xl bg-blue-50 text-blue-700
            ring-1 ring-blue-100
          "
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

export default function AuthorStats({
  articles,
  projects,
  views,
  subscribers,
}: AuthorStatsProps) {
  return (
    <section
      aria-labelledby="author-statistics-heading"
      className="my-8"
    >
      <h2
        id="author-statistics-heading"
        className="sr-only"
      >
        Author statistics
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem
          label="Articles"
          value={articles}
          icon={
            <BookOpen
              className="size-5"
              aria-hidden="true"
            />
          }
        />

        <StatItem
          label="Projects"
          value={projects}
          icon={
            <FolderKanban
              className="size-5"
              aria-hidden="true"
            />
          }
        />

        <StatItem
          label="Views"
          value={views}
          icon={
            <Eye
              className="size-5"
              aria-hidden="true"
            />
          }
        />

        <StatItem
          label="Subscribers"
          value={subscribers}
          icon={
            <Users
              className="size-5"
              aria-hidden="true"
            />
          }
        />
      </div>
    </section>
  );
}