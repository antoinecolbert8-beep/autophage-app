const https = require('https');

const TOKEN = 'nfp_NZRtAqMX8kbjNdVE2WEhD4oML5i8ikgx9882';
const SITE_ID = '35683279-839e-4ecf-a9f8-eef313354de8';
const ACCOUNT_ID = '69440af55aacc7552259a349';

// Safe pooler URL with %21 instead of !
// Safe pooler URL
const SAFE_DB_URL = "postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2026Gen@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

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
    console.log('--- Overriding DATABASE_URL in Netlify Env ---');
    try {
        await request('PUT', `/accounts/${ACCOUNT_ID}/env/DATABASE_URL?site_id=${SITE_ID}`, {
            key: "DATABASE_URL",
            values: [{ value: SAFE_DB_URL, context: 'all' }]
        });
        console.log(`✅ PUT Success: DATABASE_URL updated to correct password!`);
    } catch (e) {
        console.error(`❌ PUT Failed:`, e.status, e.data);
    }
}

run();
