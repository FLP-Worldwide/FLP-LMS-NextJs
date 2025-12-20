import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "ERP Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const json = await res.json();

          if (!res.ok || !json?.data?.access_token) {
            return null;
          }

          /**
           * IMPORTANT:
           * Whatever you return here becomes `user`
           */
          return {
            id: json.data.role, // required by next-auth
            accessToken: json.data.access_token,
            role: json.data.role, // super_admin | school_admin | coaching_admin
            accountType: json.data.account_type, // school | coaching | null
            expiresIn: json.data.expires_in,
          };
        } catch (error) {
          console.error("AUTH ERROR:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // First login
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.accountType = user.accountType;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.role = token.role;
      session.accountType = token.accountType;
      return session;
    },
  },

  pages: {
    signIn: "/", // public login page
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
