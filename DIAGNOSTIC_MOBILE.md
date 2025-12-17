# 📱 Diagnostic d'Erreur sur Mobile

**Date** : 15 décembre 2024  
**Version** : AvanPass 1.3.1  
**Problème** : Erreur de validation impossible à diagnostiquer via console mobile

---

## 🎯 Solution Implémentée

### ❌ Avant
```javascript
catch (error) {
    console.error('Erreur:', error);  // Invisible sur mobile
    Utils.showMessage('validation-message', 'Erreur générique', 'error');
}
```

### ✅ Après
```javascript
catch (error) {
    // Affichage détaillé dans une alert mobile
    let errorDetails = '🔍 DIAGNOSTIC ERREUR:\n\n';
    errorDetails += `Message: ${error.message}\n\n`;
    errorDetails += `Transaction tentée:\n`;
    errorDetails += `- Client ID: ${this.scannedClient.id}\n`;
    errorDetails += `- Boutique ID: ${this.currentBoutique.id}\n`;
    errorDetails += `- Type: passage_valide\n`;
    // ... etc
    
    alert(errorDetails);  // ✅ Visible sur mobile
}
```

---

## 📋 Informations Affichées

Lorsqu'une erreur se produit, **une popup s'affiche** avec :

### 1️⃣ Message d'Erreur
```
Message: [Texte exact de l'erreur API]
```

### 2️⃣ Données de la Transaction
```
Transaction tentée:
- Client ID: abc-123-def
- Client: Jean Dupont
- Boutique ID: xyz-456-uvw
- Boutique: Café du Coin
- Type: passage_valide
- Points: +1
```

### 3️⃣ Diagnostic Automatique
```
⚠️ Code 400: Données invalides
Cause possible: Un champ requis manque dans la transaction

⚠️ Code 404: Table non trouvée
Cause possible: La table "transactions" n'existe pas

⚠️ Code 500: Erreur serveur
```

---

## 🧪 Test à Effectuer

### **Étapes**
1. **Rafraîchir** l'app commerçant (Ctrl + Shift + R ou videz cache)
2. Se connecter : `cafe@ducoin.fr` / `demo123`
3. **Scanner** une carte client
4. Cliquer sur **"Valider 1 passage"**
5. Si erreur → **Une popup s'affiche** avec les détails complets

### **Ce Que Vous Devez Voir**
```
🔍 DIAGNOSTIC ERREUR:

Message: [Le message exact de l'API]

Transaction tentée:
- Client ID: [UUID du client]
- Client: [Prénom Nom]
- Boutique ID: [UUID boutique]
- Boutique: [Nom boutique]
- Type: passage_valide
- Points: +1

⚠️ [Diagnostic automatique basé sur le code HTTP]
```

---

## 🔍 Causes Possibles d'Erreur

| **Code** | **Signification** | **Solution** |
|----------|-------------------|--------------|
| **400** | Données invalides | Champ requis manquant dans la transaction |
| **404** | Table non trouvée | La table `transactions` n'existe pas dans la BDD |
| **500** | Erreur serveur | Problème côté API/serveur |
| **Autre** | Erreur inconnue | Voir le message exact dans la popup |

---

## 📂 Fichiers Modifiés

- **`js/commercant.js`** (lignes 613-640)
  - Ajout du diagnostic détaillé dans le `catch`
  - Affichage d'une `alert()` avec toutes les infos
  - Identification automatique du type d'erreur (400/404/500)

---

## 🚀 Prochaine Étape

**Une fois l'erreur affichée**, envoyez-moi :
1. Le **message exact** affiché dans la popup
2. Le **code HTTP** identifié (400/404/500)
3. Les **IDs** (Client ID, Boutique ID)

Je pourrai alors corriger l'erreur précisément ! 🎯

---

**Version** : 1.3.1  
**Statut** : ✅ Prêt à tester
