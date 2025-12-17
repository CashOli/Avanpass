# 🎯 Guide d'Implémentation : 3 Types de Programmes de Fidélité

**Version** : AvanPass v2.1.0  
**Date** : 16 décembre 2024

---

## 📋 VUE D'ENSEMBLE

Le commerçant peut maintenant choisir parmi **3 types de programmes** :

### **1️⃣ POINTS** (Actuel - Par visites)
- Client gagne 1 point par visite
- 10 points = Récompense
- **Parfait pour** : Cafés, restaurants, salons

### **2️⃣ TAMPONS** (Nouveau - Carte visuelle)
- Carte avec 8 cases à remplir
- 8ème case = Récompense automatique
- **Parfait pour** : Fast-food, snacks, boulangeries

### **3️⃣ MONTANT** (Nouveau - Par euros dépensés) ⭐
- Client accumule les euros dépensés
- Paliers configurables : 20€ → Café, 50€ → Dessert, 100€ → Menu
- **Parfait pour** : Restaurants, boutiques, commerces avec montants variables

---

## 🗂️ MODIFICATIONS BASE DE DONNÉES

### **Table `boutiques`** (Nouvelles colonnes)

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| `type_programme` | VARCHAR(20) | Type de programme | `'points'`, `'tampons'`, `'montant'` |
| `tampons_nombre` | INT | Nombre de cases (si tampons) | `8` |
| `paliers_montant` | JSONB | Paliers de récompenses (si montant) | `[{"seuil": 20, "recompense": "Café"}]` |

### **Table `transactions`** (Nouvelle colonne)

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| `montant_euros` | DECIMAL(10,2) | Montant de la transaction | `15.50` |

---

## 🎨 EXEMPLES D'AFFICHAGE

### **Type POINTS** (Actuel)
```
╔═══════════════════════════╗
║   CARTE DE FIDÉLITÉ       ║
╠═══════════════════════════╣
║  Jean DUPONT              ║
║                           ║
║  7 / 10 POINTS            ║
║  ████████████████░░░░ 70% ║
║                           ║
║  Encore 3 visites         ║
║  Récompense : 1 café      ║
╚═══════════════════════════╝
```

### **Type TAMPONS** (Nouveau)
```
╔═══════════════════════════╗
║   CARTE DE FIDÉLITÉ       ║
╠═══════════════════════════╣
║  Jean DUPONT              ║
║                           ║
║  ┏━━━┳━━━┳━━━┳━━━┓        ║
║  ┃ ✓ ┃ ✓ ┃ ✓ ┃ ✓ ┃        ║
║  ┣━━━╋━━━╋━━━╋━━━┫        ║
║  ┃ ✓ ┃ ✓ ┃ ✓ ┃ 🎁┃        ║
║  ┗━━━┻━━━┻━━━┻━━━┛        ║
║                           ║
║  🔥 PLUS QU'UN TAMPON !   ║
║  Récompense : Menu offert ║
╚═══════════════════════════╝
```

### **Type MONTANT** (Nouveau) ⭐
```
╔═══════════════════════════════╗
║   CARTE DE FIDÉLITÉ           ║
╠═══════════════════════════════╣
║  Jean DUPONT                  ║
║                               ║
║  💰 Total dépensé : 35€       ║
║                               ║
║  ┌─────────────────────────┐  ║
║  │ ✅ 20€ → Café offert    │  ║
║  │    Disponible ! 🎁      │  ║
║  └─────────────────────────┘  ║
║  ┌─────────────────────────┐  ║
║  │ 🔒 50€ → Dessert        │  ║
║  │    Plus que 15€ !       │  ║
║  └─────────────────────────┘  ║
║  ┌─────────────────────────┐  ║
║  │ 🔒 100€ → Menu offert   │  ║
║  │    Plus que 65€         │  ║
║  └─────────────────────────┘  ║
╚═══════════════════════════════╝
```

---

## 🛠️ WORKFLOW COMMERÇANT

### **Lors de l'inscription** :

```
┌─────────────────────────────────────────┐
│  Choisissez votre programme             │
├─────────────────────────────────────────┤
│                                         │
│  ○ 🎯 Points (par visites)              │
│     Simple : 1 visite = 1 point         │
│                                         │
│  ○ 🎫 Tampons (carte visuelle)          │
│     Ludique : Carte à remplir           │
│                                         │
│  ○ 💰 Montant (par euros dépensés) ⭐   │
│     Flexible : Récompenses par paliers  │
│                                         │
│  [Suivant]                              │
└─────────────────────────────────────────┘
```

### **Si choix "POINTS"** :
```
┌─────────────────────────────────────────┐
│  Configuration : Points                 │
├─────────────────────────────────────────┤
│  Points par visite : [1] ▼              │
│  Points pour récompense : [10] ▼        │
│  Récompense : [____________]            │
│                                         │
│  Exemple : 1 café offert                │
│                                         │
│  [Enregistrer]                          │
└─────────────────────────────────────────┘
```

