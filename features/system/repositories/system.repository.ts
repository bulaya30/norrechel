import "server-only";

import db from "@/lib/firebase/db";
import type { System } from "@/features/interfaces/system";

const COLLECTION = "system";

export default class SystemRepository {
  async get(): Promise<System | null> {
    const systems = await db.get<System>(COLLECTION);

    if (!Array.isArray(systems)) {
      return systems;
    }

    return systems[0] ?? null;
  }

  async initiate(): Promise<System> {
    return await db.add<System>(COLLECTION, {
      locked: true,
      date: new Date(),
    });
  }

  async update(id: string, data: Partial<System>): Promise<boolean> {
    return await db.update<System>(COLLECTION, id, data);
  }
}