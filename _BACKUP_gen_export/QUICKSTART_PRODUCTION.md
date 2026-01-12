# ⚡ QUICK START PRODUCTION - AUTOPHAGE

## 🎯 Mise en ligne en 30 minutes

---

## ÉTAPE 1 : Clés API (5 min)

Créer `.env` à la racine :

```env
# REQUIS (minimum pour démarrer)
OPENAI_API_KEY=sk-proj-xxxxx
GOOGLE_API_KEY=AIzaSyxxxxx
DATABASE_URL=postgresql://xxxxx

# RECOMMANDÉ
PINECONE_API_KEY=xxxxx
ELEVENLABS_API_KEY=xxxxx
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx

# OPTIONNEL (fonctionnalités avancées)
FACEBOOK_ACCESS_TOKEN=xxxxx
HEYGEN_API_KEY=xxxxx
```

---

## ÉTAPE 2 : Installation (10 min)

### Option A : Script automatique (RECOMMANDÉ)

```bash
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

✅ **Le script fait TOUT automatiquement !**

### Option B : Manuel

```bash
# 1. Node.js
npm install

# 2. Python
cd SaaS_Bot_LinkedIn
python -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate sur Windows
pip install -r requirements.txt
playwright install chromium
cd ..

# 3. Base de données
npx prisma generate
npx prisma db push

# 4. Docker
docker-compose build
docker-compose up -d
```

---

## ÉTAPE 3 : Bot LinkedIn (5 min)

```bash
cd SaaS_Bot_LinkedIn
source venv/bin/activate  # Windows: .\venv\Scripts\activate
python login_saver.py
```

➡️ **Connectez-vous manuellement à LinkedIn dans le navigateur qui s'ouvre**

✅ Les cookies sont sauvegardés → Plus besoin de reconnecter !

---

## ÉTAPE 4 : Vérification (5 min)

```bash
# Lancer le check de santé
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

ou

```bash
npm run health
```

**Tout doit être ✅ vert !**

---

## ÉTAPE 5 : Tester (5 min)

Ouvrir dans le navigateur :

- ✅ http://localhost:3000 (Frontend)
- ✅ http://localhost:3000/dashboard-war-room
- ✅ http://localhost:3000/agent-swarm

**Navigation :** Utiliser la sidebar à gauche

---

## 🚀 DÉPLOIEMENT VERCEL (Production)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

**Configurer dans le dashboard Vercel :**
1. Ajouter toutes les variables d'environnement
2. Lier le domaine personnalisé
3. Activer les Edge Functions

**URL finale :** https://votre-domaine.com

---

## 🤖 AUTOMATISATION (Cron Jobs)

### Linux/Mac

```bash
crontab -e
```

Ajouter :

```bash
# Feedback loop quotidien
0 3 * * * cd /path/to/autophage && npm run feedback:loop

# Stats toutes les heures
0 * * * * cd /path/to/autophage/SaaS_Bot_LinkedIn && python stats_collector.py

# Health check toutes les 15 min
*/15 * * * * cd /path/to/autophage && npm run health

# Backup quotidien
0 4 * * * cd /path/to/autophage && npm run backup
```

### Windows (Task Scheduler)

Créer `run_agents.bat` :

```batch
@echo off
cd C:\path\to\autophage
call npm run agents:run
```

Planifier dans "Planificateur de tâches" :
- Déclencheur : Au démarrage
- Action : Démarrer `run_agents.bat`

---

## 🔗 WEBHOOKS (Pour fonctionnalités avancées)

### Twilio (Téléphonie)

Dashboard Twilio → Numéro → Configure :

```
Webhook URL: https://votre-domaine.com/api/telephony/inbound
HTTP Method: POST
```

### Stripe (Paiements)

Dashboard Stripe → Webhooks → Add endpoint :

```
URL: https://votre-domaine.com/api/webhooks/stripe
Events: checkout.session.completed, customer.subscription.updated
```

### Meta/Facebook

Facebook Developers → Webhooks :

```
Callback URL: https://votre-domaine.com/api/webhooks/meta
Verify Token: (générer un token aléatoire)
```

---

## 📊 MONITORING

### 1. UptimeRobot (Gratuit)

Créer un monitor :
- URL : https://votre-domaine.com/api/health
- Intervalle : 5 minutes
- Alerte : Email si down

### 2. Sentry (Erreurs)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Ajouter dans `.env` :
```env
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## 🛠️ COMMANDES UTILES

```bash
# Démarrer
npm run start:production
# ou
docker-compose up -d

# Arrêter
docker-compose down

# Logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Santé
npm run health

# Backup
npm run backup

# Emergency stop
npm run emergency:stop
```

---

## 🎯 CHECKLIST DE LANCEMENT

### Avant de lancer aux clients :

- [ ] Toutes les clés API configurées
- [ ] Tests réussis sur toutes les pages
- [ ] Bot LinkedIn connecté et testé
- [ ] HTTPS activé (Vercel ou Let's Encrypt)
- [ ] Webhooks configurés (Twilio, Stripe)
- [ ] Monitoring actif (UptimeRobot)
- [ ] Backup automatique configuré
- [ ] Cron jobs actifs
- [ ] Documentation lue

### Post-lancement :

- [ ] Surveiller les logs 24h
- [ ] Tester un paiement Stripe
- [ ] Vérifier les appels Twilio
- [ ] Confirmer les posts LinkedIn
- [ ] Consulter le dashboard Admin

---

## 💰 COÛTS MINIMAUX (Démarrage)

| Service | Plan | Coût/mois |
|---------|------|-----------|
| Vercel | Hobby | 0€ (gratuit) |
| Supabase | Free | 0€ (gratuit) |
| OpenAI | Pay-as-go | ~30€ |
| Gemini | Pay-as-go | ~20€ |
| Twilio | Pay-as-go | ~20€ |

**Total minimum :** ~70€/mois

**Avec 3 clients à 299€ :** Profit de 827€/mois 🎯

---

## 🆘 PROBLÈMES COURANTS

### "Cannot connect to database"

```bash
# Vérifier l'URL dans .env
echo $DATABASE_URL

# Tester la connexion
npx prisma db execute --stdin <<< "SELECT 1;"
```

### "Docker not running"

```bash
# Windows/Mac : Lancer Docker Desktop
# Linux :
sudo systemctl start docker
```

### "Port 3000 already in use"

```bash
# Trouver et tuer le processus
lsof -ti:3000 | xargs kill -9

# Ou changer le port dans .env
PORT=3001
```

### "LinkedIn bot not working"

```bash
# Reconnecter le bot
cd SaaS_Bot_LinkedIn
python login_saver.py

# Vérifier storage_state.json existe
ls -la storage_state.json
```

---

## 📚 DOCUMENTATION COMPLÈTE

- **DEPLOYMENT_PRODUCTION.md** : Guide détaillé complet
- **START_FRONTEND.md** : Guide frontend
- **ENTERPRISE_COMPLETE.md** : Architecture enterprise

---

## 🎉 VOILÀ !

**Votre système Autophage est maintenant :**

✅ Opérationnel 24/7
✅ Autonome avec IA
✅ Monitoré
✅ Sauvegardé
✅ Scalable

**Vous possédez une armée numérique qui génère des revenus pendant que vous dormez !** 💰

---

**Support :** Consultez DEPLOYMENT_PRODUCTION.md pour plus de détails

Made with ❤️ by Autophage Team





