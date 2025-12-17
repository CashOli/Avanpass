# 🗄️ Configuration Supabase - AvanPass

## 📋 Informations du Projet

```
Nom du projet     : AvanPass
Organization      : AvanPAss (Free)
Region            : Northeast US (North Virginia)
Date de création  : 16 décembre 2024
```

---

## 🔑 Clés API

### **Project URL**
```
https://ckzicazdmqjytxtitumy.supabase.co
```

### **anon public key** (utilisée dans le code JavaScript)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremljYXpkbXFqeXR4dGl0dW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzI1MDUsImV4cCI6MjA4MTQwODUwNX0.BIuiBhRNDWkwBqV2hxGaDUACfkhszT4jD1qPnw8Yp7Y
```

### ⚠️ **service_role key** (SECRÈTE - NE JAMAIS partager)
```
À garder dans Supabase uniquement
Ne JAMAIS utiliser côté client
```

---

## 📊 Structure de la Base de Données

### **Tables créées**

1. **clients** (Utilisateurs de l'application)
   - `id` (UUID, PK)
   - `prenom`, `nom`, `email` (UNIQUE), `telephone`
   - `password_hash` (SHA-256)
   - `statut_carte` (inactive, active, suspendue, expiree)
   - `date_activation`, `date_expiration` (+12 mois)
   - `qr_token_client` (UNIQUE)
   - `created_at`, `updated_at`

2. **boutiques** (Commerçants partenaires)
   - `id` (UUID, PK)
   - `nom_boutique`, `adresse`, `ville`, `responsable`, `telephone`
   - `login_commercant` (UNIQUE), `password_hash`
   - `statut_boutique` (en_attente, active, suspendue, inactive)
   - `recompense_seuil_points` (défaut: 10)
   - `recompense_libelle` (défaut: "Récompense offerte")
   - `created_at`, `updated_at`

3. **transactions** (Historique des passages et récompenses)
   - `id` (UUID, PK)
   - `date_heure` (TIMESTAMPTZ)
   - `boutique_id` (FK → boutiques)
   - `client_id` (FK → clients)
   - `type` (passage_valide, recompense_utilisee)
   - `valeur_points` (INTEGER)
   - `commentaire`, `operateur`
   - `created_at`

4. **codes_activation** (Codes pour activer les cartes clients)
   - `id` (UUID, PK)
   - `code_activation` (UNIQUE)
   - `statut` (disponible, utilise)
   - `client_id` (FK → clients, nullable)
   - `date_utilisation`
   - `created_at`

---

## 🔒 Politiques de Sécurité (RLS)

### **Row Level Security activé sur toutes les tables**

Actuellement, les politiques sont **permissives** (pour simplifier le développement) :
- ✅ **SELECT** : Tout le monde peut lire
- ✅ **INSERT** : Tout le monde peut créer
- ✅ **UPDATE** : Tout le monde peut modifier

### ⚠️ À améliorer pour la production :
```sql
-- Exemple : Limiter l'accès aux données d'un client
CREATE POLICY "Clients can only see their own data" 
ON clients FOR SELECT 
USING (auth.uid() = id);
```

---

## 🚀 Endpoints API (via js/api.js)

### **Format des requêtes**
```javascript
// Supabase REST API v1
https://ckzicazdmqjytxtitumy.supabase.co/rest/v1/{table}

Headers:
- apikey: [anon public key]
- Authorization: Bearer [anon public key]
- Content-Type: application/json
- Prefer: return=representation
```

### **Exemples d'utilisation**

```javascript
// Lister les clients
const clients = await API.list('clients', { limit: 10, page: 1 });

// Créer une transaction
const transaction = await API.create('transactions', {
  client_id: 'xxx',
  boutique_id: 'yyy',
  type: 'passage_valide',
  valeur_points: 1
});

// Trouver un client par QR
const client = await API.findClientByQR('QR-CLIENT-JEAN-001');

// Calculer les points d'un client
const points = await API.calculatePoints(clientId, boutiqueId);
```

---

## 📦 Données de Test

### **1 Boutique**
```
Nom        : Snack boutique
Ville      : Pointe-à-Pitre
Login      : cafe@ducoin.fr
Mot de passe : demo123
Statut     : active
Seuil      : 10 points
Récompense : 1 burger Offert
```

### **5 Clients** (tous avec mot de passe : `demo123`)
```
1. jean.dupont@test.fr     - Jean Dupont
2. marie.martin@test.fr    - Marie Martin
3. pierre.bernard@test.fr  - Pierre Bernard
4. sophie.dubois@test.fr   - Sophie Dubois
5. gustos.olivier@test.fr  - Gustos Olivier
```

### **5 Codes d'activation disponibles**
```
AVANPASS-2024-001
AVANPASS-2024-002
AVANPASS-2024-003
AVANPASS-2024-004
AVANPASS-2024-005
```

---

## 🔧 Accès au Dashboard Supabase

### **URL du projet**
```
https://supabase.com/dashboard/project/ckzicazdmqjytxtitumy
```

### **Fonctionnalités disponibles**
- 📊 **Table Editor** : Voir/modifier les données
- 📝 **SQL Editor** : Exécuter des requêtes SQL
- 🔑 **Authentication** : Gérer les utilisateurs
- 📈 **Logs** : Voir les requêtes API
- ⚙️ **Settings** : Configuration du projet

---

## 🆚 Différences avec l'ancienne API (Genspark)

| Aspect | Genspark (avant) | Supabase (maintenant) |
|--------|------------------|----------------------|
| **Écriture** | ❌ READ-ONLY (403) | ✅ READ + WRITE |
| **URL de base** | `tables/{table}` | `https://xxx.supabase.co/rest/v1/{table}` |
| **Authentification** | Aucune | Headers `apikey` + `Authorization` |
| **Format réponse** | `{data: [], total, page, limit}` | `[{...}, {...}]` (array direct) |
| **Pagination** | `?page=1&limit=100` | `?limit=100&offset=0` |
| **Filtres** | `?search=...` | `?nom=eq.Jean` ou `?nom.ilike.*jean*` |
| **Tri** | `?sort=created_at` | `?order=created_at.desc` |
| **Mise à jour** | `PUT` ou `PATCH` | `PATCH` uniquement |

---

## 🐛 Debugging

### **Logs dans la console**
```javascript
// js/api.js affiche automatiquement :
✅ API Supabase initialisée: https://...
📝 Création dans transactions: {...}
✅ Création réussie: {...}
❌ Erreur API create: 400 - {...}
```

### **Vérifier les requêtes réseau**
1. Ouvrir F12 (DevTools)
2. Onglet **Network**
3. Filtrer par `supabase.co`
4. Voir les requêtes POST/GET/PATCH

### **Tester directement dans Supabase**
1. Aller dans **Table Editor**
2. Cliquer sur une table
3. Modifier/ajouter des données
4. Vérifier dans l'app

---

## ✅ Migration Réussie

**Version AvanPass : 2.0.0**
- ✅ 4 tables créées
- ✅ 5 clients de test
- ✅ 1 boutique de test
- ✅ 5 codes d'activation
- ✅ `js/api.js` migré vers Supabase
- ✅ Résolution du problème 403 (écriture autorisée)

---

## 📞 Support Supabase

- 📖 Documentation : https://supabase.com/docs
- 💬 Discord : https://discord.supabase.com
- 🐛 GitHub : https://github.com/supabase/supabase

---

**Date de migration** : 16 décembre 2024  
**Région** : Northeast US (optimisé pour la Guadeloupe 🇬🇵)
