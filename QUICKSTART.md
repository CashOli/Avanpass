# 🚀 Guide de Démarrage Rapide - AvanPass

## 🎯 Objectif
Tester l'application AvanPass en 5 minutes avec des données de démonstration.

---

## ✅ Étapes de Configuration

### 1️⃣ Connexion Administrateur

**Identifiants par défaut** :
- **Email** : `admin@avanpass.com`
- **Mot de passe** : `admin123`

1. Ouvrez l'application
2. Cliquez sur **"Administrateur"**
3. Connectez-vous avec les identifiants ci-dessus

---

### 2️⃣ Générer des Codes d'Activation

1. Dans le dashboard admin, cliquez sur **"Codes d'activation"**
2. Cliquez sur **"Générer des codes"**
3. Entrez `10` codes
4. Notez un code (ex: `ABCD-EFGH-IJKL`)

---

### 3️⃣ Créer une Boutique de Test

1. Retournez à l'accueil (bouton retour ou cliquez sur "AvanPass")
2. Cliquez sur **"Commerçant"**
3. Cliquez sur **"Créer mon compte boutique"**

**Remplissez le formulaire** :
- Nom boutique : `Café du Coin`
- Adresse : `123 Rue de la Paix`
- Ville : `Paris`
- Responsable : `Marie Dupont`
- Téléphone : `01 23 45 67 89`
- Email : `cafe@ducomn.fr`
- Mot de passe : `cafe123`
- Seuil : `10` passages
- Récompense : `1 café offert`

4. Cliquez sur **"Créer mon compte"**
5. Un message confirme : "Compte en attente de validation"

---

### 4️⃣ Valider la Boutique (Admin)

1. Retournez à l'accueil
2. Connectez-vous en **"Administrateur"**
3. Cliquez sur **"Gérer les boutiques"**
4. Trouvez "Café du Coin" avec statut "En attente"
5. Cliquez sur **"Valider"**
6. Confirmez

✅ La boutique est maintenant active !

---

### 5️⃣ Activer une Carte Client

1. Retournez à l'accueil
2. Cliquez sur **"Client"**
3. Entrez le code d'activation noté à l'étape 2
4. Cliquez sur **"Activer ma carte"**

🎉 **Votre carte virtuelle s'affiche !**

Vous verrez :
- Le QR code unique
- Le compteur de points : `0 / 10`
- La progression visuelle
- La récompense à atteindre

---

### 6️⃣ Scanner et Valider un Passage (Commerçant)

1. **Ouvrez l'app dans 2 onglets** (ou 2 appareils) :
   - Onglet 1 : Carte client (QR code visible)
   - Onglet 2 : Espace commerçant

2. **Dans l'onglet commerçant** :
   - Cliquez sur **"Commerçant"**
   - Connectez-vous :
     - Email : `cafe@ducoin.fr`
     - Mot de passe : `cafe123`
   - Cliquez sur **"Scanner une carte client"**

3. **Options de test** :

   **Option A - Avec 2 appareils (recommandé)** :
   - Smartphone 1 : Afficher la carte client
   - Smartphone 2 : Scanner avec la caméra
   - Validez le passage

   **Option B - Sans scanner (test rapide)** :
   - Dans la console du navigateur (F12), récupérez le `qr_token_client`
   - Modifiez temporairement le code pour simuler un scan
   - Ou créez manuellement une transaction via l'API

---

### 7️⃣ Vérifier les Résultats

**Côté Client** :
1. Rafraîchissez la page client
2. Le compteur affiche : `1 / 10`
3. La barre de progression avance
4. L'historique montre : "+1 point"

**Côté Commerçant** :
1. Dashboard mis à jour
2. Statistiques : "1 passage validé"
3. Transactions affichent la validation

**Côté Admin** :
1. Dashboard global mis à jour
2. "1 transaction aujourd'hui"
3. Journal des transactions complet

---

## 🎨 Tester la Récompense

Pour tester rapidement la récompense sans faire 10 passages :

### Méthode 1 : Via Admin (Correction)

1. Connectez-vous en **Admin**
2. Allez dans **"Voir les transactions"**
3. Cliquez sur **"Ajouter une correction"**
4. Entrez :
   - Motif : `Test récompense`
   - Points : `9`
   - Client ID : (récupérer depuis la table clients)
   - Boutique ID : (récupérer depuis la table boutiques)
5. Confirmez

Le client a maintenant 10 points !

### Méthode 2 : Via Console (Développeur)

```javascript
// Dans la console du navigateur (F12)
const transaction = {
    id: Utils.generateUUID(),
    date_heure: new Date().toISOString(),
    boutique_id: 'ID_BOUTIQUE',
    client_id: 'ID_CLIENT',
    type: 'passage_valide',
    valeur_points: 9,
    commentaire: 'Test',
    operateur: 'admin'
};
await API.create('transactions', transaction);
```

### Vérification

