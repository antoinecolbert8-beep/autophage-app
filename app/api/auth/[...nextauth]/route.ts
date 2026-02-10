import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db as prisma } from "@/core/db";
import { verifyPassword } from "@/lib/auth-utils";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Sovereign Access",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                }) as any;

                if (!user || !user.password) return null;

                const isValid = verifyPassword(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    organizationId: user.organizationId
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.organizationId = user.organizationId;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                (session.user as any).organizationId = token.organizationId as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
