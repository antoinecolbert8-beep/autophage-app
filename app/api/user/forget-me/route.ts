import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db as prisma } from '@/core/db';

/**
 * 🛡️ GDPR: Right to be Forgotten
 * Deletes all user data and anonymizes audit logs.
 */
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        console.log(`🛡️ [GDPR] Executing 'Forget Me' for User: ${userId}`);

        // We use a transaction to ensure atomic deletion of all user records
        await prisma.$transaction(async (tx) => {
            // 1. Delete user-specific data that we don't need to keep for accounting
            await tx.brandProfile.deleteMany({ where: { userId } });
            await tx.userPreference.deleteMany({ where: { userId } });
            await tx.saveAttempt.deleteMany({ where: { userId } });
            await tx.post.deleteMany({ where: { userId } });

            // 2. Anonymize Audit Logs instead of deleting (for system traceability)
            await tx.auditLog.updateMany({
                where: { userId },
                data: {
                    userId: null,
                    details: "[ANONYMIZED_FOR_GDPR]",
                    ipAddress: "0.0.0.0"
                }
            });

            await tx.actionHistory.deleteMany({ where: { userId } });

            // 3. Handle Subscription (Cancellation at Stripe level should be done separately or here)
            // In this version, we purge the DB record.
            await tx.subscription.deleteMany({ where: { userId } });

            // 4. Finally, delete the User record itself
            await tx.user.delete({
                where: { id: userId }
            });
        });

        return NextResponse.json({
            success: true,
            message: "All personal data has been securely purged. Protocol SHIELD: COMPLETE."
        });

    } catch (error: any) {
        console.error("❌ GDPR Deletion Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
