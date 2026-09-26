"use server";

import { cookies } from "next/headers";

import { userService } from "@/lib/container";
import {
  AUTH_COOKIE_NAME,
  createAccessToken,
} from "@/features/auth/lib/jwt";

import { redirect } from "next/navigation";

export type LoginActionResult =
  | {
      success: true;
      user: {
        id: string;
        email: string;
        role: string;
      };
    }
  | {
      success: false;
      message: string;
    };

export async function loginAction(
  idToken: string
): Promise<LoginActionResult> {
  if (!idToken) {
    return {
      success: false,
      message: "Authentication token is required.",
    };
  }

  try {
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

    return {
      success: true,
      user: {
        id: user.id ?? "",
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: getLoginErrorMessage(error),
    };
  }
}

function getLoginErrorMessage(
  error: unknown
): string {
  if (!(error instanceof Error)) {
    return "Unable to sign in.";
  }

  switch (error.message) {
    case "User account disabled":
      return "This account has been disabled.";

    case "User not found":
      return "This account is not authorized.";

    default:
      return "Unable to sign in.";
  }
}

export async function logoutAction(
  formData: FormData,
) {
  const locale =
    formData.get("locale") === "fr"
      ? "fr"
      : "en";

  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);

  redirect(`/${locale}/login`);
}