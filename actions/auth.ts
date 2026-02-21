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
}) {
    console.log('🔄 Syncing user to database:', params.email)

    try {
        const { email, name, company, plan = 'starter', tier } = params

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
        // If company name is not provided, generate a default one
        const orgName = company || `${name.split(' ')[0]}'s Agency`

        // Generate a domain slug from the org name (simple version)
        // e.g. "My Company" -> "my-company"
        // Add random suffix to ensure uniqueness
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

        // 3. Create User linked to Organization
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                role: 'admin', // First user is always admin
                organizationId: organization.id,
                currentPlan: plan,
                // If we have the supabaseUserId, we could store it if the schema supported it directly in a dedicated field
                // For now, we rely on email matching or Auth integration
            }
        })

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
