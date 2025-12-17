// ===================================
// APP - Application principale
// ===================================

const app = {
    // Initialiser l'application
    async init() {
        console.log('🚀 AvanPass - Initialisation...');
        
        // Masquer le loading après un court délai
        setTimeout(() => {
            Utils.showLoading(false);
        }, 500);
        
        // Vérifier le hash de l'URL pour navigation directe
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.navigateTo(hash);
        }
        
        console.log('✅ AvanPass - Prêt !');
    },
    
    // Générateur de données de démonstration rapide
    async genererDonneesDemoRapide() {
        if (!confirm('⚠️ Cela va créer des données de test (clients, boutiques, transactions).\n\nVoulez-vous continuer ?')) {
            return;
        }
        
        Utils.showLoading(true);
        
        try {
            // 1. Générer 10 codes d'activation
            console.log('🎫 Génération de 10 codes...');
            const codes = [];
            for (let i = 0; i < 10; i++) {
                const code = await API.create('codes_activation', {
                    id: Utils.generateUUID(),
                    code_activation: Utils.generateActivationCode(),
                    statut: 'disponible',
                    client_id: null,
                    date_utilisation: null
                });
                codes.push(code);
            }
            
            // 2. Créer 3 boutiques
            console.log('🏪 Création de 3 boutiques...');
            const boutiquesData = [
                { nom: 'Café du Coin', email: 'cafe@ducoin.fr', seuil: 10, recompense: '1 café offert' },
                { nom: 'Boulangerie Martin', email: 'boulangerie@martin.fr', seuil: 8, recompense: '1 baguette offerte' },
                { nom: 'Salon Élégance', email: 'salon@elegance.fr', seuil: 5, recompense: '1 coupe gratuite' }
            ];
            
            const boutiques = [];
            for (const data of boutiquesData) {
                const boutique = await API.create('boutiques', {
                    id: Utils.generateUUID(),
                    nom_boutique: data.nom,
                    adresse: '123 Rue Example',
                    ville: 'Paris',
                    responsable: 'Responsable',
                    telephone: '01 23 45 67 89',
                    statut_boutique: 'active',
                    login_commercant: data.email,
                    password_hash: await Auth.hashPassword('demo123'),
                    recompense_seuil_points: data.seuil,
                    recompense_libelle: data.recompense
                });
                boutiques.push(boutique);
            }
            
            // 3. Créer 5 clients
            console.log('👥 Création de 5 clients...');
            const prenoms = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Luc'];
            const noms = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Robert'];
            
            const clients = [];
            for (let i = 0; i < 5; i++) {
                const client = await API.create('clients', {
                    id: Utils.generateUUID(),
                    prenom: prenoms[i],
                    nom: noms[i],
                    email: `${prenoms[i].toLowerCase()}.${noms[i].toLowerCase()}@example.com`,
                    telephone: `06 ${10 + i} 23 45 67`,
                    statut_carte: 'active',
                    date_activation: new Date().toISOString(),
                    date_expiration: null,
                    qr_token_client: Utils.generateQRToken()
                });
                clients.push(client);
                
                // Marquer le code comme utilisé
                await API.patch('codes_activation', codes[i].id, {
                    statut: 'utilise',
                    client_id: client.id,
                    date_utilisation: new Date().toISOString()
                });
            }
            
            // 4. Créer 30 transactions
            console.log('💳 Création de 30 transactions...');
            for (let i = 0; i < 30; i++) {
                const client = clients[Math.floor(Math.random() * clients.length)];
                const boutique = boutiques[Math.floor(Math.random() * boutiques.length)];
                
                await API.create('transactions', {
                    id: Utils.generateUUID(),
                    date_heure: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                    boutique_id: boutique.id,
                    client_id: client.id,
                    type: 'passage_valide',
                    valeur_points: 1,
                    commentaire: '',
                    operateur: boutique.id
                });
            }
            
            // 5. Connecter le premier client automatiquement
            Auth.loginClient(clients[0]);
            
            Utils.showLoading(false);
            
            alert('🎉 Données créées avec succès !\n\n' +
                  '✅ 10 codes d\'activation\n' +
                  '✅ 3 boutiques (actives)\n' +
                  '✅ 5 clients (avec cartes)\n' +
                  '✅ 30 transactions\n\n' +
                  '🎴 Vous êtes maintenant connecté en tant que ' + clients[0].prenom + ' ' + clients[0].nom + '\n\n' +
                  '👉 Allez dans "Client" pour voir votre carte !');
            
        } catch (error) {
            Utils.showLoading(false);
            alert('❌ Erreur lors de la génération des données:\n' + error.message);
            console.error('Erreur:', error);
        }
    },
    
    // Navigation entre les pages
    navigateTo(page) {
        // Masquer toutes les pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Afficher la page demandée
        switch(page) {
            case 'home':
                document.getElementById('home-page').classList.add('active');
                window.location.hash = '';
                break;
                
            case 'client':
                document.getElementById('client-page').classList.add('active');
                window.location.hash = 'client';
                clientApp.init();
                break;
                
            case 'commercant':
                document.getElementById('commercant-page').classList.add('active');
                window.location.hash = 'commercant';
                commercantApp.init();
                break;
                
            case 'admin':
                document.getElementById('admin-page').classList.add('active');
                window.location.hash = 'admin';
                adminApp.init();
                break;
                
            default:
                document.getElementById('home-page').classList.add('active');
                window.location.hash = '';
        }
    }
};

// Démarrer l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Gérer le bouton retour du navigateur
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
        app.navigateTo('home');
    }
});
