import { NextResponse } from 'next/server';
import { authOptions } from "@/lib/auth-config";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const providers = authOptions.providers.map(p => ({
            id: p.id,
            name: p.name,
            type: p.type
        }));

        return NextResponse.json({
            status: "Online",
            providers,
            env: {
                NODE_ENV: process.env.NODE_ENV,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
                HAS_SECRET: !!process.env.NEXTAUTH_SECRET,
                HAS_DB_URL: !!process.env.DATABASE_URL,
                NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "MISSING"
            },
            configSource: "auth-config.ts"
        });
    } catch (err: any) {
        return NextResponse.json({
            status: "Error",
            error: err.message,
            stack: err.stack
        }, { status: 500 });
    }
}
