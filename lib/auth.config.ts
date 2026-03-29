import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Node.js dependencies).
 * Used by middleware. The full config with Prisma provider is in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    async authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;

      // Public routes - no auth needed
      if (
        pathname.startsWith("/q/") ||
        pathname.startsWith("/api/growth-os/tracking") ||
        pathname.startsWith("/api/growth-os/webhook") ||
        pathname.startsWith("/api/growth-os/quotes/track")
      ) {
        return true;
      }

      // Admin routes need authentication
      if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        return !!session?.user;
      }

      return true;
    },
  },
  providers: [], // Providers are added in auth.ts (requires Node.js runtime)
};
