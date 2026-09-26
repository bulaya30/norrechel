import { notFound } from "next/navigation";

import ProfileManager from "@/features/users/components/ProfileManager";

import {
  requireAuthenticatedUser,
} from "@/features/auth/lib/requireAuthenticatedUser";
import { getCachedUserById } from "@/features/users/queries/user.queries";

type SupportedLocale = "en" | "fr";

interface ProfilePageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { locale } = await params;

  const authUser = await requireAuthenticatedUser();

  const user = await getCachedUserById(authUser.userId);

  if (!user) {
    notFound();
  }

  return (
    <ProfileManager
      user={user}
      locale={locale}
    />
  );
}
