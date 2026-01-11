#!/bin/bash

# 🚀 Script de démarrage Enterprise - Infrastructure complète en une commande

echo "🏢 Démarrage Plateforme Enterprise Autophage..."
echo "================================================"

# Vérifie Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    echo "Installe Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

echo "✅ Docker détecté"

# Vérifie .env
if [ ! -f .env ]; then
    echo "⚠️ Fichier .env manquant"
    echo "Copie .env.example vers .env et remplis les variables"
    cp .env.example .env
    echo "✅ Fichier .env créé. Configure-le avant de relancer ce script."
    exit 1
fi

echo "✅ Fichier .env trouvé"

# Arrête les conteneurs existants
echo "🔄 Arrêt des conteneurs existants..."
docker-compose down

# Build et démarre
echo "🐳 Build et démarrage des conteneurs..."
docker-compose up -d --build

# Attend que les services soient prêts
echo "⏳ Attente démarrage des services..."
sleep 10

# Vérifie les services
echo ""
echo "📊 État des services:"
docker-compose ps

echo ""
echo "✅ Infrastructure démarrée !"
echo ""
echo "📍 Accès aux services:"
echo "   - Frontend:    http://localhost:3000"
echo "   - Dashboard:   http://localhost:3000/dashboard-pro"
echo "   - ChromaDB:    http://localhost:8000"
echo "   - Prometheus:  http://localhost:9090"
echo "   - Grafana:     http://localhost:3001"
echo ""
echo "🤖 Prochaines étapes:"
echo "   1. Initialise ChromaDB: npm run setup:chromadb"
echo "   2. Lance les agents:    npm run agents:start"
echo "   3. Ouvre le dashboard:  http://localhost:3000/dashboard-pro"
echo ""
echo "🎉 Ton empire automatisé est prêt !"





