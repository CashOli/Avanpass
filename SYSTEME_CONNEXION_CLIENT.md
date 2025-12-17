# 🔐 Système de Connexion Client - AvanPass

**Version** : 1.4.0  
**Date** : 15 décembre 2024

---

## 🎯 **VUE D'ENSEMBLE**

Le système de connexion client permet aux utilisateurs de :
- **S'inscrire** avec email + mot de passe
- **Se connecter** depuis n'importe quel appareil
- **Voir leur carte** avec QR code unique
- **Se déconnecter** en toute sécurité

---

## 📋 **FLUX D'UTILISATION**

### **1️⃣ INSCRIPTION**

**Étapes :**
1. Accueil → Cliquer "Client"
2. Cliquer "Créer mon compte"
3. Remplir le formulaire :
   - Email (unique) *
   - Mot de passe (min 6 caractères) *
   - Prénom *
   - Nom *
   - Téléphone (optionnel)
   - Code d'activation *
4. Cliquer "Créer mon compte"
5. ✅ Carte activée et affichée automatiquement

**Champs obligatoires (*)** :
- Email
- Mot de passe
- Prénom
- Nom
- Code d'activation

**Validations** :
- Email unique (pas de doublon)
- Mot de passe ≥ 6 caractères
- Code d'activation valide et non utilisé
- Email format valide

---

### **2️⃣ CONNEXION**

**Étapes :**
1. Accueil → Cliquer "Client"
2. Entrer email + mot de passe
3. Cliquer "Se connecter"
4. ✅ Carte affichée avec QR code

**Vérifications** :
- Email existe
- Mot de passe correct
- Carte active (pas suspendue/expirée)

---

### **3️⃣ UTILISATION DE LA CARTE**

**Fonctionnalités disponibles :**

1. **Sélecteur de boutique**
   - Menu déroulant avec toutes les boutiques partenaires
   - Changement dynamique des points et récompenses

2. **Carte virtuelle**
   - Nom du client
   - Points actuels / Seuil
   - Barre de progression
   - Badge récompense (si disponible)
   - QR code unique
   - Image décorative selon type de boutique

3. **QR Code**
   - Unique pour le client
   - Même QR pour toutes les boutiques
   - Scannable en magasin
   - Taille : 320x320px

4. **Historique**
   - 10 dernières transactions
   - Boutique + date + points

5. **Déconnexion**
   - Bouton en haut à droite
   - Confirmation avant déconnexion

---

## 🔧 **ARCHITECTURE TECHNIQUE**

### **Base de Données**

**Table `clients` - Schéma mis à jour :**

```json
{
  "id": "UUID",
  "email": "string (unique)",
  "password_hash": "string (bcrypt)",
  "prenom": "string",
  "nom": "string",
  "telephone": "string",
  "statut_carte": "active | inactive | suspendue | expiree",
  "date_activation": "datetime",
  "date_expiration": "datetime",
  "qr_token_client": "string (unique)"
}
```

**Nouveau champ :**
- `password_hash` : Hash bcrypt du mot de passe

---

### **Fichiers Modifiés**

#### **1. `index.html`**

**Avant :**
```html
<button onclick="clientApp.showActivation()">Activer ma carte</button>
<button onclick="clientApp.showCard()">Voir ma carte</button>
```

**Après :**
```html
<!-- Écran de connexion -->
<input id="client-login-email" type="email">
<input id="client-login-password" type="password">
<button onclick="clientApp.login()">Se connecter</button>
<button onclick="clientApp.showRegistration()">Créer mon compte</button>
```

---

#### **2. `js/client.js`**

**Réécriture complète avec nouvelles fonctions :**

```javascript
// Inscription
async register() {
  - Validation des champs
  - Vérification email unique
  - Vérification code d'activation
  - Hachage mot de passe
  - Création client
  - Connexion automatique
}

// Connexion
async login() {
  - Recherche client par email
  - Vérification mot de passe
  - Vérification statut carte
  - Sauvegarde session
  - Affichage carte
}

// Déconnexion
logout() {
  - Confirmation
  - Suppression session
  - Retour à l'écran connexion
}

// Affichage carte
async showCard() {
  - Vérification session
  - Récupération boutiques
  - Calcul points
  - Génération QR code
  - Historique transactions
}
```

---

## 🔒 **SÉCURITÉ**

### **Mots de Passe**

1. **Hachage**
   - Algorithme : bcrypt
   - Fonction : `Auth.hashPassword(password)`
   - Stockage : uniquement le hash

2. **Vérification**
   - Fonction : `Auth.verifyPassword(password, hash)`
   - Comparaison sécurisée

3. **Exigences**
   - Minimum 6 caractères
   - Validation côté client et serveur

---

### **Email**

1. **Unicité**
   - Vérification avant inscription
   - Recherche insensible à la casse

2. **Format**
   - Validation HTML5 (type="email")
   - Trim automatique

---

### **Session**

1. **Stockage**
   - localStorage (navigateur)
   - Objet client complet

