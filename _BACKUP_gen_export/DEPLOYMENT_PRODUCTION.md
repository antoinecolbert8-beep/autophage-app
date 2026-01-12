# 🚀 GUIDE DE DÉPLOIEMENT PRODUCTION - AUTOPHAGE ENTERPRISE

## 📋 Checklist Complète pour Rendre le Système Opérationnel

---

## ÉTAPE 1 : CONFIGURATION DES CLÉS API 🔑

### 1.1 Créer le fichier `.env`

```bash
# À la racine du projet
cp .env.complete .env
```

### 1.2 Remplir TOUTES les clés API

#### **OpenAI (Requis)**
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```
👉 Obtenir sur : https://platform.openai.com/api-keys

#### **Google Gemini Pro (Requis)**
```env
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxx
```
👉 Obtenir sur : https://makersuite.google.com/app/apikey

#### **Pinecone (Option 1 - Cloud)**
```env
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX_NAME=autophage-knowledge
```
👉 Obtenir sur : https://app.pinecone.io/

#### **Supabase (Base de données)**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```
👉 Créer projet sur : https://supabase.com/dashboard

#### **ElevenLabs (Voix IA)**
```env
ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```
👉 Obtenir sur : https://elevenlabs.io/api

#### **Twilio (Téléphonie)**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33123456789
```
👉 Obtenir sur : https://www.twilio.com/console

#### **Stripe (Paiements)**
```env
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```
👉 Obtenir sur : https://dashboard.stripe.com/apikeys

#### **Meta/Facebook (Réseaux sociaux)**
```env
FACEBOOK_APP_ID=xxxxxxxxxxxxx
FACEBOOK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxx
```
👉 Obtenir sur : https://developers.facebook.com/

#### **Stock Images (Optionnel)**
```env
PEXELS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
UNSPLASH_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
```

#### **HeyGen (Avatars vidéo - Elite)**
```env
HEYGEN_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```
👉 Obtenir sur : https://www.heygen.com/

---

## ÉTAPE 2 : INSTALLATION DES DÉPENDANCES 📦

### 2.1 Backend Node.js

```bash
# À la racine
npm install

# Vérifier que tout est installé
npm list --depth=0
```

### 2.2 Bot Python

```bash
cd SaaS_Bot_LinkedIn

# Créer environnement virtuel
python -m venv venv

# Activer (Windows)
.\venv\Scripts\activate

# Activer (Mac/Linux)
source venv/bin/activate

# Installer dépendances
pip install -r requirements.txt

# Installer Playwright browsers
playwright install chromium
```

---

## ÉTAPE 3 : SETUP DES BASES DE DONNÉES 🗄️

### 3.1 PostgreSQL (Supabase)

```bash
# Générer les tables Prisma
npx prisma generate
npx prisma db push

# Vérifier la connexion
npx prisma studio
```

**Tables créées automatiquement :**
- `User` : Utilisateurs/Clients
- `BotAction` : Historique des actions bots
- `ContentPost` : Posts générés
- `Lead` : Prospects qualifiés
- `CallRecord` : Enregistrements téléphonie

### 3.2 ChromaDB (Souveraineté - Recommandé)

```bash
# Lancer ChromaDB (Docker)
docker run -p 8000:8000 chromadb/chroma

# OU via docker-compose
docker-compose up chromadb -d

# Setup collection
npm run setup:chromadb
```

**Ou utiliser Pinecone (Cloud) :**

```bash
npm run setup:pinecone
```

### 3.3 Ingestion de la Base de Connaissances

```bash
# Créer le dossier de documents
mkdir -p data/knowledge

# Y placer vos fichiers :
# - PDFs (docs produit, pitchs)
# - TXT (scripts, FAQs)
# - MD (documentation)

# Ingérer dans la base vectorielle
npm run ingest:knowledge
```

---

## ÉTAPE 4 : CONFIGURATION DOCKER 🐳

### 4.1 Vérifier Docker

```bash
docker --version
docker-compose --version
```

### 4.2 Build des images

```bash
# Build tous les services
docker-compose build

# Ou individuellement
docker-compose build app
docker-compose build bot
```

### 4.3 Lancer l'infrastructure complète

```bash
# Lancer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Vérifier le statut
docker-compose ps
```

**Services lancés :**
- `app` : Next.js (port 3000)
- `bot` : Python LinkedIn Bot
- `chromadb` : Base vectorielle (port 8000)
- `video-processor` : Pipeline vidéo
- `telephony` : Service Twilio
- `agents` : Multi-Agent Swarm

---

## ÉTAPE 5 : CONFIGURATION LINKEDIN BOT 🤖

### 5.1 Première connexion manuelle

```bash
cd SaaS_Bot_LinkedIn

