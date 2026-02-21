import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db as prisma } from '@/core/db';

/**
 * 🛡️ GDPR: Data Portability
 * Exports all user data in JSON format.
 */
export async function GET(req: Request) {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        console.log(`🛡️ [GDPR] Generating Data Export for User: ${userId}`);

        // Fetch everything related to the user
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                organization: true,
                subscription: true,
                usageRecords: true,
                posts: true,
                brandProfile: true,
                userPreference: true,
                auditLogs: {
                    take: 100, // Export recent logs
                    orderBy: { createdAt: 'desc' }
                },
                actionHistory: {
                    take: 100,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!userData) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Clean PII before final export if needed (though Portability implies returning what we have)
        // We'll return the full structure as held by ELA.

        return new NextResponse(JSON.stringify(userData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="ela-data-export-${userId}.json"`
            }
        });

    } catch (error: any) {
        console.error("❌ GDPR Export Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
