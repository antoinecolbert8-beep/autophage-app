#!/bin/bash
export DATABASE_URL="postgresql://postgres:ElaSovereign2024!@db.yoqgvuwtseoctwwjlapy.supabase.co:5432/postgres?sslmode=require"
export NEXTAUTH_SECRET="ela-sovereign-genesis-nextauth-secret-2026-fortress"
export NEXTAUTH_URL="https://storied-longma-396754.netlify.app"
export NEXT_PUBLIC_APP_URL="https://storied-longma-396754.netlify.app"
export FORTRESS_SECRET="ela-sovereign-vault-protection-32"
export CRON_SECRET="ela-apex-cron-sovereign-2026"

echo "Running production build sequence..."
npx prisma generate
npx prisma db push --accept-data-loss
node scripts/netlify-seed.js
npm run build
