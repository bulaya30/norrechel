import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";
import {
  AUTH_COOKIE_NAME,
  verifyAccessToken,
} from "@/features/auth/lib/jwt";

const intlMiddleware = createIntlMiddleware(routing);

const protectedRoutes = [
  "/dashboard",
];

const authenticationRoutes = [
  "/login",
];

function getLocaleFromPathname(
  pathname: string
): string | null {
  const locale = routing.locales.find(
    (supportedLocale) =>
      pathname === `/${supportedLocale}` ||
      pathname.startsWith(`/${supportedLocale}/`)
  );

  return locale ?? null;
}

function removeLocaleFromPathname(
  pathname: string,
  locale: string
): string {
  const pathnameWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  return pathnameWithoutLocale;
}

function matchesRoute(
  pathname: string,
  routes: readonly string[]
): boolean {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

function createLocalizedUrl(
  request: NextRequest,
  locale: string,
  pathname: string
): URL {
  return new URL(`/${locale}${pathname}`, request.url);
}

export default async function proxy(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  /*
   * For URLs without a locale, let next-intl perform browser-language
   * negotiation first.
   *
   * Examples:
   * /            → /en or /fr
   * /dashboard   → /en/dashboard or /fr/dashboard
   */
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    return intlMiddleware(request);
  }

  const pathnameWithoutLocale =
    removeLocaleFromPathname(pathname, locale);

  const isProtectedRoute = matchesRoute(
    pathnameWithoutLocale,
    protectedRoutes
  );

  const isAuthenticationRoute = matchesRoute(
    pathnameWithoutLocale,
    authenticationRoutes
  );

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let authenticatedUser = null;

  if (token) {
    try {
      authenticatedUser =
        await verifyAccessToken(token);
    } catch (error) {
      console.error(
        "Proxy token verification failed:",
        error,
      );
    }
  }

  /*
   * Prevent unauthenticated users from accessing protected pages.
   */
  if (isProtectedRoute && !authenticatedUser) {
    const loginUrl = createLocalizedUrl(
      request,
      locale,
      "/login"
    );

    loginUrl.searchParams.set(
      "callbackUrl",
      `${pathname}${request.nextUrl.search}`
    );

    const response = NextResponse.redirect(loginUrl);

    if (token) {
      response.cookies.delete(AUTH_COOKIE_NAME);
    }

    return response;
  }

  /*
   * Prevent an authenticated user from opening the login page again.
   */
  if (isAuthenticationRoute && authenticatedUser) {
    return NextResponse.redirect(
      createLocalizedUrl(
        request,
        locale,
        "/dashboard"
      )
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};