### **Si choix "TAMPONS"** :
```
┌─────────────────────────────────────────┐
│  Configuration : Tampons                │
├─────────────────────────────────────────┤
│  Nombre de cases : [8] ▼                │
│  (6, 8, 10, 12)                         │
│                                         │
│  Récompense : [____________]            │
│  Exemple : Menu offert                  │
│                                         │
│  Aperçu :                               │
│  ┏━━━┳━━━┳━━━┳━━━┓                      │
│  ┃ 1 ┃ 2 ┃ 3 ┃ 4 ┃                      │
│  ┣━━━╋━━━╋━━━╋━━━┫                      │
│  ┃ 5 ┃ 6 ┃ 7 ┃ 🎁┃                      │
│  ┗━━━┻━━━┻━━━┻━━━┛                      │
│                                         │
│  [Enregistrer]                          │
└─────────────────────────────────────────┘
```

### **Si choix "MONTANT"** ⭐ :
```
┌─────────────────────────────────────────┐
│  Configuration : Paliers par montant    │
├─────────────────────────────────────────┤
│                                         │
│  Palier 1 :                             │
│  Montant : [20] € → [Café offert]       │
│                                         │
│  Palier 2 :                             │
│  Montant : [50] € → [Dessert offert]    │
│                                         │
│  Palier 3 :                             │
│  Montant : [100] € → [Menu offert]      │
│                                         │
│  [+ Ajouter un palier]                  │
│                                         │
│  [Enregistrer]                          │
└─────────────────────────────────────────┘
```

---

## 🔄 WORKFLOW VALIDATION (Commerçant)

### **Type POINTS ou TAMPONS** (Pas de changement)
1. Scanner QR client
2. Cliquer "Valider 1 passage"
3. ✅ Transaction créée avec `valeur_points: 1`

### **Type MONTANT** (Nouveau workflow) ⭐
```
┌─────────────────────────────────────────┐
│  📱 Scanner QR Code                     │
├─────────────────────────────────────────┤
│  Jean DUPONT                            │
│  Total dépensé : 35€                    │
│                                         │
│  Prochaine récompense :                 │
│  50€ → Dessert offert (Plus que 15€)    │
├─────────────────────────────────────────┤
│                                         │
│  Montant de l'achat :                   │
│  [_____] €                              │
│                                         │
│  [Valider l'achat]                      │
│                                         │
└─────────────────────────────────────────┘
```

1. Scanner QR client
2. **Saisir le montant** : `12.50 €`
3. Cliquer "Valider l'achat"
4. ✅ Transaction créée avec `montant_euros: 12.50`
5. Système calcule automatiquement si une récompense est débloquée

---

## 💾 STRUCTURE DES DONNÉES

### **Boutique mode POINTS** :
```json
{
  "type_programme": "points",
  "recompense_seuil_points": 10,
  "recompense_libelle": "1 café offert"
}
```

### **Boutique mode TAMPONS** :
```json
{
  "type_programme": "tampons",
  "tampons_nombre": 8,
  "recompense_libelle": "Menu offert"
}
```

### **Boutique mode MONTANT** ⭐ :
```json
{
  "type_programme": "montant",
  "paliers_montant": [
    {"seuil": 20, "recompense": "Café offert"},
    {"seuil": 50, "recompense": "Dessert offert"},
    {"seuil": 100, "recompense": "Menu complet offert"},
    {"seuil": 200, "recompense": "20€ de réduction"}
  ]
}
```

### **Transaction mode POINTS/TAMPONS** :
```json
{
  "client_id": "650e8400-...",
  "boutique_id": "550e8400-...",
  "type": "passage_valide",
  "valeur_points": 1,
  "montant_euros": 0,
  "date_heure": "2024-12-16T12:30:00Z"
}
```

### **Transaction mode MONTANT** ⭐ :
```json
{
  "client_id": "650e8400-...",
  "boutique_id": "550e8400-...",
  "type": "passage_valide",
  "valeur_points": null,
  "montant_euros": 12.50,
  "date_heure": "2024-12-16T12:30:00Z"
}
```

---

## 🧮 CALCUL DES RÉCOMPENSES

### **Mode POINTS** :
```javascript
const totalPoints = transactions
    .filter(t => t.type === 'passage_valide')
    .reduce((sum, t) => sum + t.valeur_points, 0);

const recompensesDisponibles = Math.floor(totalPoints / seuil);
```

### **Mode TAMPONS** :
```javascript
// Identique au mode POINTS (affichage différent)
const tamponsRemplis = transactions
    .filter(t => t.type === 'passage_valide')
    .length;

const carteComplete = tamponsRemplis >= tamponsNombre;
```

