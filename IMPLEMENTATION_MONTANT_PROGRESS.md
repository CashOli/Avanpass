# 🚀 Implémentation Système MONTANT - Progression

**Version** : AvanPass v2.1.0  
**Date** : 16 décembre 2024  
**Statut** : En cours

---

## ✅ **Phase 1 : Préparation & SQL** - TERMINÉE

### Étape 1 : Backup ✅
- Supabase : Backups automatiques quotidiens (plan Free)
- Fichier `backup-data-export.html` créé comme alternative

### Étape 2 : Migration SQL ✅
- Script `SQL_3_PROGRAMMES_FIDELITE.sql` exécuté avec succès
- **Colonnes ajoutées** :
  - `boutiques.type_programme` (VARCHAR) - Valeur par défaut: 'points'
  - `boutiques.tampons_nombre` (INT) - Valeur par défaut: 10
  - `boutiques.paliers_montant` (JSONB) - Valeur par défaut: []
  - `transactions.montant_euros` (DECIMAL) - Valeur par défaut: 0
- **Fonctions SQL créées** :
  - `calcul_total_depense()` - Calcul du montant total
  - `recompenses_disponibles()` - Liste des récompenses
  - `validate_boutique_programme()` - Validation des données
- **Trigger créé** : `trg_validate_boutique_programme`

### Étape 3 : Vérification compatibilité ✅
- Application testée : Fonctionne comme avant ✅
- Mode POINTS intact
- Boutique "Snack boutique" configurée en mode 'points'

---

## 🔄 **Phase 2 : Développement Système MONTANT** - EN COURS

### Étape 1 : Modifications `js/api.js` ✅ TERMINÉ
**Nouvelles méthodes ajoutées** :
```javascript
// Calcul du montant total dépensé
async calculateMontantDepense(clientId, boutiqueId)

// Liste des paliers avec statut (disponible/utilisé)
async getRecompensesDisponibles(clientId, boutiqueId, paliersMontant)

// Calcul universel (points OU montant selon le type)
async calculateProgress(clientId, boutiqueId, boutique)
```

**Logique** :
- `calculateMontantDepense()` : Somme de `montant_euros` pour les transactions `passage_valide`
- `getRecompensesDisponibles()` : Pour chaque palier, calcule si disponible et si utilisé
- `calculateProgress()` : Switch selon `type_programme` ('points', 'tampons', 'montant')

---

### Étape 2 : Modifications `js/client.js` - EN COURS

**Objectifs** :
1. Détection du type de programme (boutique.type_programme)
2. Affichage conditionnel selon le type :
   - **Points** : Affichage actuel (barre de progression)
   - **Tampons** : Grille de cases à cocher
   - **Montant** : Liste des paliers avec progression

**Structure proposée** :

```javascript
// Dans showCard()
async showCard() {
    const client = Auth.getClient();
    const boutique = await API.get('boutiques', client.boutique_id);
    
    // Switch selon le type de programme
    switch(boutique.type_programme) {
        case 'tampons':
            this.showCardTampons(client, boutique);
            break;
        case 'montant':
            this.showCardMontant(client, boutique);
            break;
        case 'points':
        default:
            this.showCardPoints(client, boutique);
            break;
    }
}
```

**Affichage MONTANT (nouveau)** :
```html
<div class="carte-montant">
    <h3>💰 Total dépensé : 35€</h3>
    
    <div class="paliers">
        <!-- Palier débloqué -->
        <div class="palier disponible">
            <div class="palier-icon">✅</div>
            <div class="palier-info">
                <strong>20€ → Café offert</strong>
                <span class="status">Disponible ! 🎁</span>
            </div>
        </div>
        
        <!-- Palier en cours -->
        <div class="palier en-cours">
            <div class="palier-icon">🔒</div>
            <div class="palier-info">
                <strong>50€ → Dessert offert</strong>
                <span class="status">Plus que 15€ !</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 70%"></div>
                </div>
            </div>
        </div>
        
        <!-- Palier verrouillé -->
        <div class="palier verrouille">
            <div class="palier-icon">🔒</div>
            <div class="palier-info">
                <strong>100€ → Menu offert</strong>
                <span class="status">Plus que 65€</span>
            </div>
        </div>
    </div>
</div>
```

---

### Étape 3 : Modifications `js/commercant.js` - À FAIRE

**Objectif** : Permettre la saisie du montant lors de la validation (si mode MONTANT)

**Workflow actuel (POINTS)** :
1. Scanner QR
2. Afficher info client
3. Cliquer "Valider 1 passage"
4. Créer transaction avec `valeur_points: 1`

**Nouveau workflow (MONTANT)** :
1. Scanner QR
2. Afficher info client + montant déjà dépensé
3. **Saisir le montant** : `[____] €`
4. Cliquer "Valider l'achat"
5. Créer transaction avec `montant_euros: 12.50`

