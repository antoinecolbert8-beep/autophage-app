const { Client } = require('pg');
const { scryptSync, crypto, timingSafeEqual } = require('crypto');

const DB = process.env.DATABASE_URL || "postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2026Gen@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

function verifyPassword(password, hash) {
    const [salt, key] = hash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = scryptSync(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey);
}

const client = new Client({
    connectionString: DB,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    await client.connect();
    const res = await client.query("SELECT * FROM \"User\" WHERE email='admin@genesis.ai'");
    if (res.rows.length === 0) {
        console.log("❌ USER NOT FOUND IN DB!");
    } else {
        const user = res.rows[0];
        console.log("✅ USER FOUND:", user.id, user.email, "Role:", user.role);
        console.log("Password hash in DB:", user.password);

        const isMatch = verifyPassword("Genesis2025!", user.password);
        console.log("Does password match Genesis2025! ?", isMatch ? "YES ✅" : "NO ❌");
    }
    await client.end();
}

run().catch(console.error);
