const { spawnSync } = require('child_process');

console.log("Pushing schema via Session Pooler...");
const env = { ...process.env, DATABASE_URL: "postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2026Gen@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require" };
const push = spawnSync('npx', ['prisma', 'db', 'push', '--accept-data-loss'], { env, stdio: 'inherit' });
if (push.status !== 0) {
    console.error("Failed with code", push.status);
} else {
    console.log("Success!");
}
