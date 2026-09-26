import "server-only";

import db from "@/lib/firebase/db";
import type { Notification } from "@/features/interfaces/notification";

const COLLECTION = "notifications";

export default class NotificationRepository {
  async findAll(): Promise<Notification[]> {
    const result = await db.get<Notification>(COLLECTION);
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async findById(id: string): Promise<Notification | null> {
    const result = await db.findById<Notification>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async findByEntity(entityId: string): Promise<Notification[]> {
    return await db.get<Notification>(COLLECTION, {
      where: [
        {
          field: "entityId", 
          value: entityId
        }
      ]}
    );
  }

  async findByUser(uid: string): Promise<Notification[]> {
    return await db.get<Notification>(COLLECTION, {where: [{field: "uid", value: uid}]}); 
  }

  async create(data: Omit<Notification, "id">): Promise<Notification> {
    return await db.add<Notification>(COLLECTION, data);
  }

  async update(id: string, data: Partial<Notification>): Promise<boolean> {
    return await db.update<Notification>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async deleteByEntity(entityId: string): Promise<boolean> {
    const notifications = await this.findByEntity(entityId);

    await Promise.all(
      notifications
        .filter((notification) => notification.id)
        .map((notification) => db.remove(COLLECTION, notification.id!))
    );

    return true;
  }

  async deleteAll(uid: string): Promise<boolean> {
    const notifications = await this.findByUser(uid);

    await Promise.all(
      notifications
        .filter((notification) => notification.id)
        .map((notification) => db.remove(COLLECTION, notification.id!))
    );

    return true;
  }

  async reset(uid: string): Promise<boolean> {
    return await this.deleteAll(uid);
  }
}