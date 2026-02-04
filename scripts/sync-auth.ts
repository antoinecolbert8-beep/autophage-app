import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log(`📡 Connecting to Supabase: ${supabaseUrl}`);
if (!supabaseServiceKey) console.error("❌ SUPABASE_SERVICE_ROLE_KEY is missing!");

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncAdmin() {
    const email = 'godmode@ela.ai';
    const password = 'GodMode2024!'; // Using the same password as the master admin for simplicity

    console.log(`\n🔗 [Auth Sync] Checking user: ${email}...`);

    // 1. Check if user exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("❌ Error listing users:", listError.message);
        return;
    }

    const existingUser = users.users.find(u => u.email === email);

    if (existingUser) {
        console.log(`✅ User already exists in Supabase Auth (ID: ${existingUser.id})`);

        // Update password just in case
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            password: password,
            email_confirm: true
        });

        if (updateError) {
            console.error("❌ Error updating password:", updateError.message);
        } else {
            console.log(`🔄 Password synchronized for ${email}`);
        }
    } else {
        console.log(`➕ User not found. Creating ${email}...`);

        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin' }
        });

        if (createError) {
            console.error("❌ Error creating user:", createError.message);
        } else {
            console.log(`✨ Success! User created in Supabase Auth: ${newUser.user?.id}`);
        }
    }
}

syncAdmin().catch(console.error);
