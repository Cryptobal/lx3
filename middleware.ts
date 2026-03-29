import createIntlMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/lib/i18n/routing";
import { authConfig } from "@/lib/auth.config";

const intlMiddleware = createIntlMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Admin routes: check auth (except login and public paths)
  if (pathname.startsWith("/admin")) {
    if (
      !pathname.startsWith("/admin/login") &&
      !request.auth?.user
    ) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Public quote view
  if (pathname.startsWith("/q/")) {
    return NextResponse.next();
  }

  // Everything else: apply i18n middleware
  const response = intlMiddleware(request);
  if (response?.status === 307 && response.headers.get("location")) {
    return NextResponse.redirect(response.headers.get("location")!, 301);
  }
  return response;
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
