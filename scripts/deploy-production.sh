#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT PRODUCTION AUTOPHAGE
# Ce script automatise le déploiement complet du système

set -e  # Arrêter en cas d'erreur

echo "🚀 DÉPLOIEMENT AUTOPHAGE ENTERPRISE"
echo "===================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de vérification
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 n'est pas installé${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ $1 est installé${NC}"
    fi
}

# Étape 1: Vérification des prérequis
echo "📋 Étape 1/10: Vérification des prérequis"
echo "==========================================="
check_command node
check_command npm
check_command docker
check_command docker-compose
check_command python3
echo ""

# Étape 2: Vérification du fichier .env
echo "🔑 Étape 2/10: Vérification de la configuration"
echo "==============================================="
if [ ! -f .env ]; then
    echo -e "${RED}❌ Fichier .env manquant${NC}"
    echo "Créez un fichier .env à partir de .env.complete"
    exit 1
else
    echo -e "${GREEN}✅ Fichier .env trouvé${NC}"
    
    # Vérifier les clés critiques
    required_keys=("OPENAI_API_KEY" "GOOGLE_API_KEY" "DATABASE_URL")
    for key in "${required_keys[@]}"; do
        if grep -q "^${key}=" .env; then
            echo -e "${GREEN}✅ ${key} configuré${NC}"
        else
            echo -e "${YELLOW}⚠️  ${key} manquant dans .env${NC}"
        fi
    done
fi
echo ""

# Étape 3: Installation des dépendances Node.js
echo "📦 Étape 3/10: Installation des dépendances Node.js"
echo "===================================================="
npm install
echo -e "${GREEN}✅ Dépendances Node.js installées${NC}"
echo ""

# Étape 4: Installation des dépendances Python
echo "🐍 Étape 4/10: Installation des dépendances Python"
echo "==================================================="
cd SaaS_Bot_LinkedIn

if [ ! -d "venv" ]; then
    echo "Création de l'environnement virtuel Python..."
    python3 -m venv venv
fi

echo "Activation de l'environnement virtuel..."
source venv/bin/activate || . venv/Scripts/activate

echo "Installation des dépendances Python..."
pip install -r requirements.txt

echo "Installation des navigateurs Playwright..."
playwright install chromium

cd ..
echo -e "${GREEN}✅ Dépendances Python installées${NC}"
echo ""

# Étape 5: Setup de la base de données
echo "🗄️  Étape 5/10: Configuration de la base de données"
echo "===================================================="
echo "Génération des clients Prisma..."
npx prisma generate

echo "Application des migrations..."
npx prisma db push --skip-generate

echo -e "${GREEN}✅ Base de données configurée${NC}"
echo ""

# Étape 6: Build Docker
echo "🐳 Étape 6/10: Build des images Docker"
echo "======================================"
echo "Construction des images Docker..."
docker-compose build

echo -e "${GREEN}✅ Images Docker construites${NC}"
echo ""

# Étape 7: Setup ChromaDB
echo "🧠 Étape 7/10: Configuration de ChromaDB"
echo "========================================"
echo "Lancement de ChromaDB..."
docker-compose up chromadb -d

sleep 5  # Attendre que ChromaDB démarre

echo "Setup de la collection..."
npm run setup:chromadb || echo -e "${YELLOW}⚠️  ChromaDB déjà configuré${NC}"

echo -e "${GREEN}✅ ChromaDB configuré${NC}"
echo ""

# Étape 8: Ingestion de la base de connaissances
echo "📚 Étape 8/10: Ingestion de la base de connaissances"
echo "====================================================="
if [ -d "data/knowledge" ] && [ "$(ls -A data/knowledge)" ]; then
    echo "Ingestion des documents..."
    npm run ingest:knowledge
    echo -e "${GREEN}✅ Documents ingérés${NC}"
else
    echo -e "${YELLOW}⚠️  Aucun document dans data/knowledge/${NC}"
    echo "Ajoutez vos PDFs/TXT/MD dans ce dossier et relancez:"
    echo "npm run ingest:knowledge"
fi
echo ""

# Étape 9: Build de production Next.js
echo "⚡ Étape 9/10: Build de production Next.js"
echo "=========================================="
echo "Construction de l'application..."
npm run build

echo -e "${GREEN}✅ Application construite${NC}"
echo ""

# Étape 10: Lancement de tous les services
echo "🚀 Étape 10/10: Lancement des services"
echo "======================================"
echo "Démarrage de tous les services Docker..."
docker-compose up -d

echo ""
echo "Attente du démarrage des services..."
sleep 10

# Vérification des services
echo ""
echo "📊 Statut des services:"
docker-compose ps

echo ""
echo "✅ DÉPLOIEMENT TERMINÉ !"
echo "======================="
echo ""
echo "🌐 Application disponible sur:"
echo "   - Frontend: http://localhost:3000"
echo "   - ChromaDB: http://localhost:8000"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Vérifier les logs: docker-compose logs -f"
echo "   2. Tester l'application: http://localhost:3000"
echo "   3. Connecter le bot LinkedIn: cd SaaS_Bot_LinkedIn && python login_saver.py"
echo "   4. Configurer les webhooks (Twilio, Stripe, Meta)"
echo "   5. Configurer les cron jobs pour l'automatisation"
echo ""
echo "📚 Documentation complète: DEPLOYMENT_PRODUCTION.md"
echo ""
echo "🎉 Votre empire numérique est opérationnel !"





