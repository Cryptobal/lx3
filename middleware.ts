import createIntlMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/lib/i18n/routing";
import { authConfig } from "@/lib/auth.config";

const intlMiddleware = createIntlMiddleware(routing);

// Only initialize Auth.js middleware — used selectively below
const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: run through Auth.js for session checking
  if (pathname.startsWith("/admin")) {
    // Use auth() as a wrapper only for /admin routes
    const authMiddleware = auth((req) => {
      if (
        !req.nextUrl.pathname.startsWith("/admin/login") &&
        !req.auth?.user
      ) {
        const loginUrl = new URL("/admin/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    });
    return authMiddleware(request, {} as any);
  }

  // Public quote view — no auth needed
  if (pathname.startsWith("/q/")) {
    return NextResponse.next();
  }

  // Everything else: apply i18n middleware (no auth)
  const response = intlMiddleware(request);
  if (response?.status === 307 && response.headers.get("location")) {
    return NextResponse.redirect(response.headers.get("location")!, 301);
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
