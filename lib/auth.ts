import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[auth] Missing email or password");
          return null;
        }

        if (!prisma) {
          console.error("[auth] Database not connected — check DATABASE_URL");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.error("[auth] User not found:", credentials.email);
            return null;
          }

          if (!user.password) {
            console.error("[auth] User has no password set:", credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) {
            console.error("[auth] Invalid password for:", credentials.email);
            return null;
          }

          console.log("[auth] Login OK:", user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("[auth] authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("[auth] signIn callback, user:", user?.email);
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if (prisma) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email! },
              select: { role: true },
            });
            token.role = dbUser?.role ?? "MEMBER";
          } catch (error) {
            console.error("[auth] jwt callback DB error:", error);
            token.role = "MEMBER";
          }
        } else {
          token.role = "MEMBER";
        }
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
});
