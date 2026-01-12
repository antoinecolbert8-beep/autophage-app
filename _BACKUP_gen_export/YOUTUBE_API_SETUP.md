# 🎬 CONFIGURATION YOUTUBE API - GUIDE COMPLET

## 📋 **VUE D'ENSEMBLE**

Pour uploader automatiquement des YouTube Shorts, vous avez besoin de :
1. **YouTube API Key** (pour les opérations de lecture)
2. **OAuth2 Client ID** (pour l'authentification)
3. **OAuth2 Client Secret** (pour l'authentification)
4. **Refresh Token** (pour maintenir l'accès)

---

## 🚀 **ÉTAPE 1 : CRÉER UN PROJET GOOGLE CLOUD**

### 1.1 Accéder à Google Cloud Console
1. Allez sur : https://console.cloud.google.com/
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Select a project"** en haut
4. Cliquez sur **"NEW PROJECT"**

### 1.2 Créer le projet
1. **Nom du projet** : `Autophage-YouTube-Bot`
2. Cliquez sur **"CREATE"**
3. Attendez que le projet soit créé (quelques secondes)

---

## 🔧 **ÉTAPE 2 : ACTIVER YOUTUBE DATA API v3**

### 2.1 Activer l'API
1. Dans le menu latéral, allez dans **"APIs & Services"** > **"Library"**
2. Recherchez : `YouTube Data API v3`
3. Cliquez sur **"YouTube Data API v3"**
4. Cliquez sur **"ENABLE"**
5. Attendez l'activation (10-30 secondes)

---

## 🔑 **ÉTAPE 3 : CRÉER UNE CLÉ API**

### 3.1 Générer la clé
1. Allez dans **"APIs & Services"** > **"Credentials"**
2. Cliquez sur **"+ CREATE CREDENTIALS"**
3. Sélectionnez **"API key"**
4. Copiez la clé générée (commence par `AIza...`)
5. (Optionnel) Cliquez sur **"RESTRICT KEY"** pour plus de sécurité
   - **Application restrictions** : None
   - **API restrictions** : YouTube Data API v3
6. Cliquez sur **"SAVE"**

**➡️ Sauvegardez cette clé :** `YOUTUBE_API_KEY`

---

## 🔐 **ÉTAPE 4 : CRÉER OAUTH2 CLIENT ID**

### 4.1 Configurer l'écran de consentement
1. Dans **"APIs & Services"** > **"OAuth consent screen"**
2. Sélectionnez **"External"** (pour tester)
3. Cliquez sur **"CREATE"**

### 4.2 Remplir les informations
- **App name** : `Autophage YouTube Uploader`
- **User support email** : Votre email
- **Developer contact information** : Votre email
- Cliquez sur **"SAVE AND CONTINUE"**

### 4.3 Ajouter les scopes
1. Cliquez sur **"ADD OR REMOVE SCOPES"**
2. Recherchez et cochez :
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube`
3. Cliquez sur **"UPDATE"**
4. Cliquez sur **"SAVE AND CONTINUE"**

### 4.4 Ajouter des utilisateurs test
1. Cliquez sur **"+ ADD USERS"**
2. Ajoutez votre email (celui de votre compte YouTube)
3. Cliquez sur **"SAVE AND CONTINUE"**

### 4.5 Créer OAuth Client ID
1. Allez dans **"Credentials"**
2. Cliquez sur **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. **Application type** : `Desktop app`
4. **Name** : `Autophage Desktop Client`
5. Cliquez sur **"CREATE"**

### 4.6 Télécharger les credentials
1. Une popup apparaît avec :
   - **Client ID** (commence par `xxx.apps.googleusercontent.com`)
   - **Client Secret** (chaîne aléatoire)
2. Cliquez sur **"DOWNLOAD JSON"** (gardez ce fichier précieusement)
3. Ou copiez manuellement les deux valeurs

**➡️ Sauvegardez :**
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`

---

## 🔄 **ÉTAPE 5 : OBTENIR LE REFRESH TOKEN**

### 5.1 Utiliser le script d'authentification

Je vais créer un script pour vous aider à obtenir le refresh token.

**Commande à exécuter :**
```bash
npx tsx scripts/youtube-auth.ts
```

Le script :
1. Ouvrira votre navigateur
2. Vous demandera de vous connecter à YouTube
3. Vous demandera d'autoriser l'application
4. Affichera votre **REFRESH_TOKEN**

---

## 📝 **ÉTAPE 6 : CONFIGURER LES VARIABLES D'ENVIRONNEMENT**

Ajoutez ces lignes à votre fichier `.env` :

```env
# YouTube Upload
YOUTUBE_API_KEY=AIzaSy...votre_clé_api...
YOUTUBE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-votre_secret...
YOUTUBE_REFRESH_TOKEN=1//votre_refresh_token...
```

---

## ✅ **ÉTAPE 7 : TESTER L'UPLOAD**

Une fois configuré, testez avec :

```bash
npx tsx scripts/generate-youtube-short.ts "Test upload automatique"
```

Le short devrait être uploadé sur votre chaîne YouTube !

---

## 🔍 **VÉRIFICATION DES QUOTAS**

### Quotas YouTube API (gratuit)
- **10,000 unités/jour** par projet
- **Upload d'une vidéo** = 1,600 unités
- **➡️ Vous pouvez uploader ~6 vidéos/jour gratuitement**

### Augmenter les quotas
Si vous avez besoin de plus :
1. Allez dans **"APIs & Services"** > **"Quotas"**
2. Sélectionnez **"YouTube Data API v3"**
3. Demandez une augmentation de quota

---

## 🛠️ **TROUBLESHOOTING**

### Erreur "Access Not Configured"
➡️ Assurez-vous que YouTube Data API v3 est bien activée

### Erreur "Invalid Client"
➡️ Vérifiez que CLIENT_ID et CLIENT_SECRET sont corrects

### Erreur "Token has been expired or revoked"
➡️ Régénérez un nouveau refresh token avec `youtube-auth.ts`

### Erreur "Quota exceeded"
➡️ Attendez le lendemain (quotas reset à minuit PST)

---

## 🎯 **RÉSUMÉ RAPIDE**

1. ✅ Créer projet Google Cloud
2. ✅ Activer YouTube Data API v3
3. ✅ Générer API Key
4. ✅ Créer OAuth2 Client (Desktop app)
5. ✅ Obtenir Refresh Token
6. ✅ Configurer `.env`
7. ✅ Tester l'upload

**Temps estimé : 10-15 minutes**

---

## 📚 **RESSOURCES**

- **Google Cloud Console** : https://console.cloud.google.com/
- **YouTube API Docs** : https://developers.google.com/youtube/v3
- **OAuth2 Playground** : https://developers.google.com/oauthplayground/

---

**🚀 Une fois configuré, vos YouTube Shorts s'uploaderont automatiquement !**