**Interface proposée** :
```html
<div id="scanResult" class="scan-result" style="display: none;">
    <h3>Client scanné</h3>
    <p><strong>Nom :</strong> <span id="clientName"></span></p>
    <p><strong>Total dépensé :</strong> <span id="clientMontant">0€</span></p>
    
    <!-- NOUVEAU : Saisie montant (si mode MONTANT) -->
    <div id="montantInput" style="display: none;">
        <label for="achatMontant">Montant de l'achat :</label>
        <input type="number" id="achatMontant" step="0.01" min="0" placeholder="0.00" />
        <span>€</span>
    </div>
    
    <!-- Bouton adaptatif -->
    <button id="validateBtn" class="btn-validate">
        Valider 1 passage (+1 point)
    </button>
</div>
```

**Logique JavaScript** :
```javascript
async validatePassage() {
    const boutique = Auth.getCommercant();
    const client = this.scannedClient;
    
    let transactionData = {
        client_id: client.id,
        boutique_id: boutique.id,
        type: 'passage_valide',
        date_heure: new Date().toISOString()
    };
    
    // Switch selon le type de programme
    if (boutique.type_programme === 'montant') {
        // Mode MONTANT : récupérer le montant saisi
        const montant = parseFloat(document.getElementById('achatMontant').value);
        
        if (!montant || montant <= 0) {
            Utils.showMessage('Veuillez saisir un montant valide', 'error');
            return;
        }
        
        transactionData.montant_euros = montant;
        transactionData.valeur_points = null;
    } else {
        // Mode POINTS ou TAMPONS : 1 point
        transactionData.valeur_points = 1;
        transactionData.montant_euros = 0;
    }
    
    // Créer la transaction
    const result = await API.create('transactions', transactionData);
    
    // Message de succès adaptatif
    if (boutique.type_programme === 'montant') {
        Utils.showMessage(`Achat de ${montant}€ validé ! Merci !`, 'success');
    } else {
        Utils.showMessage('Passage validé avec succès ! +1 point', 'success');
    }
}
```

---

### Étape 4 : CSS pour l'affichage MONTANT - À FAIRE

**Nouveau fichier ou ajout à `css/styles.css`** :

```css
/* Carte MONTANT */
.carte-montant {
    padding: 20px;
}

.carte-montant h3 {
    text-align: center;
    font-size: 24px;
    color: #667eea;
    margin-bottom: 30px;
}

.paliers {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.palier {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-radius: 12px;
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    transition: all 0.3s;
}

.palier.disponible {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    border-color: #28a745;
}

.palier.en-cours {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    border-color: #ffc107;
}

.palier.verrouille {
    background: #f8f9fa;
    border-color: #dee2e6;
    opacity: 0.7;
}

.palier-icon {
    font-size: 32px;
    min-width: 40px;
    text-align: center;
}

.palier-info {
    flex: 1;
}

.palier-info strong {
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
}

.palier-info .status {
    display: block;
    font-size: 14px;
    color: #666;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    margin-top: 8px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s;
}
```

---

## 📋 **Prochaines étapes**

### Immédiat (aujourd'hui) :
1. ✅ Modifier `js/api.js` - **TERMINÉ**
2. 🔄 Modifier `js/client.js` - **EN COURS**
3. ⏳ Modifier `js/commercant.js` - **À FAIRE**
4. ⏳ Ajouter CSS pour affichage MONTANT - **À FAIRE**
5. ⏳ Tester en local
6. ⏳ Créer boutique de test en mode MONTANT
7. ⏳ Tests complets (PC + Mobile)
8. ⏳ Déploiement

### Demain (optionnel) :
1. Système TAMPONS (affichage visuel)
2. Interface de choix pour le commerçant
3. Documentation complète

---

## 🧪 **Plan de tests**

### Test 1 : Mode POINTS (existant) ✅
- Connexion client : jean.dupont@test.fr
- Vérifier que l'affichage est identique
- Valider un passage
- Vérifier +1 point

### Test 2 : Mode MONTANT (nouveau)
- Créer boutique test en mode MONTANT
- Configurer paliers : 20€, 50€, 100€
- Créer client test
- Valider achat de 25€
- Vérifier affichage : "Total 25€, Palier 20€ débloqué"
- Valider achat de 30€
- Vérifier affichage : "Total 55€, Palier 50€ débloqué"

---

## 📊 **Temps estimé restant**

- `js/client.js` : 2 heures
- `js/commercant.js` : 1.5 heures
- CSS : 30 minutes
- Tests : 1 heure
- **TOTAL** : ~5 heures

---

**Dernière mise à jour** : 16/12/2024 - 22:00
