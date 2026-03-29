import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const publicAdminPaths = ["/admin/login"];
const publicPrefixes = [
  "/q/",
  "/api/growth-os/tracking/",
  "/api/growth-os/webhook/",
  "/api/growth-os/quotes/track/",
];

function isPublicPath(pathname: string): boolean {
  if (publicAdminPaths.includes(pathname)) return true;
  return publicPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export default auth(function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/q")) {
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/admin") && !req.auth) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const response = intlMiddleware(req);
  if (response?.status === 307 && response.headers.get("location")) {
    return NextResponse.redirect(response.headers.get("location")!, 301);
  }
  return response;
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
