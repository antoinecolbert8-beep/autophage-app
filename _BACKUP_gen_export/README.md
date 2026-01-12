# 🤖 SaaS Bot LinkedIn - Autophage

**Le premier bot LinkedIn/TikTok qui s'améliore tout seul.**

Un système d'automatisation complet pour :
- ✅ Générer du contenu viral (vidéos + scripts)
- ✅ Engager intelligemment (commentaires, likes, DMs)
- ✅ S'adapter à la marque du client (polymorphisme)
- ✅ S'auto-améliorer selon les performances (darwinisme digital)

---

## 🚀 Installation

### Prérequis
- **Node.js** ≥ 20
- **Python** ≥ 3.10
- **PostgreSQL** (Supabase recommandé)
- **FFmpeg** (pour l'assemblage vidéo)

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
pip install playwright requests
playwright install chromium
cd ..
```

### 4. Configuration environnement
```bash
cp .env.example .env
# Remplis les variables dans .env
```

### 5. Setup de la base de données
```bash
npx prisma generate
npx prisma db push
npx tsx scripts/setup-database.ts
```

### 6. Setup Pinecone
```bash
npx tsx scripts/setup-pinecone.ts
```

### 7. Ingestion de connaissances (optionnel)
Place tes PDF/TXT dans `./data` puis :
```bash
npx tsx scripts/ingest-knowledge.ts
```

---

## 🎯 Usage

### A. Frontend Next.js (Dashboard SaaS)
```bash
npm run dev
# Ouvre http://localhost:3000
```

### B. Bot LinkedIn (Python)

#### 1. Connexion initiale (sauvegarde session)
```bash
cd SaaS_Bot_LinkedIn
python login_saver.py
# Connecte-toi manuellement, puis appuie sur Entrée
```

#### 2. Bot d'engagement
Édite `targets.json` avec tes posts/profils cibles, puis :
```bash
python engagement_bot.py
```

#### 3. Collecteur de stats
Édite `posts_to_track.json` avec tes posts, puis :
```bash
python stats_collector.py
```

---

## 📦 Structure du Projet

```
cursor/
├── app/                      # Frontend Next.js
│   ├── api/                  # API Routes
│   │   ├── brain/            # RAG Pinecone
│   │   ├── content/          # Génération vidéo
│   │   ├── brand/            # Scraping marque
│   │   ├── feedback/         # Auto-amélioration
│   │   └── ...
│   ├── dashboard/            # Interface client
│   └── ...
├── lib/                      # Librairies core
│   ├── ai-brain.ts           # RAG GPT-4
│   ├── pinecone-*.ts         # Gestion Pinecone
│   ├── script-generator.ts   # Génération scripts viraux
│   ├── video-assembler.ts    # Assemblage FFmpeg
│   ├── elevenlabs-tts.ts     # Audio IA
│   ├── brand-scraper.ts      # Extraction logo/couleurs
│   ├── wording-dictionary.ts # Polymorphisme texte
│   └── feedback-loop.ts      # Auto-amélioration
├── components/               # Composants React
│   └── polymorphic-layout.tsx # Layout adaptatif
├── SaaS_Bot_LinkedIn/        # Bot Python
│   ├── login_saver.py        # Gestion session
│   ├── user_agent_rotator.py # Rotation UA
│   ├── stealth_config.py     # Anti-détection
│   ├── engagement_bot.py     # Bot engagement
│   ├── stats_collector.py    # Collecte stats
│   └── ...
├── prisma/
│   └── schema.prisma         # Schéma DB
├── scripts/                  # Scripts utilitaires
│   ├── setup-pinecone.ts
│   ├── setup-database.ts
│   ├── ingest-knowledge.ts
│   └── run-feedback-loop.ts
└── .env                      # Configuration (à créer)
```

---

## 🧠 PHASE 1 : Infrastructure & Discrétion

✅ **Gestion des Cookies** : `login_saver.py` sauvegarde la session dans `storage_state.json`  
✅ **Rotation User-Agents** : `user_agent_rotator.py` change l'empreinte toutes les 7 jours  
✅ **Anti-détection** : `stealth_config.py` masque Playwright et simule comportement humain

**Usage** :
```bash
cd SaaS_Bot_LinkedIn
python login_saver.py  # Première connexion
python login_saver.py --force  # Force reconnexion
```

---

## 🧠 PHASE 2 : Le Cerveau (Data & Mémoire)

✅ **Pinecone** : Index vectoriel `autophage-brain` (512d embeddings)  
✅ **Ingestion** : Script `scripts/ingest-knowledge.ts` transforme PDF/TXT en vecteurs  
✅ **RAG** : Endpoint `/api/rag/query` pour réponses contextuelles

**Usage** :
```bash
# Setup initial
npx tsx scripts/setup-pinecone.ts

# Ingestion (place tes docs dans ./data)
npx tsx scripts/ingest-knowledge.ts

# Test RAG
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Comment scaler sur LinkedIn ?"}'
```

---

## ⚙️ PHASE 3 : Content Factory

✅ **Scraper d'Inspiration** : `lib/inspiration-scraper.ts` récupère top posts  
✅ **Générateur Scripts** : `lib/script-generator.ts` crée hooks viraux (GPT-4)  
✅ **Pipeline Vidéo** :
  - Audio : `lib/elevenlabs-tts.ts` (ElevenLabs)
  - Images : `lib/stock-images.ts` (Pexels/Unsplash)
  - Assemblage : `lib/video-assembler.ts` (FFmpeg)
  - Algo Dopamine : Cut toutes les 3 sec
  - SEO : Renommage automatique (`mot-cle-strategique.mp4`)

**Usage** :
```bash
# Via API
curl -X POST http://localhost:3000/api/content/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "10x ton revenu en 90 jours",
    "niche": "coaching",
    "platform": "TIKTOK",
    "seoKeyword": "coaching-business-2025",
    "stockImages": ["url1", "url2", ...]
  }'
