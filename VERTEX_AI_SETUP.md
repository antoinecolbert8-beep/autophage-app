# 🎬 ACTIVATION VERTEX AI - GUIDE COMPLET

## 📋 **RÉSUMÉ**

Pour passer en **mode PRODUCTION** et générer de vraies vidéos YouTube Shorts :

1. ✅ Activer la facturation sur Google Cloud
2. ✅ Activer Vertex AI API
3. ✅ Configurer `VERTEX_AI_ENABLED=true`
4. ✅ Relancer la génération de shorts

---

## 🚀 **ÉTAPE 1 : ACTIVER LA FACTURATION**

### 1.1 Accéder à la facturation
1. Allez sur : https://console.cloud.google.com/billing
2. Sélectionnez votre projet : **empire-youtube-system**
3. Cliquez sur **"Associer un compte de facturation"**

### 1.2 Créer un compte de facturation
1. Cliquez sur **"Créer un compte de facturation"**
2. Remplissez les informations :
   - Nom du compte
   - Pays : France
   - Devise : EUR (€)
3. Ajoutez votre carte bancaire
4. Acceptez les conditions

### 1.3 Associer au projet
1. Sélectionnez votre compte de facturation
2. Associez-le au projet **empire-youtube-system**
3. Validez

**💡 Note** : Google offre **$300 de crédits gratuits** pour 90 jours !

---

## 🔧 **ÉTAPE 2 : ACTIVER VERTEX AI**

### 2.1 Activer l'API
1. Allez sur : https://console.cloud.google.com/apis/library
2. Recherchez : **"Vertex AI API"**
3. Cliquez sur **"ACTIVER"** / **"ENABLE"**
4. Attendez l'activation (30 secondes)

### 2.2 Activer les APIs nécessaires
Activez également ces APIs :
- ✅ **Vertex AI API**
- ✅ **Cloud Text-to-Speech API**
- ✅ **Cloud Storage API** (pour stocker les vidéos)

---

## ⚙️ **ÉTAPE 3 : CONFIGURATION DANS CURSOR**

### 3.1 Vérifier votre .env.local
Assurez-vous que ces lignes sont présentes :

```env
# Google Cloud & Vertex AI
GOOGLE_API_KEY=AIzaSyAGfmRv8uSKFhZKXzwABFovmldj_wvD4a8
GOOGLE_CLOUD_PROJECT_ID=empire-youtube-system

# Mode Production (true = vraies vidéos, false = simulation)
VERTEX_AI_ENABLED=false
```

### 3.2 Passer en mode PRODUCTION
Pour générer de **vraies vidéos**, changez :

```env
VERTEX_AI_ENABLED=true
```

---

## 🎯 **ÉTAPE 4 : TESTER LE SYSTÈME**

### 4.1 Mode Simulation (gratuit)
```bash
# Dans .env.local : VERTEX_AI_ENABLED=false
npx tsx scripts/generate-youtube-short.ts "Test simulation"
```

**Résultat** :
- ⚠️ Mode SIMULATION
- 📝 Script généré par GPT-4
- 🎬 Placeholder vidéo
- 🎙️ Placeholder audio

### 4.2 Mode Production (payant)
```bash
# Dans .env.local : VERTEX_AI_ENABLED=true
npx tsx scripts/generate-youtube-short.ts "Test production"
```

**Résultat** :
- ✅ Mode PRODUCTION
- 📝 Script généré par GPT-4
- 🎬 Vraie vidéo via Vertex AI
- 🎙️ Vraie voix via Google TTS
- 📤 Upload automatique sur YouTube

---

## 💰 **COÛTS ESTIMÉS**

### Mode Simulation (GRATUIT)
- GPT-4 Script : $0.01
- Vidéo : $0 (placeholder)
- Audio : $0 (placeholder)
- **Total : $0.01**

### Mode Production
- GPT-4 Script : $0.01
- Vertex AI Imagen Video : $0.50 - $2.00 (selon durée)
- Google TTS : $0.02
- YouTube Upload : Gratuit
- **Total : $0.53 - $2.03 par short**

### Crédits Google Cloud
- ✅ **$300 gratuits** pendant 90 jours
- ≈ **150 à 600 shorts gratuits** !

---

## 🔍 **VÉRIFICATION**

### Vérifier que tout est activé
```bash
# Lister les APIs activées
gcloud services list --enabled --project=empire-youtube-system
```

Vous devriez voir :
- ✅ aiplatform.googleapis.com (Vertex AI)
- ✅ texttospeech.googleapis.com (TTS)
- ✅ storage-api.googleapis.com (Storage)
- ✅ youtube.googleapis.com (YouTube)

---

## 🛠️ **TROUBLESHOOTING**

### Erreur "Billing not enabled"
➡️ Activez la facturation sur votre projet

### Erreur "API not enabled"
➡️ Activez Vertex AI API dans la console

### Erreur "Quota exceeded"
➡️ Attendez ou demandez une augmentation de quota

### Vidéo ne se génère pas
➡️ Vérifiez que `VERTEX_AI_ENABLED=true` dans .env.local

---

## 📊 **COMMANDES UTILES**

```bash
# Tester en mode simulation
VERTEX_AI_ENABLED=false npx tsx scripts/generate-youtube-short.ts "Test"

# Tester en mode production
VERTEX_AI_ENABLED=true npx tsx scripts/generate-youtube-short.ts "Test"

# Générer 3 shorts en batch production
VERTEX_AI_ENABLED=true npx tsx scripts/generate-youtube-short.ts
```

---

## 🎯 **RÉSUMÉ FINAL**

1. ✅ Activez la facturation Google Cloud
2. ✅ Activez Vertex AI API
3. ✅ Changez `VERTEX_AI_ENABLED=true` dans .env.local
4. ✅ Lancez `npx tsx scripts/generate-youtube-short.ts`
5. ✅ Profitez de vos **vraies vidéos automatiques** ! 🚀

---

**🔥 AVEC $300 DE CRÉDITS GRATUITS, VOUS POUVEZ GÉNÉRER DES CENTAINES DE SHORTS ! 🔥**


