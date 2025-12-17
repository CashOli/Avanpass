# 🎴 AvanPass - Carte Virtuelle de Fidélité

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**AvanPass** est une application web progressive (PWA) de carte de fidélité digitale, conçue pour digitaliser la relation entre commerces et clients avec un système simple et efficace.

## 🎯 Concept

**Principe unique** : 1 passage validé = 1 point | X points = 1 récompense

### Fonctionnement
- Le client présente un QR code (carte digitale ou physique)
- Le commerçant scanne et valide le passage
- La plateforme garde un historique complet
- L'administrateur supervise l'ensemble du système

---

## ✨ Fonctionnalités Complètes

### 👤 Espace Client
- ✅ **Activation de carte** avec code unique
- ✅ **Carte virtuelle premium V2** (design Apple Wallet/PassKit)
  - 🖼️ **Bannière d'image** personnalisée par type de commerce
  - 🎨 **Contour élégant** avec effet de profondeur 3D
  - ✨ **Animations fluides** et effets au survol
- ✅ **QR code dynamique** pour chaque boutique partenaire
- ✅ **Compteur de points** en temps réel avec progression visuelle
- ✅ **Badges de récompense** lorsque le seuil est atteint
- ✅ **Historique des transactions** détaillé
- ✅ **Multi-boutiques** : une carte pour tous les partenaires

### 🏪 Espace Commerçant
- ✅ **Inscription autonome** avec validation admin
- ✅ **Scanner QR intégré** (caméra native du smartphone)
- ✅ **Validation de passage** (+1 point)
- ✅ **Validation de récompense** (déduction automatique)
- ✅ **Dashboard statistiques** : passages, récompenses, transactions
- ✅ **Paramétrage fidélité** : seuil et libellé personnalisables
- ✅ **Historique transactions** de la boutique
- ✅ **Statut carte client** en temps réel lors du scan

### 👨‍💼 Espace Administrateur
- ✅ **Dashboard global** avec statistiques
- ✅ **Gestion clients** : activation/suspension
- ✅ **Gestion boutiques** : validation/suspension
- ✅ **Gestion codes d'activation** : génération et suivi
- ✅ **Journal des transactions** complet et non modifiable
- ✅ **Corrections manuelles** avec motif obligatoire
- ✅ **Export CSV** : clients, boutiques, transactions
- ✅ **Alertes** : boutiques en attente de validation

---

## 🗄️ Structure des Données

### Table `clients`
```
- id (UUID)
- prenom, nom, email, telephone (optionnels)
- statut_carte: inactive | active | suspendue | expiree
- date_activation, date_expiration
- qr_token_client (unique, sécurisé)
- created_at, updated_at
```

### Table `boutiques`
```
- id (UUID)
- nom_boutique, adresse, ville, responsable, telephone
- statut_boutique: en_attente | active | suspendue
- login_commercant (email)
- password_hash
- recompense_seuil_points (ex: 10)
- recompense_libelle (ex: "1 café offert")
- created_at, updated_at
```

### Table `transactions`
```
- id (UUID)
- date_heure
- boutique_id, client_id
- type: passage_valide | recompense_utilisee | correction_admin
- valeur_points (+1, -10, etc.)
- commentaire
- operateur (id du commerçant ou admin)
- created_at, updated_at
```

### Table `codes_activation`
```
- id (UUID)
- code_activation (unique, format: XXXX-XXXX-XXXX)
- statut: disponible | utilise | annule
- client_id (si utilisé)
- date_utilisation
- created_at, updated_at
```

---

## 🚀 Démarrage Rapide

### 1. Accéder à l'Application
Ouvrez simplement `index.html` dans votre navigateur ou déployez sur un serveur web.

### 2. Connexion Administrateur
**Compte par défaut** :
- Email : `admin@avanpass.com`
- Mot de passe : `admin123`

⚠️ **Important** : Changez ces identifiants en production !

### 3. Première Configuration

**Étape 1 : Générer des codes d'activation**
1. Connectez-vous en tant qu'admin
2. Allez dans "Codes d'activation"
3. Générez 10-20 codes
4. Notez quelques codes pour les tests

**Étape 2 : Créer une boutique**
1. Sur la page d'accueil, cliquez sur "Commerçant"
2. Cliquez sur "Créer mon compte boutique"
3. Remplissez le formulaire
4. Retournez en admin et validez la boutique

**Étape 3 : Activer une carte client**
1. Sur la page d'accueil, cliquez sur "Client"
2. Entrez un code d'activation
3. Votre carte virtuelle s'affiche !

**Étape 4 : Tester la validation**
1. Connectez-vous en tant que commerçant
2. Cliquez sur "Scanner une carte client"
3. Scannez le QR code de la carte client
4. Validez un passage

---

## 📱 Installation PWA

### Sur Android (Chrome, Edge, Firefox)
1. Ouvrez l'application dans votre navigateur
2. Menu ⋮ → "Ajouter à l'écran d'accueil"
3. L'icône AvanPass apparaît sur votre écran d'accueil
4. Lancez comme une application native !