# Activer venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Lancer le script de connexion
python login_saver.py
```

**Actions :**
1. Une fenêtre Chrome s'ouvre
2. Connectez-vous MANUELLEMENT à LinkedIn
3. Le script sauvegarde les cookies dans `storage_state.json`
4. ✅ Plus besoin de reconnecter !

### 5.2 Configuration des targets

Éditer `SaaS_Bot_LinkedIn/targets.json` :

```json
{
  "profiles": [
    "https://www.linkedin.com/in/john-doe/",
    "https://www.linkedin.com/in/jane-smith/"
  ],
  "keywords": ["SaaS", "Marketing", "AI"],
  "exclusions": ["recruteur", "freelance"]
}
```

### 5.3 Lancer le bot en mode autonome

```bash
# Engagement automatique
python engagement_bot.py

# Collecte de stats
python stats_collector.py
```

---

## ÉTAPE 6 : DÉPLOIEMENT EN PRODUCTION 🌐

### Option A : Vercel (Recommandé pour Next.js)

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configuration Vercel :**
1. Ajouter toutes les variables d'environnement dans le dashboard
2. Configurer les domaines personnalisés
3. Activer les Edge Functions

### Option B : VPS (DigitalOcean, AWS, OVH)

```bash
# 1. Connecter au serveur
ssh root@votre-serveur.com

# 2. Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Cloner le repo
git clone https://github.com/votre-repo/autophage.git
cd autophage

# 4. Copier .env
nano .env
# (Coller toutes les clés API)

# 5. Lancer avec Docker
docker-compose up -d

# 6. Configurer Nginx (reverse proxy)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/autophage

