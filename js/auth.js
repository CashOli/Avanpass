// ===================================
// AUTH - Système d'authentification
// ===================================

const Auth = {
    // Clés de stockage local
    STORAGE_KEYS: {
        CLIENT: 'avanpass_client',
        COMMERCANT: 'avanpass_commercant',
        ADMIN: 'avanpass_admin'
    },
    
    // Hash simple pour les mots de passe (côté client)
    // Note: En production, utiliser bcrypt côté serveur
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    
    // Vérifier un mot de passe
    async verifyPassword(password, hash) {
        const passwordHash = await this.hashPassword(password);
        return passwordHash === hash;
    },
    
    // CLIENT - Connexion
    loginClient(clientData) {
        localStorage.setItem(this.STORAGE_KEYS.CLIENT, JSON.stringify(clientData));
    },
    
    // CLIENT - Déconnexion
    logoutClient() {
        localStorage.removeItem(this.STORAGE_KEYS.CLIENT);
    },
    
    // CLIENT - Récupérer les données
    getClient() {
        const data = localStorage.getItem(this.STORAGE_KEYS.CLIENT);
        return data ? JSON.parse(data) : null;
    },
    
    // CLIENT - Vérifier si connecté
    isClientLoggedIn() {
        return !!this.getClient();
    },
    
    // COMMERCANT - Connexion
    loginCommercant(boutiqueData) {
        localStorage.setItem(this.STORAGE_KEYS.COMMERCANT, JSON.stringify(boutiqueData));
    },
    
    // COMMERCANT - Déconnexion
    logoutCommercant() {
        localStorage.removeItem(this.STORAGE_KEYS.COMMERCANT);
    },
    
    // COMMERCANT - Récupérer les données
    getCommercant() {
        const data = localStorage.getItem(this.STORAGE_KEYS.COMMERCANT);
        return data ? JSON.parse(data) : null;
    },
    
    // COMMERCANT - Vérifier si connecté
    isCommercantLoggedIn() {
        return !!this.getCommercant();
    },
    
    // ADMIN - Connexion
    loginAdmin(adminData) {
        localStorage.setItem(this.STORAGE_KEYS.ADMIN, JSON.stringify(adminData));
    },
    
    // ADMIN - Déconnexion
    logoutAdmin() {
        localStorage.removeItem(this.STORAGE_KEYS.ADMIN);
    },
    
    // ADMIN - Récupérer les données
    getAdmin() {
        const data = localStorage.getItem(this.STORAGE_KEYS.ADMIN);
        return data ? JSON.parse(data) : null;
    },
    
    // ADMIN - Vérifier si connecté
    isAdminLoggedIn() {
        return !!this.getAdmin();
    },
    
    // Déconnexion complète
    logoutAll() {
        this.logoutClient();
        this.logoutCommercant();
        this.logoutAdmin();
    }
};
