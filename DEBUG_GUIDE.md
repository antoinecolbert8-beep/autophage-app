# 🔧 GUIDE DE DÉPANNAGE - COPIE LIMOVA

## ✅ VÉRIFICATIONS

### 1. **Serveur en cours d'exécution ?**
```powershell
netstat -ano | findstr :3001
```
Si rien n'apparaît, le serveur n'est pas lancé.

### 2. **Redémarrer le serveur**
```powershell
# Arrêter tous les processus Node
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Attendre 3 secondes
Start-Sleep -Seconds 3

# Relancer
npm run dev
```

### 3. **Vérifier les erreurs dans le terminal**
Regardez la sortie de `npm run dev` pour voir s'il y a des erreurs de compilation.

### 4. **Vider le cache**
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### 5. **Vérifier le navigateur**
- Ouvrez http://localhost:3001/
- Appuyez sur **Ctrl + F5** pour forcer le rafraîchissement
- Ouvrez la console (F12) pour voir les erreurs JavaScript

## 🐛 PROBLÈMES COURANTS

### Page blanche
- Vérifiez la console du navigateur (F12)
- Vérifiez les erreurs dans le terminal
- Vérifiez que Tailwind CSS est bien configuré

### Erreur de compilation
- Vérifiez que tous les imports sont corrects
- Vérifiez la syntaxe JSX

### Design ne s'affiche pas
- Vérifiez que `app/globals.css` est bien chargé
- Vérifiez que Tailwind est configuré dans `tailwind.config.ts`

## 📝 FICHIERS À VÉRIFIER

1. `app/page.tsx` - Page principale
2. `app/globals.css` - Styles globaux
3. `tailwind.config.ts` - Configuration Tailwind
4. `next.config.js` - Configuration Next.js

## 🚀 SOLUTION RAPIDE

Si rien ne fonctionne, essayez cette version minimale :

1. Remplacez `app/page.tsx` par une version simple
2. Vérifiez que ça fonctionne
3. Ajoutez progressivement les sections

---

**Dites-moi quelle erreur vous voyez exactement** pour que je puisse vous aider plus précisément !