1. Retournez sur la carte client
2. Le compteur affiche : `10 / 10`
3. Badge **"Récompense disponible !"** apparaît
4. Bouton pour utiliser la récompense

### Utiliser la Récompense

1. Le commerçant scanne à nouveau
2. Cette fois, deux boutons :
   - **"Valider la récompense"** (-10 points)
   - **"Valider 1 passage"** (+1 point)
3. Cliquez sur "Valider la récompense"
4. Les points reviennent à 0
5. Le client peut recommencer !

---

## 📱 Tester en PWA

### Installation Mobile

1. **Android** :
   - Menu ⋮ → "Ajouter à l'écran d'accueil"
   - Lancez l'icône AvanPass

2. **iOS** :
   - Bouton Partager 📤
   - "Sur l'écran d'accueil"
   - Confirmez

3. **Desktop** :
   - Icône ⊕ dans la barre d'adresse
   - "Installer AvanPass"

---

## 🔍 Fonctionnalités à Tester

### Client
- [x] Activation de carte
- [x] Affichage QR code
- [x] Compteur de points
- [x] Badge récompense
- [x] Historique
- [x] Multi-boutiques
- [x] Déconnexion

### Commerçant
- [x] Création compte
- [x] Connexion
- [x] Dashboard stats
- [x] Scanner QR
- [x] Validation passage
- [x] Validation récompense
- [x] Paramètres fidélité
- [x] Historique boutique

### Admin
- [x] Dashboard global
- [x] Gestion clients
- [x] Gestion boutiques
- [x] Validation boutique
- [x] Suspension client/boutique
- [x] Génération codes
- [x] Corrections manuelles
- [x] Export CSV
- [x] Journal transactions

---

## 🎯 Scénarios de Test Complets

### Scénario 1 : Parcours Client Standard
1. Activation carte avec code
2. Visite 1 : +1 point (9 restants)
3. Visite 2-9 : +1 point à chaque fois
4. Visite 10 : Badge récompense !
5. Utilisation récompense : retour à 0

### Scénario 2 : Gestion Multi-Boutiques
1. Créer 2 boutiques (Café + Boulangerie)
2. Valider les deux (admin)
3. Client visite les deux
4. Points séparés par boutique
5. Récompenses indépendantes

### Scénario 3 : Gestion des Incidents
1. Client perd sa carte physique
2. Admin suspend la carte
3. QR code marqué "NON VALIDE"
4. Scan refusé
5. Nouvelle carte activée
6. Points récupérés (si souhaité via correction)

---

## 🐛 Problèmes Courants & Solutions

### Le scanner ne détecte pas le QR code
**Solution** :
- Bon éclairage
- Distance correcte (10-30 cm)
- QR code bien visible
- Permissions caméra accordées

### Les données ne s'affichent pas
**Solution** :
- Rafraîchir la page (F5)
- Vider le cache (Ctrl+Shift+R)
- Vérifier la console (F12)

### La boutique reste "en attente"
**Solution** :
- Connectez-vous en admin
- Validez manuellement la boutique

---

## 📊 Générer des Données de Test

Pour tester avec plus de volume :

### Générer 50 codes d'activation
1. Admin → Codes d'activation
2. Générer → `50`

### Créer 5 boutiques
1. Répétez la création avec :
   - Café du Coin
   - Boulangerie Martin
   - Pressing Express
   - Salon de Coiffure Élégance
   - Restaurant Le Gourmet

### Activer 20 clients
1. Utilisez les 50 codes
2. Activez 20 cartes différentes

### Générer des transactions
1. Via corrections admin
2. Ou via console développeur
3. Variété : passages + récompenses

---

## 🎓 Aller Plus Loin

### Personnalisation
- Modifiez les couleurs dans `css/styles.css`
- Changez le logo dans `images/logo.svg`
- Ajustez les seuils par boutique

### Export des Données
1. Admin → Exporter les données
2. 3 fichiers CSV téléchargés :
   - Clients
   - Boutiques
   - Transactions
3. Analysez dans Excel/Google Sheets

### Déploiement
- Suivez les instructions du README.md
- Section "Déploiement"
- Netlify, Vercel ou GitHub Pages

---

## ✅ Checklist de Test Complet

- [ ] Installation PWA
- [ ] Génération codes
- [ ] Création boutique
- [ ] Validation boutique (admin)
- [ ] Activation carte client
- [ ] Scanner QR (passage)
- [ ] Atteindre récompense
- [ ] Utiliser récompense
- [ ] Suspension client
- [ ] Suspension boutique
- [ ] Correction admin
- [ ] Export CSV
- [ ] Test multi-boutiques
- [ ] Test offline (PWA)
- [ ] Test différents navigateurs

---

## 🎉 Félicitations !

Vous maîtrisez maintenant AvanPass ! 🚀

Pour toute question, consultez le **README.md** complet.

---

<div align="center">

**Bon test ! 🎴**

AvanPass - Digitalisons la fidélité locale

</div>
