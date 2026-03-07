import { NextResponse } from 'next/server';
import { db as prisma } from '@/core/db';
import { verifyPassword } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const hasDbUrl = !!process.env.DATABASE_URL;
        const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;

        const user = await prisma.user.findUnique({
            where: { email: 'admin@genesis.ai' }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' });
        }

        let verifyWorks = false;
        try {
            verifyWorks = verifyPassword('Genesis2025!', user.password || '');
        } catch (e: any) {
            return NextResponse.json({ error: 'Crypto err: ' + e.message });
        }

        return NextResponse.json({
            status: 'ok',
            userFound: !!user,
            verifyWorks,
            hasDbUrl,
            hasNextAuthSecret,
            envKeys: Object.keys(process.env).filter(k => k.includes('SUPA') || k.includes('DATA') || k.includes('NEXT')),
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message, stack: e.stack });
    }
}
