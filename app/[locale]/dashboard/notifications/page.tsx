import { getTranslations } from "next-intl/server";

import DashboardPageHeader from "@/features/dashboard/components/DashboardPageHeader";

import NotificationCenter from "@/features/notifications/components/NotificationCenter";
import NotificationSummary from "@/features/notifications/components/NotificationSummary";

import { getCachedUserNotifications } from "@/features/notifications/queries/notification.queries";
import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface NotificationPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export default async function NotificationPage({
  params,
}: NotificationPageProps) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "NotificationPage",
  });

  const { userId } = await requireAuthenticatedUser();

  const result = await getCachedUserNotifications(userId);

  const notifications = Array.isArray(result)
    ? result.filter(Boolean)
    : [];

  const unreadCount = notifications.filter(
    (notification) => notification.read === false,
  ).length;

  return (
    <>
      <DashboardPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
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