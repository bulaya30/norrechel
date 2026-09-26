import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { userService } from "@/lib/container/user.container";
import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

import type { User } from "@/features/interfaces/user";

export async function getCachedUsers(): Promise<User[]> {
  "use cache";

  cacheLife("hours");
  cacheTag("users");

  const users = await userService.getUsers();

  return serializeFirestore(users);
}

export async function getCachedUserById(
  uid: string,
): Promise<User | null> {
  "use cache";

  cacheLife("hours");
  cacheTag("users", `users:id:${uid}`);

  const user = await userService.getUserById(uid);

  return serializeFirestore(user);
}