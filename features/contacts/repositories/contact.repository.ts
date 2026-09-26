import "server-only";

import db from "@/lib/firebase/db";
import type { Contact } from "@/features/interfaces/contact";

const COLLECTION = "contacts";

export default class ContactRepository {
  async findAll(): Promise<Contact[]> {
    const result = await db.get<Contact>(COLLECTION);
    return Array.isArray(result) ? result : [];
  }

  async findById(id: string): Promise<Contact | null> {
    const result = await db.findById<Contact>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async create(data: Omit<Contact, "id">): Promise<Contact> {
    return await db.add<Contact>(COLLECTION, data);
  }

  async update(id: string, data: Partial<Contact>): Promise<boolean> {
    return await db.update<Contact>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await db.remove(COLLECTION, id);
  }

  async reset(): Promise<boolean> {
    const contacts = await this.findAll();

    await Promise.all(
      contacts
        .filter((contact) => contact.id)
        .map((contact) => db.remove(COLLECTION, contact.id!))
    );

    return true;
  }
}