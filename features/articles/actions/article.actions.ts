"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";

import { articleService } from "@/lib/container/article.container";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

import type {
  Article,
  ArticleUpdateInput,
  Lang,
} from "@/features/interfaces/article";

import { ArticleFormInput } from "@/features/interfaces/article";

import { generateSlug } from "@/lib/slusify";

type ArticleActionResult =
  | {
      success: true;
      message: string;
      articleId?: string;
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

function invalidateSlugCaches(
  slug: Lang | null | undefined,
): void {
  if (slug?.en) {
    updateTag(
      `article:slug:${slug.en}`,
    );
  }

  if (slug?.fr) {
    updateTag(
      `article:slug:${slug.fr}`,
    );
  }
}

function invalidateArticleCaches(
  article: Partial<Article>,
): void {
  updateTag("articles");
  updateTag("articles:published");

  if (article.uid) {
    updateTag(
      `articles:author:${article.uid}`,
    );
  }

  if (article.categoryId) {
    updateTag(
      `articles:category:${article.categoryId}`,
    );
  }

  invalidateSlugCaches(
    article.slug,
  );
}


function createArticleSlugs(
  title: Lang,
): Lang {
  const temporaryId = randomUUID();

  const englishSlug = generateSlug(title.en);

  const frenchSlug = generateSlug(title.fr);

  return {
    en:
      englishSlug ||
      `draft-${temporaryId}`,

    fr:
      frenchSlug ||
      `draft-${temporaryId}`,
  };
}

/*
 * -------------------------------------------
 * Errors
 * -------------------------------------------
 */

function getArticleErrorMessage(
  error: unknown,
): string {
  if (!(error instanceof Error)) {
    return "Unable to process article.";
  }

  switch (error.message) {
    case "Unauthenticated":
    case "Invalid session":
      return "Your session has expired. Please sign in again.";

    case "Unauthorized":
      return "You are not authorized to modify this article.";

    case "Article not found":
      return "Article not found.";

    case "Category not found":
      return "The selected category does not exist.";

    case "User not found":
      return "The authenticated user could not be found.";

    case "Article with this slug already exists":
      return "An article with this title already exists.";

    case "Only JPG, PNG, and WEBP images are supported.":
      return error.message;

    case "Cover image must not exceed 5 MB.":
      return error.message;

    default:
      return error.message;
  }
}

/*
 * -------------------------------------------
 * Create
 * -------------------------------------------
 */

export async function createArticleAction(
  data: ArticleFormInput,
): Promise<ArticleActionResult> {
  try {
    const { userId } = await requireAuthenticatedUser();

    const slug = createArticleSlugs(data.title);

    const article = 
      await articleService.createArticle(
        userId, {
          title: data.title,
          slug,
          categoryId: data.categoryId,
          content: {
            en: data.content?.en,
            fr: data.content?.fr,
          },
          coverImage: data.coverImage ?? null,
        },
      );
      
    invalidateArticleCaches(
      article,
    );

    if (!article.id) {
      throw new Error(
        "Created article has no id",
      );
    }

    return {
      success: true,
      message: "Draft saved successfully.",
      articleId: article.id,
    };
  } catch (error) {
    console.error(
      "createArticleAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getArticleErrorMessage(
          error,
        ),
    };
  }
}

export async function updateArticleAction(
  id: string,
  data: ArticleUpdateInput,
): Promise<ArticleActionResult> {
  if (!id.trim()) {
    return {
      success: false,
      message: "Article ID is required.",
    };
  }

  try {
    const { userId } = await requireAuthenticatedUser();

    const oldArticle = await articleService.getArticleById(
      userId,
      id,
    );

    if (!oldArticle) {
      return {
        success: false,
        message: "Article not found.",
      };
    }

    const title = data.title ?? oldArticle.title;

    const slug = createArticleSlugs(title);

    const payload = {
      ...oldArticle,
      ...data,
      slug,
    };

    await articleService.updateArticle(
      userId,
      id,
      payload,
    );

    updateTag("articles");
    updateTag("articles:published");
    updateTag(`articles:author:${userId}`);

    if (oldArticle.categoryId) {
      updateTag(
        `articles:category:${oldArticle.categoryId}`,
      );
    }

    if (data.categoryId) {
      updateTag(
        `articles:category:${data.categoryId}`,
      );
    }

    /*
     * -------------------------------------------
     * Invalidate old and new slug caches
     * -------------------------------------------
     */
    invalidateSlugCaches(oldArticle.slug);

    invalidateSlugCaches(slug);

    return {
      success: true,
      message: "Article updated successfully.",
      articleId: id,
    };
  } catch (error) {
    console.error(
      "updateArticleAction failed:",
      error,
    );

    return {
      success: false,
      message: getArticleErrorMessage(error),
    };
  }
}

export async function publishArticleAction(
  articleId: string,
): Promise<ArticleActionResult> {
  if (!articleId.trim()) {
    return {
      success: false,
      message:
        "Article ID is required.",
    };
  }

  try {
    const { userId } = await requireAuthenticatedUser();

    const article = await articleService.getArticleById(
      userId,
      articleId,
    );

    if (!article) {
      return {
        success: false,
        message:
          "Article not found.",
      };
    }

    await articleService.publishArticle(
      userId,
      articleId,
    );

    invalidateArticleCaches( article ); 

    return {
      success: true,
      message: "Article published successfully.",
    }
  } catch (error) {
    console.error(
      "publishArticleAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getArticleErrorMessage(
          error,
        ),
    };
  }
}

/*
 * -------------------------------------------
 * Delete
 * -------------------------------------------
 */

export async function deleteArticleAction(
  articleId: string,
): Promise<ArticleActionResult> {
  if (!articleId.trim()) {
    return {
      success: false,
      message:
        "Article ID is required.",
    };
  }

  try {
    const { userId } = await requireAuthenticatedUser();

    const article = await articleService.getArticleById(
        userId,
        articleId,
      );

    if (!article) {
      return {
        success: false,
        message:
          "Article not found.",
      };
    }

    await articleService.deleteArticle(
      userId,
      articleId,
    );

    invalidateArticleCaches( article );

    return {
      success: true,
      message: "Article deleted successfully.",
      articleId,
    };
  } catch (error) {
    console.error(
      "deleteArticleAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getArticleErrorMessage(
          error,
        ),
    };
  }
}

/*
 * -------------------------------------------
 * Restore
 * -------------------------------------------
 */

export async function restoreArticleAction(
  articleId: string,
): Promise<ArticleActionResult> {
  if (!articleId.trim()) {
    return {
      success: false,
      message:
        "Article ID is required.",
    };
  }

  try {
    const { userId } = await requireAuthenticatedUser();

    const article = await articleService.getArticleById(
        userId,
        articleId,
      );

    if (!article) {
      return {
        success: false,
        message:
          "Article not found.",
      };
    }

    await articleService.restoreArticle(
      userId,
      articleId,
    );

    invalidateArticleCaches( article );

    return {
      success: true,
      message:
        "Article restored successfully.",
      articleId,
    };
  } catch (error) {
    console.error(
      "restoreArticleAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getArticleErrorMessage(
          error,
        ),
    };
  }
}