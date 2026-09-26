"use server";

import { updateTag } from "next/cache";

import { notificationService } from "@/lib/container/notification.container";
import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

export type NotificationActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export async function markNotificationAsReadAction(
  id: string,
): Promise<NotificationActionResult> {
  const notificationId = id.trim();

  if (!notificationId) {
    return {
      success: false,
      message: "Notification ID is required.",
    };
  }

  try {
    const { userId } =
      await requireAuthenticatedUser();

    await notificationService.markNotificationAsRead(
      userId,
      notificationId,
    );

    updateTag("notifications");
    updateTag(`notifications:user:${userId}`);

    return {
      success: true,
      message: "Notification marked as read.",
    };
  } catch (error) {
    console.error(
      "markNotificationAsReadAction failed:",
      error,
    );

    return {
      success: false,
      message: getNotificationErrorMessage(error),
    };
  }
}

export async function markAllNotificationsAsReadAction(): Promise<NotificationActionResult> {
  try {
    const { userId } =
      await requireAuthenticatedUser();

    await notificationService.markAllNotificationsAsRead(
      userId,
    );

    updateTag("notifications");
    updateTag(`notifications:user:${userId}`);

    return {
      success: true,
      message: "All notifications marked as read.",
    };
  } catch (error) {
    console.error(
      "markAllNotificationsAsReadAction failed:",
      error,
    );

    return {
      success: false,
      message: getNotificationErrorMessage(error),
    };
  }
}

export async function deleteNotificationAction(
  id: string,
): Promise<NotificationActionResult> {
  const notificationId = id.trim();

  if (!notificationId) {
    return {
      success: false,
      message: "Notification ID is required.",
    };
  }

  try {
    const { userId } =
      await requireAuthenticatedUser();

    await notificationService.deleteNotification(
      userId,
      notificationId,
    );

    updateTag("notifications");
    updateTag(`notifications:user:${userId}`);

    return {
      success: true,
      message: "Notification deleted.",
    };
  } catch (error) {
    console.error(
      "deleteNotificationAction failed:",
      error,
    );

    return {
      success: false,
      message: getNotificationErrorMessage(error),
    };
  }
}

export async function deleteAllNotificationsAction(): Promise<NotificationActionResult> {
  try {
    const { userId } =
      await requireAuthenticatedUser();

    await notificationService.deleteAllNotifications(
      userId,
    );

    updateTag("notifications");
    updateTag(`notifications:user:${userId}`);

    return {
      success: true,
      message: "All notifications deleted.",
    };
  } catch (error) {
    console.error(
      "deleteAllNotificationsAction failed:",
      error,
    );

    return {
      success: false,
      message: getNotificationErrorMessage(error),
    };
  }
}

function getNotificationErrorMessage(
  error: unknown,
): string {
  if (!(error instanceof Error)) {
    return "Unable to update notifications.";
  }

  switch (error.message) {
    case "Unauthenticated":
    case "Invalid session":
      return "You must sign in again.";

    case "User not found":
      return "The authenticated user was not found.";

    case "Notification not found":
      return "The notification was not found.";

    case "Unauthorized":
      return "You are not allowed to modify this notification.";

    default:
      return "Unable to update notifications.";
  }
}