2. **Vérification**
   - À chaque chargement de page
   - Auto-connexion si session valide

3. **Déconnexion**
   - Suppression localStorage
   - Retour à l'écran connexion

---

## 🎨 **INTERFACE UTILISATEUR**

### **Écran de Connexion**

```
┌────────────────────────────┐
│      Espace Client         │
│                            │
│  Email:                    │
│  [votre@email.com____]     │
│                            │
│  Mot de passe:             │
│  [••••••••___________]     │
│                            │
│  [    Se connecter    ]    │
│  [ Créer mon compte   ]    │
└────────────────────────────┘
```

---

### **Écran d'Inscription**

```
┌────────────────────────────┐
│   Créer mon compte         │
│                            │
│  Email *                   │
│  [________________]        │
│                            │
│  Mot de passe *            │
│  [________________]        │
│                            │
│  Prénom *                  │
│  [________________]        │
│                            │
│  Nom *                     │
│  [________________]        │
│                            │
│  Téléphone                 │
│  [________________]        │
│                            │
│  Code d'activation *       │
│  [________________]        │
│  Code fourni par admin     │
│                            │
│  [ Créer mon compte ]      │
└────────────────────────────┘
```

---

### **Carte Virtuelle**

```
┌────────────────────────────────────┐
│  Ma Carte AvanPass      [Logout]   │
│                                    │
│  Sélectionner boutique:            │
│  [Café du Coin ▼]                  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ [Image décorative 160px]     │  │
│  │                              │  │
│  │  ☕ Café du Coin              │  │
│  │     Carte de fidélité        │  │
│  │                              │  │
│  │  Jean Dupont                 │  │
│  │                              │  │
│  │       5 / 10 points          │  │
│  │  [▰▰▰▰▰▱▱▱▱▱] 50%            │  │
│  │                              │  │
│  │  Encore 5 passages pour:     │  │
│  │  1 café offert               │  │
│  │                              │  │
│  │     [  QR CODE  ]            │  │
│  │     [  320x320  ]            │  │
│  │                              │  │
│  │  Présentez ce QR en boutique │  │
│  └──────────────────────────────┘  │
│                                    │
│  📜 Dernières transactions         │
│  ☕ Café du Coin  +1   15/12/2024  │
│  🥖 Boulangerie  +1   14/12/2024  │
└────────────────────────────────────┘
```

---

## 🧪 **TESTING**

### **Test d'Inscription**

1. Aller sur "Client"
2. Cliquer "Créer mon compte"
3. Remplir :
   - Email : `test@client.fr`
   - Mot de passe : `test123`
   - Prénom : `Jean`
   - Nom : `Dupont`
   - Code : (code valide fourni par admin)
4. Vérifier :
   - ✅ Message "Compte créé avec succès"
   - ✅ Carte affichée automatiquement
   - ✅ QR code généré

---

### **Test de Connexion**

1. Se déconnecter (bouton logout)
2. Entrer email + mot de passe
3. Cliquer "Se connecter"
4. Vérifier :
   - ✅ Carte affichée
   - ✅ Points corrects
   - ✅ QR code présent

---

### **Test Multi-appareils**

1. S'inscrire sur appareil A
2. Se déconnecter
3. Ouvrir sur appareil B
4. Se connecter avec mêmes identifiants
5. Vérifier :
   - ✅ Même carte
   - ✅ Mêmes points
   - ✅ Même QR code

---

## ❓ **FAQ**

**Q : Le code d'activation est-il réutilisable ?**  
R : ❌ Non, un code = un compte unique

**Q : Peut-on changer de mot de passe ?**  
R : ⚠️ Pas encore implémenté (à venir)

**Q : Que se passe-t-il si j'oublie mon mot de passe ?**  
R : ⚠️ Récupération pas encore implémentée (à venir)

**Q : Puis-je avoir plusieurs comptes ?**  
R : ✅ Oui, avec des emails différents

**Q : Le QR code est-il unique par boutique ?**  
R : ❌ Non, c'est le MÊME QR code pour toutes les boutiques

**Q : Les points sont-ils partagés entre boutiques ?**  
R : ❌ Non, chaque boutique a son propre compteur de points

---

## 📊 **RÉCAPITULATIF**

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Inscription client | ✅ | Email + mot de passe + code activation |
| Connexion client | ✅ | Email + mot de passe |
| Déconnexion | ✅ | Bouton logout sur carte |
| Multi-appareils | ✅ | Connexion depuis n'importe où |
| QR code unique | ✅ | Même QR pour toutes boutiques |
| Sélecteur boutique | ✅ | Changement dynamique |
| Historique | ✅ | 10 dernières transactions |
| Récup. mot de passe | ❌ | À implémenter |
| Changement mot de passe | ❌ | À implémenter |

---

**Version** : AvanPass 1.4.0  
**Date** : 15 décembre 2024  
**Statut** : ✅ Système de connexion client complet et fonctionnel
