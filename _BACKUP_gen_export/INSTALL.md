# 📦 Guide d'Installation Enterprise

## Prérequis

- **Docker** ≥ 24.0 ([installer](https://docs.docker.com/get-docker/))
- **Docker Compose** ≥ 2.20
- **Node.js** ≥ 20
- **Python** ≥ 3.11 (pour le bot LinkedIn)

---

## 🚀 Installation Rapide (5 min)

### 1. Clone le repo
```bash
git clone <repo-url>
cd cursor
```

### 2. Configuration environnement
```bash
cp .env.example .env
```

**Édite `.env` et remplis AU MINIMUM** :
```env
DATABASE_URL="postgresql://..."  # Supabase ou local
OPENAI_API_KEY="sk-..."
GOOGLE_API_KEY="..."  # Gemini
CHROMA_URL="http://localhost:8000"  # ChromaDB local
```

### 3. Démarre l'infrastructure
```bash
# Option A : Script automatique (Linux/Mac)
chmod +x scripts/start-enterprise.sh
./scripts/start-enterprise.sh

# Option B : Manuel
docker-compose up -d
```

### 4. Initialise les services
```bash
npm install
npm run setup:chromadb
npm run setup:db
```

### 5. Lance les agents autonomes
```bash
npm run agents:start
```

### 6. Accède au dashboard
```
http://localhost:3000/dashboard-pro
```

---

## 📊 Vérification

### Vérifie que tous les services tournent
```bash
docker-compose ps
```

**Tu devrais voir** :
- ✅ app (Next.js)
- ✅ chromadb
- ✅ postgres
- ✅ redis
- ✅ bot-linkedin
- ✅ worker
- ✅ prometheus
- ✅ grafana

### Test health check
```bash
npm run health
```

### Test ChromaDB
```bash
curl http://localhost:8000/api/v1/heartbeat
# Réponse : {"nanosecond heartbeat": ...}
```

### Test Agents
```bash
curl -X POST http://localhost:3000/api/agents/run
```

---

## 🔧 Configuration Avancée

### Variables d'environnement complètes

**Core (Obligatoires)** :
```env
DATABASE_URL=...
OPENAI_API_KEY=...
GOOGLE_API_KEY=...  # Gemini
CHROMA_URL=http://localhost:8000
REDIS_URL=redis://localhost:6379
```

**Téléphonie (Optionnel)** :
```env
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

**Multi-Plateforme (Optionnel)** :
```env
META_PAGE_ACCESS_TOKEN=...
META_INSTAGRAM_ACCOUNT_ID=...
TIKTOK_ACCESS_TOKEN=...
YOUTUBE_API_KEY=...
```

**Monitoring (Auto-configuré)** :
```env
PROMETHEUS_URL=http://localhost:9090
GRAFANA_PASSWORD=admin  # Change en production !
```

---

## 🐳 Commandes Docker

```bash
# Démarre tous les services
docker-compose up -d

# Arrête tous les services
docker-compose down

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f app
docker-compose logs -f chromadb

# Redémarre un service
docker-compose restart app

# Rebuild après modification
docker-compose up -d --build

# Supprime tout (données comprises)
docker-compose down -v
```

---

## 🤖 Gestion des Agents

### Démarrer les agents
```bash
npm run agents:start
```

### Exécution manuelle
```bash
# Tous les agents
curl -X POST http://localhost:3000/api/agents/run

# Agent spécifique
curl -X POST http://localhost:3000/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{"agent": "treasurer"}'

# Agents disponibles: "treasurer", "opportunist", "manager", "creator"
```

### Surveillance
```bash
# Logs agents
tail -f logs/healing.log

# Monitoring Prometheus
open http://localhost:9090

# Dashboard Grafana
open http://localhost:3001
# Login : admin / admin
```

---

## 🔐 Sécurité

### Production

1. **Change les mots de passe** :
```env
POSTGRES_PASSWORD=<mot-de-passe-fort>
GRAFANA_PASSWORD=<mot-de-passe-fort>
REDIS_PASSWORD=<mot-de-passe-fort>
```

2. **HTTPS obligatoire** :
```bash
# Configure nginx ou Caddy comme reverse proxy
```

3. **Firewall** :
```bash
# N'expose que les ports nécessaires
ufw allow 443/tcp  # HTTPS
ufw allow 22/tcp   # SSH
```

4. **Backups automatiques** :
```bash
# Backup PostgreSQL
docker exec postgres pg_dump -U autophage > backup.sql

# Backup ChromaDB
docker cp chromadb:/chroma/chroma ./chroma_backup/
```

---

## 🆘 Troubleshooting

### "Cannot connect to Docker daemon"
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
# Déconnecte/reconnecte ta session
```

### "Port 3000 already in use"
```bash
# Trouve le process
lsof -i :3000
# Tue-le
kill -9 <PID>
```

### "ChromaDB connection refused"
```bash
# Vérifie que ChromaDB tourne
docker-compose ps chromadb

# Redémarre si nécessaire
docker-compose restart chromadb

# Logs
docker-compose logs chromadb
```

### "Agents not running"
```bash
# Vérifie les logs
docker-compose logs worker

# Relance manuellement
npm run agents:start
```

### "Database migration failed"
```bash
npx prisma generate
npx prisma db push --force-reset
npm run setup:db
```

---

## 📈 Scaling

### Horizontal (Multi-instances)
```yaml
# docker-compose.yml
services:
  app:
    deploy:
      replicas: 3  # 3 instances Next.js
    
  worker:
    deploy:
      replicas: 5  # 5 workers pour agents
```

### Load Balancer (Nginx)
```nginx
upstream app {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://app;
    }
}
```

---

## ✅ Checklist Finale

- [ ] Docker installé et fonctionnel
- [ ] `.env` configuré
- [ ] `docker-compose up -d` réussi
- [ ] ChromaDB initialisé (`npm run setup:chromadb`)
- [ ] Database setup (`npm run setup:db`)
- [ ] Agents démarrés (`npm run agents:start`)
- [ ] Health check OK (`npm run health`)
- [ ] Dashboard accessible (http://localhost:3000/dashboard-pro)

---

**🎉 Installation terminée ! Ton empire Enterprise est opérationnel ! 🎉**





