# 📱 Instructions - Espace Client AvanPass

## 🎯 Comment Utiliser l'Espace Client

### 🚀 Accès à l'Espace Client

1. Ouvrez `index.html` dans votre navigateur
2. Sur la page d'accueil, cliquez sur **"Client"**
3. Vous verrez 2 options :

```
┌─────────────────────────────────────┐
│          Espace Client              │
├─────────────────────────────────────┤
│                                      │
│   🎫 Activer ma carte                │
│   J'ai un code d'activation          │
│                                      │
├─────────────────────────────────────┤
│                                      │
│   💳 Voir ma carte                   │
│   J'ai déjà une carte active         │
│                                      │
└─────────────────────────────────────┘
```

---

## 🎫 Option 1 : Activer ma Carte (Première Fois)

### Si vous avez un code d'activation :

1. Cliquez sur **"Activer ma carte"**
2. Entrez votre code d'activation (format : `XXXX-XXXX-XXXX`)
3. Cliquez sur **"Activer ma carte"**
4. ✅ Votre carte s'affiche automatiquement !

### ⚠️ Si vous n'avez pas de code :

Vous devez d'abord en obtenir un :

**Option A - Via l'Admin :**
1. Retournez à l'accueil
2. Allez dans **"Administrateur"**
3. Connectez-vous (`admin@avanpass.com` / `admin123`)
4. Cliquez sur **"Codes d'activation"**
5. Cliquez sur **"Générer des codes"**
6. Entrez `5` pour générer 5 codes
7. Notez un code
8. Retournez dans "Client" et utilisez ce code

**Option B - Via demo-data.html :**
1. Ouvrez le fichier `demo-data.html`
2. Cliquez sur le bouton pour générer les codes
3. Copiez un code affiché
4. Retournez sur `index.html` → Client
5. Utilisez ce code

---

## 💳 Option 2 : Voir ma Carte (Retours Suivants)

### Si vous avez déjà activé une carte :

1. Cliquez simplement sur **"Voir ma carte"**
2. ✅ Votre carte s'affiche instantanément !

### Si aucune carte n'est trouvée :

Un message apparaît :
```
❌ Aucune carte active trouvée.

Veuillez d'abord activer une carte 
avec un code d'activation.
```

→ Utilisez l'option 1 pour activer une carte d'abord.

---

## 🎴 Votre Carte Virtuelle

Une fois affichée, votre carte montre :

### 📊 Pour Chaque Boutique :
- **QR Code unique** (pour être scanné en magasin)
- **Compteur de points** (ex: 5 / 10)
- **Barre de progression** visuelle
- **Badge récompense** si le seuil est atteint
- **Statut de la carte** (Active / Inactive / Expirée)

### 📜 Historique
- Les 10 dernières transactions
- Type d'opération (passage validé / récompense)
- Date et heure
- Points gagnés ou déduits

---

## 🔄 Navigation

### Depuis la Carte :
- **Flèche ← (gauche)** : Retour au choix Client
- **Bouton 🚪 (droite)** : Déconnexion

### Depuis le Choix Client :
- **Flèche ←** : Retour à l'accueil

---

## 💡 Cas d'Usage Typiques

### 🆕 Nouveau Client
```
1. Client → Activer ma carte
2. Entrer le code reçu
3. Carte affichée !
4. Présenter le QR en magasin
```

### 🔄 Client Régulier
```
1. Client → Voir ma carte
2. Carte affichée !
3. Présenter le QR en magasin
```

### 📱 Changement d'Appareil
```
1. Client → Activer ma carte
2. Utiliser le même code (si non utilisé)
3. OU obtenir un nouveau code de l'admin
```

---

## 🎯 Points Importants

### ✅ À Savoir :
- Une carte = Un appareil (données stockées localement)
- Le QR code est unique par client
- Les points sont séparés par boutique
- L'historique montre les 10 dernières transactions

### ⚠️ Attention :
- Si vous effacez les données du navigateur, vous perdez la carte
- Il faudra réactiver avec un code
- Le bouton "Voir ma carte" n'affiche rien si aucune carte active

---

## 🔐 Déconnexion

Pour changer de carte ou tester un autre client :

1. Depuis votre carte, cliquez sur 🚪 (en haut à droite)
2. Confirmez la déconnexion
3. Vous revenez au choix Client
4. Vous pouvez activer une autre carte

---

## 🆘 Problèmes Courants

### "Aucune carte active trouvée"
**Solution** : Activez d'abord une carte avec un code

### "Code d'activation invalide"
**Causes possibles** :
- Le code n'existe pas
- Le code a déjà été utilisé
- Le code a été annulé

**Solution** : Obtenez un nouveau code via l'admin

### Le QR code ne s'affiche pas
**Solution** : Rafraîchissez la page (F5)

### Les points ne sont pas à jour
**Solution** : 
1. Retournez au choix Client (flèche ←)
2. Re-cliquez sur "Voir ma carte"

---

## 📞 Pour Aller Plus Loin

- **README.md** : Documentation technique complète
- **QUICKSTART.md** : Guide de démarrage rapide
- **demo-data.html** : Générateur de données de test

---

## 🎊 Profitez de Votre Carte AvanPass !

L'interface est conçue pour être **simple et intuitive**.

Deux boutons, deux actions :
- 🎫 **Activer** → Première fois
- 💳 **Voir** → Toutes les autres fois

C'est tout ! 😊
