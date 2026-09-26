import "server-only";

import db from "@/lib/firebase/db";

import type {
  Project,
} from "@/features/interfaces/project";

const COLLECTION = "projects";

type SupportedLocale = "en" | "fr";

export default class ProjectRepository {
  /*
   * -------------------------------------------
   * ID
   * -------------------------------------------
   */

  generateId(): string {
    return db.generateId(COLLECTION);
  }

  /*
   * -------------------------------------------
   * Find
   * -------------------------------------------
   */

  async findAll(
  ): Promise<Project[]> {
    const result =
      await db.get<Project>( COLLECTION, {
        orderByField: "createdAt",
        orderDirection: "desc",
      } );

    return Array.isArray(result)
      ? result
      : result
        ? [result]
        : [];
  }

  async findById(
    id: string,
  ): Promise<Project | null> {
    const result =
      await db.findById<Project>(
        COLLECTION,
        id,
      );

    return result &&
      !Array.isArray(result)
      ? result
      : null;
  }

  async findBySlug(
    slug: string,
    locale: SupportedLocale,
  ): Promise<Project | null> {
    const field = locale === "en"
        ? "slug.en"
        : "slug.fr";

    const result = await db.get<Project>(
        COLLECTION,{
          where: [
            {
              field,
              value: slug
            }
          ],
          limit: 1
        });

    return Array.isArray(result)
      ? result[0] ?? null
      : result;
  }

  async findByCategory(
    categoryId: string,
  ): Promise<Project[]> {
    return db.get<Project>( COLLECTION, {
      where: [
        {
          field: "category_id",
          value: categoryId
        }
      ],
      orderByField: "createdAt",
      orderDirection: "desc",
    }
    );
  }

  async findByUser(
    uid: string,
  ): Promise<Project[]> {
    return db.get<Project>( COLLECTION, {
      where: [
        {
          field: "uid",
          value: uid
        }
      ],
      orderByField: "createdAt",
      orderDirection: "desc",
    })
  }

  async findPublished(): Promise<Project[]> {
    return db.get<Project>( COLLECTION, {
      where: [
        {
          field: "status",
          value: "published"
        },
        {
          field: "active",
          value: true,
        },
      ],
      orderByField: "createdAt",
      orderDirection: "desc",
    })
  }

  /*
   * -------------------------------------------
   * Create
   * -------------------------------------------
   */

  async create(
    data: Omit<Project, "id">,
    docId?: string,
  ): Promise<Project> {
    return db.add<Omit<Project, "id">>(
      COLLECTION,
      data,
      docId,
    );
  }

  /*
   * -------------------------------------------
   * Update
   * -------------------------------------------
   */

  async update(
    id: string,
    data: Partial<Project>,
  ): Promise<boolean> {
    return db.update<Project>(
      COLLECTION,
      id,
      data,
    );
  }

  /*
   * -------------------------------------------
   * Delete
   * -------------------------------------------
   */

  async delete(
    id: string,
  ): Promise<boolean> {
    return db.remove(
      COLLECTION,
      id,
    );
  }

  /*
   * -------------------------------------------
   * Delete by category
   * -------------------------------------------
   */

  async deleteByCategory(
    categoryId: string,
  ): Promise<boolean> {
    const projects =
      await this.findByCategory(
        categoryId,
      );

    if (projects.length === 0) {
      return false;
    }

    await Promise.all(
      projects
        .filter(
          (project) =>
            Boolean(project.id),
        )
        .map(
          (project) =>
            db.remove(
              COLLECTION,
              project.id!,
            ),
        ),
    );

    return true;
  }

  /*
   * -------------------------------------------
   * Reset user projects
   * -------------------------------------------
   */

  async reset(
    uid: string,
  ): Promise<boolean> {
    const projects =
      await this.findByUser(uid);

    if (projects.length === 0) {
      return false;
    }

    await Promise.all(
      projects
        .filter(
          (project) =>
            Boolean(project.id),
        )
        .map(
          (project) =>
            db.remove(
              COLLECTION,
              project.id!,
            ),
        ),
    );

    return true;
  }
}