# Configuration Nginx :
server {
    listen 80;
    server_name votre-domaine.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 7. Activer le site
sudo ln -s /etc/nginx/sites-available/autophage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. SSL avec Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### Option C : Railway / Render (Alternative)

**Railway :**
```bash
# Installer CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

---

## ÉTAPE 7 : AUTOMATISATION & CRON JOBS ⏰

### 7.1 Créer les cron jobs (Linux/Mac)

```bash
crontab -e
```

Ajouter :

```bash
# Feedback loop (chaque nuit à 3h)
0 3 * * * cd /path/to/autophage && npm run feedback:loop

# Stats collection (toutes les heures)
0 * * * * cd /path/to/autophage/SaaS_Bot_LinkedIn && python stats_collector.py

# Backup base de données (chaque jour à 4h)
0 4 * * * cd /path/to/autophage && npm run db:backup

# Agent Swarm check (toutes les 30min)
*/30 * * * * cd /path/to/autophage && npm run agents:check

# Self-healing (toutes les 15min)
*/15 * * * * cd /path/to/autophage && npm run self-healing:check
```

### 7.2 Automatisation Windows (Task Scheduler)

Créer `start_agents.bat` :

```batch
@echo off
cd C:\path\to\autophage
call npm run agents:run
```

**Planifier dans Task Scheduler :**
1. Ouvrir "Planificateur de tâches"
2. Créer une tâche → Déclencheur : Au démarrage du système
3. Action : Démarrer `start_agents.bat`

---

## ÉTAPE 8 : CONFIGURATION WEBHOOKS 🔗

### 8.1 Twilio (Téléphonie)

Dans le dashboard Twilio :

**Numéro entrant :**
```
https://votre-domaine.com/api/telephony/inbound
```

**Status callback :**
```
https://votre-domaine.com/api/telephony/status
```

### 8.2 Stripe (Paiements)

Dans le dashboard Stripe :

**Webhook endpoint :**
```
https://votre-domaine.com/api/webhooks/stripe
```

**Événements à écouter :**
- `checkout.session.completed`
- `customer.subscription.updated`
- `invoice.payment_succeeded`

### 8.3 Facebook/Instagram (Webhooks)

Dans Facebook Developers :

**Callback URL :**
```
https://votre-domaine.com/api/webhooks/meta
```

---

## ÉTAPE 9 : MONITORING & ALERTES 📊

### 9.1 Health Check automatique

```bash
# Toutes les 5 minutes
*/5 * * * * curl https://votre-domaine.com/api/health
```

### 9.2 Intégrer Sentry (Erreurs)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Ajouter dans `.env` :
```env
SENTRY_DSN=https://xxxxxx@sentry.io/xxxxxx
```

### 9.3 Uptime monitoring

**Services gratuits :**
- UptimeRobot : https://uptimerobot.com/
- Better Uptime : https://betteruptime.com/

Configurer pour ping toutes les 5 minutes :
```
https://votre-domaine.com/api/health
```

### 9.4 Logs centralisés

```bash
# Installer Winston
npm install winston

# Ou utiliser les logs Docker
docker-compose logs -f --tail=100
```

---

## ÉTAPE 10 : SÉCURITÉ 🔒

### 10.1 Variables d'environnement

**NE JAMAIS commit le `.env` !**

Vérifier `.gitignore` :
```
.env
.env.local
.env.production
storage_state.json
config/*.json
```

### 10.2 Rate limiting

Dans `middleware.ts` :

```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

### 10.3 Authentification

**NextAuth.js (recommandé) :**

```bash
npm install next-auth
```

Créer `app/api/auth/[...nextauth]/route.ts`

### 10.4 CORS

Dans `next.config.js` :

```javascript
async headers() {
  return [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "https://votre-domaine.com" },
      ],
    },
  ];
}
```

---

## ÉTAPE 11 : TESTS & VALIDATION ✅

### 11.1 Tests unitaires

```bash
npm run test
```

### 11.2 Tests E2E (Playwright)

```bash
npx playwright test
```

### 11.3 Checklist de validation

- [ ] Frontend accessible sur HTTPS
- [ ] Toutes les pages se chargent
- [ ] Navigation fonctionne
- [ ] Bot LinkedIn connecté
- [ ] Base de données accessible
- [ ] ChromaDB/Pinecone répond
- [ ] API OpenAI fonctionne
- [ ] API Gemini fonctionne
- [ ] Twilio reçoit/envoie des appels
- [ ] Stripe traite les paiements
- [ ] Webhooks configurés
- [ ] Cron jobs actifs
- [ ] Monitoring en place
- [ ] Logs accessibles
- [ ] Backup automatique

---

## ÉTAPE 12 : MISE À JOUR & MAINTENANCE 🔄

### 12.1 Script de mise à jour

Créer `update.sh` :

```bash
#!/bin/bash
cd /path/to/autophage
git pull origin main
npm install
npx prisma generate
docker-compose down
docker-compose build
docker-compose up -d
echo "✅ Mise à jour terminée"
```

### 12.2 Backup régulier

```bash
# Backup base de données
npm run db:backup

# Backup fichiers critiques
tar -czf backup-$(date +%Y%m%d).tar.gz \
  .env \
  storage_state.json \
  data/ \
  config/
```

---

## 📊 COÛTS ESTIMÉS (Mensuel)

| Service | Plan | Coût |
|---------|------|------|
| **Vercel** | Pro | 20$/mois |
| **Supabase** | Pro | 25$/mois |
| **Pinecone** | Starter | 70$/mois |
| **OpenAI** | Pay-as-go | ~50-200$/mois |
| **Google Gemini** | Pay-as-go | ~30-100$/mois |
| **Twilio** | Pay-as-go | ~50-500$/mois |
| **ElevenLabs** | Creator | 22$/mois |
| **HeyGen** | Creator | 29$/mois |
| **VPS** (si auto-hébergé) | 4 vCPU/8GB | 40$/mois |

**Total estimé :** 250-500$/mois pour un client actif

**Avec abonnement Elite à 999€ :** Marge de 50-75% 🎯

---

## 🚀 OPTIMISATIONS POUR PRODUCTION

### 1. CDN (CloudFlare)
- Cache des assets statiques
- Protection DDoS
- SSL gratuit

### 2. Redis (Cache)
```bash
docker-compose up redis -d
```

### 3. Queue Jobs (Bull/BullMQ)
Pour les tâches longues (génération vidéo, etc.)

### 4. Load Balancing
Si > 100 clients, utiliser plusieurs instances

---

## 🎯 CHECKLIST FINALE

### Avant le lancement :

- [ ] Toutes les clés API configurées
- [ ] Base de données setup
- [ ] Bot LinkedIn connecté
- [ ] Docker lancé
- [ ] Site déployé
- [ ] HTTPS activé
- [ ] Webhooks configurés
- [ ] Cron jobs actifs
- [ ] Monitoring en place
- [ ] Backup automatique
- [ ] Tests passés
- [ ] Documentation lue

### Post-lancement :

- [ ] Surveiller les logs 24h
- [ ] Vérifier les métriques
- [ ] Tester chaque fonctionnalité
- [ ] Valider les paiements Stripe
- [ ] Confirmer les appels Twilio
- [ ] Vérifier le bot LinkedIn
- [ ] Consulter les agents IA

---

## 🆘 SUPPORT & DÉPANNAGE

### Logs importants

```bash
# Logs Docker
docker-compose logs -f

# Logs Next.js
npm run logs

# Logs bot Python
tail -f SaaS_Bot_LinkedIn/bot.log

# Logs système
journalctl -f
```

### Redémarrage d'urgence

```bash
# Tout redémarrer
docker-compose restart

# Un service spécifique
docker-compose restart app
docker-compose restart bot
```

### Kill Switch manuel

```bash
# Arrêter TOUT
docker-compose down

# Ou
npm run emergency:stop
```

---

## 🎉 FÉLICITATIONS !

**Votre système Autophage est maintenant :**

✅ **Opérationnel** en ligne 24/7
✅ **Autonome** avec agents IA
✅ **Scalable** avec Docker
✅ **Sécurisé** avec HTTPS + rate limiting
✅ **Monitoré** avec alertes
✅ **Rentable** avec marge 50-75%

**Vous possédez maintenant une armée numérique qui travaille pendant que vous dormez !** 💰🚀

---

Made with ❤️ by Autophage Team





