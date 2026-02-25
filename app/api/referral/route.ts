/**
 * Moteur Viral — Pilier 5
 * GET  /api/referral  → Infos parrainage de l'utilisateur courant
 * POST /api/referral/activate → Appelée lors de la 1ère publication payante d'un filleul
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db as prisma } from '@/core/db';

export const dynamic = 'force-dynamic';

// ── Paliers de récompense anti-MLM ────────────────────────────────────────────
// Récompense directe uniquement (1 niveau), conforme loi française.

export const REFERRAL_TIERS = [
    {
        activeReferrals: 1,
        tier: 1,
        reward: 'Accès Pro 7 jours',
        planUpgrade: 'pro_trial_7d',
    },
    {
        activeReferrals: 3,
        tier: 3,
        reward: '100 Crédits Souverains',
        creditBonus: 100,
    },
    {
        activeReferrals: 5,
        tier: 5,
        reward: 'Pro permanent (tant que 5 filleuls actifs)',
        planUpgrade: 'pro_permanent_conditional',
    },
    {
        activeReferrals: 10,
        tier: 10,
        reward: 'Badge Empire Builder + Early Access',
        badge: 'empire_builder',
    },
    {
        activeReferrals: 25,
        tier: 25,
        reward: 'God Mode 30 jours + Appel stratégique ELA',
        planUpgrade: 'god_mode_30d',
    },
] as const;

// ── GET: Infos parrainage de l'utilisateur ────────────────────────────────────

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            referralCode: true,
            referralTier: true,
            referralsGiven: {
                select: {
                    id: true,
                    refereeId: true,
                    status: true,
                    rewardTier: true,
                    createdAt: true,
                    referee: { select: { name: true, email: true, avatar: true } },
                },
            },
        },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Générer un code de parrainage si absent
    let referralCode = user.referralCode;
    if (!referralCode) {
        referralCode = `ELA-${user.id.slice(-8).toUpperCase()}`;
        await prisma.user.update({
            where: { id: user.id },
            data: { referralCode },
        });
    }

    const activeReferrals = user.referralsGiven.filter((r) => r.status === 'active');
    const pendingReferrals = user.referralsGiven.filter((r) => r.status === 'pending');

    // Prochain palier à atteindre
    const currentActive = activeReferrals.length;
    const nextTier = REFERRAL_TIERS.find((t) => t.activeReferrals > currentActive) || null;

    return NextResponse.json({
        referralCode,
        referralLink: `${process.env.NEXTAUTH_URL || 'https://ela.app'}/signup?ref=${referralCode}`,
        totalReferrals: user.referralsGiven.length,
        activeReferrals: currentActive,
        pendingReferrals: pendingReferrals.length,
        currentTier: user.referralTier,
        nextTier: nextTier
            ? {
                activeNeeded: nextTier.activeReferrals - currentActive,
                reward: nextTier.reward,
                tier: nextTier.tier,
            }
            : null,
        referrals: user.referralsGiven.map((r) => ({
            id: r.id,
            status: r.status,
            name: r.referee.name || r.referee.email,
            avatar: r.referee.avatar,
            joinedAt: r.createdAt,
        })),
    });
}

// ── POST: Activer un filleul (1ère publication payante) ───────────────────────

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { refereeId } = body;

    if (!refereeId) {
        return NextResponse.json({ error: 'refereeId is required' }, { status: 400 });
    }

    // Trouver le lien de parrainage
    const referral = await prisma.referral.findUnique({
        where: { refereeId },
        include: {
            referrer: { select: { id: true, referralTier: true, referralsGiven: true } },
        },
    });

    if (!referral) {
        return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
    }

    if (referral.status !== 'pending') {
        return NextResponse.json({ message: 'Referral already processed', status: referral.status });
    }

    // Marquer le filleul comme actif
    await prisma.referral.update({
        where: { refereeId },
        data: { status: 'active' },
    });

    // Recalculer le tier du parrain
    const activeCount = await prisma.referral.count({
        where: { referrerId: referral.referrerId, status: 'active' },
    });

    const newTier = [...REFERRAL_TIERS]
        .reverse()
        .find((t) => activeCount >= t.activeReferrals);

    if (newTier && newTier.tier > referral.referrer.referralTier) {
        // Monter en tier
        await prisma.$transaction(async (tx) => {
            // Mettre à jour le tier utilisateur
            await tx.user.update({
                where: { id: referral.referrerId },
                data: { referralTier: newTier.tier },
            });

            // Enregistrer la récompense sur le lien de parrainage
            await tx.referral.updateMany({
                where: { referrerId: referral.referrerId, status: 'active' },
                data: { rewardTier: newTier.tier, rewardedAt: new Date() },
            });

            // Bonus crédits si applicable
            if ('creditBonus' in newTier) {
                await tx.organization.updateMany({
                    where: { users: { some: { id: referral.referrerId } } },
                    data: { creditBalance: { increment: newTier.creditBonus } },
                });
            }

            // Journal d'audit
            await tx.auditLog.create({
                data: {
                    userId: referral.referrerId,
                    action: 'REFERRAL_TIER_UNLOCKED',
                    entityType: 'Referral',
                    entityId: referral.id,
                    details: JSON.stringify({ tier: newTier.tier, reward: newTier.reward, activeReferrals: activeCount }),
                },
            });
        });

        return NextResponse.json({
            success: true,
            tierUnlocked: newTier.tier,
            reward: newTier.reward,
            activeReferrals: activeCount,
        });
    }

    return NextResponse.json({
        success: true,
        tierUnlocked: null,
        activeReferrals: activeCount,
        message: 'Filleul activé. Prochain palier pas encore atteint.',
    });
}
