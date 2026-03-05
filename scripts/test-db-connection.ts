import * as dotenv from 'dotenv';
dotenv.config();

const passwords = ['ElaSovereign2024!'];
const hosts = [
    'db.yoqgvuwtseoctwwjlapy.supabase.co:5432',
    'db.yoqgvuwtseoctwwjlapy.supabase.co:6543',
    'aws-0-eu-west-3.pooler.supabase.com:6543',
    'aws-0-eu-west-2.pooler.supabase.com:6543',
    'aws-0-eu-central-1.pooler.supabase.com:6543',
];

async function testConnection(url: string) {
    const { execSync } = await import('child_process');
    try {
        const result = execSync(
            `npx prisma db execute --stdin <<'EOF'\nSELECT 1;\nEOF`,
            {
                env: { ...process.env, DATABASE_URL: url },
                timeout: 8000,
                stdio: ['ignore', 'pipe', 'pipe']
            }
        );
        return { ok: true, output: result.toString() };
    } catch (e: any) {
        return { ok: false, error: e.stderr?.toString() || e.message };
    }
}

async function pingHttps(host: string) {
    const baseHost = host.split(':')[0].replace('db.', '');
    const urls = [
        `https://${baseHost.replace('yoqgvuwtseoctwwjlapy.', '')}yoqgvuwtseoctwwjlapy.supabase.co/rest/v1/`,
    ];
    for (const url of urls) {
        try {
            const r = await fetch(url, {
                headers: { apikey: process.env.SUPABASE_ANON_KEY || '' },
                signal: AbortSignal.timeout(5000)
            });
            console.log(`📡 HTTPS ${url} → HTTP ${r.status}`);
        } catch (e: any) {
            console.log(`📡 HTTPS ${url} → failed: ${e.message}`);
        }
    }
}

async function main() {
    console.log('🔎 Testing Supabase DB connectivity...\n');

    // First, check if REST API responds
    await pingHttps('yoqgvuwtseoctwwjlapy.supabase.co');

    // Then test pooler connections
    for (const host of hosts) {
        const url = `postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2024!@${host}/postgres?sslmode=require`;
        const url2 = `postgresql://postgres:ElaSovereign2024!@${host}/postgres?sslmode=require`;

        console.log(`\nTesting: ${host}`);
        process.stdout.write('  postgres.ref format... ');

        try {
            const res = await fetch('https://yoqgvuwtseoctwwjlapy.supabase.co/rest/v1/', {
                headers: { apikey: process.env.SUPABASE_ANON_KEY || '', Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
                signal: AbortSignal.timeout(4000),
            });
            console.log(`REST API HTTP: ${res.status} (${res.status === 200 ? 'OK ✅' : res.status === 401 ? 'Auth needed - project ACTIVE ✅' : 'unknown'})`);
            break;
        } catch (e: any) {
            console.log(`❌ ${e.message}`);
        }
    }
}

main();
