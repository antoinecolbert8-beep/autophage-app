const { Client } = require('pg');

async function testConnection(url) {
    console.log(`\n--- Testing raw pg connection ---`);
    console.log(`URL: ${url.replace(/:[^:@]+@/, ':***@')}`);

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
    } catch (e) {
        console.error("❌ ERROR:", e.message);
    } finally {
        await client.end();
    }
}

// Pooler Transaction Mode with new password
testConnection("postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2026Gen@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true");
