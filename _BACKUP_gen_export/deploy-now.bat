@echo off
REM 🚀 DÉPLOIEMENT RAPIDE AUTOPHAGE - VERSION WINDOWS
REM Utilise les clés API disponibles, reste optionnel

echo.
echo 🚀 DÉPLOIEMENT AUTOPHAGE - MODE RAPIDE
echo ======================================
echo.

REM Étape 1: Vérification configuration
echo 📋 Étape 1/5: Vérification de la configuration
echo ==============================================
if exist .env (
    echo ✅ Fichier .env trouvé
) else if exist .env.local (
    echo ✅ Fichier .env.local trouvé
) else (
    echo ⚠️  Création de .env.local depuis le template...
    if exist env.example.txt (
        copy env.example.txt .env.local
        echo ✅ .env.local créé
    ) else (
        echo ⚠️  Aucun template trouvé
    )
)
echo.

REM Étape 2: Installation Node.js
echo 📦 Étape 2/5: Installation des dépendances Node.js
echo ==================================================
if exist node_modules (
    echo ℹ️  node_modules existe déjà, skip...
) else (
    echo Installation en cours...
    call npm install
)
echo ✅ Dépendances installées
echo.

REM Étape 3: Base de données
echo 🗄️  Étape 3/5: Configuration de la base de données
echo ==================================================
echo Génération du client Prisma...
call npx prisma generate

echo Application du schéma...
call npx prisma db push --skip-generate 2>NUL || echo ⚠️  DB push ignoré (optionnel)
echo.

REM Étape 4: Build
echo ⚡ Étape 4/5: Build de l'application
echo ====================================
call npm run build
echo ✅ Application construite
echo.

REM Étape 5: Configuration optionnelle
echo 🎬 Étape 5/5: Configuration optionnelle
echo =======================================

if exist SaaS_Bot_LinkedIn (
    echo Configuration du bot Python...
    cd SaaS_Bot_LinkedIn
    
    if not exist venv (
        echo Création de l'environnement virtuel Python...
        python -m venv venv
    )
    
    if exist venv\Scripts\activate.bat (
        call venv\Scripts\activate.bat
        pip install -r requirements.txt --quiet
        playwright install chromium
    )
    
    cd ..
    echo ✅ Bot Python configuré
) else (
    echo ⚠️  SaaS_Bot_LinkedIn non trouvé (optionnel)
)
echo.

echo.
echo ✅ DÉPLOIEMENT TERMINÉ !
echo =======================
echo.
echo 🌐 Lancement du serveur de développement...
echo.
echo Application disponible sur: http://localhost:3000
echo.
echo 📝 Prochaines étapes:
echo    1. Ouvrir http://localhost:3000
echo    2. Tester les différentes pages
echo    3. Ajouter d'autres clés API si besoin (dans .env.local)
echo.
echo 🎉 Votre système est opérationnel !
echo.

REM Lancer le serveur
call npm run dev





