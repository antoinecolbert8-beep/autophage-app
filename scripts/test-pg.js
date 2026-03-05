const { Client } = require('pg');

async function testConnection(name, url) {
    console.log(`\n--- Testing ${name} ---`);
    console.log(`URL: ${url.replace(/:[^:@]+@/, ':***@')}`); // Hide password in logs

    // Explicitly disabling strict SSL verification for Supabase pooler (common requirement)
    const client = new Client({
        connectionString: url,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        const res = await client.query('SELECT current_user, current_database();');
        console.log("✅ SUCCESS!");
        console.log("User:", res.rows[0].current_user);

        const orgs = await client.query('SELECT count(*) FROM "Organization";');
        console.log("Organizations count:", orgs.rows[0].count);
    } catch (e) {
        console.error("❌ ERROR:", e.message);
    } finally {
        await client.end();
    }
}

async function runAll() {
    // Pooler Transaction Mode with explicit sslmode parameter adjustment
    await testConnection('Pooler Transaction SSL bypass', "postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2024!@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true");
}

runAll();