### Sur iOS (Safari)
1. Ouvrez l'application dans Safari
2. Appuyez sur le bouton Partager 📤
3. "Sur l'écran d'accueil"
4. Confirmez
5. L'application est installée !

### Sur Desktop (Chrome, Edge)
1. Ouvrez l'application
2. Icône ⊕ dans la barre d'adresse
3. "Installer AvanPass"
4. L'application s'ouvre dans sa propre fenêtre

---

## 🎨 Design & UX

### Style Premium V2 ✨
- **Inspiration** : Apple Wallet / PassKit
- **Couleurs** : Dégradés modernes personnalisés par commerce
- **Typography** : Inter (police moderne et lisible)
- **Cartes Premium** :
  - 🖼️ Bannière d'image décorative (120px, Unsplash)
  - 🎨 Contour élégant multi-couches (6 couches visuelles)
  - ✨ Effet de profondeur 3D (relief + jeux de lumière)
  - 💎 Arrondis généreux (24px), ombres profondes
- **Animations** : Transitions fluides, effet flottant au survol

### Mobile-First
- Interface optimisée pour smartphones
- Boutons larges (touch-friendly)
- Navigation intuitive
- Scanner QR natif (pas d'upload de fichier)

### Accessibilité
- Contrastes élevés
- Icônes explicites
- Messages clairs et non techniques
- Statuts visuels (couleurs + texte)

---

## 🔐 Sécurité

### Limitations (Frontend Only)
⚠️ Cette application est **frontend uniquement**. Les limitations de sécurité incluent :

- ❌ Mots de passe hashés côté client (SHA-256)
- ❌ API publique (accessible sans authentification)
- ❌ Pas de rate limiting
- ❌ Pas de validation serveur

### Recommandations pour Production
Pour une utilisation en production avec données sensibles :

1. **Backend sécurisé** : Migrer vers Node.js/Express ou similaire
2. **Authentification JWT** : Tokens serveur sécurisés
3. **Base de données** : PostgreSQL ou MySQL avec chiffrement
4. **HTTPS obligatoire** : Certificat SSL/TLS
5. **Bcrypt** : Hash des mots de passe côté serveur
6. **Rate limiting** : Protection contre les abus
7. **CORS restrictif** : Limiter les origines autorisées

### Bon Usage Actuel
✅ Cette version est **parfaite pour** :
- Prototypes et MVP
- Démonstrations client
- Tests de concept
- Utilisation interne contrôlée
- Validation du modèle business

---

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Design moderne, animations
- **JavaScript** (Vanilla) : Logique applicative
- **PWA** : Service Worker, Manifest

### Bibliothèques
- **QRCode.js** : Génération de QR codes
- **html5-qrcode** : Scanner QR natif
- **Font Awesome** : Icônes
- **Google Fonts** : Typographie Inter

### API & Données
- **RESTful Table API** : CRUD complet
- **LocalStorage** : Sessions utilisateur
- **Crypto API** : Hash de mots de passe

---

## 📁 Structure du Projet

```
avanpass/
├── index.html              # Page principale
├── manifest.json           # Configuration PWA
├── sw.js                   # Service Worker
├── css/
│   └── styles.css          # Styles complets
├── js/
│   ├── app.js              # Application principale
│   ├── api.js              # Interface API REST
│   ├── auth.js             # Authentification
│   ├── utils.js            # Utilitaires
│   ├── client.js           # Module client
│   ├── commercant.js       # Module commerçant
│   └── admin.js            # Module admin
├── images/
│   ├── logo.svg            # Logo vectoriel
│   ├── icon-192.png        # Icône PWA 192x192
│   ├── icon-512.png        # Icône PWA 512x512
│   └── README_ICONS.txt    # Instructions icônes
└── README.md               # Cette documentation
```

---

## 🔄 API RESTful Table

L'application utilise l'API Table intégrée pour la persistance des données.

### Endpoints Utilisés

```javascript
// Lister avec pagination
GET /tables/{table}?page=1&limit=100

// Récupérer un enregistrement
GET /tables/{table}/{id}

// Créer
POST /tables/{table}
Body: { ...data }

// Mise à jour partielle
PATCH /tables/{table}/{id}
Body: { ...fieldsToUpdate }

// Mise à jour complète
PUT /tables/{table}/{id}
Body: { ...allData }

// Supprimer (soft delete)
DELETE /tables/{table}/{id}
```

### Exemples

```javascript
// Créer un client
const client = await API.create('clients', {
    id: generateUUID(),
    prenom: 'Jean',
    nom: 'Dupont',
    statut_carte: 'active',
    qr_token_client: generateToken(),
    date_activation: new Date().toISOString()
});

// Lister les boutiques actives
const boutiques = await API.list('boutiques');
const actives = boutiques.data.filter(b => b.statut_boutique === 'active');

// Créer une transaction
await API.create('transactions', {
    id: generateUUID(),
    date_heure: new Date().toISOString(),
    boutique_id: boutiqueId,
    client_id: clientId,
    type: 'passage_valide',
    valeur_points: 1,
    operateur: commercantId
});
```

---

## 🎯 Cas d'Usage

### 1. Café / Restaurant
- Seuil : 10 passages
- Récompense : "1 café ou pâtisserie offert(e)"

### 2. Salon de Coiffure
- Seuil : 5 passages
- Récompense : "1 coupe gratuite"

### 3. Boulangerie
- Seuil : 8 passages
- Récompense : "1 baguette offerte"

### 4. Pressing
- Seuil : 10 passages
- Récompense : "1 article lavé gratuitement"

### 5. Salle de Sport
- Seuil : 15 passages
- Récompense : "1 séance coaching offerte"

---

## 🚧 Évolutions Futures

### Version 1.1 (Court terme)
- [ ] Mode hors ligne complet
- [ ] Notifications push (récompense disponible)
- [x] **Bannière d'image personnalisée** par commerce ✨ **FAIT**
- [x] **Contour élégant 3D** avec effet de profondeur ✨ **FAIT**
- [ ] Upload de logo boutique
- [ ] QR code personnalisé par boutique

### Version 2.0 (Moyen terme)
- [ ] Backend Node.js sécurisé
- [ ] Authentification JWT
- [ ] API privée avec rate limiting
- [ ] Dashboard analytics avancé
- [ ] Multi-langues (FR, EN, ES)

### Version 3.0 (Long terme)
- [ ] Programme de parrainage
- [ ] Intégration paiement
- [ ] Marketplace de récompenses
- [ ] Application mobile native (React Native)
- [ ] Géolocalisation boutiques

---

## 🐛 Résolution de Problèmes

### Le scanner QR ne fonctionne pas
- ✅ Vérifiez les permissions caméra du navigateur
- ✅ Utilisez HTTPS (obligatoire pour caméra)
- ✅ Testez sur un autre navigateur
- ✅ Assurez-vous d'avoir un bon éclairage

### Les données ne se sauvegardent pas
- ✅ Vérifiez la console du navigateur (F12)
- ✅ L'API Table est-elle accessible ?
- ✅ Testez la connexion réseau

### La carte client ne s'affiche pas
- ✅ Vérifiez que le client est bien activé
- ✅ Qu'au moins une boutique est active
- ✅ Rafraîchissez la page avec Ctrl+Shift+R (cache complet)
- ✅ Ouvrez `demo-data.html` pour générer des données de test

### L'installation PWA ne fonctionne pas
- ✅ Vérifiez que le manifest.json est accessible
- ✅ Ajoutez les icônes PNG manquantes (voir images/README_ICONS.txt)
- ✅ Utilisez HTTPS
- ✅ Vérifiez le Service Worker dans DevTools

---

## 📊 État du Projet

### ✅ Fonctionnalités Complétées
- [x] Architecture PWA complète
- [x] 3 interfaces (Client, Commerçant, Admin)
- [x] Design premium V2 type Apple Wallet
  - [x] Bannière d'image décorative par commerce ✨
  - [x] Contour élégant avec effet 3D ✨
  - [x] 6 types de commerces avec images Unsplash ✨
- [x] Scanner QR natif
- [x] Génération QR code dynamique
- [x] Système de fidélité complet
- [x] Gestion multi-boutiques
- [x] Dashboard administrateur
- [x] Export CSV
- [x] Historique transactions
- [x] Gestion des statuts
- [x] Corrections admin

### 🎨 Points Forts
- Interface moderne et professionnelle
- Expérience utilisateur fluide
- Mobile-first responsive
- Code propre et documenté
- Architecture modulaire
- Prêt pour déploiement MVP

### ⚠️ Limitations Connues
- Pas de backend sécurisé
- API publique (données non chiffrées)
- Auth côté client uniquement
- Icônes PWA à ajouter manuellement

---

## 🤝 Contribution

Ce projet est un MVP. Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📞 Support

Pour toute question ou support :
- **Email** : support@avanpass.com
- **Documentation** : Ce README.md
- **Issues** : Ouvrez une issue sur le repo

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🙏 Remerciements

- **Font Awesome** pour les icônes
- **QRCode.js** pour la génération de QR codes
- **html5-qrcode** pour le scanner
- **Google Fonts** pour la typographie Inter
- **La communauté open source** 

---

## 🎉 Déploiement

Pour déployer votre application AvanPass :

### Netlify (Recommandé)
1. Créez un compte sur [Netlify](https://netlify.com)
2. Glissez-déposez le dossier du projet
3. Votre app est en ligne ! 🚀

### Vercel
1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez le projet
3. Déployez en 1 clic

### GitHub Pages
1. Créez un repo GitHub
2. Uploadez tous les fichiers
3. Activez GitHub Pages dans Settings
4. Votre URL : `https://username.github.io/avanpass`

### Serveur Personnel
1. Uploadez via FTP/SFTP
2. Assurez-vous que le serveur supporte HTTPS
3. Configurez le domaine
4. C'est prêt !

---

<div align="center">

**Fait avec ❤️ pour digitaliser la fidélité locale**

AvanPass V1.0 - 2024

🌟 Si ce projet vous plaît, n'hésitez pas à le mettre en favoris ! 🌟

</div>
