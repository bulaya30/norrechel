import "server-only";

import db, { auth } from "@/lib/firebase/db";
import type { User } from "@/features/interfaces/user";
import type { DecodedIdToken, UserRecord } from "firebase-admin/auth";

const COLLECTION = "users";

export default class UserRepository {
  async findAll(): Promise<User[]> {
    const result = await db.get<User>(COLLECTION);
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.findById<User>(COLLECTION, id);
    return result && !Array.isArray(result) ? result : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.get<User>(COLLECTION, {
      where: [
        {
          field: "email",
          value: email
        }
      ]
    });
    return Array.isArray(result) ? result[0] ?? null : result;
  }

  async findByRole(role: string): Promise<User | null> {
    const result = await db.get<User>(COLLECTION, {
      where: [
        {
          field: "role",
          value: role,
        }
      ]
    });
    return Array.isArray(result) ? result[0] ?? null : result;
  }

  async register(email: string, password: string): Promise<UserRecord> {
    return await auth.createUser({ email, password });
  }

  async create(data: Omit<User, "id">, id?: string): Promise<User> {
    return await db.add<User>(COLLECTION, data, id);
  }

  async update(id: string, data: Partial<User>): Promise<boolean> {
    return await db.update<User>(COLLECTION, id, data);
  }

  async delete(id: string): Promise<boolean> {
    await auth.deleteUser(id);
    return await db.remove(COLLECTION, id);
  }

  async verifyToken(idToken: string): Promise<DecodedIdToken> {
    return await auth.verifyIdToken(idToken);
  }
}