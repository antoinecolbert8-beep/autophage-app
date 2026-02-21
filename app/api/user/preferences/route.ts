import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db as prisma } from '@/core/db';

/**
 * 🛡️ GDPR: Consent Management
 * Saves or updates user privacy preferences.
 */
export async function POST(req: Request) {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { gdpr_consent, ai_data_usage, marketing_emails } = await req.json();

        const preferences = await prisma.userPreference.upsert({
            where: { userId: session.user.id },
            update: {
                gdpr_consent: !!gdpr_consent,
                ai_data_usage: !!ai_data_usage,
                marketing_emails: !!marketing_emails,
                updatedAt: new Date(),
            },
            create: {
                userId: session.user.id,
                gdpr_consent: !!gdpr_consent,
                ai_data_usage: !!ai_data_usage,
                marketing_emails: !!marketing_emails,
            },
        });

        // 🛡️ Log the consent event for audit purposes
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "GDPR_CONSENT_UPDATE",
                entityType: "USER_PREFERENCE",
                entityId: preferences.id,
                details: JSON.stringify({ gdpr_consent, ai_data_usage }),
                ipAddress: req.headers.get('x-forwarded-for') || '0.0.0.0',
            }
        });

        return NextResponse.json({ success: true, data: preferences });

    } catch (error: any) {
        console.error("❌ Preference Update Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await prisma.userPreference.findUnique({
        where: { userId: session.user.id }
    });

    return NextResponse.json({ success: true, data: preferences });
}
