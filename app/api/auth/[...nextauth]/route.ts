import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db as prisma } from "@/core/db";
import { verifyPassword } from "@/lib/auth-utils";

export const dynamic = 'force-dynamic';

// Force absolute URL for NextAuth in Netlify Serverless Environments to prevent "Invalid URL" crash
if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = process.env.URL || process.env.NEXT_PUBLIC_APP_URL || "https://ela-revolution.com";
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Sovereign Access",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
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
                } catch (error) {
                    console.error("❌ [NextAuth] Database Authorization Error:", error);
                    return null;
                }
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
                if (session.user) {
                    session.user.id = token.id as string;
                    session.user.role = token.role as string;
                    (session.user as any).organizationId = token.organizationId as string;
                }
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Force absolute redirects to prevent relative URL construction crashes on Netlify
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "ela-sovereign-fallback-secret-for-build",
};

const handler = async (req: any, res: any) => {
    // Dynamic NEXTAUTH_URL detection for Netlify Serverless environment
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    // if (process.env.NODE_ENV === "production" || host) {
    //    process.env.NEXTAUTH_URL = origin;
    // }

    return await NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };
