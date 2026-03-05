import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
dotenv.config();

const PROJECT_REF = 'yoqgvuwtseoctwwjlapy';
const PASSWORD = 'elacolbert2026!';

// All Supabase pooler regions to try
const regions = [
    'aws-0-eu-west-3',   // Paris
    'aws-0-eu-west-2',   // London  
    'aws-0-eu-central-1', // Frankfurt
    'aws-0-eu-west-1',   // Ireland
    'aws-0-us-east-1',   // N. Virginia
    'aws-0-us-west-1',   // N. California
];

async function tryConnection(url: string, label: string): Promise<boolean> {
    try {
        const output = execSync(
            `npx prisma db execute --stdin`,
            {
                input: 'SELECT 1 as test;',
                env: { ...process.env, DATABASE_URL: url },
                timeout: 10000,
                stdio: ['pipe', 'pipe', 'pipe'],
            }
        );
        console.log(`✅ ${label} — CONNECTED!`);
        console.log('Output:', output.toString().slice(0, 200));
        return true;
    } catch (e: any) {
        const err = (e.stderr?.toString() || e.message || '').slice(0, 150);
        console.log(`❌ ${label} — ${err}`);
        return false;
    }
}

async function main() {
    console.log('🔎 Scanning Supabase regions...\n');

    for (const region of regions) {
        // Session Mode (port 5432) — works with Prisma migrations
        const urlSession = `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${region}.pooler.supabase.com:5432/postgres?sslmode=require`;
        // Transaction Mode (port 6543) — faster for runtime
        const urlTransaction = `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${region}.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`;

        const sessionOk = await tryConnection(urlSession, `${region}:5432 (session)`);
        if (sessionOk) {
            console.log(`\n🎉 FOUND! Update your .env:\n`);
            console.log(`DATABASE_URL="${urlSession}"`);
            process.exit(0);
        }

        const txOk = await tryConnection(urlTransaction, `${region}:6543 (transaction)`);
        if (txOk) {
            console.log(`\n🎉 FOUND! Update your .env:\n`);
            console.log(`DATABASE_URL="${urlTransaction}"`);
            process.exit(0);
        }
    }

    console.log('\n❌ No region found. The project password might be incorrect.');
    console.log('Go to: https://supabase.com/dashboard/project/yoqgvuwtseoctwwjlapy/settings/database');
    console.log('Then click "Reset database password" and update the .env file.');
}

main();
