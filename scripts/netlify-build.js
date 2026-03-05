const { spawnSync } = require('child_process');

console.log('🚀 Starting ELA Netlify build...');

// Inject environment variables directly (safe for Node.js process)
process.env.DATABASE_URL = "postgresql://postgres.yoqgvuwtseoctwwjlapy:ElaSovereign2026Gen@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";
process.env.NEXTAUTH_SECRET = "ela-sovereign-genesis-nextauth-secret-2026-fortress";
process.env.NEXTAUTH_URL = "https://storied-longma-396754.netlify.app";
process.env.NEXT_PUBLIC_APP_URL = "https://storied-longma-396754.netlify.app";
process.env.FORTRESS_SECRET = "ela-sovereign-vault-protection-32";
process.env.CRON_SECRET = "ela-apex-cron-sovereign-2026";

const opts = { stdio: 'inherit', env: process.env, shell: true };

function run(cmd, args, label) {
    console.log(`\n▶  ${label}...`);
    const result = spawnSync(cmd, args, opts);
    if (result.error) {
        console.error(`❌ Spawn error in [${label}]:`, result.error.message);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`❌ [${label}] exited with code ${result.status}`);
        process.exit(1);
    }
    console.log(`✅ ${label} — done.`);
}

// 1. Generate Prisma client (required for type-safe queries)
run('node', ['node_modules/.bin/prisma', 'generate'], 'Prisma Generate');

// 2. Next.js build
process.env.NODE_OPTIONS = '--max-old-space-size=4096';
run('node', ['node_modules/.bin/next', 'build'], 'Next.js Build');

console.log('\n✅ Build completed successfully!');
