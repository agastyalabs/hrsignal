import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) return null;
        if (!credentials?.email || !credentials?.password) return null;

        if (
          credentials.email.toLowerCase() === adminEmail.toLowerCase() &&
          credentials.password === adminPassword
        ) {
          return { id: "admin", name: "Admin", email: adminEmail };
        }
        return null;
      },
    }),
  ],
  // Keep this aligned with middleware.ts (getToken secret)
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
});

export { handler as GET, handler as POST };
