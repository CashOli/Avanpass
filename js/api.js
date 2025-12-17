// ===================================
// API - Interface avec SUPABASE
// Version 2.2.0 - Corrections & Améliorations
// ===================================

const API = {
    // Configuration Supabase
    supabaseUrl: 'https://ckzicazdmqjytxtitumy.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremljYXpkbXFqeXR4dGl0dW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzI1MDUsImV4cCI6MjA4MTQwODUwNX0.BIuiBhRNDWkwBqV2hxGaDUACfkhszT4jD1qPnw8Yp7Y',
    
    // Timeout pour les requêtes (en ms)
    requestTimeout: 10000,
    
    // Headers communs pour toutes les requêtes
    getHeaders() {
        return {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    },
    
    // Wrapper fetch avec timeout et gestion d'erreurs
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.requestTimeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeout);
            return response;
        } catch (error) {
            clearTimeout(timeout);
            if (error.name === 'AbortError') {
                throw new Error('La requête a pris trop de temps. Vérifiez votre connexion internet.');
            }
            throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
        }
    },
    
    // Gérer les erreurs API de manière cohérente
    handleApiError(error, operation) {
        console.error(`❌ Erreur ${operation}:`, error);
        
        if (error.message.includes('connexion')) {
            return {
                success: false,
                error: 'Problème de connexion. Vérifiez votre connexion internet.'
            };
        }
        
        if (error.message.includes('timeout')) {
            return {
                success: false,
                error: 'La requête a pris trop de temps. Réessayez.'
            };
        }
        
        return {
            success: false,
            error: error.message || 'Une erreur est survenue'
        };
    },
    
    // GET - Lister les enregistrements avec pagination
    async list(tableName, params = {}) {
        try {
            const limit = params.limit || 100;
            const offset = ((params.page || 1) - 1) * limit;
            
            let url = `${this.supabaseUrl}/rest/v1/${tableName}?limit=${limit}&offset=${offset}`;
            
            // Ajouter le tri si spécifié
            if (params.sort) {
                url += `&order=${params.sort}`;
            } else {
                url += `&order=created_at.desc`;
            }
            
            // Ajouter la recherche si spécifiée
            if (params.search) {
                url += `&or=(nom.ilike.*${params.search}*,prenom.ilike.*${params.search}*,email.ilike.*${params.search}*)`;
            }
            
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API list:', response.status, errorText);
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            
            return {
                success: true,
                data: data,
                total: data.length,
                page: params.page || 1,
                limit: limit
            };
        } catch (error) {
            return this.handleApiError(error, `list ${tableName}`);
        }
    },
    
    // GET - Récupérer un enregistrement par ID
    async get(tableName, recordId) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${tableName}?id=eq.${recordId}`;
            
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data[0] || null
            };
        } catch (error) {
            return this.handleApiError(error, `get ${tableName}/${recordId}`);
        }
    },
    
    // POST - Créer un nouvel enregistrement
    async create(tableName, data) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${tableName}`;
            
            console.log(`📝 Création dans ${tableName}:`, data);
            
            const response = await this.fetchWithTimeout(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API create:', response.status, errorText);
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('✅ Création réussie:', result);
            
            return {
                success: true,
                data: Array.isArray(result) ? result[0] : result
            };
        } catch (error) {
            return this.handleApiError(error, `create ${tableName}`);
        }
    },
    
    // PATCH - Mise à jour
    async update(tableName, recordId, data) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${tableName}?id=eq.${recordId}`;
            
            console.log(`📝 Mise à jour ${tableName}/${recordId}:`, data);
            
            const response = await this.fetchWithTimeout(url, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('✅ Mise à jour réussie:', result);
            
            return {
                success: true,
                data: Array.isArray(result) ? result[0] : result
            };
        } catch (error) {
            return this.handleApiError(error, `update ${tableName}/${recordId}`);
        }
    },
    
    // Alias pour patch
    patch(tableName, recordId, data) {
        return this.update(tableName, recordId, data);
    },
    
    // DELETE - Supprimer un enregistrement
    async delete(tableName, recordId) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${tableName}?id=eq.${recordId}`;
            
            const response = await this.fetchWithTimeout(url, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`);
            }
            
            console.log(`✅ Suppression réussie: ${tableName}/${recordId}`);
            return { success: true };
        } catch (error) {
            return this.handleApiError(error, `delete ${tableName}/${recordId}`);
        }
    },
    
    // ===================================
    // Méthodes spécifiques pour AvanPass
    // ===================================
    
    // Trouver un client par QR token
    async findClientByQR(qrToken) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/clients?qr_token_client=eq.${qrToken}`;
            
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                return { success: false, data: null };
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data[0] || null
            };
        } catch (error) {
            return this.handleApiError(error, 'findClientByQR');
        }
    },
    
    // Trouver une boutique par login
    async findBoutiqueByLogin(login) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/boutiques?login_commercant=eq.${encodeURIComponent(login)}`;
            
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                return { success: false, data: null };
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data[0] || null
            };
        } catch (error) {
            return this.handleApiError(error, 'findBoutiqueByLogin');
        }
    },
    
    // Récupérer les transactions d'un client
    async getClientTransactions(clientId, boutiqueId) {
        try {
            let url = `${this.supabaseUrl}/rest/v1/transactions?client_id=eq.${clientId}`;
            
            if (boutiqueId) {
                url += `&boutique_id=eq.${boutiqueId}`;
            }
            
            url += `&order=date_heure.desc&limit=1000`;
            
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                return { success: true, data: [] };
            }
            
            const data = await response.json();
            return { success: true, data: data };
        } catch (error) {
            console.error('❌ Erreur getClientTransactions:', error);
            return { success: true, data: [] };
        }
    },
    
    // Calculer les points d'un client
    async calculatePoints(clientId, boutiqueId) {
        try {
            const result = await this.getClientTransactions(clientId, boutiqueId);
            if (!result.success) return 0;
            
            const total = result.data.reduce((sum, t) => sum + (t.valeur_points || 0), 0);
            console.log(`📊 Points calculés pour client ${clientId}: ${total}`);
            return total;
        } catch (error) {
            console.error('❌ Erreur calculatePoints:', error);
            return 0;
        }
    },
    
    // Vérifier un code d'activation
    async checkActivationCode(code) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/codes_activation?code_activation=eq.${encodeURIComponent(code)}&statut=eq.disponible`;
            
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                return { success: false, data: null };
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data[0] || null
            };
        } catch (error) {
            return this.handleApiError(error, 'checkActivationCode');
        }
    },
    
    // Calculer le montant total dépensé (programme MONTANT)
    async calculateMontantDepense(clientId, boutiqueId) {
        try {
            const result = await this.getClientTransactions(clientId, boutiqueId);
            if (!result.success) return 0;
            
            const total = result.data
                .filter(t => t.type === 'passage_valide')
                .reduce((sum, t) => sum + (parseFloat(t.montant_euros) || 0), 0);
            
            console.log(`💰 Montant total dépensé pour client ${clientId}: ${total}€`);
            return total;
        } catch (error) {
            console.error('❌ Erreur calculateMontantDepense:', error);
            return 0;
        }
    },
    
    // Récupérer les récompenses disponibles (programme MONTANT)
    async getRecompensesDisponibles(clientId, boutiqueId, paliersMontant) {
        try {
            const totalDepense = await this.calculateMontantDepense(clientId, boutiqueId);
            const result = await this.getClientTransactions(clientId, boutiqueId);
            const transactions = result.success ? result.data : [];
            
            const recompenses = paliersMontant.map(palier => {
                const disponible = totalDepense >= palier.seuil;
                
                const utilise = transactions.some(t => 
                    t.type === 'recompense_utilisee' && 
                    t.commentaire && 
                    t.commentaire.includes(palier.recompense)
                );
                
                return {
                    seuil: palier.seuil,
                    recompense: palier.recompense,
                    disponible: disponible,
                    utilise: utilise,
                    manque: disponible ? 0 : (palier.seuil - totalDepense)
                };
            });
            
            recompenses.sort((a, b) => a.seuil - b.seuil);
            
            console.log(`🎁 Récompenses pour client ${clientId}:`, recompenses);
            return recompenses;
        } catch (error) {
            console.error('❌ Erreur getRecompensesDisponibles:', error);
            return [];
        }
    },
    
    // Calculer la progression selon le type de programme
    async calculateProgress(clientId, boutiqueId, boutique) {
        try {
            const typeProgramme = boutique.type_programme || 'points';
            
            if (typeProgramme === 'montant') {
                const montantTotal = await this.calculateMontantDepense(clientId, boutiqueId);
                const recompenses = await this.getRecompensesDisponibles(
                    clientId, 
                    boutiqueId, 
                    boutique.paliers_montant || []
                );
                
                return {
                    type: 'montant',
                    valeur: montantTotal,
                    recompenses: recompenses
                };
            } else {
                const points = await this.calculatePoints(clientId, boutiqueId);
                const seuil = boutique.recompense_seuil_points || boutique.tampons_nombre || 10;
                
                return {
                    type: typeProgramme,
                    valeur: points,
                    seuil: seuil,
                    progression: Math.min(100, (points / seuil) * 100)
                };
            }
        } catch (error) {
            console.error('❌ Erreur calculateProgress:', error);
            return { type: 'points', valeur: 0, seuil: 10, progression: 0 };
        }
    }
};

console.log('✅ API Supabase initialisée:', API.supabaseUrl);
