const { Client } = require('pg');
const { scryptSync, randomBytes } = require('crypto');

function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
}

async function seed() {
    console.log(`\n--- Seeding Admin via raw pg ---`);

    const client = new Client({
        connectionString: "postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2026Gen@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

        // 1. Create Organization
        let orgId = 'org_admin_genesis_2026';
        const orgCheck = await client.query('SELECT id FROM "Organization" WHERE domain = $1', ['ela-admin.io']);

        if (orgCheck.rows.length === 0) {
            await client.query(
                `INSERT INTO "Organization" (id, name, domain, tier, "creditBalance", status, "mrr", "updatedAt") 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [orgId, 'ELA Admin Corp', 'ela-admin.io', 'enterprise', 999999, 'active', 0, new Date()]
            );
            console.log("✅ Created Organization:", orgId);
        } else {
            orgId = orgCheck.rows[0].id;
            console.log("ℹ️ Organization exists:", orgId);
        }

        // 2. Create User
        let userId = 'usr_admin_genesis_2026';
        const userCheck = await client.query('SELECT id FROM "User" WHERE email = $1', ['admin@genesis.ai']);
        const pass = hashPassword('Genesis2025!');

        if (userCheck.rows.length === 0) {
            await client.query(
                `INSERT INTO "User" (id, email, password, name, role, "organizationId", "updatedAt") 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [userId, 'admin@genesis.ai', pass, 'Grand Horloger', 'ADMIN', orgId, new Date()]
            );
            console.log("✅ Created Admin User:", 'admin@genesis.ai');
        } else {
            await client.query(
                `UPDATE "User" SET password = $1, role = 'ADMIN' WHERE email = $2`,
                [pass, 'admin@genesis.ai']
            );
            console.log("ℹ️ Updated Admin User:", 'admin@genesis.ai');
        }

        console.log("✅ SEED DEPLOYED SUCCESSFULLY!");
    } catch (e) {
        console.error("❌ ERROR Deploying Seed:", e.message);
    } finally {
        await client.end();
    }
}

seed();
