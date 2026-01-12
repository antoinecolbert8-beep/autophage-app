# ⚡ Guide de Démarrage Rapide

**Temps estimé : 15 minutes**

Ce guide te permet de lancer le SaaS en mode développement rapidement.

---

## 📋 Prérequis

- ✅ Node.js ≥ 20 ([télécharger](https://nodejs.org))
- ✅ Python ≥ 3.10 ([télécharger](https://python.org))
- ✅ Git ([télécharger](https://git-scm.com))

---

## 🚀 Installation (5 min)

### 1. Clone le repo
```bash
git clone <repo-url>
cd cursor
```

### 2. Installation Node.js
```bash
npm install
```

### 3. Installation Python
```bash
cd SaaS_Bot_LinkedIn
pip install -r requirements.txt
playwright install chromium
cd ..
```

---

## 🔑 Configuration (5 min)

### 1. Crée ton fichier .env
```bash
cp .env.example .env
```

### 2. Configure les clés API minimales

**Ouvre `.env` et ajoute** :

```env
# Obligatoire
DATABASE_URL="postgresql://..." # Supabase ou PostgreSQL local
OPENAI_API_KEY="sk-..."
PINECONE_API_KEY="pcsk_..."

# Optionnel (pour plus tard)
ELEVENLABS_API_KEY="..."
PEXELS_API_KEY="..."
```

#### Où obtenir les clés ?

| API | Lien | Gratuit ? |
|-----|------|-----------|
| **Supabase** | [supabase.com](https://supabase.com) | ✅ Oui (500 MB) |
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | 💰 $5 minimum |
| **Pinecone** | [app.pinecone.io](https://app.pinecone.io) | ✅ Oui (100k vecteurs) |
| **ElevenLabs** | [elevenlabs.io](https://elevenlabs.io) | ⚠️ Trial limité |
| **Pexels** | [pexels.com/api](https://www.pexels.com/api) | ✅ Oui |

---

## 🗄️ Setup Base de Données (2 min)

### Option A : Supabase (Recommandé)
1. Va sur [supabase.com](https://supabase.com)
2. Crée un projet
3. Copie l'URL de connexion (Settings → Database → Connection String)
4. Colle dans `.env` :
   ```env
   DATABASE_URL="postgresql://postgres.xxx:[password]@db.xxx.supabase.co:5432/postgres"
   ```

### Option B : PostgreSQL Local
```bash
# Mac (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Windows (Chocolatey)
choco install postgresql16

# Linux (apt)
sudo apt install postgresql-16
```

Puis dans `.env` :
```env
DATABASE_URL="postgresql://localhost:5432/saas_bot"
```

### Initialise la DB
```bash
npx prisma db push
npm run setup:db
```

---

## 🧠 Setup Pinecone (1 min)

```bash
npm run setup:pinecone
```

Vérifie que l'index `autophage-brain` est créé.

---

## ✅ Vérification Santé

```bash
npx tsx scripts/health-check.ts
```

Tu devrais voir :
```
✅ Database (PostgreSQL)
✅ Pinecone
✅ OpenAI
⚠️ ElevenLabs (optionnel)
⚠️ FFmpeg
⚠️ Bot LinkedIn (Python)
```

---

## 🎬 Lancement (2 min)

### 1. Frontend Next.js
```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

### 2. Bot LinkedIn (optionnel pour commencer)
```bash
cd SaaS_Bot_LinkedIn
python login_saver.py
# Connecte-toi manuellement dans Chrome
# Appuie sur Entrée
```

---

## 🧪 Tests Rapides

### A. Test RAG (Pinecone)
```bash
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Comment scaler sur LinkedIn ?"}'
```

### B. Test Génération Script
```bash
curl -X POST http://localhost:3000/api/content/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "10x ton business en 90 jours",
    "niche": "coaching",
    "platform": "LINKEDIN"
  }'
```

### C. Test Bot Engagement (si session configurée)
```bash
cd SaaS_Bot_LinkedIn
python engagement_bot.py
```

---

## 📊 Dashboard

Va sur [http://localhost:3000/dashboard](http://localhost:3000/dashboard) pour :
- Générer du contenu
- Analyser des marques
- Voir l'historique d'actions
- Monitorer les stats

---

## 🎯 Prochaines Étapes

1. **Ingestion de connaissances** :
   ```bash
   # Place tes PDF/TXT dans ./data
   npm run ingest
   ```

2. **Configuration des cibles LinkedIn** :
   ```bash
   cd SaaS_Bot_LinkedIn
   nano targets.json  # Ajoute tes posts/profils
   python engagement_bot.py
   ```

3. **Setup FFmpeg (pour vidéos)** :
   ```bash
   # Mac
   brew install ffmpeg
   
   # Windows
   winget install FFmpeg
   
   # Linux
   sudo apt install ffmpeg
   ```

4. **Collecte stats** :
   ```bash
   cd SaaS_Bot_LinkedIn
   nano posts_to_track.json  # Ajoute tes posts
   python stats_collector.py
   ```

5. **Feedback Loop** :
   ```bash
   npm run feedback
   ```

---

## 🚨 Problèmes Courants

### "Module not found"
```bash
npm install
npx prisma generate
```

### "Database connection failed"
Vérifie que `DATABASE_URL` est correct dans `.env`

### "Pinecone API error"
Vérifie que `PINECONE_API_KEY` est valide

### "OpenAI rate limit"
Tu as dépassé ton quota. Ajoute des crédits ou attends.

---

## 📚 Documentation Complète

- **Utilisation** : [README.md](./README.md)
- **Déploiement** : [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Bot Python** : [SaaS_Bot_LinkedIn/README.md](./SaaS_Bot_LinkedIn/README.md)

---

## 🆘 Besoin d'Aide ?

1. Vérifie les logs : `npm run dev` (terminal)
2. Lance le health check : `npx tsx scripts/health-check.ts`
3. Consulte le Troubleshooting dans README.md
4. Ouvre une issue GitHub

---

**🎉 Félicitations ! Ton SaaS est prêt à l'emploi.**

**Prochaine étape recommandée** : Teste la génération de contenu depuis le dashboard.





