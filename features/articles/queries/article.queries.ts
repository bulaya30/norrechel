import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { articleService }  from "@/lib/container/article.container";

import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

import type { Article } from "@/features/interfaces/article";

type SupportedLocale = "en" | "fr";

export async function getCachedArticles(): Promise<Article[]> {
  "use cache";

  cacheLife("hours");
  cacheTag("articles");

  const articles =
    await articleService.getArticles();

  return serializeFirestore(articles);
}

export async function getCachedPublishedArticles() {
  "use cache";

  cacheLife("hours");
  cacheTag("articles", "articles:published");

  const articles = await articleService.getPublishedArticles();

  return serializeFirestore(articles);
}

export async function getCachedArticleBySlug(
  slug: string,
  locale: SupportedLocale,
  uid: string | null,
): Promise<Article | null> {
  "use cache";

  cacheLife("hours");
  cacheTag(
    "articles",
    "articles:published",
    `article:slug:${slug}`
  );
  const article = await articleService.getArticleBySlug(slug, locale, uid);

  return serializeFirestore(article)
}

export async function getCachedArticleById(
  uid: string,
  id: string
): Promise<Article | null> {
  "use cache";

  cacheLife("hours");
  cacheTag(
    "articles",
    "articles:published",
    `article:id:${id}`
  );

  const article = await articleService.getArticleById(uid, id);
  return serializeFirestore(article)
}

export async function getCachedArticlesByCategory(
  categoryId: string
): Promise<Article[]> {
  "use cache";

  cacheLife("hours");
  cacheTag(
    "articles",
    "articles:published",
    `articles:category:${categoryId}`
  );

  return serializeFirestore(articleService.getArticlesByCategory(categoryId));
}

export async function getCachedArticlesByAuthor(
  uid: string
): Promise<Article[]> {
  "use cache";

  cacheLife("hours");
  cacheTag(
    "articles",
    "articles:published",
    `articles:author:${uid}`
  );

  const articles = await articleService.getPublishedArticlesByAuthor(uid);

  return serializeFirestore(articles);
}