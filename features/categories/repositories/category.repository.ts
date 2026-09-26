import "server-only";

import db from "@/lib/firebase/db";
import type { Category } from "@/features/interfaces/category";

const COLLECTION = "categories";

export default class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const result = await db.get<Category>(COLLECTION);
    return Array.isArray(result) ? result : [];
  }

  async findById(id: string): Promise<Category | null> {
    const result = await db.findById<Category>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const result = await db.get<Category>(COLLECTION, {
      where: [
        {
          field: "slug",
          value: slug
        }
      ]
    });

    if (Array.isArray(result)) {
      return result[0] ?? null;
    }

    return result;
  }

  async create(data: Omit<Category, "id">): Promise<Category> {
    return await db.add<Category>(COLLECTION, data);
  }

  async update(id: string, data: Partial<Category>): Promise<boolean> {
    return await db.update<Category>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async reset(): Promise<boolean> {
    const categories = await this.findAll();

    await Promise.all(
      categories
        .filter((category) => category.id)
        .map((category) => db.remove(COLLECTION, category.id!))
    );

    return true;
  }
}