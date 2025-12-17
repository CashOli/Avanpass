# 🤝 Guide de Contribution - AvanPass

Merci de votre intérêt pour contribuer à AvanPass ! Ce guide vous aidera à commencer.

## 📋 Table des Matières
- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Standards de Code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signaler des Bugs](#signaler-des-bugs)
- [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)

---

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de maintenir un environnement respectueux et inclusif pour tous.

### Nos Engagements
- ✅ Utiliser un langage accueillant et inclusif
- ✅ Respecter les points de vue et expériences différentes
- ✅ Accepter les critiques constructives avec grâce
- ✅ Se concentrer sur ce qui est meilleur pour la communauté
- ✅ Faire preuve d'empathie envers les autres membres

### Comportements Inacceptables
- ❌ Langage ou images sexualisés
- ❌ Trolling, insultes ou commentaires désobligeants
- ❌ Harcèlement public ou privé
- ❌ Publication d'informations privées sans permission
- ❌ Toute autre conduite inappropriée en contexte professionnel

---

## 🚀 Comment Contribuer

### 1. Fork le Projet
```bash
# Via GitHub (bouton "Fork")
# Ou en ligne de commande
git clone https://github.com/votre-username/avanpass.git
cd avanpass
```

### 2. Créer une Branche
```bash
# Pour une nouvelle fonctionnalité
git checkout -b feature/nom-fonctionnalite

# Pour un bugfix
git checkout -b fix/nom-du-bug

# Pour de la documentation
git checkout -b docs/nom-modification
```

### 3. Faire vos Modifications
- Écrivez du code propre et lisible
- Commentez le code complexe
- Suivez les standards de code (voir section dédiée)
- Testez vos modifications

### 4. Commiter vos Changements
```bash
git add .
git commit -m "Type: Description courte

Description détaillée de ce qui a été modifié et pourquoi."
```

**Types de commits** :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage, point-virgules manquants, etc.
- `refactor`: Refactoring du code
- `test`: Ajout de tests
- `chore`: Maintenance, dépendances, etc.

### 5. Push vers GitHub
```bash
git push origin feature/nom-fonctionnalite
```

### 6. Créer une Pull Request
- Allez sur GitHub
- Cliquez sur "New Pull Request"
- Remplissez le template (voir ci-dessous)
- Attendez la review

---

## 💻 Standards de Code

### JavaScript
```javascript
// ✅ BON
function calculatePoints(transactions) {
    return transactions.reduce((total, t) => total + t.valeur_points, 0);
}

// ❌ MAUVAIS
function calc(t) {
    var x = 0;
    for(var i=0;i<t.length;i++){
        x+=t[i].valeur_points;
    }
    return x;
}
```

**Règles** :
- Utiliser `const` et `let` (pas `var`)
- Noms de variables descriptifs en `camelCase`
- Fonctions courtes et focalisées
- Commentaires pour le code complexe
- Éviter les répétitions (DRY)

### CSS
```css
/* ✅ BON */
.button-primary {
    background-color: var(--primary-color);
    padding: 1rem 2rem;
    border-radius: var(--radius-md);
}

/* ❌ MAUVAIS */
.btn1 {
    background-color: #6366f1;
    padding: 16px 32px;
    border-radius: 12px;
}
```

**Règles** :
- Classes descriptives en `kebab-case`
- Utiliser les variables CSS (`:root`)
- Mobile-first (media queries `min-width`)
- Éviter les `!important`

### HTML
```html
<!-- ✅ BON -->
<button class="btn btn-primary" onclick="validatePassage()">
    <i class="fas fa-check"></i>
    Valider le passage
</button>

<!-- ❌ MAUVAIS -->
<button onclick="vp()" class="b1">OK</button>
```

**Règles** :
- HTML sémantique
- Attributs `alt` pour les images
- Classes descriptives
- Indentation cohérente (2 ou 4 espaces)

---

## 🔄 Processus de Pull Request

### Template de PR
```markdown
## Description
Brève description de ce que fait cette PR.

## Type de Changement
- [ ] Bugfix (correction non cassante)
- [ ] Nouvelle fonctionnalité (ajout non cassant)
- [ ] Breaking change (modification cassant l'existant)
- [ ] Documentation

## Tests Effectués
- [ ] Test 1
- [ ] Test 2
- [ ] Test sur mobile
- [ ] Test sur desktop

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai commenté le code complexe
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai testé sur différents navigateurs
```

### Critères d'Acceptation
✅ Code propre et lisible  
✅ Pas de conflits avec la branche principale  
✅ Tests effectués  
✅ Documentation mise à jour  
✅ Review approuvée par un mainteneur  

---

## 🐛 Signaler des Bugs

### Avant de Signaler
- ✅ Vérifiez que le bug n'est pas déjà signalé
- ✅ Utilisez la dernière version
- ✅ Testez sur différents navigateurs

### Template de Bug Report
```markdown
**Description du Bug**
Description claire et concise du problème.

**Reproduction**
Étapes pour reproduire :
1. Aller sur '...'
2. Cliquer sur '....'
3. Scroller jusqu'à '....'
4. Voir l'erreur

**Comportement Attendu**
Ce qui devrait normalement se passer.

**Captures d'Écran**
Si applicable, ajoutez des captures.

**Environnement**
- OS : [ex: Windows 10, macOS, Android]
- Navigateur : [ex: Chrome 120, Safari 17]
- Version d'AvanPass : [ex: 1.0.0]

**Contexte Additionnel**
Toute autre information pertinente.
```

---

## 💡 Proposer des Fonctionnalités

### Template de Feature Request
```markdown
**Le Problème**
Description claire du problème que cette fonctionnalité résoudrait.

**La Solution Proposée**
Description claire de ce que vous aimeriez voir implémenté.

**Alternatives Considérées**
Autres solutions ou fonctionnalités auxquelles vous avez pensé.

**Contexte Additionnel**
Captures, mockups, exemples, etc.

**Impact**
- Utilisateurs concernés : [tous / clients / commerçants / admins]
- Priorité : [basse / moyenne / haute]
- Effort estimé : [petit / moyen / grand]
```

---

## 🎯 Domaines de Contribution

### Code
- 🐛 Corriger des bugs
- ✨ Ajouter des fonctionnalités
- ⚡ Améliorer les performances
- ♻️ Refactorer le code
- 🔒 Renforcer la sécurité

### Design
- 🎨 Améliorer l'UI
- 📱 Optimiser le responsive
- ✨ Ajouter des animations
- 🌈 Créer des thèmes

### Documentation
- 📝 Améliorer le README
- 📚 Écrire des tutoriels
- 🌍 Traduire en d'autres langues
- 🎥 Créer des vidéos de démo

### Tests
- 🧪 Écrire des tests unitaires
- 🔍 Tester sur différents appareils
- 🚀 Tests de performance
- 🔐 Tests de sécurité

---

## 🏆 Reconnaissance

Tous les contributeurs seront ajoutés à la section "Contributeurs" du README.

### Niveaux de Contribution
- 🥉 **Contributeur Bronze** : 1-5 contributions
- 🥈 **Contributeur Argent** : 6-15 contributions
- 🥇 **Contributeur Or** : 16+ contributions
- 💎 **Core Contributor** : Contributeur régulier avec impact majeur

---

## 📞 Questions ?

- 💬 **Discussions** : Ouvrez une discussion sur GitHub
- 📧 **Email** : contribute@avanpass.com
- 📖 **Documentation** : Consultez le README et QUICKSTART

---

## 📄 Licence

En contribuant à AvanPass, vous acceptez que vos contributions soient sous licence MIT.

---

<div align="center">

**Merci de contribuer à AvanPass ! 🎉**

Ensemble, digitalisons la fidélité locale ! 💪

</div>
