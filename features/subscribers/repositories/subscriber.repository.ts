import "server-only";

import db from "@/lib/firebase/db";
import type { Subscriber } from "@/features/interfaces/subscriber";

const COLLECTION = "subscribers";

export default class SubscriberRepository {
  async findAll(): Promise<Subscriber[]> {
    const result = await db.get<Subscriber>(COLLECTION);
    return Array.isArray(result) ? result : [];
  }

  async findById(id: string): Promise<Subscriber | null> {
    const result = await db.findById<Subscriber>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const result = await db.get<Subscriber>(COLLECTION, {
      where: [
        {
          field: "email",
          value: email
        }
      ]
    });
    return Array.isArray(result) ? result[0] ?? null : result;
  }

  async create(data: Omit<Subscriber, "id">): Promise<Subscriber> {
    return await db.add<Subscriber>(COLLECTION, data);
  }

  async update(id: string, data: Partial<Subscriber>): Promise<boolean> {
    return await db.update<Subscriber>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async reset(): Promise<boolean> {
    const subscribers = await this.findAll();

    await Promise.all(
      subscribers
        .filter((subscriber) => subscriber.id)
        .map((subscriber) => db.remove(COLLECTION, subscriber.id!))
    );

    return true;
  }
}