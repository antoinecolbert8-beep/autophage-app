# 🏗️ ARCHITECTURE SAAS COMMERCIAL - AUTOPHAGE

## 📋 **VISION**

SaaS d'automatisation de contenu social média avec modèle économique hybride :
- **Abonnements mensuels** avec quotas inclus
- **Pay-per-use** au-delà des quotas avec frais de service
- **Multi-réseaux** : YouTube, TikTok, Instagram, Facebook
- **Automatisations** : Shorts, Reels, Carrousels via IA (Veo, GPT-4)

---

## 💰 **MODÈLE ÉCONOMIQUE**

### **Plans d'abonnement**

| Plan | Prix | Quotas Inclus | Frais Service |
|------|------|---------------|---------------|
| **Starter** | 29€/mois | 10 vidéos/mois | 0.50€ au-delà |
| **Pro** | 99€/mois | 50 vidéos/mois | 0.30€ au-delà |
| **Business** | 299€/mois | 200 vidéos/mois | 0.20€ au-delà |
| **Enterprise** | Custom | Illimité | Custom |

### **Coûts par automatisation**

| Fonctionnalité | Coût IA | Frais Service | Prix Client |
|----------------|---------|---------------|-------------|
| **YouTube Short** | $0.53 | +100% | 1.06€ |
| **TikTok Video** | $0.53 | +100% | 1.06€ |
| **Instagram Reel** | $0.53 | +100% | 1.06€ |
| **Carrousel** | $0.20 | +100% | 0.40€ |

### **Revenus projetés**

- Client Starter dépassant quotas : 10 vidéos incluses + 20 additionnelles = **29€ + 20€ = 49€/mois**
- Marge : **20€ (frais services) - 10.60€ (coûts IA) = 9.40€ profit** sur usage additionnel

---

## 🗄️ **MODÈLE DE DONNÉES**

### **Users (Clients)**
```prisma
model User {
  id                String             @id @default(cuid())
  email             String             @unique
  name              String?
  avatar            String?
  
  // Stripe
  stripeCustomerId  String             @unique
  subscriptionId    String?
  subscriptionStatus SubscriptionStatus
  currentPlan       Plan               @default(STARTER)
  
  // Quotas
  monthlyQuota      Int                @default(10)
  usedQuota         Int                @default(0)
  resetDate         DateTime
  
  // Réseaux connectés
  socialAccounts    SocialAccount[]
  
  // Contenu généré
  videos            Video[]
  carrousels        Carrousel[]
  
  // Facturation
  invoices          Invoice[]
  usageRecords      UsageRecord[]
  
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
}
```

### **Plans & Subscriptions**
```prisma
enum Plan {
  STARTER
  PRO
  BUSINESS
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  TRIALING
}

model Subscription {
  id                String             @id @default(cuid())
  userId            String
  user              User               @relation(fields: [userId], references: [id])
  
  plan              Plan
  status            SubscriptionStatus
  
  priceId           String             // Stripe Price ID
  currentPeriodEnd  DateTime
  cancelAtPeriodEnd Boolean            @default(false)
  
  monthlyQuota      Int                // Quotas selon le plan
  
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
}
```

### **Usage & Facturation**
```prisma
model UsageRecord {
  id                String     @id @default(cuid())
  userId            String
  user              User       @relation(fields: [userId], references: [id])
  
  type              UsageType  // SHORT, REEL, CARROUSEL
  platform          Platform   // YOUTUBE, TIKTOK, INSTAGRAM
  
  costAI            Float      // Coût IA réel
  serviceFee        Float      // Frais de service
  totalCharge       Float      // Total facturé au client
  
  withinQuota       Boolean    // Dans les quotas ou pay-per-use
  
  videoId           String?
  carrouselId       String?
  
  createdAt         DateTime   @default(now())
}

enum UsageType {
  SHORT
  REEL
  CARROUSEL
  POST
}

enum Platform {
  YOUTUBE
  TIKTOK
  INSTAGRAM
  FACEBOOK
}
```

### **Réseaux sociaux**
```prisma
model SocialAccount {
  id                String     @id @default(cuid())
  userId            String
  user              User       @relation(fields: [userId], references: [id])
  
  platform          Platform
  platformUserId    String     // ID sur la plateforme
  username          String
  avatar            String?
  
  accessToken       String     @db.Text
  refreshToken      String?    @db.Text
  tokenExpiry       DateTime?
  
  isActive          Boolean    @default(true)
  
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  
  @@unique([userId, platform])
}
```

### **Contenus**
```prisma
model Video {
  id                String     @id @default(cuid())
  userId            String
  user              User       @relation(fields: [userId], references: [id])
  
  platform          Platform
  socialAccountId   String
  
  title             String
  description       String     @db.Text
  script            Json       // Script complet
  
  videoUrl          String?
  thumbnailUrl      String?
  
  platformVideoId   String?    // ID sur YouTube/TikTok
  uploadStatus      UploadStatus
  
  views             Int        @default(0)
  likes             Int        @default(0)
  comments          Int        @default(0)
  
  costAI            Float
  serviceFee        Float
  
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
}

enum UploadStatus {
  GENERATING
  READY
  UPLOADING
  PUBLISHED
  FAILED
}

model Carrousel {
  id                String     @id @default(cuid())
  userId            String
  user              User       @relation(fields: [userId], references: [id])
  
  platform          Platform   // Instagram/LinkedIn
  socialAccountId   String
  
  title             String
  slides            Json       // Array de slides
  
  imageUrls         String[]
  
  platformPostId    String?
  uploadStatus      UploadStatus
  
  likes             Int        @default(0)
  comments          Int        @default(0)
  shares            Int        @default(0)
  
  costAI            Float
  serviceFee        Float
  
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
}
```

