// ===================================
// CLIENT - Interface client séparée (inscription / activation / connexion)
// ===================================

const clientApp = {
    currentClient: null,
    
    // Initialiser l'espace client
    async init() {
        // Vérifier si déjà connecté
        this.currentClient = Auth.getClient();
        
        if (this.currentClient) {
            // Déjà connecté, afficher la carte
            await this.showCard();
        } else {
            // Pas connecté, afficher les choix
            this.showChoice();
        }
    },
    
    // Afficher l'écran de choix
    showChoice() {
        document.getElementById('client-choice').classList.add('active');
        document.getElementById('client-login').classList.remove('active');
        document.getElementById('client-registration').classList.remove('active');
        document.getElementById('client-activation').classList.remove('active');
        document.getElementById('client-card').classList.remove('active');
    },
    
    // Afficher l'écran de connexion
    showLogin() {
        document.getElementById('client-choice').classList.remove('active');
        document.getElementById('client-login').classList.add('active');
        document.getElementById('client-registration').classList.remove('active');
        document.getElementById('client-activation').classList.remove('active');
        document.getElementById('client-card').classList.remove('active');
    },
    
    // Afficher le formulaire d'inscription
    showRegistration() {
        document.getElementById('client-choice').classList.remove('active');
        document.getElementById('client-login').classList.remove('active');
        document.getElementById('client-registration').classList.add('active');
        document.getElementById('client-activation').classList.remove('active');
        document.getElementById('client-card').classList.remove('active');
        
        const registrationHTML = `
            <div class="container">
                <div class="header">
                    <button class="back-btn" onclick="clientApp.showChoice()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>Créer mon compte</h1>
                </div>
                
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" id="reg-client-email" class="form-control" placeholder="votre@email.com">
                </div>
                
                <div class="form-group">
                    <label>Mot de passe *</label>
                    <input type="password" id="reg-client-password" class="form-control" placeholder="••••••••" minlength="6">
                </div>
                
                <div class="form-group">
                    <label>Prénom *</label>
                    <input type="text" id="reg-client-prenom" class="form-control" placeholder="Jean">
                </div>
                
                <div class="form-group">
                    <label>Nom *</label>
                    <input type="text" id="reg-client-nom" class="form-control" placeholder="Dupont">
                </div>
                
                <div class="form-group">
                    <label>Téléphone</label>
                    <input type="tel" id="reg-client-telephone" class="form-control" placeholder="06 12 34 56 78">
                </div>
                
                <button class="btn btn-primary btn-large" onclick="clientApp.register()">
                    <i class="fas fa-user-plus"></i>
                    Créer mon compte
                </button>
                
                <p style="text-align: center; margin-top: 1.5rem; color: #666;">
                    <i class="fas fa-info-circle"></i>
                    Après inscription, vous devrez activer votre carte avec un code d'activation
                </p>
                
                <div id="registration-client-message" class="message"></div>
            </div>
        `;
        
        document.getElementById('client-registration').innerHTML = registrationHTML;
    },
    
    // Afficher l'écran d'activation
    showActivation() {
        document.getElementById('client-choice').classList.remove('active');
        document.getElementById('client-login').classList.remove('active');
        document.getElementById('client-registration').classList.remove('active');
        document.getElementById('client-activation').classList.add('active');
        document.getElementById('client-card').classList.remove('active');
        
        const activationHTML = `
            <div class="container">
                <div class="header">
                    <button class="back-btn" onclick="clientApp.showChoice()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>Activer ma carte</h1>
                </div>
                
                <div class="activation-form">
                    <div class="form-icon">
                        <i class="fas fa-ticket-alt"></i>
                    </div>
                    
                    <p class="activation-info">
                        Vous devez être inscrit et connecté pour activer votre carte.
                    </p>
                    
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="activation-email" class="form-control" placeholder="votre@email.com">
                    </div>
                    
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" id="activation-password" class="form-control" placeholder="••••••••">
                    </div>
                    
                    <div class="form-group">
                        <label>Code d'activation</label>
                        <input type="text" id="activation-code" class="form-control" placeholder="CODE-ACTIVATION" maxlength="20" style="text-transform: uppercase;">
                    </div>
                    
                    <button class="btn btn-primary btn-large" onclick="clientApp.activateCard()">
                        <i class="fas fa-check-circle"></i>
                        Activer ma carte
                    </button>
                    
                    <div id="activation-message" class="message"></div>
                </div>
            </div>
        `;
        
        document.getElementById('client-activation').innerHTML = activationHTML;
    },
    
    // Inscription client (SANS code, statut = inactive)
    async register() {
        const email = document.getElementById('reg-client-email').value.trim();
        const password = document.getElementById('reg-client-password').value;
        const prenom = document.getElementById('reg-client-prenom').value.trim();
        const nom = document.getElementById('reg-client-nom').value.trim();
        const telephone = document.getElementById('reg-client-telephone').value.trim();
        
        // Validation
        if (!email || !password || !prenom || !nom) {
            Utils.showMessage('registration-client-message', 'Veuillez remplir tous les champs obligatoires (*)', 'error');
            return;
        }
        
        if (password.length < 6) {
            Utils.showMessage('registration-client-message', 'Le mot de passe doit contenir au moins 6 caractères', 'error');
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            // Vérifier si l'email existe déjà
            const clientsResponse = await API.list('clients', { limit: 1000 });
            const existingClient = clientsResponse.data.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
            
            if (existingClient) {
                Utils.showMessage('registration-client-message', 'Cette adresse email est déjà utilisée', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Hasher le mot de passe
            const passwordHash = await Auth.hashPassword(password);
            
            // Créer le client SANS QR token et statut INACTIVE
            const clientData = {
                email: email,
                password_hash: passwordHash,
                prenom: prenom,
                nom: nom,
                telephone: telephone,
                statut_carte: 'inactive',
                date_activation: null,
                date_expiration: null,
                qr_token_client: ''
            };
            
            const response = await fetch('tables/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const client = await response.json();
            
            Utils.showMessage('registration-client-message', 
                '✅ Compte créé avec succès !<br><br>' +
                '<strong>Prochaine étape :</strong> Activez votre carte avec un code d\'activation', 
                'success');
            
            setTimeout(() => {
                this.showActivation();
            }, 3000);
            
        } catch (error) {
            console.error('Erreur inscription client:', error);
            
            const errorMsg = `❌ ERREUR D'INSCRIPTION\n\n` +
                `Message: ${error.message}\n\n` +
                `Email: ${email}`;
            
            alert(errorMsg);
            
            Utils.showMessage('registration-client-message', 'Erreur lors de l\'inscription. Veuillez réessayer.', 'error');
        }
        
        Utils.showLoading(false);
    },
    
    // Activation de carte (avec code, change statut à active)
    async activateCard() {
        const email = document.getElementById('activation-email').value.trim();
        const password = document.getElementById('activation-password').value;
        const code = document.getElementById('activation-code').value.trim().toUpperCase();
        
        if (!email || !password || !code) {
            Utils.showMessage('activation-message', 'Veuillez remplir tous les champs', 'error');
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            // 1. Vérifier les identifiants
            const clientsResponse = await API.list('clients', { limit: 1000 });
            const client = clientsResponse.data.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
            
            if (!client) {
                Utils.showMessage('activation-message', 'Email ou mot de passe incorrect', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Vérifier le mot de passe
            const passwordValid = await Auth.verifyPassword(password, client.password_hash);
            
            if (!passwordValid) {
                Utils.showMessage('activation-message', 'Email ou mot de passe incorrect', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // 2. Vérifier le code d'activation
            const activationCode = await API.checkActivationCode(code);
            
            if (!activationCode) {
                Utils.showMessage('activation-message', 'Code d\'activation invalide ou déjà utilisé', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // 3. Générer QR token et calculer dates
            const qrToken = Utils.generateQRToken();
            const dateActivation = new Date();
            const dateExpiration = new Date(dateActivation);
            dateExpiration.setFullYear(dateExpiration.getFullYear() + 1); // +1 an
            
            // 4. Mettre à jour le client (activer la carte)
            await API.patch('clients', client.id, {
                statut_carte: 'active',
                date_activation: dateActivation.toISOString(),
                date_expiration: dateExpiration.toISOString(),
                qr_token_client: qrToken
            });
            
            // 5. Marquer le code comme utilisé
            await API.patch('codes_activation', activationCode.id, {
                statut: 'utilise',
                client_id: client.id,
                date_utilisation: new Date().toISOString()
            });
            
            // 6. Connecter le client
            const updatedClient = await API.get('clients', client.id);
            Auth.loginClient(updatedClient);
            this.currentClient = updatedClient;
            
            Utils.showMessage('activation-message', '✅ Carte activée avec succès !', 'success');
            
            setTimeout(async () => {
                await this.showCard();
            }, 1500);
            
        } catch (error) {
            console.error('Erreur activation:', error);
            
            const errorMsg = `❌ ERREUR D'ACTIVATION\n\n` +
                `Message: ${error.message}\n\n` +
                `Email: ${email}\n` +
                `Code: ${code}`;
            
            alert(errorMsg);
            
            Utils.showMessage('activation-message', 'Erreur lors de l\'activation. Veuillez réessayer.', 'error');
        }
        
        Utils.showLoading(false);
    },
    
    // Connexion client
    async login() {
        const email = document.getElementById('client-login-email').value.trim();
        const password = document.getElementById('client-login-password').value;
        
        if (!email || !password) {
            Utils.showMessage('client-login-message', 'Veuillez remplir tous les champs', 'error');
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            // Chercher le client par email
            const clientsResponse = await API.list('clients', { limit: 1000 });
            const client = clientsResponse.data.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
            
            if (!client) {
                Utils.showMessage('client-login-message', 'Email ou mot de passe incorrect', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Vérifier le mot de passe
            const passwordValid = await Auth.verifyPassword(password, client.password_hash);
            
            if (!passwordValid) {
                Utils.showMessage('client-login-message', 'Email ou mot de passe incorrect', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Vérifier si la carte est activée
            if (client.statut_carte === 'inactive') {
                Utils.showMessage('client-login-message', 
                    '⚠️ Votre carte n\'est pas encore activée.<br><br>' +
                    'Veuillez d\'abord l\'activer avec un code d\'activation.', 
                    'error');
                Utils.showLoading(false);
                
                setTimeout(() => {
                    this.showActivation();
                }, 3000);
                return;
            }
            
            // Vérifier le statut de la carte
            if (client.statut_carte === 'suspendue') {
                Utils.showMessage('client-login-message', 'Votre carte est suspendue. Contactez l\'administrateur.', 'error');
                Utils.showLoading(false);
                return;
            }
            
            if (client.statut_carte === 'expiree') {
                Utils.showMessage('client-login-message', 'Votre carte a expiré. Contactez l\'administrateur pour la renouveler.', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Connexion réussie
            Auth.loginClient(client);
            this.currentClient = client;
            
            await this.showCard();
            
        } catch (error) {
            console.error('Erreur connexion client:', error);
            Utils.showMessage('client-login-message', 'Erreur lors de la connexion. Veuillez réessayer.', 'error');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher la carte virtuelle
    async showCard() {
        // Vérifier si un client est connecté
        this.currentClient = Auth.getClient();
        
        if (!this.currentClient) {
            alert('❌ Vous devez vous connecter pour voir votre carte.');
            this.showChoice();
            return;
        }
        
        document.getElementById('client-choice').classList.remove('active');
        document.getElementById('client-login').classList.remove('active');
        document.getElementById('client-registration').classList.remove('active');
        document.getElementById('client-activation').classList.remove('active');
        document.getElementById('client-card').classList.add('active');
        
        Utils.showLoading(true);
        
        try {
            // Récupérer les boutiques actives (valide OU active)
            const boutiquesResponse = await API.list('boutiques', { limit: 1000 });
            const activeBoutiques = boutiquesResponse.data.filter(b => 
                b.statut_boutique === 'valide' || b.statut_boutique === 'active'
            );
            
            if (activeBoutiques.length === 0) {
                document.getElementById('client-card').innerHTML = `
                    <div class="container">
                        <div class="header">
                            <h1>Ma Carte AvanPass</h1>
                            <button class="back-btn" onclick="clientApp.logout()" style="margin-left: auto;">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                        <p class="text-center text-muted">Aucune boutique partenaire disponible pour le moment.</p>
                    </div>
                `;
                Utils.showLoading(false);
                return;
            }
            
            // Récupérer les transactions du client
            const transactionsResponse = await API.list('transactions', { limit: 1000 });
            const clientTransactions = transactionsResponse.data
                .filter(t => t.client_id === this.currentClient.id)
                .sort((a, b) => new Date(b.date_heure) - new Date(a.date_heure));
            
            // Générer le HTML de la carte
            const cardHTML = await this.renderCard(activeBoutiques, clientTransactions);
            
            document.getElementById('client-card').innerHTML = cardHTML;
            
            // Générer le QR code
            this.generateQRCode(this.currentClient.qr_token_client);
            
        } catch (error) {
            console.error('Erreur affichage carte:', error);
            alert('Erreur lors du chargement de votre carte.');
        }
        
        Utils.showLoading(false);
    },
    
    // Render card HTML
    async renderCard(boutiques, transactions) {
        // Sélecteur de boutique
        let boutiqueOptions = boutiques.map(b => 
            `<option value="${b.id}">${b.nom_boutique}</option>`
        ).join('');
        
        // Boutique par défaut (première)
        const defaultBoutique = boutiques[0];
        
        // Calculer les points pour la boutique par défaut
        const defaultPoints = await API.calculatePoints(this.currentClient.id, defaultBoutique.id);
        
        const progress = Math.min((defaultPoints / defaultBoutique.recompense_seuil_points) * 100, 100);
        const hasReward = defaultPoints >= defaultBoutique.recompense_seuil_points;
        
        // Transactions récentes (10 dernières)
        const recentTransactions = transactions.slice(0, 10);
        
        return `
            <div class="container">
                <div class="header">
                    <h1>Ma Carte AvanPass</h1>
                    <button class="back-btn" onclick="clientApp.logout()" style="margin-left: auto;">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
                
                <div class="form-group" style="margin-bottom: 2rem;">
                    <label>Sélectionner une boutique</label>
                    <select id="boutique-selector" class="form-control" onchange="clientApp.onBoutiqueChange()">
                        ${boutiqueOptions}
                    </select>
                </div>
                
                <div id="card-container">
                    ${await this.renderSingleCard(defaultBoutique, defaultPoints)}
                </div>
                
                ${recentTransactions.length > 0 ? `
                    <div class="history-section" style="margin-top: 2rem;">
                        <h3><i class="fas fa-history"></i> Dernières transactions</h3>
                        ${this.renderTransactions(recentTransactions, boutiques)}
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    // Render single card (v2.1.0 - Support 3 types de programmes)
    async renderSingleCard(boutique, points) {
        const boutiqueType = this.getBoutiqueType(boutique.nom_boutique);
        const boutiqueIcon = this.getBoutiqueIcon(boutiqueType);
        const bandImage = this.getBoutiqueBandImage(boutiqueType);
        
        // Utiliser ClientProgrammes pour le rendu selon le type
        const programmeHTML = await ClientProgrammes.renderCardByType(boutique, this.currentClient);
        
        return `
            <div class="wallet-card" data-boutique="${boutique.id}">
                <div class="card-decorative-band" style="background-image: url('${bandImage}');"></div>
                
                <div class="card-header">
                    <div class="card-logo">
                        <span class="boutique-emoji">${boutiqueIcon}</span>
                    </div>
                    <div class="card-title">
                        <h2>${boutique.nom_boutique}</h2>
                        <p class="card-subtitle">Carte de fidélité</p>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="card-client-info">
                        <p class="client-name">${this.currentClient.prenom} ${this.currentClient.nom}</p>
                        ${this.renderCardStatus()}
                    </div>
                    
                    ${programmeHTML}
                    
                    <div class="qr-code-container">
                        <div id="client-qrcode"></div>
                        <p class="qr-instruction">Présentez ce QR code en boutique</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Render card status and dates
    renderCardStatus() {
        const statut = this.currentClient.statut_carte;
        const dateActivation = this.currentClient.date_activation;
        const dateExpiration = this.currentClient.date_expiration;
        
        // Classe CSS selon le statut
        let statusClass = 'active';
        let statusIcon = 'fa-check-circle';
        let statusText = 'Activée';
        
        if (statut === 'inactive') {
            statusClass = 'inactive';
            statusIcon = 'fa-times-circle';
            statusText = 'Inactive';
        } else if (statut === 'suspendue') {
            statusClass = 'suspended';
            statusIcon = 'fa-pause-circle';
            statusText = 'Suspendue';
        } else if (statut === 'expiree') {
            statusClass = 'expired';
            statusIcon = 'fa-exclamation-circle';
            statusText = 'Expirée';
        }
        
        // Formater les dates
        const formatDate = (isoDate) => {
            if (!isoDate) return 'Non définie';
            const date = new Date(isoDate);
            return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        };
        
        // Calculer la période de validité (date à date)
        const dateActivationFormatted = formatDate(dateActivation);
        const dateExpirationFormatted = formatDate(dateExpiration);
        
        return `
            <div class="card-status-info">
                <div class="status-badge status-${statusClass}">
                    <i class="fas ${statusIcon}"></i>
                    ${statusText}
                </div>
                <div class="card-dates">
                    <div class="date-item">
                        <span class="date-label">Valide du</span>
                        <span class="date-value">${dateActivationFormatted}</span>
                    </div>
                    <div class="date-item">
                        <span class="date-label">Au</span>
                        <span class="date-value">${dateExpirationFormatted}</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Changement de boutique
    async onBoutiqueChange() {
        const boutiqueId = document.getElementById('boutique-selector').value;
        
        Utils.showLoading(true);
        
        try {
            // Récupérer la boutique sélectionnée
            const boutique = await API.get('boutiques', boutiqueId);
            
            // Calculer les points
            const points = await API.calculatePoints(this.currentClient.id, boutiqueId);
            
            // Mettre à jour la carte
            document.getElementById('card-container').innerHTML = await this.renderSingleCard(boutique, points);
            
            // Régénérer le QR code
            this.generateQRCode(this.currentClient.qr_token_client);
            
        } catch (error) {
            console.error('Erreur changement boutique:', error);
        }
        
        Utils.showLoading(false);
    },
    
    // Générer le QR code
    generateQRCode(token) {
        const qrContainer = document.getElementById('client-qrcode');
        if (!qrContainer) return;
        
        qrContainer.innerHTML = '';
        
        try {
            new QRCode(qrContainer, {
                text: token,
                width: 320,
                height: 320,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('Erreur génération QR:', error);
            qrContainer.innerHTML = '<p style="color: red;">Erreur génération QR code</p>';
        }
    },
    
    // Render transactions
    renderTransactions(transactions, boutiques) {
        return transactions.map(t => {
            const boutique = boutiques.find(b => b.id === t.boutique_id);
            const boutiqueName = boutique ? boutique.nom_boutique : 'Boutique inconnue';
            
            // Déterminer si c'est une transaction MONTANT ou POINTS
            const isMontant = t.montant_euros && t.montant_euros > 0;
            const isPositive = isMontant ? true : (t.valeur_points > 0);
            
            // Affichage de la valeur (€ ou points)
            const displayValue = isMontant 
                ? `+${t.montant_euros.toFixed(2)}€` 
                : Utils.formatPoints(t.valeur_points);
            
            return `
                <div class="transaction-item">
                    <div class="transaction-icon ${isPositive ? 'positive' : 'negative'}">
                        <i class="fas fa-${isPositive ? 'plus' : 'gift'}"></i>
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-boutique">${boutiqueName}</div>
                        <div class="transaction-date">${Utils.formatDate(t.date_heure)}</div>
                    </div>
                    <div class="transaction-points ${isPositive ? 'positive' : 'negative'}">
                        ${displayValue}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Helper functions
    getBoutiqueType(nom) {
        const nomLower = nom.toLowerCase();
        if (nomLower.includes('café') || nomLower.includes('coffee') || nomLower.includes('cafe')) return 'cafe';
        if (nomLower.includes('boulang') || nomLower.includes('pain')) return 'boulangerie';
        if (nomLower.includes('salon') || nomLower.includes('coiff')) return 'salon';
        if (nomLower.includes('pressing') || nomLower.includes('laverie')) return 'pressing';
        if (nomLower.includes('restaurant') || nomLower.includes('resto') || nomLower.includes('snack') || nomLower.includes('burger')) return 'restaurant';
        return 'default';
    },
    
    getBoutiqueIcon(type) {
        const icons = {
            cafe: '☕',
            boulangerie: '🥖',
            salon: '💇',
            pressing: '👔',
            restaurant: '🍽️',
            default: '🏪'
        };
        return icons[type] || icons.default;
    },
    
    getBoutiqueBandImage(type) {
        const images = {
            cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=300&fit=crop&q=80',
            boulangerie: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=300&fit=crop&q=80',
            salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=300&fit=crop&q=80',
            pressing: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800&h=300&fit=crop&q=80',
            restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop&q=80',
            default: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=300&fit=crop&q=80'
        };
        return images[type] || images.default;
    },
    
    // Déconnexion
    logout() {
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            Auth.logoutClient();
            this.currentClient = null;
            this.showChoice();
        }
    }
};