### **Mode MONTANT** ⭐ :
```javascript
const totalDepense = transactions
    .filter(t => t.type === 'passage_valide')
    .reduce((sum, t) => sum + t.montant_euros, 0);

const recompensesDisponibles = paliers
    .filter(p => totalDepense >= p.seuil)
    .map(p => ({
        seuil: p.seuil,
        recompense: p.recompense,
        disponible: true,
        utilisee: transactions.some(t => 
            t.type === 'recompense_utilisee' && 
            t.commentaire.includes(p.recompense)
        )
    }));
```

---

## 📊 COMPARAISON DES 3 SYSTÈMES

| Aspect | Points 🎯 | Tampons 🎫 | Montant 💰 |
|--------|-----------|------------|------------|
| **Saisie commerçant** | 1 clic | 1 clic | Saisir montant |
| **Visuel client** | Barre progression | Cases à remplir | Liste paliers |
| **Motivation** | Moyenne | Forte (proximité) | Forte (valeur) |
| **Flexibilité** | Faible | Faible | **Très forte** ⭐ |
| **Type commerce** | Tous | Fast-food/Snack | Restaurant/Boutique |
| **Valorisation achat** | Non | Non | **Oui** ⭐ |
| **Complexité** | Simple | Simple | Moyenne |

---

## 🎯 AVANTAGES DU SYSTÈME MONTANT

### **Pour le commerçant** :
- ✅ Valorise les gros acheteurs
- ✅ Encourage à dépenser plus
- ✅ Statistiques précises (CA par client)
- ✅ Flexibilité totale (paliers personnalisables)
- ✅ Peut créer des paliers VIP (200€, 500€)

### **Pour le client** :
- ✅ Sentiment de récompense juste (proportionnel à la dépense)
- ✅ Plusieurs objectifs visibles
- ✅ Progression rapide si gros achats
- ✅ Transparence totale

### **Exemples d'utilisation** :

**Restaurant** :
- 20€ → Café offert
- 50€ → Dessert offert
- 100€ → Entrée offerte
- 200€ → Menu complet

**Boutique de vêtements** :
- 50€ → 5€ de réduction
- 100€ → 10€ de réduction
- 250€ → 30€ de réduction
- 500€ → 100€ de réduction

**Salon de coiffure** :
- 100€ → Shampoing offert
- 200€ → Coupe offerte
- 400€ → Couleur offerte

**Épicerie/Supérette** :
- 30€ → 3€ de crédit
- 60€ → 6€ de crédit
- 100€ → 10€ de crédit

---

## 🚀 ÉTAPES D'IMPLÉMENTATION

### **Étape 1 : Base de données** ✅
1. Exécuter `SQL_3_PROGRAMMES_FIDELITE.sql` dans Supabase SQL Editor
2. Vérifier les colonnes créées
3. Tester les fonctions SQL

### **Étape 2 : Backend (API)**
1. Modifier `js/api.js` pour supporter les nouveaux champs
2. Ajouter méthodes pour calcul des paliers de montant

### **Étape 3 : Interface Client**
1. Modifier `js/client.js` pour afficher les 3 types de cartes
2. Créer composants visuels (tampons, paliers)

### **Étape 4 : Interface Commerçant**
1. Modifier `js/commercant.js` pour saisir le montant (si mode montant)
2. Créer interface de configuration des programmes

### **Étape 5 : Tests**
1. Tester les 3 types de programmes
2. Vérifier les calculs
3. Tester sur mobile

### **Étape 6 : Documentation**
1. Mettre à jour README.md
2. Mettre à jour CHANGELOG.md (v2.1.0)

---

## 📝 TEMPS ESTIMÉ

- **Étape 1** (SQL) : ✅ Fait (30 min)
- **Étape 2** (API) : 2 heures
- **Étape 3** (Client) : 3 heures
- **Étape 4** (Commerçant) : 4 heures
- **Étape 5** (Tests) : 2 heures
- **Étape 6** (Doc) : 1 heure

**TOTAL** : ~12 heures (1.5 jour de développement)

---

## 🎁 BONUS : IDÉES D'ÉVOLUTION

1. **Cashback automatique** : 5% du montant → Crédit utilisable
2. **Double points** : Certains produits valent 2x plus
3. **Happy Hour** : Double montant entre 14h-16h
4. **Paliers progressifs** : Plus on monte, plus les % augmentent
5. **Bonus anniversaire** : 10€ offerts le jour J

---

## ✅ PROCHAINES ÉTAPES

1. **Exécuter le script SQL** dans Supabase
2. **Valider l'approche** : Les 3 systèmes vous conviennent ?
3. **Commencer le développement** : Dans quel ordre ?

**Je suis prêt à implémenter !** 🚀

Dites-moi si vous voulez que je commence ! 💪
