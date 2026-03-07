const { Client } = require('pg');
const { scryptSync, randomBytes } = require('crypto');

const DB = "postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2026Gen@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

function hashPassword(p) {
    const s = randomBytes(16).toString('hex');
    const d = scryptSync(p, s, 64);
    return s + ':' + d.toString('hex');
}

function cuid() {
    return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

const client = new Client({
    connectionString: DB,
    ssl: { rejectUnauthorized: false }
});

client.connect()
    .then(async () => {
        console.log('DB connected!');

        // Check/create org
        const orgRes = await client.query("SELECT id FROM \"Organization\" WHERE domain='ela-revolution.com' LIMIT 1");
        let orgId;
        if (orgRes.rows.length > 0) {
            orgId = orgRes.rows[0].id;
            console.log('Org found:', orgId);
        } else {
            orgId = cuid();
            await client.query(
                'INSERT INTO "Organization" (id, name, domain, tier, status, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,NOW(),NOW())',
                [orgId, 'ELA Revolution', 'ela-revolution.com', 'enterprise', 'active']
            );
            console.log('Org created:', orgId);
        }

        // Check/create user
        const userRes = await client.query("SELECT id FROM \"User\" WHERE email='admin@genesis.ai' LIMIT 1");
        if (userRes.rows.length > 0) {
            await client.query(
                'UPDATE "User" SET password=$1, role=$2, "updatedAt"=NOW() WHERE email=$3',
                [hashPassword('Genesis2025!'), 'admin', 'admin@genesis.ai']
            );
            console.log('Admin password updated!');
        } else {
            await client.query(
                'INSERT INTO "User" (id, email, name, role, password, "organizationId", "currentPlan", "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())',
                [cuid(), 'admin@genesis.ai', 'Grand Horloger', 'admin', hashPassword('Genesis2025!'), orgId, 'enterprise']
            );
            console.log('Admin created!');
        }

        console.log('\nLogin: admin@genesis.ai / Genesis2025!');
        await client.end();
    })
    .catch(e => {
        console.error('DB Error:', e.message);
        process.exit(1);
    });
