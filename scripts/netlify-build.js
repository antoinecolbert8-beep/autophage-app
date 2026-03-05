const { spawnSync } = require('child_process');

console.log('🚀 Starting robust Netlify build script (Production Mode)...');

// Force critical production secrets to bypass Netlify UI bugs and shell escaping issues
// URL encode the exclamation mark (! => %21) to prevent ANY bash history expansion errors
process.env.DATABASE_URL = "postgresql://postgres:ElaSovereign2024%21@db.yoqgvuwtseoctwwjlapy.supabase.co:5432/postgres?sslmode=require";
process.env.NEXTAUTH_SECRET = "ela-sovereign-genesis-nextauth-secret-2026-fortress";
process.env.NEXTAUTH_URL = "https://storied-longma-396754.netlify.app";
process.env.NEXT_PUBLIC_APP_URL = "https://storied-longma-396754.netlify.app";
process.env.FORTRESS_SECRET = "ela-sovereign-vault-protection-32";
process.env.CRON_SECRET = "ela-apex-cron-sovereign-2026";

const opts = { stdio: 'inherit', env: process.env };

try {
    console.log('📦 1. Generating Prisma Client...');
    const prismaGen = spawnSync('npx', ['--yes', 'prisma', 'generate'], opts);
    if (prismaGen.status !== 0) throw new Error(`Prisma generate failed with code ${prismaGen.status}`);

    console.log('📦 2. Pushing database schema...');
    const dbPush = spawnSync('npx', ['--yes', 'prisma', 'db', 'push', '--accept-data-loss'], opts);
    if (dbPush.status !== 0) throw new Error(`Prisma db push failed with code ${dbPush.status}`);

    console.log('🌱 3. Seeding admin account...');
    const seed = spawnSync('node', ['scripts/netlify-seed.js'], opts);
    if (seed.status !== 0) throw new Error(`Seed failed with code ${seed.status}`);

    console.log('🏗️  4. Running Next.js Build...');
    // Provide memory options explicitly in NODE_OPTIONS if needed
    process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS || '') + ' --max-old-space-size=4096';

    // Some local paths might use backslashes, but require.resolve finds it correctly
    const nextBin = require.resolve('next/dist/bin/next');
    const build = spawnSync('node', [nextBin, 'build'], { stdio: 'inherit', env: process.env });

    if (build.status !== 0) throw new Error(`Next.js build exited with code ${build.status}`);

    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build script caught an error:', error);
    process.exit(1);
}
