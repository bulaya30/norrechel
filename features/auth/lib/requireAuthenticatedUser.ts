import "server-only";

import { cookies } from "next/headers";

import {
  AUTH_COOKIE_NAME,
  verifyAccessToken,
} from "@/features/auth/lib/jwt";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    AUTH_COOKIE_NAME,
  )?.value;

  if (!token) {
    throw new Error("Unauthenticated");
  }

  const payload = await verifyAccessToken(token);

  if (!payload?.userId) {
    throw new Error("Invalid session");
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}