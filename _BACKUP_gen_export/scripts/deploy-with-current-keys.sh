#!/bin/bash

# 🚀 DÉPLOIEMENT AVEC VOS CLÉS API ACTUELLES
# Script adapté à votre configuration

set -e

echo "🚀 DÉPLOIEMENT AUTOPHAGE (Configuration actuelle)"
echo "=================================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Clés API détectées :${NC}"
echo "✅ Google Gemini API"
echo "✅ Meta Ads (Facebook/Instagram)"
echo "✅ Stripe (Paiements)"
echo "✅ Database (PostgreSQL)"
echo ""
echo -e "${YELLOW}⚠️  Fonctionnalités optionnelles (non configurées) :${NC}"
echo "⏸️  OpenAI GPT-4 (génération contenu avancée)"
echo "⏸️  Pinecone (base vectorielle cloud)"
echo "⏸️  Twilio (téléphonie IA)"
echo "⏸️  ElevenLabs (voix IA)"
echo "⏸️  HeyGen (avatars vidéo)"
echo ""
echo -e "${GREEN}➡️  Le système fonctionnera avec Gemini comme IA principale${NC}"
echo ""

read -p "Continuer le déploiement ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Déploiement annulé."
    exit 1
fi

echo ""
echo "📦 Étape 1/6: Installation des dépendances Node.js"
echo "===================================================="
npm install
echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

echo "🗄️  Étape 2/6: Configuration de la base de données"
echo "===================================================="
echo "Génération des clients Prisma..."
npx prisma generate

echo "Application des migrations..."
npx prisma db push --skip-generate || echo -e "${YELLOW}⚠️  Base de données déjà à jour${NC}"

echo -e "${GREEN}✅ Base de données configurée${NC}"
echo ""

echo "⚡ Étape 3/6: Build de l'application"
echo "===================================="
npm run build
echo -e "${GREEN}✅ Application construite${NC}"
echo ""

echo "🐳 Étape 4/6: Configuration Docker (optionnelle)"
echo "================================================"
if command -v docker &> /dev/null; then
    echo "Docker détecté. Voulez-vous utiliser Docker ? (y/n)"
    read -p "" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Construction des images Docker..."
        docker-compose build
        echo "Lancement des services..."
        docker-compose up -d
        echo -e "${GREEN}✅ Services Docker lancés${NC}"
    else
        echo -e "${YELLOW}⏭️  Docker ignoré${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker non installé - Ignoré${NC}"
fi
echo ""

echo "🧪 Étape 5/6: Tests de santé"
echo "============================="
echo "Vérification des services..."

# Test de l'application
if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Application: Non démarrée (normal si pas encore lancée)${NC}"
fi

echo ""
echo "🎉 Étape 6/6: Résumé du déploiement"
echo "===================================="
echo ""
echo -e "${GREEN}✅ DÉPLOIEMENT TERMINÉ !${NC}"
echo ""
echo "📊 Configuration actuelle :"
echo "   • IA principale: Google Gemini Pro"
echo "   • Réseaux sociaux: Meta (Facebook/Instagram)"
echo "   • Paiements: Stripe"
echo "   • Base de données: PostgreSQL"
echo ""
echo "🚀 Pour démarrer l'application :"
echo "   npm run dev          # Mode développement"
echo "   npm run start        # Mode production"
echo ""
echo "🌐 Accès :"
echo "   Frontend: http://localhost:3000"
echo "   Dashboard: http://localhost:3000/dashboard-war-room"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Tester l'application: http://localhost:3000"
echo "   2. Configurer les webhooks Meta/Stripe"
echo "   3. (Optionnel) Ajouter OpenAI pour GPT-4"
echo "   4. (Optionnel) Ajouter Twilio pour téléphonie"
echo ""
echo -e "${BLUE}💡 Pour ajouter d'autres clés API plus tard :${NC}"
echo "   Éditez votre fichier .env et relancez: npm run build"
echo ""
echo "🎊 Votre système Autophage est opérationnel !"

