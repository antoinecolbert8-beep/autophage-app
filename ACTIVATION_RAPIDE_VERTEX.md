# ⚡ ACTIVATION RAPIDE VERTEX AI

## 🎯 **3 ÉTAPES OBLIGATOIRES (5 MINUTES)**

### **✅ ÉTAPE 1 : Activer la facturation**

1. **Ouvrez ce lien** :
```
https://console.cloud.google.com/billing/linkedaccount?project=empire-youtube-system
```

2. **Si aucun compte de facturation** :
   - Cliquez sur **"Créer un compte de facturation"**
   - Remplissez vos informations
   - Ajoutez votre carte bancaire
   - 💰 **Vous recevrez $300 de crédits gratuits !**

3. **Si vous avez déjà un compte** :
   - Sélectionnez-le
   - Cliquez sur **"Définir le compte"**

---

### **✅ ÉTAPE 2 : Activer Vertex AI API**

1. **Ouvrez ce lien** :
```
https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=empire-youtube-system
```

2. Cliquez sur **"ACTIVER"** (bouton bleu)
3. Attendez 30 secondes

---

### **✅ ÉTAPE 3 : Activer Text-to-Speech API**

1. **Ouvrez ce lien** :
```
https://console.cloud.google.com/apis/library/texttospeech.googleapis.com?project=empire-youtube-system
```

2. Cliquez sur **"ACTIVER"** (bouton bleu)
3. Attendez 30 secondes

---

## 🚀 **VÉRIFICATION**

Une fois les 3 étapes faites, relancez :

```bash
npx tsx scripts/generate-youtube-short.ts "Test production"
```

Vous devriez voir :
- ✅ **Mode PRODUCTION activé**
- 🎙️ **Voix générée avec Google TTS**
- 🎬 **Vidéo générée avec Vertex AI** (ou erreur si API pas activée)

---

## ⚠️ **ERREURS POSSIBLES**

### "Billing not enabled"
➡️ Retournez à l'étape 1, activez la facturation

### "API not enabled"
➡️ Retournez aux étapes 2 et 3, activez les APIs

### "Quota exceeded"  
➡️ Attendez 24h ou demandez une augmentation de quota

---

## 💰 **RAPPEL COÛTS**

- **$300 de crédits gratuits** = 150-600 shorts !
- Google TTS : ~$0.02 par short
- Vertex AI Imagen : ~$0.50-2.00 par short (selon qualité)

---

## 🎯 **LIENS RAPIDES**

| Action | Lien Direct |
|--------|-------------|
| 💳 Facturation | https://console.cloud.google.com/billing/linkedaccount?project=empire-youtube-system |
| 🤖 Vertex AI | https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=empire-youtube-system |
| 🎙️ Text-to-Speech | https://console.cloud.google.com/apis/library/texttospeech.googleapis.com?project=empire-youtube-system |
| 📊 Dashboard | https://console.cloud.google.com/home/dashboard?project=empire-youtube-system |

---

**Après activation, revenez ici et relancez la génération ! 🚀**


