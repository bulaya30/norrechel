import "server-only";

import {
  cacheLife,
  cacheTag,
} from "next/cache";

import { notificationService } from "@/lib/container/notification.container";
import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

import type { Notification } from "@/features/interfaces/notification";

export async function getCachedUserNotifications(
  userId: string,
): Promise<Notification[]> {
  "use cache";

  cacheLife("minutes");

  cacheTag(
    "notifications",
    `notifications:user:${userId}`,
  );

  const notifications =
    await notificationService.getUserNotifications(
      userId,
    );

  return serializeFirestore(notifications);
}