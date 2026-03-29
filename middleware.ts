import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Routes that skip auth (public access)
const publicAdminPaths = ["/admin/login"];
const publicPrefixes = ["/q/", "/api/growth-os/tracking/", "/api/growth-os/webhook/", "/api/growth-os/quotes/track/"];

function isPublicPath(pathname: string): boolean {
  if (publicAdminPaths.includes(pathname)) return true;
  return publicPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for /admin/* and /q/* routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/q")) {
    // Public paths: allow through
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    // Protected /admin/* routes: check JWT
    if (pathname.startsWith("/admin")) {
      const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
      });

      if (!token) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  }

  // All other routes: apply i18n middleware
  const response = intlMiddleware(request);
  if (response?.status === 307 && response.headers.get("location")) {
    return NextResponse.redirect(response.headers.get("location")!, 301);
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
