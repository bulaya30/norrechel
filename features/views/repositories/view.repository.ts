import "server-only";

import db from "@/lib/firebase/db";
import type { View } from "@/features/interfaces/view";

const COLLECTION = "content_views";

export default class ViewRepository {
  async findAll(): Promise<View[]> {
    const result = await db.get<View>(COLLECTION);
    return Array.isArray(result) ? result : [];
  }

  async findById(id: string): Promise<View | null> {
    const result = await db.findById<View>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async findByContent(contentId: string): Promise<View[]> {
    const result = await db.get<View>(COLLECTION, {
      where: [
        {
          field: "content_id",
          value: contentId,
        },
      ],
    });
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async findBySlug(slug: string): Promise<View[]> {
    const result = await db.get<View>(COLLECTION, {
      where: [
        {
          field: "slug",
          value: slug,
        },
      ],
    });
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async create(data: Omit<View, "id">): Promise<View> {
    return await db.add<View>(COLLECTION, data);
  }

  async update(id: string, data: Partial<View>): Promise<boolean> {
    return await db.update<View>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async reset(): Promise<boolean> {
    const views = await this.findAll();

    await Promise.all(
      views
        .filter((view) => view.id)
        .map((view) => db.remove(COLLECTION, view.id!))
    );

    return true;
  }
}