```

---

## 🤖 PHASE 4 : Bot Social

✅ **Écoute Commentaires** : Détecte nouveaux commentaires  
✅ **Filtre Intelligent** : Classifie Lead / Troll / Spam  
✅ **Répondeur Contextuel** : Génère réponses via RAG + délai aléatoire (5-45 min)  
✅ **Sniper Outbound** : Visite profils cibles + like post ancien

**Usage** :
```bash
cd SaaS_Bot_LinkedIn

# Édite targets.json
nano targets.json

# Lance le bot
python engagement_bot.py
```

**Fichier `targets.json`** :
```json
{
  "posts": ["https://linkedin.com/posts/..."],
  "profiles": ["https://linkedin.com/in/..."]
}
```

---

## 🦎 PHASE 5 : Polymorphisme

✅ **Brand Scraper** : Extrait logo, couleurs, fonts depuis URL  
✅ **Frontend Dynamique** : Composant `PolymorphicLayout` applique CSS à la volée  
✅ **Dictionnaire Variable** : Hook `useWording` adapte vocabulaire selon niche

**Usage** :
```typescript
// Dans un composant React
import { PolymorphicLayout } from '@/components/polymorphic-layout';
import { useWording } from '@/hooks/use-wording';

export default function Dashboard({ userId }) {
  const { t } = useWording(userId);
  
  return (
    <PolymorphicLayout userId={userId}>
      <h1>{t('dashboard')}</h1> {/* "Tableau de bord coach" si coaching */}
      <p>{t('fans')}: 1,234</p> {/* "clients" ou "acheteurs" selon niche */}
    </PolymorphicLayout>
  );
}
```

**Analyse marque** :
```bash
curl -X POST http://localhost:3000/api/brand/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "userId": "..."}'
```

---

## 🔄 PHASE 6 : Autophagie (Auto-Amélioration)

✅ **Tracker Stats** : Collecte vues/likes/comments/shares  
✅ **Feedback Loop** : Analyse top posts et ajuste prompt système  
✅ **Darwinisme Digital** : Le contenu évolue automatiquement

**Usage** :
```bash
# Collecte stats LinkedIn (Python)
cd SaaS_Bot_LinkedIn
python stats_collector.py

# Analyse et amélioration (TypeScript)
npx tsx scripts/run-feedback-loop.ts

# Ou via cron hebdomadaire
0 0 * * 0 cd /app && npx tsx scripts/run-feedback-loop.ts
```

Le système :
1. Récupère les 10 meilleurs posts de la semaine
2. Identifie les patterns de succès (structure, ton, émojis...)
3. Génère un nouveau prompt système optimisé
4. L'applique automatiquement si confiance ≥ 60%

---

## 🛠️ Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le frontend Next.js |
| `npm run build` | Build production |
| `npx tsx scripts/setup-pinecone.ts` | Initialise Pinecone |
| `npx tsx scripts/setup-database.ts` | Vérifie la DB |
| `npx tsx scripts/ingest-knowledge.ts` | Ingère PDF/TXT dans Pinecone |
| `npx tsx scripts/run-feedback-loop.ts` | Lance l'auto-amélioration |
| `python login_saver.py` | Sauvegarde session LinkedIn |
| `python engagement_bot.py` | Bot engagement LinkedIn |
| `python stats_collector.py` | Collecte stats posts |

---

## 🔐 Sécurité

- ✅ Rotation User-Agent intelligente
- ✅ Délais aléatoires entre actions (anti-spam)
- ✅ Stealth mode (masque Playwright)
- ✅ Historique actions (évite doublons)
- ✅ Session persistante (pas de reconnexion = pas d'alerte)

---

## 📊 Monitoring

### Logs
```bash
# Logs Python
tail -f SaaS_Bot_LinkedIn/*.log

# Logs Next.js
npm run dev  # Affiche dans console
```

### Database
```bash
npx prisma studio  # Interface visuelle
```

---

## 🚀 Déploiement Production

### Frontend (Vercel)
```bash
vercel --prod
```

### Base de données (Supabase)
1. Crée un projet sur [supabase.com](https://supabase.com)
2. Copie `DATABASE_URL` dans `.env`
3. `npx prisma db push`

### Bot Python (VPS/Cloud)
```bash
# Sur un serveur Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip ffmpeg
pip3 install playwright requests
playwright install chromium

# Setup cron
crontab -e
# Ajoute :
0 */4 * * * cd /app/SaaS_Bot_LinkedIn && python3 engagement_bot.py
0 0 * * * cd /app/SaaS_Bot_LinkedIn && python3 stats_collector.py
```

---

## 🆘 Troubleshooting

### "FFmpeg not found"
```bash
# Windows
winget install FFmpeg

# Mac
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

### "Pinecone API key invalid"
Vérifie que `PINECONE_API_KEY` est bien défini dans `.env`

### "LinkedIn détecte le bot"
- Augmente les délais dans `stealth_config.py`
- Force une rotation UA : `python user_agent_rotator.py`
- Limite les actions (max 50/jour)

---

## 📈 Roadmap

- [ ] Support TikTok (en plus de LinkedIn)
- [ ] Multi-comptes (gestion plusieurs clients)
- [ ] A/B Testing automatique (teste 2 versions de contenu)
- [ ] Intégration Stripe (monétisation)
- [ ] Webhooks (notifications Slack/Discord)

---

## 📜 License

Propriétaire - Tous droits réservés

---

## 🤝 Support

Pour toute question : ouvre une issue sur GitHub ou contacte-moi directement.

**Fait avec ❤️ et beaucoup de GPT-4**





