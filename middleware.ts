import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/lib/i18n/routing";
import { auth } from "@/lib/auth";

const intlMiddleware = createIntlMiddleware(routing);

const publicPaths = [
  "/admin/login",
  "/q/",
  "/api/auth",
  "/api/growth-os/tracking",
  "/api/growth-os/webhook",
  "/api/growth-os/quotes/track",
];

function isPublicPath(pathname: string) {
  return publicPaths.some((p) => pathname.startsWith(p));
}

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Admin routes: check auth (except login and public paths)
  if (pathname.startsWith("/admin")) {
    if (!isPublicPath(pathname) && !request.auth?.user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Admin routes don't use i18n - just pass through
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
