import "server-only";

import db from "@/lib/firebase/db";
import type { Visitor } from "@/features/interfaces/visitor";

const COLLECTION = "visitors";

export default class VisitorRepository {
  async findAll(): Promise<Visitor[]> {
    const result = await db.get<Visitor>(COLLECTION);
    return Array.isArray(result) ? result : [];
  }

  async findById(id: string): Promise<Visitor | null> {
    const result = await db.findById<Visitor>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async findByVisitorId(visitorId: string): Promise<Visitor | null> {
    const result = await db.get<Visitor>(COLLECTION, {
      where: [
        {
          field: "visitor_id",
          value: visitorId,
        },
      ],
    });
    return Array.isArray(result) ? result[0] ?? null : result;
  }

  async findBySessionId(sessionId: string): Promise<Visitor | null> {
    const result = await db.get<Visitor>(COLLECTION, {
      where: [
        {
          field: "session_id",
          value: sessionId,
        },
      ],
    });
    return Array.isArray(result) ? result[0] ?? null : result;
  }

  async findByContent(contentId: string): Promise<Visitor[]> {
    const result = await db.get<Visitor>(COLLECTION, {
      where: [
        {
          field: "content_id",
          value: contentId,
        },
      ],
    });
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async findByIp(ip: string): Promise<Visitor | null> {
    const result = await db.get<Visitor>(COLLECTION, {
      where: [
        {
          field: "ip",
          value: ip,
        },
      ],
    });
    return Array.isArray(result) ? result[0] ?? null : result;
  }

  async create(data: Omit<Visitor, "id">): Promise<Visitor> {
    return await db.add<Visitor>(COLLECTION, data);
  }

  async update(id: string, data: Partial<Visitor>): Promise<boolean> {
    return await db.update<Visitor>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async reset(): Promise<boolean> {
    const visitors = await this.findAll();

    await Promise.all(
      visitors
        .filter((visitor) => visitor.id)
        .map((visitor) => db.remove(COLLECTION, visitor.id!))
    );

    return true;
  }
}