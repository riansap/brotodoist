import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) token.id_token = account.id_token;
            return token;
        },
        async session({ session, token }) {
            session.id_token = token.id_token;
            return session;
        },
    },
};
