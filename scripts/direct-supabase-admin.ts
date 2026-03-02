import { createClient } from '@supabase/supabase-js';
import { scryptSync, randomBytes } from 'crypto';

const SUPABASE_URL = 'https://yoqgvuwtseoctwwjlapy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_ylO1Hcbb3J6gcY0AwUfg5w_KDhuHm0e';

// Manual hash function to match NextAuth
function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    const email = 'admin@genesis.ai';
    const password = 'Genesis2025!';
    const hashedPassword = hashPassword(password);

    console.log(`🚀 Direct Supabase Update for ${email}...`);

    // 1. Get user id
    const { data: user, error: fetchError } = await supabase
        .from('User')
        .select('id')
        .eq('email', email)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching user:', fetchError);
        return;
    }

    if (user) {
        console.log('✅ User found, updating password and role...');
        const { error: updateError } = await supabase
            .from('User')
            .update({
                password: hashedPassword,
                role: 'admin'
            })
            .eq('id', user.id);

        if (updateError) console.error('❌ Update failed:', updateError);
        else console.log('🎉 Admin password updated successfully!');
    } else {
        console.log('ℹ️ User not found, creating new one...');
        // Need an organization first
        const { data: org } = await supabase.from('Organization').select('id').limit(1).single();
        if (!org) {
            console.error('❌ No organization found in DB. Please create one first.');
            return;
        }

        const { error: insertError } = await supabase
            .from('User')
            .insert([{
                email,
                name: 'Admin Genesis',
                password: hashedPassword,
                role: 'admin',
                organizationId: org.id,
                currentPlan: 'enterprise'
            }]);

        if (insertError) console.error('❌ Insert failed:', insertError);
        else console.log('🎉 Admin user created successfully!');
    }
}

main();
