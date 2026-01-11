# 🚀 INSTRUCTIONS DE DÉPLOIEMENT VERCEL

## ⚠️ Le Token n'est Pas Valide

Le token fourni n'est pas reconnu par Vercel. Voici comment procéder :

---

## 🎯 MÉTHODE 1 : Déploiement Interactif (Recommandé)

### Étape 1 : Se Connecter

Ouvrez un nouveau terminal et exécutez :

```bash
vercel login
```

**Choisissez votre méthode de connexion** :
- **Email** : Recevez un code par email
- **GitHub** : Connexion via GitHub (recommandé)
- **GitLab** : Connexion via GitLab
- **Bitbucket** : Connexion via Bitbucket

### Étape 2 : Déployer

Une fois connecté, lancez :

```bash
vercel
```

**Répondez aux questions** :
- `Set up and deploy?` → **Y** (Yes)
- `Which scope?` → Choisissez votre compte
- `Link to existing project?` → **N** (No)
- `What's your project's name?` → **autophage-enterprise** (ou votre choix)
- `In which directory is your code located?` → **.** (point, répertoire actuel)
- `Want to modify these settings?` → **N** (No)

**Vercel va alors** :
1. ✅ Uploader votre code
2. ✅ Builder l'application
3. ✅ Déployer sur un domaine de preview
4. ✅ Afficher l'URL de votre application

### Étape 3 : Ajouter les Variables d'Environnement

1. **Allez sur** : https://vercel.com/dashboard
2. **Sélectionnez** votre projet `autophage-enterprise`
3. **Allez dans** : Settings → Environment Variables
4. **Ajoutez vos variables** :

```env
DATABASE_URL=votre_database_url
GOOGLE_API_KEY=votre_google_api_key
STRIPE_SECRET=votre_stripe_secret
STRIPE_WEBHOOK_SECRET=votre_webhook_secret
META_ACCESS_TOKEN=votre_meta_token
META_AD_ACCOUNT_ID=votre_ad_account_id
META_AD_SET_ID=votre_ad_set_id
CRON_SECRET=votre_cron_secret
EMERGENCY_STOP_ADS=false
```

### Étape 4 : Redéployer en Production

Retournez au terminal et exécutez :

```bash
vercel --prod
```

🎉 **C'est terminé !** Votre application sera accessible sur internet !

---

## 🎯 MÉTHODE 2 : Obtenir un Nouveau Token

Si vous voulez utiliser un token pour le déploiement automatisé :

### 1. Aller sur le Dashboard Vercel

Ouvrez : https://vercel.com/account/tokens

### 2. Créer un Nouveau Token

- Cliquez sur **Create Token**
- **Token Name** : `Autophage Deployment`
- **Scope** : Sélectionnez votre compte/équipe
- **Expiration** : Choisissez la durée (30 jours, 60 jours, ou jamais)
- Cliquez sur **Create**

### 3. Copier le Token

⚠️ **ATTENTION** : Le token ne sera affiché qu'une seule fois !
- Copiez-le immédiatement
- Stockez-le en lieu sûr

### 4. Utiliser le Token

```bash
vercel --token VOTRE_NOUVEAU_TOKEN --yes
```

---

## 🎯 MÉTHODE 3 : Via GitHub (Automatique)

### Avantage
Déploiement automatique à chaque push !

### Étapes

#### 1. Créer un Repository GitHub

```bash
git init
git add .
git commit -m "Initial commit - Autophage Enterprise"
git branch -M main
```

#### 2. Créer le Repo sur GitHub

- Allez sur https://github.com/new
- **Repository name** : `autophage-enterprise`
- **Visibility** : Private (recommandé)
- Cliquez sur **Create repository**

#### 3. Pusher le Code

```bash
git remote add origin https://github.com/VOTRE_USERNAME/autophage-enterprise.git
git push -u origin main
```

#### 4. Connecter à Vercel

