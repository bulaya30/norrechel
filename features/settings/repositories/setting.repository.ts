import "server-only";

import db from "@/lib/firebase/db";
import type { Setting } from "@/features/interfaces/setting";

const COLLECTION = "settings";

export default class SettingsRepository {
  async findAll(): Promise<Setting[]> {
    const result = await db.get<Setting>(COLLECTION,);
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async findById(id: string): Promise<Setting | null> {
    const result = await db.findById<Setting>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async findByUser(uid: string): Promise<Setting | null> {
    const settings = await db.get<Setting>(COLLECTION, {
      where: [{ field: "uid", value: uid }],
    });
    return settings[0] ?? null;
  }

  async create(data: Omit<Setting, "id">): Promise<Setting> {
    return await db.add<Setting>(COLLECTION, data);
  }

  async createDefaultSettings(uid: string): Promise<Setting> {
    return await this.create({
      uid,
      theme: "default",
      active: true,
    });
  }

  async update(id: string, data: Partial<Setting>): Promise<boolean> {
    return await db.update<Setting>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async reset(uid: string): Promise<boolean> {
    const setting = await this.findByUser(uid);

    if (!setting?.id) {
      return false;
    }

    await db.remove(COLLECTION, setting.id);

    return true;
  }
}