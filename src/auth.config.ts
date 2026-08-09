import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      
      if (isAdminRoute) {
        if (isLoggedIn) {
          // Additional role check could go here
          return true;
        }
        return false; // Redirect to signIn
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
