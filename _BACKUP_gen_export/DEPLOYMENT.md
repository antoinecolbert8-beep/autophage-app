# 🚀 Guide de Déploiement - SaaS Bot LinkedIn

Ce guide couvre le déploiement complet du système en production.

---

## 📋 Checklist Pré-Déploiement

- [ ] Node.js ≥ 20 installé
- [ ] Python ≥ 3.10 installé
- [ ] FFmpeg installé
- [ ] Compte Supabase créé (ou PostgreSQL)
- [ ] Compte Pinecone créé
- [ ] Clés API obtenues :
  - [ ] OpenAI API Key
  - [ ] Pinecone API Key
  - [ ] ElevenLabs API Key (optionnel)
  - [ ] Pexels/Unsplash (optionnel)
- [ ] Domaine configuré (optionnel)

---

## 🗄️ 1. Base de Données (Supabase)

### A. Création du projet
1. Va sur [supabase.com](https://supabase.com)
2. Crée un nouveau projet
3. Choisis une région proche de tes utilisateurs
4. Note le mot de passe de la DB

### B. Configuration
```bash
# Récupère l'URL de connexion
# Dashboard → Settings → Database → Connection String (URI)
# Format: postgresql://postgres.[project-ref]:[password]@[host]:5432/postgres

# Ajoute dans .env
DATABASE_URL="postgresql://postgres.xxxx:[password]@db.xxxx.supabase.co:5432/postgres"
```

### C. Migration
```bash
npx prisma db push
npx tsx scripts/setup-database.ts
```

---

## 🧠 2. Pinecone (Base Vectorielle)

### A. Création de compte
1. Va sur [pinecone.io](https://www.pinecone.io)
2. Crée un compte gratuit (100k vecteurs gratuits)
3. Crée une API Key

### B. Configuration
```bash
# Ajoute dans .env
PINECONE_API_KEY="pcsk_..."
```

### C. Initialisation
```bash
npx tsx scripts/setup-pinecone.ts
```

---

## 🌐 3. Frontend Next.js (Vercel)

### Option A : Déploiement Vercel (Recommandé)

```bash
# Installe Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configuration Vercel** :
1. Ajoute les variables d'environnement dans Dashboard → Settings → Environment Variables
2. Copie toutes les variables de `.env`
3. Redéploie : `vercel --prod`

### Option B : Déploiement VPS (Node.js)

```bash
# Sur le serveur
cd /var/www/saas-bot
git clone <repo-url> .
npm install
npm run build

# PM2 pour garder l'app en vie
npm i -g pm2
pm2 start npm --name "saas-bot" -- start
pm2 save
pm2 startup
```

**Nginx Reverse Proxy** :
```nginx
server {
    listen 80;
    server_name ton-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

---

## 🤖 4. Bot Python (VPS/Cloud)

### A. Setup Serveur (Ubuntu 22.04)

```bash
# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Installation dépendances
sudo apt install -y python3 python3-pip ffmpeg git

# Installation Playwright
pip3 install playwright requests
playwright install chromium
playwright install-deps

# Clone repo
cd /opt
sudo git clone <repo-url> saas-bot
cd saas-bot/SaaS_Bot_LinkedIn

# Copie .env
sudo nano .env
# Colle tes variables d'environnement
```

### B. Première Connexion LinkedIn

```bash
cd /opt/saas-bot/SaaS_Bot_LinkedIn

# Lance avec interface graphique (nécessite X11 ou VNC)
python3 login_saver.py

# Alternative : utilise un desktop temporaire
sudo apt install xvfb
xvfb-run python3 login_saver.py
```

**Note** : La première connexion LinkedIn nécessite une interface graphique. Options :
1. SSH avec X11 forwarding : `ssh -X user@server`
2. VNC Server : Configure un bureau distant
3. Local puis upload : Lance sur ta machine locale, puis upload `storage_state.json` sur le serveur

### C. Configuration Cron Jobs

```bash
crontab -e
```

Ajoute ces lignes :
```cron
# Bot engagement : toutes les 4 heures
0 */4 * * * cd /opt/saas-bot/SaaS_Bot_LinkedIn && python3 engagement_bot.py >> /var/log/engagement.log 2>&1

# Collecte stats : tous les jours à minuit
0 0 * * * cd /opt/saas-bot/SaaS_Bot_LinkedIn && python3 stats_collector.py >> /var/log/stats.log 2>&1

# Feedback loop : tous les lundis à 2h
0 2 * * 1 cd /opt/saas-bot && npx tsx scripts/run-feedback-loop.ts >> /var/log/feedback.log 2>&1
```

---

## 🔐 5. Sécurité Production

### A. Variables d'Environnement

**JAMAIS** commit `.env` dans Git !

```bash
# Ajoute au .gitignore
echo ".env" >> .gitignore
echo "storage_state.json" >> .gitignore
echo "*.log" >> .gitignore
```

### B. HTTPS (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ton-domaine.com
```

### C. Firewall

```bash
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

---

## 📊 6. Monitoring

### A. Logs

```bash
# Frontend (si VPS)
pm2 logs saas-bot

# Bot Python
tail -f /var/log/engagement.log
tail -f /var/log/stats.log
tail -f /var/log/feedback.log
```

### B. Uptime Monitoring

Utilise un service comme :
- [UptimeRobot](https://uptimerobot.com) (gratuit)
- [Pingdom](https://www.pingdom.com)
- [BetterUptime](https://betteruptime.com)

Configure ping sur `https://ton-domaine.com/api/health`

### C. Sentry (Erreurs)

```bash
npm install @sentry/nextjs
```

Configure dans `next.config.js` :
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // config Next.js
}, {
  silent: true,
  org: "ton-org",
  project: "saas-bot",
});
```

---

## 🔄 7. CI/CD (GitHub Actions)

Crée `.github/workflows/deploy.yml` :

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          PINECONE_API_KEY: ${{ secrets.PINECONE_API_KEY }}
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🧪 8. Tests Pré-Production

### A. Tests API

```bash
# Test Pinecone
curl http://localhost:3000/api/pinecone/setup

# Test RAG
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'

# Test génération vidéo
curl -X POST http://localhost:3000/api/content/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "test",
    "niche": "saas",
    "platform": "LINKEDIN"
  }'
```

### B. Tests Bot Python

```bash
cd SaaS_Bot_LinkedIn

# Test rotation UA
python3 user_agent_rotator.py

# Test engagement (mode dry-run)
python3 engagement_bot.py --dry-run
```

---

## 🚨 9. Troubleshooting Production

### "Module not found"
```bash
npm install
npx prisma generate
```

### "Database connection failed"
```bash
# Vérifie la connexion
npx prisma db pull

# Vérifie les logs Supabase
# Dashboard → Logs
```

### "FFmpeg not working"
```bash
# Vérifie l'installation
ffmpeg -version

# Réinstalle si nécessaire
sudo apt install --reinstall ffmpeg
```

### "LinkedIn bloque le bot"
- Réduis la fréquence des actions (passe de 4h à 8h dans cron)
- Vérifie que `storage_state.json` est à jour
- Force rotation UA : `python3 user_agent_rotator.py`
- Augmente les délais dans `stealth_config.py`

---

## 📈 10. Scaling

### A. Multi-Instances (Horizontal)

Pour gérer plusieurs comptes LinkedIn :

```bash
# Structure
/opt/saas-bot/
  ├── instance-1/  # Client A
  │   ├── storage_state.json
  │   ├── targets.json
  │   └── ...
  ├── instance-2/  # Client B
  │   └── ...
  └── shared/
      └── scripts/
```

Cron par instance :
```cron
0 */4 * * * cd /opt/saas-bot/instance-1 && python3 ../shared/engagement_bot.py
0 */4 * * * cd /opt/saas-bot/instance-2 && python3 ../shared/engagement_bot.py
```

### B. Database Optimization

```sql
-- Ajoute des index pour performance
CREATE INDEX idx_action_history_user ON "ActionHistory"("userId", "createdAt");
CREATE INDEX idx_content_stat_post ON "ContentStat"("postId", "collectedAt");
```

---

## ✅ Checklist Finale

- [ ] Frontend accessible (HTTPS)
- [ ] Base de données connectée
- [ ] Pinecone initialisé
- [ ] Bot Python en cron
- [ ] Logs configurés
- [ ] Monitoring actif
- [ ] Backups configurés
- [ ] DNS configuré
- [ ] Tests effectués

---

## 🆘 Support

En cas de problème :
1. Vérifie les logs
2. Consulte la section Troubleshooting
3. Ouvre une issue GitHub

**🎉 Ton SaaS est maintenant en production !**





