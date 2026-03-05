const fs = require('fs');
const { Client } = require('pg');

async function deploySchema() {
    console.log(`\n--- Deploying Schema to Supabase Pooler ---`);

    // Read the file, handle UTF-16LE from PowerShell pipe if necessary
    let sql = fs.readFileSync('schema.sql');
    if (sql[0] === 0xff && sql[1] === 0xfe) {
        sql = sql.toString('utf16le');
    } else {
        sql = sql.toString('utf8');
    }

    // Strip BOM
    if (sql.charCodeAt(0) === 0xFEFF) {
        sql = sql.slice(1);
    }

    const client = new Client({
        connectionString: "postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2026Gen@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log("✅ Authenticated. Executing schema queries...");

        // Execute the entire schema SQL
        await client.query(sql);

        console.log("✅ SCHEMA DEPLOYED SUCCESSFULLY!");
    } catch (e) {
        console.error("❌ ERROR Deploying Schema:", e.message);
    } finally {
        await client.end();
    }
}

deploySchema();
