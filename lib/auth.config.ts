import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Prisma, no bcrypt).
 * Used by middleware/proxy to decode the JWT session cookie.
 * The full config with Credentials provider lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "MEMBER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
