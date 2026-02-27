import { NextRequest, NextResponse } from 'next/server';
import { resolveDispute, validateProofOfWork } from '@/lib/ai/magistrate';
import { prisma } from '@/lib/prisma'; // Assume prisma is setup
// import { stripe } from '@/lib/stripe'; // Assume standard stripe lib

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, contractId, milestoneId, proofOfWorkUrl, buyerEvidence, sellerEvidence } = body;

        if (action === 'VALIDATE_MILESTONE') {
            const milestone = await prisma.milestone.findUnique({
                where: { id: milestoneId },
                include: {
                    contract: {
                        include: {
                            buyer: { include: { organization: { include: { aiProfile: true } } } },
                            seller: { include: { organization: { include: { aiProfile: true } } } }
                        }
                    }
                }
            });

            if (!milestone) return NextResponse.json({ error: 'Milestone introuvable' }, { status: 404 });

            const result = await validateProofOfWork(
                proofOfWorkUrl || milestone.proofOfWorkUrl || '',
                milestone.contract.aiPrompt || ''
            );

            // 🛡️ B2B Enterprise Compliance Lock (EU Reverse Charge)
            if (result.isValid) {
                const sellerProfile = milestone.contract.seller?.organization?.aiProfile;
                const buyerProfile = milestone.contract.buyer?.organization?.aiProfile;
                const euCountries = ['FR', 'DE', 'ES', 'IT', 'BE', 'NL', 'PT', 'SE']; // Simplifié

                if (sellerProfile?.countryCode && buyerProfile?.countryCode) {
                    const isCrossBorderEU = euCountries.includes(sellerProfile.countryCode) &&
                        euCountries.includes(buyerProfile.countryCode) &&
                        sellerProfile.countryCode !== buyerProfile.countryCode;

                    if (isCrossBorderEU && (!sellerProfile.vatNumber || !buyerProfile.vatNumber)) {
                        return NextResponse.json({
                            success: false,
                            error: 'COMPLIANCE_LOCK: Numéros de TVA Intracommunautaire requis pour la facturation Reverse Charge.',
                            validation: result
                        }, { status: 403 });
                    }
                }
            }

            await prisma.milestone.update({
                where: { id: milestoneId },
                data: {
                    aiValidationScore: result.score,
                    status: result.isValid ? 'AI_VERIFIED' : 'REJECTED'
                }
            });

            // Update reputation if verified based on the seller's organization AI profile ...

            return NextResponse.json({ success: true, validation: result });
        }

        if (action === 'DISPUTE') {
            const contract = await prisma.contract.findUnique({
                where: { id: contractId },
                include: {
                    buyer: { include: { organization: { include: { aiProfile: true } } } },
                    seller: { include: { organization: { include: { aiProfile: true } } } }
                }
            });

            if (!contract) return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 });

            const verdict = await resolveDispute(
                contractId,
                buyerEvidence || '',
                sellerEvidence || '',
                contract.aiPrompt || ''
            );

            await prisma.contract.update({
                where: { id: contractId },
                data: { status: 'DISPUTED' }
            });

            // 🛡️ Logique de Ledger de Réputation (Sovereign Score)
            let sellerReputationModifier = 0;
            let buyerReputationModifier = 0;

            if (verdict.verdict === 'FULL_RELEASE') {
                // Seller wins
                sellerReputationModifier = 5;
                buyerReputationModifier = -10; // Penalize abusive disputes
                // TODO: libérer les fonds Stripe vers le vendeur
            } else if (verdict.verdict === 'FULL_REFUND') {
                // Buyer wins
                sellerReputationModifier = -20; // Heavy penalty for bad work
                buyerReputationModifier = 0;
                // TODO: Refund Stripe intent
            } else {
                // Split 50/50
                sellerReputationModifier = -5;
                buyerReputationModifier = -5;
                // TODO: Split Stripe funds
            }

            // Mettre à jour les AI profiles (Sovereign Scores)
            if (contract.seller.organization?.aiProfile) {
                await prisma.aIProfile.update({
                    where: { id: contract.seller.organization.aiProfile.id },
                    data: { reputationScore: { increment: sellerReputationModifier } }
                });
            }

            if (contract.buyer.organization?.aiProfile) {
                await prisma.aIProfile.update({
                    where: { id: contract.buyer.organization.aiProfile.id },
                    data: { reputationScore: { increment: buyerReputationModifier } }
                });
            }

            // TODO: Déclencher Notification (Email/Push)

            return NextResponse.json({
                success: true,
                arbitration: verdict,
                actionsTaken: {
                    sellerReputationChange: sellerReputationModifier,
                    buyerReputationChange: buyerReputationModifier
                }
            });
        }

        return NextResponse.json({ error: 'Action invalide' }, { status: 400 });

    } catch (e) {
        console.error("Arbitration Error:", e);
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
