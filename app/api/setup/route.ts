import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY,
            SUPABASE_SERVICE_ROLE_KEY,
            OPENAI_API_KEY,
            STRIPE_SECRET_KEY
        } = body;

        // Define path to .env file
        const envPath = path.join(process.cwd(), '.env');

        // Read existing .env file
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf-8');
        }

        // Helper to update or append key
        const updateKey = (key: string, value: string) => {
            if (!value) return; // Skip empty values

            const regex = new RegExp(`^${key}=.*`, 'm');
            if (regex.test(envContent)) {
                envContent = envContent.replace(regex, `${key}=${value}`);
            } else {
                envContent += `\n${key}=${value}`;
            }
        };

        // Update keys
        updateKey('NEXT_PUBLIC_SUPABASE_URL', NEXT_PUBLIC_SUPABASE_URL);
        updateKey('NEXT_PUBLIC_SUPABASE_ANON_KEY', NEXT_PUBLIC_SUPABASE_ANON_KEY);
        updateKey('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY);
        updateKey('OPENAI_API_KEY', OPENAI_API_KEY);
        updateKey('STRIPE_SECRET_KEY', STRIPE_SECRET_KEY);

        // Write back to .env
        fs.writeFileSync(envPath, envContent.trim() + '\n');

        return NextResponse.json({ success: true, message: "Configuration system updated. Restart required." });

    } catch (error: any) {
        console.error("Setup Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
