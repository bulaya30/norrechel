import "server-only";

import db from "@/lib/firebase/db";
import type { Engagement } from "@/features/interfaces/engagement";

const COLLECTION = "engagements";

export default class EngagementRepository {
  async findAll(): Promise<Engagement[]> {
    const result = await db.get<Engagement>(COLLECTION);
    return Array.isArray(result) ? result : [];
  }

  async findById(id: string): Promise<Engagement | null> {
    const result = await db.findById<Engagement>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async findByVisitorContentEvent(
  visitorId: string,
  contentId: string,
  contentType: string,
  eventType: string,
): Promise<Engagement | null> {
  const result = await db.get<Engagement>(COLLECTION, {
    where: [
      {
        field: "visitor_id",
        value: visitorId,
      },
      {
        field: "content_id",
        value: contentId,
      },
      {
        field: "content_type",
        value: contentType,
      },
      {
        field: "event_type",
        value: eventType,
      },
    ],
    limit: 1,
  });

  return result[0] ?? null;
}

  async findBySlug(slug: string): Promise<Engagement[]> {
    const result = await db.get<Engagement>(COLLECTION, {
      where: [
        {
          field: "slug",
          value: slug,
        },
      ]
    });
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async findByContent(contentId: string): Promise<Engagement[]> {
    const result = await db.get<Engagement>(COLLECTION, {
      where: [
        {
          field: "content_id",
          value: contentId
        }
      ]
    });
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async findByVisitor(visitorId: string): Promise<Engagement[]> {
    const result = await db.get<Engagement>(COLLECTION, {
      where: [
        {
          field: "visitor_id",
          value: visitorId
        }
      ]
    });
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async create(data: Omit<Engagement, "id">): Promise<Engagement> {
    return await db.add<Engagement>(COLLECTION, data);
  }

  async update(id: string, data: Partial<Engagement>): Promise<boolean> {
    return await db.update<Engagement>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async reset(): Promise<boolean> {
    const engagements = await this.findAll();

    await Promise.all(
      engagements
        .filter((engagement) => engagement.id)
        .map((engagement) => db.remove(COLLECTION, engagement.id!))
    );

    return true;
  }
}