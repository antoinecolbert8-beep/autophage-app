# 🚀 DÉPLOIEMENT SUR VERCEL

## Guide Complet pour Déployer AUTOPHAGE ENTERPRISE sur Vercel

---

## 📋 PRÉREQUIS

✅ Compte Vercel (gratuit) - https://vercel.com/signup
✅ Projet fonctionnel en local (déjà fait ✓)
✅ Git installé
✅ Vercel CLI installé (on va l'installer)

---

## 🎯 MÉTHODE 1 : DÉPLOIEMENT RAPIDE (Recommandé)

### Étape 1 : Installer Vercel CLI

```bash
npm install -g vercel
```

### Étape 2 : Se Connecter à Vercel

```bash
vercel login
```

### Étape 3 : Déployer

```bash
vercel
```

Suivez les instructions :
- **Set up and deploy** : `Y`
- **Which scope** : Choisissez votre compte
- **Link to existing project** : `N`
- **Project name** : `autophage-enterprise` (ou votre choix)
- **Directory** : `.` (laisser par défaut)
- **Override settings** : `N`

### Étape 4 : Déploiement Production

```bash
vercel --prod
```

🎉 **C'est tout !** Votre application sera déployée sur Vercel !

---

## 🎯 MÉTHODE 2 : DÉPLOIEMENT VIA GITHUB (Automatique)

### Étape 1 : Créer un Repository GitHub

```bash
git init
git add .
git commit -m "Initial commit - Autophage Enterprise"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/autophage-enterprise.git
git push -u origin main
```

### Étape 2 : Connecter à Vercel

1. Allez sur https://vercel.com/new
2. Cliquez sur **Import Project**
3. Sélectionnez votre repository GitHub
4. Cliquez sur **Import**

### Étape 3 : Configuration

Vercel détectera automatiquement Next.js.

**Build Command** : `npm run build` (auto-détecté)
**Output Directory** : `.next` (auto-détecté)
**Install Command** : `npm install` (auto-détecté)

### Étape 4 : Variables d'Environnement

Dans les settings Vercel, ajoutez vos variables :

```env
# Database
DATABASE_URL="votre_database_url"

# Google AI (Gemini)
GOOGLE_API_KEY="votre_google_api_key"

# Stripe
STRIPE_SECRET="votre_stripe_secret"
STRIPE_WEBHOOK_SECRET="votre_webhook_secret"

# Meta Ads
META_ACCESS_TOKEN="votre_meta_token"
META_AD_ACCOUNT_ID="votre_ad_account_id"
META_AD_SET_ID="votre_ad_set_id"

# Cron Security
CRON_SECRET="votre_cron_secret"

# Safety
EMERGENCY_STOP_ADS="false"

# Optionnel - Twilio
TWILIO_ACCOUNT_SID="votre_sid"
TWILIO_AUTH_TOKEN="votre_token"
TWILIO_PHONE_NUMBER="+33123456789"

# Optionnel - OpenAI
OPENAI_API_KEY="sk-..."

# Optionnel - Mistral
MISTRAL_API_KEY="votre_mistral_key"

# Optionnel - Pinecone
PINECONE_API_KEY="votre_pinecone_key"

# Optionnel - WhatsApp
WHATSAPP_PHONE_NUMBER_ID="123456789"
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxx"

# Optionnel - Social Media
META_PAGE_ACCESS_TOKEN="EAAxxxxxxx"
META_PAGE_ID="123456789"
META_INSTAGRAM_ACCOUNT_ID="123456789"
TIKTOK_ACCESS_TOKEN="act.xxxxxxx"
YOUTUBE_API_KEY="AIzaSy..."

# Optionnel - CRM
HUBSPOT_API_KEY="votre_hubspot_key"
SALESFORCE_CLIENT_ID="votre_salesforce_id"
SALESFORCE_CLIENT_SECRET="votre_salesforce_secret"
PIPEDRIVE_API_KEY="votre_pipedrive_key"
```

### Étape 5 : Déployer

Cliquez sur **Deploy** !

---

## 🗄️ BASE DE DONNÉES

### Option 1 : Vercel Postgres (Recommandé)

1. Dans votre projet Vercel, allez dans **Storage**
2. Cliquez sur **Create Database**
3. Sélectionnez **Postgres**
4. Suivez les instructions
5. Copiez la `DATABASE_URL` dans vos variables d'environnement

### Option 2 : Supabase (Gratuit)

1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet
3. Allez dans **Settings** > **Database**
4. Copiez la **Connection String**
5. Ajoutez-la à Vercel comme `DATABASE_URL`

### Appliquer le Schéma

Une fois déployé, exécutez :

```bash
vercel env pull .env.production
npx prisma db push
```

---

## 🔐 VARIABLES D'ENVIRONNEMENT OBLIGATOIRES

### Minimum pour Démarrer

```env
DATABASE_URL="postgresql://..."
GOOGLE_API_KEY="AIzaSy..."
STRIPE_SECRET="sk_live_..."
CRON_SECRET="votre_token_secret"
```

### Recommandées

```env
META_ACCESS_TOKEN="EAAxxxxxxx"
TWILIO_ACCOUNT_SID="ACxxxxxxx"
OPENAI_API_KEY="sk-..."
```

---

## 🔄 WEBHOOKS & CRON JOBS

### Configurer les Webhooks Stripe

1. Dans Stripe Dashboard : https://dashboard.stripe.com/webhooks
2. Ajoutez un endpoint : `https://votre-app.vercel.app/api/webhooks/stripe`
3. Copiez le **Signing Secret**
4. Ajoutez-le à Vercel comme `STRIPE_WEBHOOK_SECRET`

### Configurer les Cron Jobs

Vercel Cron est déjà configuré dans le code. Activez-le :

1. Dans votre projet Vercel, allez dans **Settings** > **Cron Jobs**
2. Les crons seront automatiquement détectés

---

## 🚀 APRÈS LE DÉPLOIEMENT

### 1. Vérifier le Déploiement

Votre application sera disponible sur :
```
https://autophage-enterprise.vercel.app
```

Ou un domaine personnalisé si vous en configurez un.

### 2. Tester les Pages

- ✅ Landing Page : https://votre-app.vercel.app
- ✅ Dashboard Pro : https://votre-app.vercel.app/dashboard-pro
- ✅ Sales Factory : https://votre-app.vercel.app/sales-factory
- ✅ Agent Swarm : https://votre-app.vercel.app/agent-swarm

### 3. Vérifier les API

```bash
curl https://votre-app.vercel.app/api/health
```

### 4. Configurer un Domaine Personnalisé

1. Dans Vercel, allez dans **Settings** > **Domains**
2. Ajoutez votre domaine : `autophage.votredomaine.com`
3. Suivez les instructions pour configurer les DNS

---

## 🛠️ COMMANDES UTILES

### Déployer en Production

```bash
vercel --prod
```

### Voir les Logs

```bash
vercel logs
```

### Voir les Variables d'Environnement

```bash
vercel env ls
```

### Ajouter une Variable d'Environnement

```bash
vercel env add VARIABLE_NAME
```

### Télécharger les Variables d'Environnement

```bash
vercel env pull .env.production
```

### Rollback vers Version Précédente

```bash
vercel rollback
```

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Erreur de Build

```bash
# Vérifier localement d'abord
npm run build

# Si ça marche, redéployer
vercel --prod --force
```

### Erreur de Base de Données

```bash
# Vérifier la connection
vercel env pull .env.production
npx prisma db push

# Générer le client Prisma
npx prisma generate
```

### Erreur de Variables d'Environnement

```bash
# Lister les variables
vercel env ls

# Ajouter les manquantes
vercel env add DATABASE_URL
vercel env add GOOGLE_API_KEY
```

### Logs en Temps Réel

```bash
vercel logs --follow
```

---

## 📊 MONITORING

### Analytics Vercel (Inclus)

- Performance automatique
- Web Vitals
- Trafic en temps réel

### Ajouter Sentry (Optionnel)

1. Créez un compte Sentry : https://sentry.io
2. Créez un nouveau projet Next.js
3. Suivez les instructions d'installation
4. Ajoutez `SENTRY_DSN` dans Vercel

---

## 💰 TARIFICATION VERCEL

### Plan Hobby (Gratuit)
- ✅ Bandwidth illimité
- ✅ 100 GB-hours de build
- ✅ Déploiements illimités
- ✅ SSL automatique
- ⚠️ Limité à des projets personnels

### Plan Pro ($20/mois)
- ✅ Tout du Hobby
- ✅ Domaines personnalisés illimités
- ✅ Support prioritaire
- ✅ Advanced Analytics
- ✅ Utilisation commerciale

---

## 🔒 SÉCURITÉ

### Headers de Sécurité (Déjà Configurés)

Le fichier `vercel.json` inclut :
- CORS configuré
- Timeouts pour les fonctions
- Région optimisée (CDG - Paris)

### Variables Sensibles

⚠️ **Ne jamais commiter** :
- `.env`
- `.env.local`
- Clés API

✅ **Toujours utiliser** :
- Variables d'environnement Vercel
- Secrets Vercel pour les données sensibles

---

## 🎯 CHECKLIST AVANT DÉPLOIEMENT

- [ ] Build local réussi (`npm run build`)
- [ ] Toutes les clés API ajoutées dans Vercel
- [ ] Base de données créée et accessible
- [ ] `DATABASE_URL` configurée
- [ ] Webhooks Stripe configurés
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Tests fonctionnels en local

---

## 📞 SUPPORT

### Documentation Vercel
https://vercel.com/docs

### Dashboard Vercel
https://vercel.com/dashboard

### Status Vercel
https://www.vercel-status.com/

---

## 🎉 FÉLICITATIONS !

Une fois déployé, votre système AUTOPHAGE ENTERPRISE sera accessible 24/7 sur internet !

**Performance attendue** :
- ⚡ Temps de réponse < 100ms
- 🌍 CDN global automatique
- 🔒 SSL/HTTPS automatique
- 📊 Scaling automatique
- 🔄 Déploiement continu (avec GitHub)

---

**Dernière mise à jour** : 6 janvier 2025 - 23:30  
**Version** : 1.0.0 Production Ready  
**Statut** : ✅ PRÊT À DÉPLOYER




