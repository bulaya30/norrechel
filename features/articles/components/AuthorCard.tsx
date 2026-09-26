import Image from "next/image";
import Link from "next/link";

interface AuthorCardProps {
  id?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageUrl?: string;
  role?: string;
  locale?: string;
}

export default function AuthorCard({
  id,
  firstName,
  lastName,
  bio,
  imageUrl,
  role,
  locale = "en",
}: AuthorCardProps) {
  const authorName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    (locale === "fr" ? "Auteur inconnu" : "Unknown author");

  const authorUrl = id
    ? `/${locale}/author/${id}`
    : null;

  return (
    <aside
      aria-labelledby="author-card-heading"
      className="
        my-12 rounded-2xl border border-slate-200
        bg-slate-50 p-6 shadow-sm
      "
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* {imageUrl && (
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
        )} */}

        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            {locale === "fr"
              ? "À propos de l’auteur"
              : "About the author"}
          </p>

          <h2
            id="author-card-heading"
            className="mt-1 text-xl font-bold text-slate-900"
          >
            {authorName}
          </h2>

          {role && (
            <p className="mt-1 text-sm font-medium text-slate-500">
              {role}
            </p>
          )}

          {bio && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {bio}
            </p>
          )}

          {authorUrl && (
            <Link
              href={authorUrl}
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
              {locale === "fr"
                ? "Voir le profil"
                : "View profile"}

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