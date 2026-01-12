# 🚀 DÉPLOIEMENT IMMÉDIAT - AVEC VOS CLÉS ACTUELLES

## ✅ Clés API Détectées

Vous avez configuré :

- ✅ **Google Gemini API** (IA principale)
- ✅ **Meta Ads** (Facebook/Instagram)
- ✅ **Stripe** (Paiements)
- ✅ **Database** (PostgreSQL)

---

## 🎯 Ce qui va fonctionner

### ✅ Fonctionnalités Actives

1. **Frontend complet** (9 pages "Dark Intelligence")
2. **Google Gemini Pro** comme IA principale
   - Génération de contenu
   - Agent Swarm (4 agents)
   - Analyse sémantique
3. **Meta Ads** (Facebook/Instagram)
   - Publication automatique
   - Gestion des campagnes
4. **Stripe**
   - Paiements
   - Abonnements
5. **Base de données**
   - Stockage utilisateurs
   - Historique actions

### ⏸️ Fonctionnalités en Attente (Optionnelles)

Ces fonctionnalités nécessitent des clés API supplémentaires :

1. **OpenAI GPT-4** → Génération contenu avancée
2. **Pinecone** → Base vectorielle cloud (alternative : ChromaDB local)
3. **Twilio** → Téléphonie IA
4. **ElevenLabs** → Voix IA
5. **HeyGen** → Avatars vidéo
6. **Bot LinkedIn** → Prospection (nécessite connexion manuelle)

---

## 🚀 LANCER LE DÉPLOIEMENT

### Option 1 : Script Automatique (RECOMMANDÉ)

```bash
chmod +x scripts/deploy-with-current-keys.sh
./scripts/deploy-with-current-keys.sh
```

### Option 2 : Manuel (3 commandes)

```bash
# 1. Installer
npm install

# 2. Setup base de données
npx prisma generate
npx prisma db push

# 3. Build
npm run build

# 4. Démarrer
npm run dev
```

---

## 🌐 Accès à l'Application

Une fois lancé, ouvrez :

- **Landing Page** : http://localhost:3000
- **War Room** : http://localhost:3000/dashboard-war-room
- **Sales Factory** : http://localhost:3000/sales-factory
- **Agent Swarm** : http://localhost:3000/agent-swarm
- **Admin Master** : http://localhost:3000/admin-master

---

## 🧪 Tests Rapides

### 1. Tester Gemini AI

```bash
# Dans un nouveau terminal
curl -X POST http://localhost:3000/api/content/gemini-generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"SaaS automation","style":"professional"}'
```

### 2. Tester Meta Ads

```bash
curl -X POST http://localhost:3000/api/social/publish \
  -H "Content-Type: application/json" \
  -d '{"platform":"facebook","content":"Test post"}'
```

### 3. Tester Stripe

```bash
curl http://localhost:3000/api/sales/subscription-plans
```

---

## 📝 Ajouter des Clés Plus Tard

Pour activer les fonctionnalités optionnelles :

### 1. OpenAI (GPT-4)

```bash
# Ajouter dans .env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**Obtenir sur :** https://platform.openai.com/api-keys

### 2. Twilio (Téléphonie)

```bash
# Ajouter dans .env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33123456789
```

**Obtenir sur :** https://www.twilio.com/console

### 3. ChromaDB (Base vectorielle locale - GRATUIT)

```bash
# Lancer ChromaDB avec Docker
docker run -p 8000:8000 chromadb/chroma

# Puis
npm run setup:chromadb
npm run ingest:knowledge
```

---

## 🔧 Configuration Webhooks

### Meta (Facebook/Instagram)

1. Aller sur : https://developers.facebook.com/
2. Sélectionner votre app
3. Webhooks → Configure
4. URL : `https://votre-domaine.com/api/webhooks/meta`

### Stripe

1. Aller sur : https://dashboard.stripe.com/webhooks
2. Add endpoint
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Events : `checkout.session.completed`, `customer.subscription.updated`

---

## 🐛 Dépannage

### "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### "Port 3000 already in use"

```bash
# Trouver et tuer le processus
lsof -ti:3000 | xargs kill -9

# Ou changer le port
PORT=3001 npm run dev
```

### "Database connection failed"

Vérifier votre `DATABASE_URL` dans `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/autophage?connection_limit=1"
```

---

## 🎯 Prochaines Étapes

### Aujourd'hui (1h)

1. ✅ Lancer le déploiement
2. ✅ Tester toutes les pages
3. ✅ Vérifier Gemini fonctionne
4. ✅ Tester Meta Ads
5. ✅ Configurer webhooks

### Cette Semaine

1. Déployer sur Vercel
2. Configurer domaine personnalisé
3. Ajouter OpenAI (optionnel)
4. Ajouter Twilio (optionnel)
5. Tester avec 1-2 beta users

### Ce Mois-ci

1. Optimiser les prompts Gemini
2. Créer landing page marketing
3. Lancer premiers clients payants
4. Monitorer les coûts API
5. Ajuster les fonctionnalités

---

## 💰 Coûts Estimés (Avec votre config)

| Service | Coût/mois |
|---------|-----------|
| Google Gemini | ~30-50€ |
| Meta Ads | Variable (budget pub) |
| Stripe | 0€ (commission sur ventes) |
| Vercel (hosting) | 0€ (plan gratuit) |
| **TOTAL** | **~30-50€** |

**Avec 1 client à 299€ :** Profit de ~250€/mois 🎯

**Avec 5 clients :** Profit de ~1 200€/mois 🚀

---

## 🎉 PRÊT À LANCER ?

```bash
# Lancer maintenant !
chmod +x scripts/deploy-with-current-keys.sh
./scripts/deploy-with-current-keys.sh
```

**Durée estimée :** 5-10 minutes

**Après :** Votre système sera accessible sur http://localhost:3000

---

## 📞 Support

Si vous rencontrez un problème :

1. Vérifier les logs : `npm run dev` (mode verbose)
2. Consulter `DEPLOYMENT_PRODUCTION.md`
3. Vérifier que toutes les clés API sont valides

---

🎊 **Votre empire numérique est à 5 minutes d'être opérationnel !**

Made with ❤️ by Autophage Team

