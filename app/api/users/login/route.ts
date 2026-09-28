import { cookies } from "next/headers";

import { userService } from "@/lib/container/user.container";

import {
  success,
  failure,
} from "@/lib/api/response";

import {
  AUTH_COOKIE_NAME,
  createAccessToken,
} from "@/features/auth/lib/jwt";

interface LoginRequest {
  idToken: string;
}

export async function POST(request: Request) {
  try {
    const { idToken } =
      (await request.json()) as LoginRequest;

    if (!idToken) {
      return failure(
        new Error("Authentication token is required"),
        401,
      );
    }

    const user = await userService.login({
      idToken,
    });

    const token = await createAccessToken({
      userId: user.id ?? "",
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return success({
      user: {
        id: user.id ?? "",
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return failure(error, 401);
  }
}