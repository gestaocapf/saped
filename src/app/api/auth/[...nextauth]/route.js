import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    jwt: true, // This will tell NextAuth to use JWT for session
  },
  callbacks: {
    // Callback to check if user exists in DB
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // Allow sign-in if user exists in DB
      if (existingUser) {
        return true;
      }
      return false;
    },

    // Modify the session object
    async session({ session, token }) {
      if (session?.user) {
        // Assign user ID from the token to the session
        session.user.id = token.id;
      }
      return session;
    },

    // Modify the JWT token
    async jwt({ token, user }) {
      if (user) {
        // Store the user ID in the JWT token when the user is signed in
        token.id = user.id;
      }
      return token;
    },
  },

  secret: process.env.JWT_SECRET, // Ensure this is set in your .env.local

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure only in production
        sameSite: "lax", // 'lax' or 'strict' depending on your needs
        path: "/", // Cookie is valid for the entire site
      },
    },
  },

  pages: {
    error: "/auth/error", // Custom error page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
