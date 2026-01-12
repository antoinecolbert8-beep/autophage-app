# ELA SaaS - Deployment Checklist

## 🚀 Quick Deploy (5 minutes)

### Step 1: Environment Variables
Create `.env.local` with:
```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Supabase Realtime
SUPABASE_URL="https://[PROJECT].supabase.co"
SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Vertex AI
VERTEX_AI_API_KEY="AIza..."
GOOGLE_CLOUD_PROJECT_ID="your-project"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

### Step 2: Database Setup
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Deploy to Vercel
```bash
npx vercel --prod
```

### Step 4: Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_method.attached`

### Step 5: Enable Cron Jobs (Vercel)
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/domination",
    "schedule": "*/5 * * * *"
  }]
}
```

## ✅ Verification Checklist

- [ ] Database connected (`npx prisma studio`)
- [ ] Stripe webhook receiving events
- [ ] Content generation works (`/dashboard/content-generator`)
- [ ] Billing page loads (`/dashboard/billing`)
- [ ] Domination worker starts (`/dashboard/domination-heatmap`)

## 🔒 Security Reminders

- [ ] All API keys are in environment variables (not code)
- [ ] Stripe webhook signature verified
- [ ] Fortress middleware active on all routes
- [ ] HTTPS enforced

## 📊 Post-Deploy

1. Create first organization via Prisma Studio
2. Test SEPA subscription flow
3. Generate first content asset
4. Monitor `/dashboard/domination-heatmap`
