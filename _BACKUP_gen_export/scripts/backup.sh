#!/bin/bash

# 💾 SCRIPT DE BACKUP
# Sauvegarde automatique des données critiques

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$DATE"

echo "💾 BACKUP AUTOPHAGE - $DATE"
echo "============================"
echo ""

# Créer le dossier de backup
mkdir -p "$BACKUP_DIR"

echo "📋 Sauvegarde de la configuration..."
cp .env "$BACKUP_DIR/.env.backup"

echo "🗄️  Backup de la base de données..."
if command -v pg_dump &> /dev/null; then
    # Extraire l'URL de connexion depuis .env
    source .env
    pg_dump "$DATABASE_URL" > "$BACKUP_DIR/database.sql"
    echo "✅ Base de données sauvegardée"
else
    echo "⚠️  pg_dump non trouvé, backup PostgreSQL ignoré"
fi

echo "🤖 Sauvegarde du bot LinkedIn..."
if [ -f "SaaS_Bot_LinkedIn/storage_state.json" ]; then
    cp SaaS_Bot_LinkedIn/storage_state.json "$BACKUP_DIR/storage_state.json"
    echo "✅ Session LinkedIn sauvegardée"
fi

echo "🎯 Sauvegarde des targets..."
if [ -f "SaaS_Bot_LinkedIn/targets.json" ]; then
    cp SaaS_Bot_LinkedIn/targets.json "$BACKUP_DIR/targets.json"
fi

echo "📚 Sauvegarde de la base de connaissances..."
if [ -d "data/knowledge" ]; then
    cp -r data/knowledge "$BACKUP_DIR/knowledge"
    echo "✅ Base de connaissances sauvegardée"
fi

echo "🎬 Sauvegarde des médias générés..."
if [ -d "public/videos" ] || [ -d "public/audio" ]; then
    mkdir -p "$BACKUP_DIR/media"
    [ -d "public/videos" ] && cp -r public/videos "$BACKUP_DIR/media/"
    [ -d "public/audio" ] && cp -r public/audio "$BACKUP_DIR/media/"
    echo "✅ Médias sauvegardés"
fi

# Compression du backup
echo ""
echo "🗜️  Compression du backup..."
tar -czf "backups/autophage_backup_$DATE.tar.gz" -C backups "$DATE"
rm -rf "$BACKUP_DIR"

echo ""
echo "✅ BACKUP TERMINÉ !"
echo "==================="
echo ""
echo "📦 Fichier créé: backups/autophage_backup_$DATE.tar.gz"
echo "💾 Taille: $(du -h "backups/autophage_backup_$DATE.tar.gz" | cut -f1)"
echo ""
echo "📝 Pour restaurer:"
echo "   tar -xzf backups/autophage_backup_$DATE.tar.gz -C backups/"
echo ""
echo "🚨 N'oubliez pas de copier ce backup sur un serveur distant !"





