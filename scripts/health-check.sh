#!/bin/bash

# 🏥 SCRIPT DE VÉRIFICATION DE SANTÉ
# Vérifie que tous les services sont opérationnels

echo "🏥 VÉRIFICATION DE SANTÉ - AUTOPHAGE"
echo "====================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Fonction de test
test_service() {
    local name=$1
    local url=$2
    
    if curl -sf "$url" > /dev/null; then
        echo -e "${GREEN}✅ $name: OK${NC}"
        return 0
    else
        echo -e "${RED}❌ $name: ÉCHEC${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Test Frontend
echo "🌐 Test Frontend..."
test_service "Frontend" "http://localhost:3000/api/health"

# Test ChromaDB
echo "🧠 Test ChromaDB..."
test_service "ChromaDB" "http://localhost:8000/api/v1/heartbeat"

# Test Docker containers
echo ""
echo "🐳 État des containers Docker:"
docker-compose ps

# Vérification espace disque
echo ""
echo "💾 Espace disque:"
df -h | grep -E "Filesystem|/$"

# Vérification mémoire
echo ""
echo "🧠 Utilisation mémoire:"
free -h

# Vérification processus
echo ""
echo "⚙️  Processus Node.js:"
ps aux | grep node | grep -v grep | wc -l | xargs echo "Processus actifs:"

# Vérification base de données
echo ""
echo "🗄️  Test connexion base de données..."
if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ Base de données: OK${NC}"
else
    echo -e "${RED}❌ Base de données: ÉCHEC${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Résumé
echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ TOUS LES SERVICES SONT OPÉRATIONNELS${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS ERREUR(S) DÉTECTÉE(S)${NC}"
    echo ""
    echo "📋 Actions recommandées:"
    echo "   1. Vérifier les logs: docker-compose logs -f"
    echo "   2. Redémarrer les services: docker-compose restart"
    echo "   3. Consulter DEPLOYMENT_PRODUCTION.md"
    exit 1
fi





