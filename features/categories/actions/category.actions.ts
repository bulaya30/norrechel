"use server";

import { updateTag } from "next/cache";

import { categoryService } from "@/lib/container/category.container";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

import type { Category } from "@/features/interfaces/category";

import { generateSlug } from "@/lib/slusify";

type CategoryActionResult =
  | {
      success: true;
      message: string;
      categoryId?: string;
    }
  | {
      success: false;
      message: string;
    };

/*
 * -------------------------------------------
 * Cache helpers
 * -------------------------------------------
 */

function invalidateCategoryCaches(
  category: Partial<Category>,
): void {
  updateTag("categories");

  if (category.id) {
    updateTag(
      `category:id:${category.id}`,
    );

    updateTag(
      `articles:category:${category.id}`,
    );

    updateTag(
      `projects:category:${category.id}`,
    );
  }

  if (category.slug) {
    updateTag(
      `category:slug:${category.slug}`,
    );
  }
}

/*
 * -------------------------------------------
 * Errors
 * -------------------------------------------
 */

function getCategoryErrorMessage(
  error: unknown,
): string {
  if (!(error instanceof Error)) {
    return "Unable to process category.";
  }

  switch (error.message) {
    case "Unauthenticated":
    case "Invalid session":
      return "Your session has expired. Please sign in again.";

    case "Unauthorized":
      return "You are not authorized to modify this category.";

    case "Category not found":
      return "Category not found.";

    case "Category data is required":
      return "Category data is required.";

    case "Category name and slug are required":
      return "Category name is required.";

    case "Category with this slug already exists":
      return "A category with this name already exists.";

    case "Category is already deleted":
      return "Category is already deleted.";

    case "Category is already active":
      return "Category is already active.";

    case "Cannot update a deleted category":
      return "A deleted category cannot be updated.";

    case "Category id is required":
      return "Category ID is required.";

    case "No update data provided":
      return "No category changes were provided.";

    default:
      return error.message;
  }
}

/*
 * -------------------------------------------
 * Create
 * -------------------------------------------
 */

export async function createCategoryAction(
  data: {
    name: string;
  },
): Promise<CategoryActionResult> {
  try {
    await requireAuthenticatedUser();

    /*
     * Generate the slug on the server.
     * The client never controls the slug.
     */
    const slug = generateSlug(data.name);

    if (!slug) {
      return {
        success: false,
        message:
          "Unable to generate a valid category slug.",
      };
    }

    const category = await categoryService.createCategory({
        name: data.name.trim(),
        slug,
      });

    invalidateCategoryCaches(category);

    if (!category.id) {
      throw new Error(
        "Created category has no id",
      );
    }

    return {
      success: true,
      message:
        "Category created successfully.",
      categoryId: category.id,
    };
  } catch (error) {
    console.error(
      "createCategoryAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getCategoryErrorMessage(error),
    };
  }
}

/*
 * -------------------------------------------
 * Update
 * -------------------------------------------
 */

export async function updateCategoryAction(
  id: string,
  data: {
    name: string;
  },
): Promise<CategoryActionResult> {
  if (!id.trim()) {
    return {
      success: false,
      message: "Category ID is required.",
    };
  }

  try {
    await requireAuthenticatedUser();

    const existing = await categoryService.getCategoryById(id);

    if (!existing) {
      return {
        success: false,
        message: "Category not found.",
      };
    }

    const name = data.name.trim();

    const slug = generateSlug(name);

    if (!slug) {
      return {
        success: false,
        message:
          "Unable to generate a valid category slug.",
      };
    }

    await categoryService.updateCategory(
      id,
      {
        name,
        slug,
      },
    );

    invalidateCategoryCaches({
      ...existing,
      id,
      name,
      slug,
    });

    return {
      success: true,
      message:
        "Category updated successfully.",
      categoryId: id,
    };
  } catch (error) {
    console.error(
      "updateCategoryAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getCategoryErrorMessage(error),
    };
  }
}

/*
 * -------------------------------------------
 * Delete
 * -------------------------------------------
 */

export async function deleteCategoryAction(
  categoryId: string,
): Promise<CategoryActionResult> {
  if (!categoryId.trim()) {
    return {
      success: false,
      message: "Category ID is required.",
    };
  }

  try {
    await requireAuthenticatedUser();

    const category =
      await categoryService.getCategoryById(
        categoryId,
      );

    if (!category) {
      return {
        success: false,
        message: "Category not found.",
      };
    }

    await categoryService.deleteCategory(
      categoryId,
    );

    invalidateCategoryCaches(category);

    return {
      success: true,
      message:
        "Category deleted successfully.",
      categoryId,
    };
  } catch (error) {
    console.error(
      "deleteCategoryAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getCategoryErrorMessage(error),
    };
  }
}

/*
 * -------------------------------------------
 * Restore
 * -------------------------------------------
 */

export async function restoreCategoryAction(
  categoryId: string,
): Promise<CategoryActionResult> {
  if (!categoryId.trim()) {
    return {
      success: false,
      message: "Category ID is required.",
    };
  }

  try {
    await requireAuthenticatedUser();

    const category =
      await categoryService.getCategoryById(
        categoryId,
      );

    if (!category) {
      return {
        success: false,
        message: "Category not found.",
      };
    }

    await categoryService.restoreCategory(
      categoryId,
    );

    invalidateCategoryCaches(category);

    return {
      success: true,
      message:
        "Category restored successfully.",
      categoryId,
    };
  } catch (error) {
    console.error(
      "restoreCategoryAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getCategoryErrorMessage(error),
    };
  }
}
