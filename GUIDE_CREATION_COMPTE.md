# 📝 Guide Complet : Créer un Compte

**Date** : 15 décembre 2024  
**Version** : AvanPass 1.3.2

---

## 🎯 OUI, VOUS POUVEZ CRÉER UN COMPTE ! ✅

---

## 👤 **3 TYPES DE COMPTES DISPONIBLES**

### 1️⃣ **CLIENT** (Utilisateur final)
- **Activation par code uniquement**
- **Pas d'inscription libre**
- Vous devez avoir un **code d'activation** fourni par l'administrateur

### 2️⃣ **COMMERÇANT** (Boutique/Restaurant/Salon/etc.)
- ✅ **INSCRIPTION LIBRE DISPONIBLE**
- Créez votre compte directement depuis l'app
- **Validation requise** par l'administrateur avant utilisation

### 3️⃣ **ADMINISTRATEUR**
- ❌ **Pas d'inscription libre**
- Compte créé manuellement par le développeur/propriétaire

---

## 🏪 **COMMENT CRÉER UN COMPTE COMMERÇANT** (Recommandé)

### **Étape 1 : Accéder à l'app**
```
URL : https://puvlagux.gensparkspace.com
```

### **Étape 2 : Choisir "Commerçant"**
Sur la page d'accueil, cliquez sur :
```
┌─────────────────────────┐
│   🏪 Commerçant        │
│   Scanner et valider    │
│   les passages          │
└─────────────────────────┘
```

### **Étape 3 : Cliquer sur "Créer mon compte boutique"**
Sur l'écran de connexion, cliquez sur le bouton gris :
```
┌─────────────────────────────────┐
│  Créer mon compte boutique      │
└─────────────────────────────────┘
```

### **Étape 4 : Remplir le formulaire**

#### **Informations obligatoires** (marquées *)
```
Nom de la boutique *
└─> Exemple : "Café du Coin"

Email (connexion) *
└─> Exemple : "contact@maboutique.fr"

Mot de passe *
└─> Exemple : "MonMotDePasse123"

Nombre de passages pour une récompense *
└─> Exemple : 10

Libellé de la récompense *
└─> Exemple : "1 café offert"
```

#### **Informations optionnelles**
```
Adresse
└─> Exemple : "123 Rue de la Paix"

Ville
└─> Exemple : "Paris"

Responsable
└─> Exemple : "Jean Dupont"

Téléphone
└─> Exemple : "06 12 34 56 78"
```

### **Étape 5 : Valider**
Cliquez sur :
```
┌─────────────────────────────────┐
│  ✅ Créer mon compte           │
└─────────────────────────────────┘
```

### **Étape 6 : Attendre la validation**
Message affiché :
```
✅ Compte créé avec succès !
Votre compte est en attente de validation 
par l'administrateur.
```

---

## ⏳ **STATUT DU COMPTE APRÈS CRÉATION**

### **État initial : EN ATTENTE**
```
Statut : en_attente
└─> Vous ne pouvez PAS encore vous connecter
└─> Un administrateur doit valider votre compte
```

### **Après validation admin : VALIDÉ**
```
Statut : valide
└─> Vous pouvez vous connecter
└─> Vous pouvez scanner des cartes client
└─> Vous pouvez valider des passages et récompenses
```

---

## 🎫 **COMMENT CRÉER UN COMPTE CLIENT**

### ❌ **Pas d'inscription directe**
Les clients ne peuvent pas s'inscrire eux-mêmes.

### ✅ **Activation par code uniquement**

#### **Étape 1 : Obtenir un code d'activation**
Demandez à l'administrateur de générer un code pour vous.

#### **Étape 2 : Accéder à l'app**
```
URL : https://puvlagux.gensparkspace.com
```

#### **Étape 3 : Choisir "Client"**
```
┌─────────────────────────┐
│   👤 Client            │
│   Accédez à votre       │
│   carte virtuelle       │
└─────────────────────────┘
```

#### **Étape 4 : Activer ma carte**
```
┌─────────────────────────┐
│   🎫 Activer ma carte  │
│   J'ai un code          │
│   d'activation          │
└─────────────────────────┘
```

#### **Étape 5 : Saisir le code**
```
Code d'activation
└─> Entrez le code fourni (ex: ABC123)
```

#### **Étape 6 : Valider**
```
✅ Carte activée avec succès !
```

Votre carte virtuelle s'affiche automatiquement avec votre QR code unique.

---

## 🔐 **COMMENT CRÉER UN COMPTE ADMIN**

### ❌ **Création manuelle uniquement**
Les comptes administrateur ne peuvent pas être créés via l'interface.

### 💻 **Méthode : Via console développeur ou script**
Un compte admin doit être créé directement dans la base de données.

---

## 📊 **RÉCAPITULATIF**

| Type | Inscription Libre | Méthode | Validation Requise |
|------|-------------------|---------|-------------------|
| **Client** | ❌ Non | Code d'activation | ✅ Oui (code) |
| **Commerçant** | ✅ Oui | Formulaire web | ✅ Oui (admin) |
| **Administrateur** | ❌ Non | Manuelle (BDD) | ❌ Non |

---

## 🎯 **RECOMMANDATION POUR TESTER**

### **Pour tester l'app commerçant :**

1. **Créez un compte commerçant** (comme expliqué ci-dessus)
2. **Validez-le via l'admin** (ou utilisez un compte démo)
3. **Utilisez les identifiants démo** :
   ```
   Email : cafe@ducoin.fr
   Mot de passe : demo123
   ```

### **Pour tester l'app client :**

1. **Utilisez un code d'activation** (demandez à l'admin)
2. **Ou utilisez un client démo** déjà créé

---

## 🚀 **PROCHAINES ÉTAPES**

### **Si vous voulez tester immédiatement :**

✅ **Option 1 : Compte commerçant démo**
```
Email : cafe@ducoin.fr
Mot de passe : demo123
Statut : ✅ Déjà validé
```

✅ **Option 2 : Créer votre propre compte**
Suivez les étapes de la section "COMMENT CRÉER UN COMPTE COMMERÇANT"

⚠️ **Attention** : Votre nouveau compte sera en attente jusqu'à validation admin.

---

## ❓ **QUESTIONS FRÉQUENTES**

### **Q : Puis-je créer plusieurs comptes commerçant ?**
✅ Oui, autant que vous voulez (une boutique par compte).

### **Q : Combien de temps prend la validation ?**
⏳ Cela dépend de l'administrateur (peut être immédiat ou plusieurs heures/jours).

### **Q : Puis-je modifier mes informations après création ?**
✅ Oui, via les "Paramètres fidélité" dans votre dashboard commerçant.

### **Q : Que faire si mon email est "déjà utilisé" ?**
❌ Chaque email ne peut avoir qu'un seul compte. Utilisez un autre email.

### **Q : Puis-je me connecter pendant la validation ?**
❌ Non, vous devez attendre que l'admin valide votre compte.

---

## 📂 **FICHIERS LIÉS**

- **`index.html`** : Interface de connexion/inscription
- **`js/commercant.js`** : Fonctions d'inscription (ligne 87-212)
- **`js/client.js`** : Fonctions d'activation client (ligne 28-92)
- **`js/api.js`** : Appels API pour création de comptes

---

**Version** : AvanPass 1.3.2  
**Statut** : ✅ Inscription commerçant fonctionnelle  
**Date** : 15 décembre 2024
