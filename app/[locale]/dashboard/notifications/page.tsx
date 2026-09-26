import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";

import NotificationCenter from "@/features/notifications/components/NotificationCenter";
import NotificationSummary from "@/features/notifications/components/NotificationSummary";

import { getCachedUserNotifications } from "@/features/notifications/queries/notification.queries";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

type SupportedLocale = "en" | "fr";

interface NotificationPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function NotificationPage({
  params,
}: NotificationPageProps) {
  const { locale } = await params;

  // Dynamic/request-specific operation happens OUTSIDE cache.
  const { userId } =
    await requireAuthenticatedUser();

  // Only stable data is passed into the cached query.
  const result =
    await getCachedUserNotifications(userId);

  const notifications = Array.isArray(result)
    ? result.filter(Boolean)
    : [];

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.read === false,
    ).length;

  return (
    <>
      <DashboardPageHeader
        eyebrow={
          locale === "fr"
            ? "Activité"
            : "Activity"
        }
        title="Notifications"
        description={
          locale === "fr"
            ? "Consultez les événements récents liés à votre contenu et à votre audience."
            : "Review recent events related to your content and audience."
        }
      />

      <NotificationSummary
        total={notifications.length}
        unread={unreadCount}
        locale={locale}
      />

      <NotificationCenter
        notifications={notifications}
        locale={locale}
      />
    </>
  );
}