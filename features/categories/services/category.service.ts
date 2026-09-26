import "server-only";

import CategoryRepository from "@/features/categories/repositories/category.repository";
import type { Category, CategoryInput } from "@/features/interfaces/category";

import { Timestamp } from "firebase-admin/firestore";

export default class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();

    return categories.filter((category) => category.active !== false);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!id) {
      throw new Error("Category id is required");
    }

    return await this.categoryRepository.findById(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!slug) {
      throw new Error("Category slug is required");
    }

    const category = await this.categoryRepository.findBySlug(slug);

    if (!category || category.active === false) {
      return null;
    }

    return category;
  }

  async createCategory(category: CategoryInput): Promise<Category> {
    if (!category) {
      throw new Error("Category data is required");
    }

    const { name, slug } = category;

    if (!name || !slug) {
      throw new Error("Category name and slug are required");
    }

    const existing = await this.categoryRepository.findBySlug(slug);

    if (existing) {
      throw new Error("Category with this slug already exists");
    }

    const payload: Omit<Category, "id"> = {
      name,
      slug,
      active: true,
      date: Timestamp.now(),
    };

    return await this.categoryRepository.create(payload);
  }

  async updateCategory(
    id: string,
    category: Partial<Category>
  ): Promise<boolean> {
    if (!id) {
      throw new Error("Category id is required");
    }

    if (Object.keys(category).length === 0) {
      throw new Error("No update data provided");
    }

    const existing = await this.categoryRepository.findById(id);

    if (!existing) {
      throw new Error("Category not found");
    }

    if (existing.active === false) {
      throw new Error("Cannot update a deleted category");
    }

    if (category.slug && category.slug !== existing.slug) {
      const slugExists = await this.categoryRepository.findBySlug(category.slug);

      if (slugExists) {
        throw new Error("Category with this slug already exists");
      }
    }

    return await this.categoryRepository.update(id, category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Category id is required");
    }

    const existing = await this.categoryRepository.findById(id);

    if (!existing) {
      throw new Error("Category not found");
    }

    if (existing.active === false) {
      throw new Error("Category is already deleted");
    }

    return await this.categoryRepository.update(id, {
      active: false,
      deletedAt: Timestamp.now(),
    });
  }

  async restoreCategory(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Category id is required");
    }

    const existing = await this.categoryRepository.findById(id);

    if (!existing) {
      throw new Error("Category not found");
    }

    if (existing.active !== false) {
      throw new Error("Category is already active");
    }

    return await this.categoryRepository.update(id, {
      active: true,
      deletedAt: undefined,
    });
  }

  async resetCategory(): Promise<boolean> {
    return await this.categoryRepository.reset();
  }
}