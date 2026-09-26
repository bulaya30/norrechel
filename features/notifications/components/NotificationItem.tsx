"use client";

import Link from "next/link";

import {
  Bell,
  BookOpen,
  Check,
  CodeXml,
  ExternalLink,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type {
  Notification,
  NotificationType,
} from "@/features/interfaces/notification";

import {
  normalizeDate,
  readableDate,
} from "@/lib/dates/utils";

interface NotificationItemProps {
  notification: Notification;
  locale: "en" | "fr";
  onMarkAsRead?: (id: string) => void;
  isPending?: boolean;
}

function getNotificationIcon(
  type: NotificationType,
) {
  switch (type) {
    case "article":
      return BookOpen;

    case "project":
      return CodeXml;

    case "subscriber":
      return UserPlus;

    default:
      return Bell;
  }
}

export default function NotificationItem({
  notification,
  locale,
  onMarkAsRead,
  isPending = false,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(
    notification.type,
  );

  const notificationId =
    notification.id ?? null;

  const titleId = notificationId
    ? `notification-${notificationId}-title`
    : undefined;

  const messageId = notificationId
    ? `notification-${notificationId}-message`
    : undefined;

  const timeId = notificationId
    ? `notification-${notificationId}-time`
    : undefined;

  const notificationDate = normalizeDate(
    notification.createdAt,
  );

  const displayDate = readableDate(
    notification.createdAt,
    locale === "fr" ? "fr-FR" : "en-US",
  );

  const describedBy = [
    notification.message && messageId
      ? messageId
      : null,
    displayDate && timeId
      ? timeId
      : null,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string",
    )
    .join(" ");

  return (
    <article
      aria-labelledby={titleId}
      aria-describedby={
        describedBy || undefined
      }
      className={cn(
        `
          group relative rounded-2xl border
          bg-white p-4 shadow-sm
          transition-all duration-200
          hover:border-blue-200
          hover:shadow-md
        `,
        notification.read
          ? "border-slate-200"
          : `
              border-blue-200
              bg-blue-50/60
              shadow-blue-950/5
            `,
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            `
              flex size-11 shrink-0
              items-center justify-center
              rounded-2xl ring-1
            `,
            notification.read
              ? `
                  bg-slate-100 text-slate-600
                  ring-slate-200
                `
              : `
                  bg-blue-100 text-blue-700
                  ring-blue-200
                `,
          )}
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3
                id={titleId}
                className="
                  text-sm font-bold leading-6
                  text-slate-900
                "
              >
                {notification.title}
              </h3>

              {notification.message && (
                <p
                  id={messageId}
                  className="
                    mt-1 text-sm leading-6
                    text-slate-600
                  "
                >
                  {notification.message}
                </p>
              )}
            </div>

            {!notification.read && (
              <span
                className="
                  mt-2 size-2 shrink-0
                  rounded-full bg-blue-600
                "
              >
                <span className="sr-only">
                  {locale === "fr"
                    ? "Notification non lue"
                    : "Unread notification"}
                </span>
              </span>
            )}
          </div>

          <footer
            className="
              mt-3 flex flex-wrap
              items-center justify-between
              gap-3
            "
          >
            {notificationDate &&
              displayDate && (
                <time
                  id={timeId}
                  dateTime={
                    notificationDate.toISOString()
                  }
                  className="text-xs text-slate-500"
                >
                  {displayDate}
                </time>
              )}

            <div className="flex items-center gap-2">
              {notification.href && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="
                    h-8 px-2 text-blue-700
                    hover:bg-blue-100
                    hover:text-blue-900
                  "
                >
                  <Link
                    href={notification.href}
                  >
                    {locale === "fr"
                      ? "Ouvrir"
                      : "Open"}

                    <ExternalLink
                      className="size-3.5"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              )}

              {!notification.read &&
                notificationId &&
                onMarkAsRead && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      onMarkAsRead(
                        notificationId,
                      )
                    }
                    className="
                      h-8 px-2 text-slate-600
                      hover:bg-slate-100
                      hover:text-slate-950
                    "
                  >
                    <Check
                      className="size-3.5"
                      aria-hidden="true"
                    />

                    {locale === "fr"
                      ? "Marquer comme lue"
                      : "Mark as read"}
                  </Button>
                )}
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}