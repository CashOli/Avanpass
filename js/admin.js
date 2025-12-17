// ===================================
// ADMIN - Interface administrateur
// ===================================

const adminApp = {
    currentAdmin: null,
    // Credentials admin par défaut (à changer en production)
    DEFAULT_ADMIN: {
        id: 'admin-001',
        email: 'admin@avanpass.com',
        password: 'admin123'  // À hasher en production
    },
    
    // Initialiser l'espace admin
    async init() {
        this.currentAdmin = Auth.getAdmin();
        
        if (this.currentAdmin) {
            await this.showDashboard();
        } else {
            this.showLogin();
        }
    },
    
    // Afficher le login
    showLogin() {
        document.getElementById('admin-login').classList.add('active');
        document.getElementById('admin-dashboard').classList.remove('active');
    },
    
    // Connexion admin
    async login() {
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value;
        
        if (!email || !password) {
            Utils.showMessage('admin-login-message', 'Veuillez remplir tous les champs', 'error');
            return;
        }
        
        Utils.showLoading(true);
        
        // Vérification simple (en production, utiliser une vraie authentification)
        if (email === this.DEFAULT_ADMIN.email && password === this.DEFAULT_ADMIN.password) {
            const adminData = {
                id: this.DEFAULT_ADMIN.id,
                email: email
            };
            
            Auth.loginAdmin(adminData);
            this.currentAdmin = adminData;
            
            await this.showDashboard();
        } else {
            Utils.showMessage('admin-login-message', 'Email ou mot de passe incorrect', 'error');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher le dashboard
    async showDashboard() {
        document.getElementById('admin-login').classList.remove('active');
        document.getElementById('admin-dashboard').classList.add('active');
        
        Utils.showLoading(true);
        
        try {
            // Charger toutes les données
            const [clientsRes, boutiquesRes, transactionsRes, codesRes] = await Promise.all([
                API.list('clients', { limit: 1000 }),
                API.list('boutiques', { limit: 1000 }),
                API.list('transactions', { limit: 1000 }),
                API.list('codes_activation', { limit: 1000 })
            ]);
            
            const clients = clientsRes.data;
            const boutiques = boutiquesRes.data;
            const transactions = transactionsRes.data;
            const codes = codesRes.data;
            
            // Statistiques
            const clientsActifs = clients.filter(c => c.statut_carte === 'active').length;
            const clientsSuspendus = clients.filter(c => c.statut_carte === 'suspendue').length;
            const boutiquesActives = boutiques.filter(b => b.statut_boutique === 'active').length;
            const boutiquesEnAttente = boutiques.filter(b => b.statut_boutique === 'en_attente').length;
            
            const today = new Date().toISOString().split('T')[0];
            const transactionsToday = transactions.filter(t => t.date_heure.startsWith(today)).length;
            
            const codesDisponibles = codes.filter(c => c.statut === 'disponible').length;
            
            const dashboardHTML = `
                <div class="container">
                    <div class="header">
                        <button class="back-btn" onclick="adminApp.logout()">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                        <h1>Administration</h1>
                    </div>
                    
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-value">${clientsActifs}</div>
                            <div class="stat-label">Clients actifs</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">🏪</div>
                            <div class="stat-value">${boutiquesActives}</div>
                            <div class="stat-label">Boutiques actives</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-value">${transactionsToday}</div>
                            <div class="stat-label">Transactions aujourd'hui</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">🎫</div>
                            <div class="stat-value">${codesDisponibles}</div>
                            <div class="stat-label">Codes disponibles</div>
                        </div>
                    </div>
                    
                    ${boutiquesEnAttente > 0 ? `
                        <div style="background: #fef3c7; padding: 1rem; border-radius: 12px; margin: 2rem 0; border-left: 4px solid var(--warning-color);">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>${boutiquesEnAttente}</strong> boutique(s) en attente de validation
                        </div>
                    ` : ''}
                    
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="adminApp.showClients()">
                            <i class="fas fa-users"></i>
                            Gérer les clients
                        </button>
                        
                        <button class="btn btn-primary" onclick="adminApp.showBoutiques()">
                            <i class="fas fa-store"></i>
                            Gérer les boutiques
                        </button>
                        
                        <button class="btn btn-primary" onclick="adminApp.showTransactions()">
                            <i class="fas fa-exchange-alt"></i>
                            Voir les transactions
                        </button>
                        
                        <button class="btn btn-secondary" onclick="adminApp.showCodes()">
                            <i class="fas fa-ticket-alt"></i>
                            Codes d'activation
                        </button>
                        
                        <button class="btn btn-success" onclick="adminApp.exportData()">
                            <i class="fas fa-download"></i>
                            Exporter les données (CSV)
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('admin-dashboard').innerHTML = dashboardHTML;
            
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher la gestion des clients
    async showClients() {
        Utils.showLoading(true);
        
        try {
            const clientsRes = await API.list('clients', { limit: 1000 });
            const clients = clientsRes.data;
            
            const clientsHTML = `
                <div class="container">
                    <div class="header">
                        <button class="back-btn" onclick="adminApp.showDashboard()">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <h1>Gestion des clients</h1>
                    </div>
                    
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Statut</th>
                                    <th>Date activation</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${clients.map(c => `
                                    <tr>
                                        <td>${c.prenom || ''} ${c.nom || 'Client'}</td>
                                        <td>${c.email || '-'}</td>
                                        <td>
                                            <span class="badge badge-${c.statut_carte === 'active' ? 'success' : c.statut_carte === 'suspendue' ? 'danger' : 'warning'}">
                                                ${Utils.getStatusLabel(c.statut_carte)}
                                            </span>
                                        </td>
                                        <td>${Utils.formatDate(c.date_activation)}</td>
                                        <td>
                                            ${c.statut_carte === 'active' ? `
                                                <button class="btn btn-danger" style="padding: 0.5rem 1rem;" 
                                                    onclick="adminApp.suspendClient('${c.id}')">
                                                    Suspendre
                                                </button>
                                            ` : `
                                                <button class="btn btn-success" style="padding: 0.5rem 1rem;" 
                                                    onclick="adminApp.activateClient('${c.id}')">
                                                    Activer
                                                </button>
                                            `}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            document.getElementById('admin-dashboard').innerHTML = clientsHTML;
            
        } catch (error) {
            console.error('Erreur chargement clients:', error);
        }
        
        Utils.showLoading(false);
    },
    
    // Suspendre un client
    async suspendClient(clientId) {
        if (!Utils.confirm('Voulez-vous vraiment suspendre ce client ?')) return;
        
        Utils.showLoading(true);
        
        try {
            await API.patch('clients', clientId, {
                statut_carte: 'suspendue'
            });
            
            alert('Client suspendu avec succès');
            await this.showClients();
            
        } catch (error) {
            console.error('Erreur suspension client:', error);
            alert('Erreur lors de la suspension du client');
        }
        
        Utils.showLoading(false);
    },
    
    // Activer un client
    async activateClient(clientId) {
        if (!Utils.confirm('Voulez-vous vraiment activer ce client ?')) return;
        
        Utils.showLoading(true);
        
        try {
            await API.patch('clients', clientId, {
                statut_carte: 'active'
            });
            
            alert('Client activé avec succès');
            await this.showClients();
            
        } catch (error) {
            console.error('Erreur activation client:', error);
            alert('Erreur lors de l\'activation du client');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher la gestion des boutiques
    async showBoutiques() {
        Utils.showLoading(true);
        
        try {
            const boutiquesRes = await API.list('boutiques', { limit: 1000 });
            const boutiques = boutiquesRes.data;
            
            const boutiquesHTML = `
                <div class="container">
                    <div class="header">
                        <button class="back-btn" onclick="adminApp.showDashboard()">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <h1>Gestion des boutiques</h1>
                    </div>
                    
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Ville</th>
                                    <th>Email</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${boutiques.map(b => `
                                    <tr>
                                        <td>${b.nom_boutique}</td>
                                        <td>${b.ville || '-'}</td>
                                        <td>${b.login_commercant}</td>
                                        <td>
                                            <span class="badge badge-${b.statut_boutique === 'active' ? 'success' : b.statut_boutique === 'suspendue' ? 'danger' : 'warning'}">
                                                ${Utils.getStatusLabel(b.statut_boutique)}
                                            </span>
                                        </td>
                                        <td>
                                            ${b.statut_boutique === 'en_attente' ? `
                                                <button class="btn btn-success" style="padding: 0.5rem 1rem;" 
                                                    onclick="adminApp.validateBoutique('${b.id}')">
                                                    Valider
                                                </button>
                                            ` : b.statut_boutique === 'active' ? `
                                                <button class="btn btn-danger" style="padding: 0.5rem 1rem;" 
                                                    onclick="adminApp.suspendBoutique('${b.id}')">
                                                    Suspendre
                                                </button>
                                            ` : `
                                                <button class="btn btn-success" style="padding: 0.5rem 1rem;" 
                                                    onclick="adminApp.activateBoutique('${b.id}')">
                                                    Activer
                                                </button>
                                            `}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            document.getElementById('admin-dashboard').innerHTML = boutiquesHTML;
            
        } catch (error) {
            console.error('Erreur chargement boutiques:', error);
        }
        
        Utils.showLoading(false);
    },
    
    // Valider une boutique
    async validateBoutique(boutiqueId) {
        if (!Utils.confirm('Voulez-vous vraiment valider cette boutique ?')) return;
        
        Utils.showLoading(true);
        
        try {
            await API.patch('boutiques', boutiqueId, {
                statut_boutique: 'active'
            });
            
            alert('Boutique validée avec succès');
            await this.showBoutiques();
            
        } catch (error) {
            console.error('Erreur validation boutique:', error);
            alert('Erreur lors de la validation de la boutique');
        }
        
        Utils.showLoading(false);
    },
    
    // Suspendre une boutique
    async suspendBoutique(boutiqueId) {
        if (!Utils.confirm('Voulez-vous vraiment suspendre cette boutique ?')) return;
        
        Utils.showLoading(true);
        
        try {
            await API.patch('boutiques', boutiqueId, {
                statut_boutique: 'suspendue'
            });
            
            alert('Boutique suspendue avec succès');
            await this.showBoutiques();
            
        } catch (error) {
            console.error('Erreur suspension boutique:', error);
            alert('Erreur lors de la suspension de la boutique');
        }
        
        Utils.showLoading(false);
    },
    
    // Activer une boutique
    async activateBoutique(boutiqueId) {
        if (!Utils.confirm('Voulez-vous vraiment activer cette boutique ?')) return;
        
        Utils.showLoading(true);
        
        try {
            await API.patch('boutiques', boutiqueId, {
                statut_boutique: 'active'
            });
            
            alert('Boutique activée avec succès');
            await this.showBoutiques();
            
        } catch (error) {
            console.error('Erreur activation boutique:', error);
            alert('Erreur lors de l\'activation de la boutique');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher les transactions
    async showTransactions() {
        Utils.showLoading(true);
        
        try {
            const [transactionsRes, clientsRes, boutiquesRes] = await Promise.all([
                API.list('transactions', { limit: 1000 }),
                API.list('clients', { limit: 1000 }),
                API.list('boutiques', { limit: 1000 })
            ]);
            
            const transactions = transactionsRes.data;
            const clients = clientsRes.data;
            const boutiques = boutiquesRes.data;
            
            // Créer des maps pour lookup rapide
            const clientsMap = {};
            clients.forEach(c => clientsMap[c.id] = c);
            
            const boutiquesMap = {};
            boutiques.forEach(b => boutiquesMap[b.id] = b);
            
            const transactionsHTML = `
                <div class="container">
                    <div class="header">
                        <button class="back-btn" onclick="adminApp.showDashboard()">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <h1>Transactions</h1>
                    </div>
                    
                    <button class="btn btn-success mb-3" onclick="adminApp.addCorrection()">
                        <i class="fas fa-edit"></i>
                        Ajouter une correction
                    </button>
                    
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Boutique</th>
                                    <th>Client</th>
                                    <th>Type</th>
                                    <th>Points</th>
                                    <th>Commentaire</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions.slice(0, 100).map(t => {
                                    const client = clientsMap[t.client_id];
                                    const boutique = boutiquesMap[t.boutique_id];
                                    return `
                                        <tr>
                                            <td>${Utils.formatDate(t.date_heure)}</td>
                                            <td>${boutique ? boutique.nom_boutique : '-'}</td>
                                            <td>${client ? `${client.prenom || ''} ${client.nom || 'Client'}` : '-'}</td>
                                            <td>
                                                <span class="badge badge-${t.type === 'passage_valide' ? 'success' : t.type === 'correction_admin' ? 'warning' : 'info'}">
                                                    ${t.type === 'passage_valide' ? 'Passage' : t.type === 'recompense_utilisee' ? 'Récompense' : 'Correction'}
                                                </span>
                                            </td>
                                            <td style="font-weight: 700; color: ${t.valeur_points > 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                                                ${Utils.formatPoints(t.valeur_points)}
                                            </td>
                                            <td>${t.commentaire || '-'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <p class="text-center text-muted">Affichage des 100 dernières transactions</p>
                </div>
            `;
            
            document.getElementById('admin-dashboard').innerHTML = transactionsHTML;
            
        } catch (error) {
            console.error('Erreur chargement transactions:', error);
        }
        
        Utils.showLoading(false);
    },
    
    // Ajouter une correction
    async addCorrection() {
        const motif = prompt('Motif de la correction :');
        if (!motif) return;
        
        const points = parseInt(prompt('Nombre de points (+ ou -) :'));
        if (isNaN(points)) return;
        
        // Pour simplifier, on demande l'ID du client
        const clientId = prompt('ID du client :');
        if (!clientId) return;
        
        const boutiqueId = prompt('ID de la boutique :');
        if (!boutiqueId) return;
        
        Utils.showLoading(true);
        
        try {
            const transaction = {
                id: Utils.generateUUID(),
                date_heure: new Date().toISOString(),
                boutique_id: boutiqueId,
                client_id: clientId,
                type: 'correction_admin',
                valeur_points: points,
                commentaire: motif,
                operateur: this.currentAdmin.id
            };
            
            await API.create('transactions', transaction);
            
            alert('Correction ajoutée avec succès');
            await this.showTransactions();
            
        } catch (error) {
            console.error('Erreur ajout correction:', error);
            alert('Erreur lors de l\'ajout de la correction');
        }
        
        Utils.showLoading(false);
    },
    
    // Afficher les codes d'activation
    async showCodes() {
        Utils.showLoading(true);
        
        try {
            const codesRes = await API.list('codes_activation', { limit: 1000 });
            const codes = codesRes.data;
            
            const codesHTML = `
                <div class="container">
                    <div class="header">
                        <button class="back-btn" onclick="adminApp.showDashboard()">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <h1>Codes d'activation</h1>
                    </div>
                    
                    <button class="btn btn-primary mb-3" onclick="adminApp.generateCodes()">
                        <i class="fas fa-plus-circle"></i>
                        Générer des codes
                    </button>
                    
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Statut</th>
                                    <th>Client ID</th>
                                    <th>Date utilisation</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${codes.map(c => `
                                    <tr>
                                        <td style="font-family: monospace; font-weight: 600;">${c.code_activation}</td>
                                        <td>
                                            <span class="badge badge-${c.statut === 'disponible' ? 'success' : c.statut === 'utilise' ? 'info' : 'danger'}">
                                                ${Utils.getStatusLabel(c.statut)}
                                            </span>
                                        </td>
                                        <td>${c.client_id || '-'}</td>
                                        <td>${c.date_utilisation ? Utils.formatDate(c.date_utilisation) : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            document.getElementById('admin-dashboard').innerHTML = codesHTML;
            
        } catch (error) {
            console.error('Erreur chargement codes:', error);
        }
        
        Utils.showLoading(false);
    },
    
    // Générer des codes d'activation
    async generateCodes() {
        const count = parseInt(prompt('Combien de codes voulez-vous générer ?', '10'));
        if (!count || count < 1 || count > 100) {
            alert('Veuillez entrer un nombre entre 1 et 100');
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            const codes = [];
            for (let i = 0; i < count; i++) {
                codes.push({
                    id: Utils.generateUUID(),
                    code_activation: Utils.generateActivationCode(),
                    statut: 'disponible',
                    client_id: null,
                    date_utilisation: null
                });
            }
            
            // Créer tous les codes
            for (const code of codes) {
                await API.create('codes_activation', code);
            }
            
            alert(`${count} code(s) généré(s) avec succès`);
            await this.showCodes();
            
        } catch (error) {
            console.error('Erreur génération codes:', error);
            alert('Erreur lors de la génération des codes');
        }
        
        Utils.showLoading(false);
    },
    
    // Exporter les données
    async exportData() {
        Utils.showLoading(true);
        
        try {
            const [clientsRes, boutiquesRes, transactionsRes] = await Promise.all([
                API.list('clients', { limit: 10000 }),
                API.list('boutiques', { limit: 10000 }),
                API.list('transactions', { limit: 10000 })
            ]);
            
            // Exporter chaque table
            Utils.exportToCSV(clientsRes.data, 'avanpass_clients.csv');
            setTimeout(() => {
                Utils.exportToCSV(boutiquesRes.data, 'avanpass_boutiques.csv');
            }, 500);
            setTimeout(() => {
                Utils.exportToCSV(transactionsRes.data, 'avanpass_transactions.csv');
            }, 1000);
            
            alert('Export des données réussi !');
            
        } catch (error) {
            console.error('Erreur export:', error);
            alert('Erreur lors de l\'export des données');
        }
        
        Utils.showLoading(false);
    },
    
    // Déconnexion
    logout() {
        if (Utils.confirm('Voulez-vous vraiment vous déconnecter ?')) {
            Auth.logoutAdmin();
            this.currentAdmin = null;
            app.navigateTo('home');
        }
    }
};
