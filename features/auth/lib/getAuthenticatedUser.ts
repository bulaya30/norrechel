import "server-only";

import { cookies } from "next/headers";

import {
  AUTH_COOKIE_NAME,
  verifyAccessToken,
} from "@/features/auth/lib/jwt";
import { userService } from "@/lib/container";

export interface AuthenticatedUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    AUTH_COOKIE_NAME,
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(token);

    if (!payload?.userId) {
      return null;
    }

    const user = await userService.getUserById(payload.userId); 

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}