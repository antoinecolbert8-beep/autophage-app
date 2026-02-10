import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from "@/core/db";

/**
 * PIXEL DE TRACKING POUR CONVERSIONS
 * Usage: <img src="/api/track/conversion?event=purchase&value=99&email=user@example.com" />
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const event = searchParams.get('event'); // purchase, signup, upgrade, etc.
    const value = parseFloat(searchParams.get('value') || '0');
    const email = searchParams.get('email');
    const source = searchParams.get('source') || 'direct';
    const metadata = searchParams.get('metadata');

    try {
        // 1. Find or create lead
        let lead;
        if (email) {
            // Try to find existing lead
            lead = await prisma.lead.findFirst({
                where: { email }
            });

            // If not found, create basic lead (we'd need orgId in real scenario)
            if (!lead) {
                const org = await prisma.organization.findFirst();
                if (org) {
                    lead = await prisma.lead.create({
                        data: {
                            email,
                            organizationId: org.id,
                            stage: 'hot',
                            scoreBreakdown: JSON.stringify({ demographic: 0, behavioral: 0, engagement: 0, intent: 0 })
                        }
                    });
                }
            }
        }

        // 2. Log conversion if we have a lead
        if (lead && event) {
            await prisma.conversion.create({
                data: {
                    leadId: lead.id,
                    type: event,
                    value: value,
                    source: source,
                    metadata: metadata || ''
                }
            });

            console.log(`[PIXEL] Conversion tracked: ${event} - ${value}€ for ${email}`);
        }

        // 3. Return 1x1 transparent pixel
        const pixel = Buffer.from(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            'base64'
        );

        return new NextResponse(pixel, {
            status: 200,
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error('[PIXEL] Tracking error:', error);

        // Still return pixel even on error (silent failure)
        const pixel = Buffer.from(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            'base64'
        );

        return new NextResponse(pixel, {
            status: 200,
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    }
}
