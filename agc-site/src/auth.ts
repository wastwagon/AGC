import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = process.env.ADMIN_EMAIL?.trim();
        const password = process.env.ADMIN_PASSWORD?.trim();

        if (!email || !password) {
          console.warn("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
          return null;
        }

        const inputEmail = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const inputPassword =
          typeof credentials?.password === "string" ? credentials.password.trim() : "";

        if (inputEmail === email && inputPassword === password) {
          return { id: "admin", email, name: "Admin" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage && !isAdmin) {
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: process.env.AUTH_SECRET || (process.env.NODE_ENV === "development" ? "dev-secret-change-in-production" : undefined),
  trustHost: true,
});
