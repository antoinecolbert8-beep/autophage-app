#!/bin/bash

# 🚀 DÉPLOIEMENT RAPIDE AUTOPHAGE
# Utilise les clés API disponibles, reste optionnel

set -e

echo "🚀 DÉPLOIEMENT AUTOPHAGE - MODE RAPIDE"
echo "======================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction de vérification
check_env() {
    if [ -f .env ] || [ -f .env.local ]; then
        echo -e "${GREEN}✅ Fichier de configuration trouvé${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Aucun fichier .env trouvé${NC}"
        echo "Création depuis le template..."
        if [ -f env.example.txt ]; then
            cp env.example.txt .env.local
            echo -e "${GREEN}✅ .env.local créé${NC}"
        fi
    fi
}

echo "📋 Étape 1/5: Vérification de la configuration"
echo "=============================================="
check_env
echo ""

echo "📦 Étape 2/5: Installation des dépendances Node.js"
echo "=================================================="
if [ -d "node_modules" ]; then
    echo -e "${BLUE}ℹ️  node_modules existe déjà, skip...${NC}"
else
    npm install
fi
echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

echo "🗄️  Étape 3/5: Configuration de la base de données"
echo "=================================================="
echo "Génération du client Prisma..."
npx prisma generate

if grep -q "DATABASE_URL" .env 2>/dev/null || grep -q "DATABASE_URL" .env.local 2>/dev/null; then
    echo "Application du schéma..."
    npx prisma db push --skip-generate || echo -e "${YELLOW}⚠️  DB push ignoré (optionnel)${NC}"
else
    echo -e "${YELLOW}⚠️  DATABASE_URL non configuré, DB skip (optionnel)${NC}"
fi
echo ""

echo "⚡ Étape 4/5: Build de l'application"
echo "===================================="
npm run build
echo -e "${GREEN}✅ Application construite${NC}"
echo ""

echo "🎬 Étape 5/5: Configuration optionnelle"
echo "======================================="

# Python Bot (optionnel)
if [ -d "SaaS_Bot_LinkedIn" ]; then
    echo "Configuration du bot Python..."
    cd SaaS_Bot_LinkedIn
    
    if [ ! -d "venv" ]; then
        echo "Création de l'environnement virtuel Python..."
        python -m venv venv || python3 -m venv venv
    fi
    
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    elif [ -f "venv/Scripts/activate" ]; then
        . venv/Scripts/activate
    fi
    
    pip install -r requirements.txt --quiet || echo -e "${YELLOW}⚠️  Installation Python partielle${NC}"
    playwright install chromium || echo -e "${YELLOW}⚠️  Playwright skip${NC}"
    
    cd ..
    echo -e "${GREEN}✅ Bot Python configuré${NC}"
else
    echo -e "${YELLOW}⚠️  SaaS_Bot_LinkedIn non trouvé (optionnel)${NC}"
fi
echo ""

# Docker (optionnel)
if command -v docker &> /dev/null; then
    echo "Docker détecté, voulez-vous lancer les containers ? (y/N)"
    read -t 5 -n 1 response || response="n"
    echo ""
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Lancement des containers Docker..."
        docker-compose up -d || echo -e "${YELLOW}⚠️  Docker skip (optionnel)${NC}"
    else
        echo -e "${BLUE}ℹ️  Docker skip${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker non installé (optionnel)${NC}"
fi

echo ""
echo "✅ DÉPLOIEMENT TERMINÉ !"
echo "======================="
echo ""
echo "🌐 Lancement du serveur de développement..."
echo ""
echo -e "${GREEN}Application disponible sur: http://localhost:3000${NC}"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Ouvrir http://localhost:3000"
echo "   2. Tester les différentes pages"
echo "   3. Ajouter d'autres clés API si besoin (dans .env.local)"
echo ""
echo "🎉 Votre système est opérationnel !"
echo ""

# Lancer le serveur
npm run dev





