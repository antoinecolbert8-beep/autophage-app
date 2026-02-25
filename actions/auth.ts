'use server'

import { prisma } from '@/lib/prisma'
import { authService } from '@/lib/supabase/auth'

/**
 * Synchronize a new Supabase user to the Prisma database
 * Creates an Organization and a User record
 */
export async function syncUserToDatabase(params: {
    email: string
    name: string
    company?: string
    plan?: string
    tier?: string
    supabaseUserId?: string
    referredBy?: string
}) {
    console.log('🔄 Syncing user to database:', params.email)

    try {
        const { email, name, company, plan = 'starter', tier, referredBy } = params

        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { organization: true }
        })

        if (existingUser) {
            console.log('✅ User already exists in DB:', existingUser.id)
            return {
                success: true,
                userId: existingUser.id,
                organizationId: existingUser.organizationId,
                isNew: false
            }
        }

        // 2. Create Organization first
        const orgName = company || `${name.split(' ')[0]}'s Agency`
        const domain = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7)

        const organization = await prisma.organization.create({
            data: {
                name: orgName,
                domain: domain,
                tier: tier === 'grand_horloger' || plan === 'god_mode' ? 'enterprise' : (plan as any || 'starter'),
                status: 'active'
            }
        })

        console.log('✅ Organization created:', organization.id)

        // 3. Handle Referral if exists
        let referrerId = null;
        if (referredBy) {
            const referrer = await prisma.user.findUnique({
                where: { referralCode: referredBy }
            });
            if (referrer) {
                referrerId = referrer.id;
                console.log(`🎯 Referral detected! Referrer: ${referrer.email}`);
            }
        }

        // 4. Create User linked to Organization
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                role: 'admin',
                organizationId: organization.id,
                currentPlan: plan,
                referralCode: `ELA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                referredBy: referrerId ? referredBy : null // Store the code string for record
            }
        })

        // 5. Create Referral record if we found a referrer
        if (referrerId) {
            await prisma.referral.create({
                data: {
                    referrerId: referrerId,
                    refereeId: newUser.id,
                    status: 'pending' // Becomes 'active' after first payment
                }
            });
        }

        console.log('✅ User created:', newUser.id)

        return {
            success: true,
            userId: newUser.id,
            organizationId: organization.id,
            isNew: true
        }

    } catch (error: any) {
        console.error('❌ Error syncing user to database:', error)
        return {
            success: false,
            error: error.message
        }
    }
}
