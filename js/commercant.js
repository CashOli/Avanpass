// ===================================
// COMMERCANT - Interface commerçant
// ===================================

const commercantApp = {
    currentBoutique: null,
    html5QrCode: null,
    scannedClient: null,
    
    // Initialiser l'espace commerçant
    async init() {
        this.currentBoutique = Auth.getCommercant();
        
        if (this.currentBoutique) {
            await this.showDashboard();
        } else {
            this.showLogin();
        }
    },
    
    // Afficher le login
    showLogin() {
        document.getElementById('commercant-login').classList.add('active');
        document.getElementById('commercant-registration').classList.remove('active');
        document.getElementById('commercant-dashboard').classList.remove('active');
        document.getElementById('commercant-scanner').classList.remove('active');
    },
    
    // Connexion commerçant
    async login() {
        const email = document.getElementById('commercant-email').value.trim();
        const password = document.getElementById('commercant-password').value;
        
        if (!email || !password) {
            Utils.showMessage('commercant-login-message', 'Veuillez remplir tous les champs', 'error');
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            const boutique = await API.findBoutiqueByLogin(email);
            
            if (!boutique) {
                Utils.showMessage('commercant-login-message', 'Email ou mot de passe incorrect', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Vérifier le mot de passe
            const isValid = await Auth.verifyPassword(password, boutique.password_hash);
            
            if (!isValid) {
                Utils.showMessage('commercant-login-message', 'Email ou mot de passe incorrect', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Vérifier le statut
            if (boutique.statut_boutique === 'en_attente') {
                Utils.showMessage('commercant-login-message', 'Votre compte est en attente de validation par l\'administrateur', 'warning');
                Utils.showLoading(false);
                return;
            }
            
            if (boutique.statut_boutique === 'suspendue') {
                Utils.showMessage('commercant-login-message', 'Votre compte a été suspendu. Contactez l\'administrateur.', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Connexion réussie
            Auth.loginCommercant(boutique);
            this.currentBoutique = boutique;
            
            await this.showDashboard();
            
        } catch (error) {
            console.error('Erreur connexion:', error);
            Utils.showMessage('commercant-login-message', 'Erreur de connexion. Veuillez réessayer.', 'error');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher le formulaire d'inscription
    showRegistration() {
        document.getElementById('commercant-login').classList.remove('active');
        document.getElementById('commercant-registration').classList.add('active');
        
        const registrationHTML = `
            <div class="container">
                <div class="header">
                    <button class="back-btn" onclick="commercantApp.showLogin()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>Créer mon compte</h1>
                </div>
                
                <div class="form-group">
                    <label>Nom de la boutique *</label>
                    <input type="text" id="reg-nom-boutique" class="form-control" placeholder="Ma Boutique">
                </div>
                
                <div class="form-group">
                    <label>Adresse</label>
                    <input type="text" id="reg-adresse" class="form-control" placeholder="123 Rue Example">
                </div>
                
                <div class="form-group">
                    <label>Ville</label>
                    <input type="text" id="reg-ville" class="form-control" placeholder="Paris">
                </div>
                
                <div class="form-group">
                    <label>Responsable</label>
                    <input type="text" id="reg-responsable" class="form-control" placeholder="Jean Dupont">
                </div>
                
                <div class="form-group">
                    <label>Téléphone</label>
                    <input type="tel" id="reg-telephone" class="form-control" placeholder="06 12 34 56 78">
                </div>
                
                <div class="form-group">
                    <label>Email (connexion) *</label>
                    <input type="email" id="reg-email" class="form-control" placeholder="contact@maboutique.fr">
                </div>
                
                <div class="form-group">
                    <label>Mot de passe *</label>
                    <input type="password" id="reg-password" class="form-control" placeholder="••••••••">
                </div>
                
                <div class="form-group">
                    <label>Nombre de passages pour une récompense *</label>
                    <input type="number" id="reg-seuil" class="form-control" value="10" min="1">
                </div>
                
                <div class="form-group">
                    <label>Libellé de la récompense *</label>
                    <input type="text" id="reg-recompense" class="form-control" placeholder="1 café offert">
                </div>
                
                <button class="btn btn-primary btn-large" onclick="commercantApp.register()">
                    <i class="fas fa-check-circle"></i>
                    Créer mon compte
                </button>
                
                <div id="registration-message" class="message"></div>
            </div>
        `;
        
        document.getElementById('commercant-registration').innerHTML = registrationHTML;
    },
    
    // Inscription commerçant
    async register() {
        const nomBoutique = document.getElementById('reg-nom-boutique').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const seuil = parseInt(document.getElementById('reg-seuil').value);
        const recompense = document.getElementById('reg-recompense').value.trim();
        
        if (!nomBoutique || !email || !password || !seuil || !recompense) {
            Utils.showMessage('registration-message', 'Veuillez remplir tous les champs obligatoires (*)', 'error');
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            // Vérifier si l'email existe déjà
            const existing = await API.findBoutiqueByLogin(email);
            if (existing) {
                Utils.showMessage('registration-message', 'Cette adresse email est déjà utilisée', 'error');
                Utils.showLoading(false);
                return;
            }
            
            // Hasher le mot de passe
            const passwordHash = await Auth.hashPassword(password);
            
            // Créer la boutique
            const boutiqueData = {
                id: Utils.generateUUID(),
                nom_boutique: nomBoutique,
                adresse: document.getElementById('reg-adresse').value.trim(),
                ville: document.getElementById('reg-ville').value.trim(),
                responsable: document.getElementById('reg-responsable').value.trim(),
                telephone: document.getElementById('reg-telephone').value.trim(),
                statut_boutique: 'en_attente',
                login_commercant: email,
                password_hash: passwordHash,
                recompense_seuil_points: seuil,
                recompense_libelle: recompense
            };
            
            await API.create('boutiques', boutiqueData);
            
            Utils.showMessage('registration-message', 'Compte créé avec succès ! Votre compte est en attente de validation par l\'administrateur.', 'success');
            
            setTimeout(() => {
                this.showLogin();
            }, 3000);
            
        } catch (error) {
            console.error('Erreur inscription:', error);
            
            // Diagnostic détaillé pour mobile
            let errorDetails = '🔍 DIAGNOSTIC ERREUR INSCRIPTION:\n\n';
            errorDetails += `Message: ${error.message || 'Aucun message'}\n\n`;
            errorDetails += `Données tentées:\n`;
            errorDetails += `- Nom boutique: ${nomBoutique}\n`;
            errorDetails += `- Email: ${email}\n`;
            errorDetails += `- Seuil: ${seuil}\n`;
            errorDetails += `- Récompense: ${recompense}\n\n`;
            
            if (error.message.includes('400')) {
                errorDetails += '⚠️ Code 400: Données invalides\n';
                errorDetails += 'Cause: Un champ requis manque ou est invalide';
            } else if (error.message.includes('404')) {
                errorDetails += '⚠️ Code 404: Table non trouvée\n';
                errorDetails += 'Cause: La table "boutiques" n\'existe pas';
            } else if (error.message.includes('500')) {
                errorDetails += '⚠️ Code 500: Erreur serveur';
            }
            
            alert(errorDetails);
            
            Utils.showMessage('registration-message', 'Erreur lors de l\'inscription. Veuillez réessayer.', 'error');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher le dashboard
    async showDashboard() {
        document.getElementById('commercant-login').classList.remove('active');
        document.getElementById('commercant-registration').classList.remove('active');
        document.getElementById('commercant-dashboard').classList.add('active');
        document.getElementById('commercant-scanner').classList.remove('active');
        
        Utils.showLoading(true);
        
        try {
            // Récupérer les transactions de la boutique
            const transactionsResponse = await API.list('transactions', { limit: 1000 });
            const transactions = transactionsResponse.data.filter(t => t.boutique_id === this.currentBoutique.id);
            
            // Statistiques
            const today = new Date().toISOString().split('T')[0];
            const todayTransactions = transactions.filter(t => t.date_heure.startsWith(today));
            const passagesValides = transactions.filter(t => t.type === 'passage_valide').length;
            const recompensesUtilisees = transactions.filter(t => t.type === 'recompense_utilisee').length;
            
            const dashboardHTML = `
                <div class="container">
                    <div class="header">
                        <button class="back-btn" onclick="commercantApp.logout()">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                        <h1>${this.currentBoutique.nom_boutique}</h1>
                    </div>
                    
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-value">${passagesValides}</div>
                            <div class="stat-label">Passages validés</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">🎁</div>
                            <div class="stat-value">${recompensesUtilisees}</div>
                            <div class="stat-label">Récompenses utilisées</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">📅</div>
                            <div class="stat-value">${todayTransactions.length}</div>
                            <div class="stat-label">Transactions aujourd'hui</div>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-large" onclick="commercantApp.showScanner()">
                            <i class="fas fa-qrcode"></i>
                            Scanner une carte client
                        </button>
                        
                        <button class="btn btn-secondary" onclick="commercantApp.showSettings()">
                            <i class="fas fa-cog"></i>
                            Paramètres fidélité
                        </button>
                    </div>
                    
                    <div class="history-section">
                        <h3><i class="fas fa-history"></i> Transactions récentes</h3>
                        ${this.renderTransactions(transactions.slice(0, 20))}
                    </div>
                </div>
            `;
            
            document.getElementById('commercant-dashboard').innerHTML = dashboardHTML;
            
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher les paramètres
    showSettings() {
        const settingsHTML = `
            <div class="container">
                <div class="header">
                    <button class="back-btn" onclick="commercantApp.showDashboard()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>Paramètres fidélité</h1>
                </div>
                
                <div class="form-group">
                    <label>Nombre de passages pour une récompense</label>
                    <input type="number" id="settings-seuil" class="form-control" 
                        value="${this.currentBoutique.recompense_seuil_points}" min="1">
                </div>
                
                <div class="form-group">
                    <label>Libellé de la récompense</label>
                    <input type="text" id="settings-recompense" class="form-control" 
                        value="${this.currentBoutique.recompense_libelle}">
                </div>
                
                <button class="btn btn-primary btn-large" onclick="commercantApp.saveSettings()">
                    <i class="fas fa-save"></i>
                    Enregistrer
                </button>
                
                <div id="settings-message" class="message"></div>
            </div>
        `;
        
        document.getElementById('commercant-dashboard').innerHTML = settingsHTML;
    },
    
    // Sauvegarder les paramètres
    async saveSettings() {
        const seuil = parseInt(document.getElementById('settings-seuil').value);
        const recompense = document.getElementById('settings-recompense').value.trim();
        
        if (!seuil || !recompense) {
            Utils.showMessage('settings-message', 'Veuillez remplir tous les champs', 'error');
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            await API.patch('boutiques', this.currentBoutique.id, {
                recompense_seuil_points: seuil,
                recompense_libelle: recompense
            });
            
            // Mettre à jour les données locales
            this.currentBoutique.recompense_seuil_points = seuil;
            this.currentBoutique.recompense_libelle = recompense;
            Auth.loginCommercant(this.currentBoutique);
            
            Utils.showMessage('settings-message', 'Paramètres enregistrés avec succès !', 'success');
            
            setTimeout(() => {
                this.showDashboard();
            }, 1500);
            
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            Utils.showMessage('settings-message', 'Erreur lors de la sauvegarde. Veuillez réessayer.', 'error');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher le scanner QR
    showScanner() {
        document.getElementById('commercant-dashboard').classList.remove('active');
        document.getElementById('commercant-scanner').classList.add('active');
        
        const scannerHTML = `
            <div class="container">
                <div class="header">
                    <button class="back-btn" onclick="commercantApp.stopScanner()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h1>Scanner QR Code</h1>
                </div>
                
                <div class="scanner-container">
                    <div id="qr-reader"></div>
                </div>
                
                <div id="scan-result-container"></div>
                
                <p class="text-center text-muted mt-3">
                    Positionnez le QR code de la carte client devant la caméra
                </p>
            </div>
        `;
        
        document.getElementById('commercant-scanner').innerHTML = scannerHTML;
        
        // Démarrer le scanner
        setTimeout(() => {
            this.startScanner();
        }, 500);
    },
    
    // Démarrer le scanner
    startScanner() {
        this.html5QrCode = new Html5Qrcode("qr-reader");
        
        this.html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                this.onScanSuccess(decodedText);
            },
            (errorMessage) => {
                // Ignorer les erreurs de scan
            }
        ).catch(err => {
            console.error('Erreur démarrage scanner:', err);
            alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
        });
    },
    
    // Arrêter le scanner
    async stopScanner() {
        if (this.html5QrCode) {
            try {
                await this.html5QrCode.stop();
                this.html5QrCode = null;
            } catch (error) {
                console.error('Erreur arrêt scanner:', error);
            }
        }
        this.showDashboard();
    },
    
    // Scan réussi
    async onScanSuccess(qrToken) {
        // Arrêter le scanner
        if (this.html5QrCode) {
            await this.html5QrCode.stop();
            this.html5QrCode = null;
        }
        
        Utils.showLoading(true);
        
        try {
            // Chercher le client
            const client = await API.findClientByQR(qrToken);
            
            if (!client) {
                this.showScanError('Carte client non trouvée');
                Utils.showLoading(false);
                return;
            }
            
            // Vérifier le statut
            if (!Utils.isCardValid(client.statut_carte)) {
                this.showScanError(`Carte ${Utils.getStatusLabel(client.statut_carte).toLowerCase()}. Cette carte ne peut pas être utilisée.`);
                Utils.showLoading(false);
                return;
            }
            
            // Calculer les points
            const points = await API.calculatePoints(client.id, this.currentBoutique.id);
            
            this.scannedClient = client;
            await this.showScanResult(client, points);
            
        } catch (error) {
            console.error('Erreur traitement scan:', error);
            this.showScanError('Erreur lors du traitement du QR code');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher le résultat du scan
    async showScanResult(client, points) {
        const typeProgramme = this.currentBoutique.type_programme || 'points';
        const isMontant = (typeProgramme === 'montant');
        
        // Calcul selon le type de programme
        let progressInfo, hasReward;
        if (isMontant) {
            const montantTotal = await API.calculateMontantDepense(client.id, this.currentBoutique.id);
            const paliers = this.currentBoutique.paliers_montant || [];
            const recompenses = await API.getRecompensesDisponibles(client.id, this.currentBoutique.id, paliers);
            progressInfo = { montantTotal, recompenses };
            hasReward = recompenses.some(r => r.disponible && !r.utilise);
        } else {
            const seuil = this.currentBoutique.recompense_seuil_points;
            hasReward = points >= seuil;
            const progress = Math.min((points / seuil) * 100, 100);
            progressInfo = { points, seuil, progress };
        }
        
        const resultHTML = `
            <div class="scan-result">
                <div class="client-info-card">
                    <h3 style="text-align: center; margin-bottom: 1rem;">
                        <i class="fas fa-user-circle"></i> 
                        ${client.prenom || 'Client'} ${client.nom || ''}
                    </h3>
                    
                    <div class="client-info-row">
                        <span class="info-label">Statut carte</span>
                        <span class="info-value">
                            <span class="badge badge-success">${Utils.getStatusLabel(client.statut_carte)}</span>
                        </span>
                    </div>
                    
                    ${isMontant ? `
                        <div class="client-info-row">
                            <span class="info-label">Total dépensé</span>
                            <span class="info-value" style="font-size: 1.5rem; color: var(--primary-color);">
                                ${progressInfo.montantTotal.toFixed(2)}€
                            </span>
                        </div>
                    ` : `
                        <div class="client-info-row">
                            <span class="info-label">Points actuels</span>
                            <span class="info-value" style="font-size: 1.5rem; color: var(--primary-color);">
                                ${progressInfo.points} / ${progressInfo.seuil}
                            </span>
                        </div>
                        
                        <div class="progress-bar" style="margin: 1rem 0;">
                            <div class="progress-fill" style="width: ${progressInfo.progress}%;"></div>
                        </div>
                    `}
                </div>
                
                ${isMontant ? `
                    <div class="form-group" style="margin: 1.5rem 0;">
                        <label for="achatMontant" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-euro-sign"></i> Montant de l'achat :
                        </label>
                        <input type="number" id="achatMontant" step="0.01" min="0" placeholder="0.00" 
                               class="form-control" style="font-size: 1.5rem; text-align: center;" />
                    </div>
                    
                    ${hasReward ? `
                        <div style="background: #d1fae5; padding: 1rem; border-radius: 12px; margin: 1rem 0; text-align: center;">
                            <i class="fas fa-gift" style="font-size: 2rem; color: var(--success-color);"></i>
                            <p style="margin: 0.5rem 0; font-weight: 600;">Récompense(s) disponible(s) !</p>
                        </div>
                    ` : ''}
                    
                    <button class="btn btn-primary btn-large" onclick="commercantApp.validatePassage()">
                        <i class="fas fa-check-circle"></i>
                        Valider l'achat
                    </button>
                ` : `
                    ${hasReward ? `
                        <div style="background: #d1fae5; padding: 1rem; border-radius: 12px; margin: 1rem 0; text-align: center;">
                            <i class="fas fa-gift" style="font-size: 2rem; color: var(--success-color);"></i>
                            <p style="margin: 0.5rem 0; font-weight: 600;">Récompense disponible !</p>
                            <p style="margin: 0; color: var(--text-secondary);">${this.currentBoutique.recompense_libelle}</p>
                        </div>
                        
                        <button class="btn btn-success btn-large" onclick="commercantApp.validateReward()">
                            <i class="fas fa-check-circle"></i>
                            Valider la récompense (-${progressInfo.seuil} points)
                        </button>
                        
                        <button class="btn btn-primary btn-large" onclick="commercantApp.validatePassage()">
                            <i class="fas fa-plus-circle"></i>
                            Valider 1 passage (+1 point)
                        </button>
                    ` : `
                        <button class="btn btn-primary btn-large" onclick="commercantApp.validatePassage()">
                            <i class="fas fa-plus-circle"></i>
                            Valider 1 passage (+1 point)
                        </button>
                        
                        <p class="text-center text-muted mt-2">
                            Encore ${progressInfo.seuil - progressInfo.points} passage(s) avant la récompense
                        </p>
                    `}
                `}
                
                <button class="btn btn-secondary" onclick="commercantApp.showScanner()">
                    Scanner une autre carte
                </button>
                
                <div id="validation-message" class="message"></div>
            </div>
        `;
        
        document.getElementById('scan-result-container').innerHTML = resultHTML;
    },
    
    // Afficher une erreur de scan
    showScanError(message) {
        const errorHTML = `
            <div class="scan-result">
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: var(--danger-color);"></i>
                    <h3 style="margin-top: 1rem; color: var(--danger-color);">Erreur</h3>
                    <p>${message}</p>
                </div>
                
                <button class="btn btn-primary btn-large" onclick="commercantApp.showScanner()">
                    <i class="fas fa-qrcode"></i>
                    Réessayer
                </button>
            </div>
        `;
        
        document.getElementById('scan-result-container').innerHTML = errorHTML;
    },
    
    // Valider un passage - VERSION RECODÉE
    async validatePassage() {
        // Vérifications de base
        if (!this.scannedClient) {
            alert('❌ ERREUR: Aucun client scanné');
            return;
        }
        
        if (!this.currentBoutique) {
            alert('❌ ERREUR: Aucune boutique connectée');
            return;
        }
        
        const typeProgramme = this.currentBoutique.type_programme || 'points';
        const isMontant = (typeProgramme === 'montant');
        
        // Si mode MONTANT, vérifier le montant saisi
        let montant = 0;
        if (isMontant) {
            const montantInput = document.getElementById('achatMontant');
            if (!montantInput) {
                alert('❌ ERREUR: Champ montant introuvable');
                return;
            }
            montant = parseFloat(montantInput.value);
            if (!montant || montant <= 0) {
                alert('⚠️ Veuillez saisir un montant valide (supérieur à 0€)');
                return;
            }
        }
        
        // Confirmation
        const confirmMsg = isMontant 
            ? `✅ Valider l'achat de ${montant.toFixed(2)}€ pour ${this.scannedClient.prenom} ${this.scannedClient.nom || ''} ?`
            : `✅ Valider le passage de ${this.scannedClient.prenom} ${this.scannedClient.nom || ''} ?`;
        
        if (!confirm(confirmMsg)) {
            return;
        }
        
        // Afficher le chargement
        Utils.showLoading(true);
        
        try {
            // Préparer les données de la transaction (v2.1.0 - Support 3 programmes)
            const now = new Date();
            const transactionData = {
                client_id: this.scannedClient.id,
                boutique_id: this.currentBoutique.id,
                type: 'passage_valide',
                date_heure: now.toISOString(),
                commentaire: '',
                operateur: this.currentBoutique.id
            };
            
            // Selon le type de programme
            if (isMontant) {
                transactionData.montant_euros = montant;
                transactionData.valeur_points = null;
            } else {
                transactionData.valeur_points = 1;
                transactionData.montant_euros = 0;
            }
            
            // Envoyer via l'API Supabase (v2.1.0)
            const result = await API.create('transactions', transactionData);
            
            // Succès !
            const successMsg = isMontant 
                ? `✅ Achat de ${montant.toFixed(2)}€ validé avec succès !`
                : '✅ Passage validé avec succès ! +1 point';
            
            Utils.showMessage('validation-message', successMsg, 'success');
            
            // Retour au dashboard après 2 secondes
            setTimeout(() => {
                this.showDashboard();
            }, 2000);
            
        } catch (error) {
            // Afficher l'erreur détaillée
            const errorMsg = `❌ ERREUR DE VALIDATION\n\n` +
                `Message: ${error.message}\n\n` +
                `Client: ${this.scannedClient.prenom} ${this.scannedClient.nom || ''}\n` +
                `Client ID: ${this.scannedClient.id}\n\n` +
                `Boutique: ${this.currentBoutique.nom_boutique}\n` +
                `Boutique ID: ${this.currentBoutique.id}\n\n` +
                `Action: ${isMontant ? `+${montant.toFixed(2)}€ (passage_valide - montant)` : '+1 point (passage_valide)'}`;
            
            alert(errorMsg);
            console.error('Erreur validation:', error);
            
            Utils.showMessage('validation-message', 
                '❌ Erreur lors de la validation. Voir les détails dans la popup.', 
                'error');
        } finally {
            Utils.showLoading(false);
        }
    },
    
    // Valider une récompense - VERSION RECODÉE
    async validateReward() {
        if (!this.scannedClient) {
            alert('❌ ERREUR: Aucun client scanné');
            return;
        }
        
        if (!this.currentBoutique) {
            alert('❌ ERREUR: Aucune boutique connectée');
            return;
        }
        
        // Confirmation
        if (!confirm(`✅ Valider la récompense "${this.currentBoutique.recompense_libelle}" ?\n\nLes points seront réinitialisés à 0.`)) {
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            // Préparer les données de la transaction
            const now = new Date();
            const transactionData = {
                client_id: this.scannedClient.id,
                boutique_id: this.currentBoutique.id,
                type: 'recompense_utilisee',
                valeur_points: -this.currentBoutique.recompense_seuil_points,
                date_heure: now.toISOString(),
                commentaire: this.currentBoutique.recompense_libelle,
                operateur: this.currentBoutique.id
            };
            
            // Envoyer via l'API Supabase (v2.0.1)
            const result = await API.create('transactions', transactionData);
            
            // Succès !
            Utils.showMessage('validation-message', '🎁 Récompense validée avec succès !', 'success');
            
            // Retour au dashboard
            setTimeout(() => {
                this.showDashboard();
            }, 2000);
            
        } catch (error) {
            // Afficher l'erreur détaillée
            const errorMsg = `❌ ERREUR DE VALIDATION RÉCOMPENSE\n\n` +
                `Message: ${error.message}\n\n` +
                `Client: ${this.scannedClient.prenom} ${this.scannedClient.nom || ''}\n` +
                `Boutique: ${this.currentBoutique.nom_boutique}\n\n` +
                `Récompense: ${this.currentBoutique.recompense_libelle}`;
            
            alert(errorMsg);
            console.error('Erreur validation récompense:', error);
            
            Utils.showMessage('validation-message', 
                '❌ Erreur lors de la validation. Voir les détails dans la popup.', 
                'error');
        } finally {
            Utils.showLoading(false);
        }
    },
    
    // Render transactions
    renderTransactions(transactions) {
        if (transactions.length === 0) {
            return '<p class="text-center text-muted">Aucune transaction</p>';
        }
        
        return transactions.map(t => {
            const isPositive = t.valeur_points > 0;
            return `
                <div class="transaction-item">
                    <div class="transaction-icon ${isPositive ? 'positive' : 'negative'}">
                        <i class="fas fa-${isPositive ? 'plus' : 'gift'}"></i>
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-boutique">${t.type === 'passage_valide' ? 'Passage validé' : 'Récompense utilisée'}</div>
                        <div class="transaction-date">${Utils.formatDate(t.date_heure)}</div>
                    </div>
                    <div class="transaction-points ${isPositive ? 'positive' : 'negative'}">
                        ${Utils.formatPoints(t.valeur_points)}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Déconnexion
    logout() {
        if (Utils.confirm('Voulez-vous vraiment vous déconnecter ?')) {
            Auth.logoutCommercant();
            this.currentBoutique = null;
            app.navigateTo('home');
        }
    }
};
