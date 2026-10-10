import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type SupportedLocale = "en" | "fr";

interface AuthorCardProps {
  id?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageUrl?: string;
  role?: string;
  locale?: SupportedLocale;
}

export default async function AuthorCard({
  id,
  firstName,
  lastName,
  bio,
  imageUrl,
  locale = "en",
}: AuthorCardProps) {
  const t = await getTranslations({
    locale,
    namespace: "Blogs.AuthorCard",
  });

  const authorName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    t("unknownAuthor");

  return (
    <aside
      aria-labelledby="author-card-heading"
      className="
        my-12 rounded-2xl border border-slate-200
        bg-slate-50 p-6 shadow-sm
      "
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {imageUrl && (
          <div className="shrink-0">
            <Image
              src={imageUrl}
              alt={authorName}
              width={96}
              height={96}
              className="
                h-24 w-24 rounded-full
                border border-slate-200
                object-cover
              "
            />
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            {t("eyebrow")}
          </p>

          <h2
            id="author-card-heading"
            className="mt-1 text-xl font-bold text-slate-900"
          >
            {authorName}
          </h2>


          {bio && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {bio}
            </p>
          )}

          {id && (
            <Link
              href={`/author/${id}`}
              className="
                mt-4 inline-flex items-center
                text-sm font-semibold text-blue-700
                transition-colors
                hover:text-blue-900 hover:underline
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-600
                focus-visible:ring-offset-2
              "
            >
              {t("viewProfile")}

              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}