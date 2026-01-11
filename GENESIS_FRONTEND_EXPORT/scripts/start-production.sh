#!/bin/bash

# 🚀 SCRIPT DE DÉMARRAGE PRODUCTION
# Lance tous les services en production

echo "🚀 DÉMARRAGE PRODUCTION AUTOPHAGE"
echo "================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier que Docker est lancé
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas lancé. Démarrez Docker Desktop et réessayez."
    exit 1
fi

echo "🐳 Lancement des containers Docker..."
docker-compose up -d

echo ""
echo "⏳ Attente du démarrage des services (30s)..."
sleep 30

echo ""
echo "📊 Statut des services:"
docker-compose ps

echo ""
echo -e "${GREEN}✅ Tous les services sont démarrés !${NC}"
echo ""
echo "🌐 Accès aux services:"
echo "   - Frontend:  http://localhost:3000"
echo "   - ChromaDB:  http://localhost:8000"
echo ""
echo "📋 Commandes utiles:"
echo "   - Voir les logs:    docker-compose logs -f"
echo "   - Arrêter:          docker-compose down"
echo "   - Redémarrer:       docker-compose restart"
echo "   - Santé:            ./scripts/health-check.sh"
echo ""
echo "🎉 Votre système est opérationnel !"





