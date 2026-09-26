import "server-only";

import type {
  Notification,
  NotificationType,
} from "@/features/interfaces/notification";

import { Timestamp } from "firebase-admin/firestore";

import type { User } from "@/features/interfaces/user";
import NotificationRepository from "@/features/notifications/repositories/notification.repository";
import UserRepository from "@/features/users/repositories/user.repository";

type NotificationInput = {
  title: string;
  message: string;
  type: NotificationType;
  entityId?: string;
  entityType?: string;
  dedupeKey?: string;
};

export default class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository
  ) {}

  private async checkUser(uid: string): Promise<User> {
    if (!uid) {
      throw new Error("User id is required");
    }

    const user = await this.userRepository.findById(uid);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  private async checkNotification(id: string): Promise<Notification> {
    if (!id) {
      throw new Error("Notification id is required");
    }

    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  }

  async getNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.findAll();
  }

  async getNotificationById(
    uid: string,
    id: string
  ): Promise<Notification | null> {
    await this.checkUser(uid);

    const notification = await this.checkNotification(id);

    if (notification.uid !== uid) {
      throw new Error("Unauthorized");
    }

    return notification;
  }

  async getUserNotifications(uid: string): Promise<Notification[]> {
    await this.checkUser(uid);

    return await this.notificationRepository.findByUser(uid);
  }

  async createNotification(
    uid: string,
    data: NotificationInput
  ): Promise<Notification> {
    await this.checkUser(uid);

    if (!data.title || !data.message || !data.type || !data.entityType) {
      throw new Error(
        "Title, message, type, and entity type are required",
      );
    }

    const payload: Omit<Notification, "id"> = {
      uid,
      title: data.title,
      message: data.message,
      type: data.type,
      entityId: data.entityId,
      entityType: data.entityType ?? null,
      dedupeKey: data.dedupeKey ?? null,
      read: false,
      createdAt: Timestamp.now(),
    };

    return await this.notificationRepository.create(payload);
  }

  async markNotificationAsRead(uid: string, id: string): Promise<boolean> {
    await this.checkUser(uid);

    const notification = await this.checkNotification(id);

    if (notification.uid !== uid) {
      throw new Error("Unauthorized");
    }

    if (notification.read) {
      return true;
    }

    return await this.notificationRepository.update(id, {
      read: true,
      readAt: Timestamp.now(),
    });
  }

  async markAllNotificationsAsRead(uid: string): Promise<boolean> {
    await this.checkUser(uid);

    const notifications = await this.notificationRepository.findByUser(uid);

    await Promise.all(
      notifications
        .filter((notification) => notification.id && !notification.read)
        .map((notification) =>
          this.notificationRepository.update(notification.id!, {
            read: true,
            readAt: Timestamp.now(),
          })
        )
    );

    return true;
  }

  async deleteNotification(uid: string, id: string): Promise<boolean> {
    await this.checkUser(uid);

    const notification = await this.checkNotification(id);

    if (notification.uid !== uid) {
      throw new Error("Unauthorized");
    }

    return await this.notificationRepository.delete(id);
  }

  async deleteAllNotifications(uid: string): Promise<boolean> {
    await this.checkUser(uid);

    return await this.notificationRepository.deleteAll(uid);
  }

  async resetAllNotifications(uid: string): Promise<boolean> {
    await this.checkUser(uid);

    return await this.notificationRepository.reset(uid);
  }
}