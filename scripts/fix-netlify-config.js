const https = require('https');

const TOKEN = 'nfp_NZRtAqMX8kbjNdVE2WEhD4oML5i8ikgx9882';
const SITE_ID = '35683279-839e-4ecf-a9f8-eef313354de8';
const ACCOUNT_ID = '69440af55aacc7552259a349';

const vars = [
    { key: "DATABASE_URL", value: "postgresql://postgres:ElaSovereign2024!@db.yoqgvuwtseoctwwjlapy.supabase.co:5432/postgres?sslmode=require" },
    { key: "NEXT_PUBLIC_APP_URL", value: "https://storied-longma-396754.netlify.app" },
    { key: "NEXTAUTH_URL", value: "https://storied-longma-396754.netlify.app" },
    { key: "NEXTAUTH_SECRET", value: "ela-sovereign-genesis-nextauth-secret-2026-fortress" },
    { key: "FORTRESS_SECRET", value: "ela-sovereign-vault-protection-32" },
    { key: "CRON_SECRET", value: "ela-apex-cron-sovereign-2026" }
];

function request(method, path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.netlify.com',
            path: `/api/v1${path}`,
            method: method,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data ? JSON.parse(data) : {});
                } else {
                    reject({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    console.log('--- Updating Environment Variables ---');
    for (const v of vars) {
        try {
            await request('POST', `/accounts/${ACCOUNT_ID}/env?site_id=${SITE_ID}`, [
                { key: v.key, values: [{ value: v.value, context: 'all' }] }
            ]);
            console.log(`✅ POST Success: ${v.key}`);
        } catch (e) {
            try {
                await request('PATCH', `/accounts/${ACCOUNT_ID}/env/${v.key}?site_id=${SITE_ID}`, {
                    key: v.key,
                    values: [{ value: v.value, context: 'all' }]
                });
                console.log(`✅ PATCH Success: ${v.key}`);
            } catch (err) {
                console.error(`❌ Failed ${v.key}:`, err.status, err.data);
            }
        }
    }

    console.log('\n--- Updating Build Command ---');
    try {
        const site = await request('GET', `/sites/${SITE_ID}`);
        delete site.build_settings.env;
        site.build_settings.cmd = "npx prisma generate && npx prisma db push --accept-data-loss && node scripts/netlify-seed.js && npm run build";

        await request('PUT', `/sites/${SITE_ID}`, { build_settings: site.build_settings });
        console.log('✅ Build Settings Updated');
    } catch (e) {
        console.error('❌ Build Settings Update Failed:', e.status, e.data);
    }

    console.log('\n--- Triggering Final Deploy ---');
    try {
        await request('POST', `/sites/${SITE_ID}/builds`, {});
        console.log('🚀 Final Deploy Triggered!');
    } catch (e) {
        console.error('❌ Deploy Trigger Failed:', e.status, e.data);
    }
}

run();