- Allez sur https://vercel.com/new
- Cliquez sur **Import Git Repository**
- Sélectionnez votre repo `autophage-enterprise`
- Cliquez sur **Import**
- Vercel détectera automatiquement Next.js
- Cliquez sur **Deploy**

#### 5. Ajouter les Variables

Dans les settings du projet Vercel, ajoutez toutes vos variables d'environnement.

---

## 📊 APRÈS LE DÉPLOIEMENT

### Votre Application Sera Disponible Sur

```
https://autophage-enterprise.vercel.app
```

Ou avec votre domaine personnalisé si vous en configurez un.

### Tester les Pages

- 🏠 **Landing** : https://votre-app.vercel.app
- 📊 **Dashboard** : https://votre-app.vercel.app/dashboard-pro
- 🎬 **Sales Factory** : https://votre-app.vercel.app/sales-factory
- 🤖 **Agent Swarm** : https://votre-app.vercel.app/agent-swarm

### Vérifier la Santé

```bash
curl https://votre-app.vercel.app/api/health
```

---

## 🗄️ BASE DE DONNÉES

### Option 1 : Vercel Postgres (Recommandé)

1. Dans votre projet Vercel → **Storage**
2. **Create Database** → **Postgres**
3. Copiez la `DATABASE_URL`
4. Elle sera automatiquement ajoutée aux variables

### Option 2 : Supabase (Gratuit)

1. https://supabase.com → Nouveau projet
2. Settings → Database → Connection String
3. Ajoutez-la à Vercel comme `DATABASE_URL`

### Appliquer le Schéma Prisma

```bash
# Télécharger les variables de production
vercel env pull .env.production

# Appliquer le schéma
npx prisma db push
```

---

## 🔒 SÉCURITÉ

### ⚠️ IMPORTANT : Ne Jamais Committer

- ❌ `.env`
- ❌ `.env.local`
- ❌ Tokens Vercel
- ❌ Clés API

### ✅ Toujours Utiliser

- ✅ Variables d'environnement Vercel
- ✅ `.gitignore` pour les fichiers sensibles
- ✅ Secrets séparés pour Preview/Production

---

## 🛠️ COMMANDES UTILES

### Déploiement

```bash
vercel                    # Preview deployment
vercel --prod            # Production deployment
vercel --force           # Force redeploy
```

### Logs

```bash
vercel logs              # Voir les logs
vercel logs --follow     # Logs en temps réel
```

### Variables

```bash
vercel env ls            # Lister les variables
vercel env add           # Ajouter une variable
vercel env rm            # Supprimer une variable
vercel env pull          # Télécharger les variables
```

### Projet

```bash
vercel list              # Lister vos projets
vercel inspect           # Inspecter le déploiement
vercel remove            # Supprimer un déploiement
```

---

## 🐛 PROBLÈMES COURANTS

### "Not Logged In"

```bash
vercel login
```

### "Build Failed"

```bash
# Tester localement
npm run build

# Vérifier les logs
vercel logs
```

### "Environment Variable Missing"

Allez dans Settings → Environment Variables et ajoutez-les.

### "Domain Not Found"

Attendez quelques minutes, la propagation DNS peut prendre du temps.

---

## 📞 BESOIN D'AIDE ?

### Documentation

- **Vercel Docs** : https://vercel.com/docs
- **Vercel CLI** : https://vercel.com/docs/cli
- **Dashboard** : https://vercel.com/dashboard

### Support

- **Status** : https://www.vercel-status.com
- **Discord** : https://vercel.com/discord
- **Support** : https://vercel.com/support

---

## 🎉 PROCHAINES ÉTAPES

1. ✅ Build réussi (déjà fait)
2. ⏳ Connexion à Vercel
3. ⏳ Déploiement
4. ⏳ Ajout des variables
5. ⏳ Déploiement en production
6. 🎊 Application en ligne !

---

**Dernière mise à jour** : 6 janvier 2025 - 23:40  
**Version** : 1.0.0 Production Ready  
**Status** : ⏳ EN ATTENTE DE CONNEXION VERCEL




