import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { categoryService } from "@/lib/container/category.container";

import type { Category } from "@/features/interfaces/category";

import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

export async function getCachedCategories(): Promise<Category[]> {
  "use cache";

  cacheLife("hours");
  cacheTag("categories");

  const categories =
    await categoryService.getCategories();

  return serializeFirestore(categories);
}

export async function getCachedCategoryById(id: string): Promise<Category | null> {
    "use cache";
    cacheLife("hours");
    cacheTag("categories", `categories:id:${id}`);

    const category = await categoryService.getCategoryById(id);

    return serializeFirestore(category);
}

export async function getCachedCategoryBySlug(slug: string): Promise<Category | null> {
    "use cache";
    cacheLife("hours");
    cacheTag("categories", `categories:slug:${slug}`);

    const category = await categoryService.getCategoryBySlug(slug);

    return serializeFirestore(category);
}