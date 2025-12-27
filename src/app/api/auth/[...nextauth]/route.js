import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

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
          // ⚠️ SERVER-SIDE AXIOS (NO interceptors, NO token)
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 10000,
            }
          );

          const data = res.data?.data;

          if (!data?.access_token) {
            return null;
          }

          /**
           * Everything returned here becomes `user`
           * and is available in jwt() callback
           */
          return {
            id: data.role, // required by next-auth
            accessToken: data.access_token,
            role: data.role, // super_admin | school_admin | coaching_admin
            accountType: data.account_type, // school | coaching | null
            expiresIn: data.expires_in,
          };
        } catch (error) {
          console.error(
            "AUTH ERROR:",
            error?.response?.data || error.message
          );
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Runs on first login and on every request
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.accountType = user.accountType;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose values to client
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
