import "server-only";

import db from "@/lib/firebase/db";
import type { Article } from "@/features/interfaces/article";

const COLLECTION = "blogs";

type SupportedLocale = "en" | "fr";

export default class ArticleRepository {

  generateId(): string {
    return db.generateId(COLLECTION)
  }

  async findAll(): Promise<Article[]> {
    const result = await  db.get<Article>(COLLECTION, {
      orderByField: "createdAt",
      orderDirection: "desc",
    });

    return Array.isArray(result) ? result : [];
  }

  async findPublishedArticles(): Promise<Article[]> {
    return db.get<Article>(COLLECTION, {
      where: [
        {
          field: "status",
          value: "published",
        },
        {
          field: "active",
          value: true,
        },
      ],
      orderByField: "createdAt",
      orderDirection: "desc",
    });
  }

  async findById(id: string): Promise<Article | null> {
    const result = await db.findById<Article>(COLLECTION, id);

    return result && !Array.isArray(result) ? result : null;
  }

 async findBySlug(
     slug: string,
     locale: SupportedLocale,
   ): Promise<Article | null> {
     const field =
       locale === "en"
         ? "slug.en"
         : "slug.fr";
 
     const result =
       await db.get<Article>(
         COLLECTION, {
          where: [
            {
              field,
              value: slug
            }
          ],
          limit: 1
         },
       );
 
     return Array.isArray(result)
       ? result[0] ?? null
       : result;
   }

  async findByCategoryId(categoryId: string): Promise<Article[]> {
    return db.get(COLLECTION, { where: [{ field: "category_id", value: categoryId }],
      orderByField: "createdAt",
      orderDirection: "desc", 
    });
  }

  async findByUser(uid: string): Promise<Article[]> {
    return db.get(COLLECTION, {
      where: [
        {field: "uid", value: uid},
        {field: "active", value: true},
        {field: "status", value: "published"}
      ],
      orderByField: "createdAt",
      orderDirection: "desc",
    }
    );
  }

  async create(data: Omit<Article, "id">, id: string = ""): Promise<Article> {
    return await db.add<Omit<Article, "id">>(COLLECTION, data, id);
  }

  async update(id: string, data: Partial<Article>): Promise<boolean> {
    return await db.update<Article>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async reset(uid: string): Promise<boolean> {
    const articles = await this.findByUser(uid);

    await Promise.all(
      articles
        .filter((article) => article.id)
        .map((article) => db.remove(COLLECTION, article.id!))
    );

    return true;
  }
}