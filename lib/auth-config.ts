import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db as prisma } from "@/core/db";
import { verifyPassword } from "@/lib/auth-utils";

console.log('🛡️ AUTH_CONFIG: Initializing options...');

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Sovereign Access",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log('🔓 AUTH: Authorize called for', credentials?.email);
                if (!credentials?.email || !credentials?.password) return null;

                // DEV MODE BYPASS: Allow local testing without a real database
                if (process.env.NODE_ENV === 'development') {
                    const DEV_EMAIL = process.env.DEV_ADMIN_EMAIL || 'admin@ela.com';
                    const DEV_PASSWORD = process.env.DEV_ADMIN_PASSWORD || 'admin123';
                    if (credentials.email === DEV_EMAIL && credentials.password === DEV_PASSWORD) {
                        console.warn('⚠️ DEV MODE: Using mock admin session bypass');
                        return {
                            id: 'dev-admin-001',
                            email: DEV_EMAIL,
                            name: 'Admin ELA',
                            role: 'admin',
                            organizationId: 'dev-org-001'
                        } as any;
                    }
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    }) as any;

                    if (!user || !user.password) {
                        console.warn('❌ AUTH: User not found or no password');
                        return null;
                    }

                    const isValid = verifyPassword(credentials.password, user.password);
                    if (!isValid) {
                        console.warn('❌ AUTH: Invalid password');
                        return null;
                    }

                    console.log('✅ AUTH: User authenticated successfully');
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        organizationId: user.organizationId
                    };
                } catch (err) {
                    console.error('❌ AUTH: Database error during authorization', err);
                    // DEV FALLBACK: if DB is unreachable, try the dev credentials one more time
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('⚠️ DEV FALLBACK: DB unreachable, checking dev credentials');
                        const DEV_EMAIL = process.env.DEV_ADMIN_EMAIL || 'admin@ela.com';
                        const DEV_PASSWORD = process.env.DEV_ADMIN_PASSWORD || 'admin123';
                        if (credentials.email === DEV_EMAIL && credentials.password === DEV_PASSWORD) {
                            return {
                                id: 'dev-admin-001',
                                email: DEV_EMAIL,
                                name: 'Admin ELA',
                                role: 'admin',
                                organizationId: 'dev-org-001'
                            } as any;
                        }
                    }
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
        }
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "ela-sovereign-fallback-secret-for-build",
    debug: process.env.NODE_ENV === 'development',
};

// 🛡️ SECURITY AUDIT: Validate NextAuth configuration
if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
    console.error('❌ CRITICAL SECURITY ERROR: NEXTAUTH_SECRET is missing. Authentication WILL FAIL in production.');
}
