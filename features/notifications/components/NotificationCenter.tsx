"use client";

import { useOptimistic, useTransition } from "react";
import { useTranslations } from "next-intl";

import {
  Bell,
  BookOpen,
  CheckCircle2,
  CodeXml,
  UserPlus,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import NotificationItem from "./NotificationItem";

import {
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from "@/features/notifications/actions/notification.actions";

import type { Notification } from "@/features/interfaces/notification";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

type NotificationFilter =
  | "all"
  | "article"
  | "project"
  | "subscriber";

interface NotificationCenterProps {
  notifications: Notification[];
  locale: SupportedLocale;
}

type OptimisticAction =
  | {
      type: "mark-one";
      id: string;
    }
  | {
      type: "mark-all";
    };

export default function NotificationCenter({
  notifications,
  locale,
}: NotificationCenterProps) {
  const t = useTranslations("NotificationCenter");

  const [isPending, startTransition] = useTransition();

  const [
    optimisticNotifications,
    updateOptimisticNotifications,
  ] = useOptimistic(
    notifications,
    (
      currentNotifications,
      action: OptimisticAction,
    ) => {
      if (action.type === "mark-all") {
        return currentNotifications.map((notification) => ({
          ...notification,
          read: true,
        }));
      }

      return currentNotifications.map((notification) =>
        notification.id === action.id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      );
    },
  );

  const filters: Array<{
    value: NotificationFilter;
    label: string;
    icon: typeof Bell;
  }> = [
    {
      value: "all",
      label: t("filters.all"),
      icon: Bell,
    },
    {
      value: "article",
      label: t("filters.articles"),
      icon: BookOpen,
    },
    {
      value: "project",
      label: t("filters.projects"),
      icon: CodeXml,
    },
    {
      value: "subscriber",
      label: t("filters.subscribers"),
      icon: UserPlus,
    },
  ];

  const unreadCount = optimisticNotifications.filter(
    (notification) => notification.read === false,
  ).length;

  function handleMarkAsRead(id: string) {
    startTransition(async () => {
      updateOptimisticNotifications({
        type: "mark-one",
        id,
      });

      await markNotificationAsReadAction(id);
    });
  }

  function handleMarkAllAsRead() {
    startTransition(async () => {
      updateOptimisticNotifications({
        type: "mark-all",
      });

      await markAllNotificationsAsReadAction();
    });
  }

  function getFilteredNotifications(
    filter: NotificationFilter,
  ): Notification[] {
    if (filter === "all") {
      return optimisticNotifications;
    }

    return optimisticNotifications.filter(
      (notification) => notification.type === filter,
    );
  }

  function renderNotificationList(filter: NotificationFilter) {
    const filteredNotifications = getFilteredNotifications(filter);

    if (filteredNotifications.length === 0) {
      return (
        <div
          className="
            rounded-2xl border border-dashed
            border-slate-300 bg-slate-50
            px-6 py-14 text-center
          "
        >
          <div
            className="
              mx-auto flex size-12
              items-center justify-center
              rounded-2xl bg-slate-100
              text-slate-500
              ring-1 ring-slate-200
            "
          >
            <Bell className="size-5" aria-hidden="true" />
          </div>

          <h3 className="mt-4 font-bold text-slate-900">
            {t("emptyTitle")}
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            {t("emptyDescription")}
          </p>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {filteredNotifications.map((notification, index) => (
          <li
            key={
              notification.id ??
              `${notification.type}-${index}`
            }
          >
            <NotificationItem
              notification={notification}
              locale={locale}
              isPending={isPending}
              onMarkAsRead={
                notification.id ? handleMarkAsRead : undefined
              }
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section
      aria-labelledby="notification-center-heading"
      className="
        overflow-hidden rounded-2xl
        border border-slate-200
        bg-white p-5 shadow-sm
        sm:p-6
      "
    >
      <header
        className="
          mb-6 flex flex-col gap-4
          border-b border-slate-200
          pb-5 sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2
            id="notification-center-heading"
            className="
              text-xl font-bold tracking-tight
              text-slate-950
            "
          >
            {t("recentActivity")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("unreadCount", { count: unreadCount })}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleMarkAllAsRead}
            className="
              border-blue-200 text-blue-700
              hover:bg-blue-50
              hover:text-blue-900
            "
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {t("markAllAsRead")}
          </Button>
        )}
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList
          aria-label={t("filterLabel")}
          className="
            h-auto w-full justify-start gap-1
            overflow-x-auto rounded-none
            border-b border-slate-200
            bg-transparent p-0
          "
        >
          {filters.map((filter) => {
            const Icon = filter.icon;
            const count = getFilteredNotifications(filter.value).length;

            return (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="
                  shrink-0 rounded-none
                  border-b-2 border-transparent
                  px-4 py-3 text-sm
                  font-semibold text-slate-500
                  shadow-none transition-colors
                  hover:text-blue-700
                  data-[state=active]:border-blue-700
                  data-[state=active]:bg-transparent
                  data-[state=active]:text-blue-700
                  data-[state=active]:shadow-none
                "
              >
                <Icon className="size-4" aria-hidden="true" />

                <span>{filter.label}</span>

                <span
                  className="
                    rounded-full bg-slate-100
                    px-2 py-0.5 text-xs
                    text-slate-600
                  "
                >
                  {count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {filters.map((filter) => (
          <TabsContent
            key={filter.value}
            value={filter.value}
            className="mt-5 focus-visible:outline-none"
          >
            {renderNotificationList(filter.value)}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}