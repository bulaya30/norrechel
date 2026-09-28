import { notFound, redirect } from "next/navigation";

import UpdateProfile from "@/features/users/components/edit/UpdateProfile";
import { getCachedUserById } from "@/features/users/queries/user.queries";

import {
  requireAuthenticatedUser,
} from "@/features/auth/lib/requireAuthenticatedUser";

type SupportedLocale = "en" | "fr";

interface ProfileEditPageProps {
  params: Promise<{
    locale: SupportedLocale;
    id: string;
  }>;
}

export default async function ProfileEditPage({
  params,
}: ProfileEditPageProps) {
  const { locale, id } = await params;

  const authUser = await requireAuthenticatedUser();

  /*
   * The authenticated user's UID is the source of truth.
   * The route ID is only used to validate the requested profile URL.
   */
  if (id !== authUser.userId) {
    redirect(`/${locale}/dashboard/profile/${authUser.userId}/edit`);
  }

  const user = await getCachedUserById(authUser.userId);

  if (!user) {
    notFound();
  }

  return (
    <section
      aria-labelledby="profile-edit-heading"
      className="w-full"
    >
      {/* Page heading */}
      <div className="mb-6">
        <h1
          id="profile-edit-heading"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Edit Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal and professional information.
        </p>
      </div>

      {/* Back to profile */}
      <div className="mb-6">
        <a
          href={`/${locale}/dashboard/profile`}
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Back to Profile
        </a>
      </div>

      {/* Profile form */}
      <UpdateProfile user={user} locale={locale} />
    </section>
  );
}