### **Factures**
```prisma
model Invoice {
  id                String     @id @default(cuid())
  userId            String
  user              User       @relation(fields: [userId], references: [id])
  
  stripeInvoiceId   String     @unique
  
  subscriptionFee   Float      // Frais abonnement
  usageFees         Float      // Frais usage additionnel
  total             Float
  
  period            String     // "2025-01"
  status            InvoiceStatus
  
  paidAt            DateTime?
  
  createdAt         DateTime   @default(now())
}

enum InvoiceStatus {
  DRAFT
  OPEN
  PAID
  VOID
  UNCOLLECTIBLE
}
```

---

## 🎯 **ROUTES API**

### **Authentication**
- `POST /api/auth/signup` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - User actuel

### **Abonnements**
- `GET /api/subscriptions/plans` - Liste des plans
- `POST /api/subscriptions/checkout` - Créer session Stripe
- `POST /api/subscriptions/upgrade` - Upgrade plan
- `POST /api/subscriptions/cancel` - Annuler
- `GET /api/subscriptions/current` - Abonnement actuel

### **Quotas & Usage**
- `GET /api/usage/current` - Quotas actuels
- `GET /api/usage/history` - Historique d'usage
- `GET /api/usage/estimate` - Estimer coût action

### **Réseaux sociaux**
- `POST /api/social/connect/:platform` - Connecter compte
- `DELETE /api/social/disconnect/:id` - Déconnecter
- `GET /api/social/accounts` - Liste comptes connectés
- `GET /api/social/:platform/callback` - OAuth callback

### **Génération de contenu**
- `POST /api/generate/short` - Générer YouTube Short
- `POST /api/generate/reel` - Générer Instagram Reel
- `POST /api/generate/carrousel` - Générer carrousel
- `POST /api/generate/batch` - Génération en lot

### **Upload & Publication**
- `POST /api/upload/youtube` - Upload sur YouTube
- `POST /api/upload/tiktok` - Upload sur TikTok
- `POST /api/upload/instagram` - Upload sur Instagram
- `POST /api/schedule` - Planifier publication

### **Analytics**
- `GET /api/analytics/overview` - Vue d'ensemble
- `GET /api/analytics/videos` - Stats par vidéo
- `GET /api/analytics/platforms` - Stats par plateforme

### **Webhooks**
- `POST /api/webhooks/stripe` - Webhooks Stripe
- `POST /api/webhooks/youtube` - Notifications YouTube
- `POST /api/webhooks/tiktok` - Notifications TikTok

---

## 🎨 **PAGES FRONTEND**

### **Public**
- `/` - Landing page
- `/pricing` - Page tarifs
- `/features` - Fonctionnalités
- `/login` - Connexion
- `/signup` - Inscription

### **Dashboard Client**
- `/dashboard` - Vue d'ensemble
- `/dashboard/generate` - Générer contenu
- `/dashboard/videos` - Mes vidéos
- `/dashboard/carrousels` - Mes carrousels
- `/dashboard/schedule` - Planification
- `/dashboard/analytics` - Analytics
- `/dashboard/social` - Réseaux connectés
- `/dashboard/billing` - Facturation
- `/dashboard/usage` - Usage & quotas
- `/dashboard/settings` - Paramètres

### **Admin**
- `/admin` - Dashboard admin
- `/admin/users` - Gestion utilisateurs
- `/admin/revenue` - Revenus
- `/admin/usage` - Usage global
- `/admin/costs` - Coûts IA

---

## 🔒 **SÉCURITÉ**

- ✅ **Authentication** : NextAuth.js + JWT
- ✅ **Authorization** : RBAC (Role-Based Access Control)
- ✅ **Rate Limiting** : Par IP et par user
- ✅ **Encryption** : Tokens OAuth chiffrés
- ✅ **Webhooks** : Signatures vérifiées
- ✅ **CORS** : Whitelist domaines
- ✅ **GDPR** : Conformité UE

---

## 📊 **MONITORING**

- ✅ **Sentry** : Error tracking
- ✅ **Vercel Analytics** : Performance
- ✅ **Stripe Dashboard** : Revenus
- ✅ **Custom Metrics** : Usage, coûts, profits

---

## 🚀 **SCALABILITÉ**

- ✅ **Database** : PostgreSQL (Supabase) avec connection pooling
- ✅ **Cache** : Redis pour quotas et sessions
- ✅ **Queue** : Bull MQ pour jobs longs (génération vidéos)
- ✅ **Storage** : S3/R2 pour vidéos
- ✅ **CDN** : Cloudflare pour assets
- ✅ **Edge** : Vercel Edge Functions

---

**PRÊT À CONSTRUIRE LE MEILLEUR SAAS D'AUTOMATISATION SOCIALE ! 🔥**


