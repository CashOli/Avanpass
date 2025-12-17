// ===================================
// API - Interface avec SUPABASE
// Version 2.0.0 - Migration Supabase
// ===================================

const API = {
    // Configuration Supabase
    supabaseUrl: 'https://ckzicazdmqjytxtitumy.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremljYXpkbXFqeXR4dGl0dW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzI1MDUsImV4cCI6MjA4MTQwODUwNX0.BIuiBhRNDWkwBqV2hxGaDUACfkhszT4jD1qPnw8Yp7Y',
    
    // Headers communs pour toutes les requêtes
    getHeaders() {
        return {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
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
                // Tri par défaut : created_at descendant
                url += `&order=created_at.desc`;
            }
            
            // Ajouter la recherche si spécifiée
            if (params.search) {
                url += `&or=(nom.ilike.*${params.search}*,prenom.ilike.*${params.search}*,email.ilike.*${params.search}*)`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API list:', response.status, errorText);
                throw new Error(`Erreur API: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Retourner dans le format attendu par l'ancien code
            return {
                data: data,
                total: data.length,
                page: params.page || 1,
                limit: limit
            };
        } catch (error) {
            console.error(`❌ Erreur list ${tableName}:`, error);
            throw error;
        }
    },
    
    // GET - Récupérer un enregistrement par ID
    async get(tableName, recordId) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${tableName}?id=eq.${recordId}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API get:', response.status, errorText);
                throw new Error(`Erreur API: ${response.status}`);
            }
            
            const data = await response.json();
            return data[0]; // Supabase retourne un array, on prend le premier élément
        } catch (error) {
            console.error(`❌ Erreur get ${tableName}/${recordId}:`, error);
            throw error;
        }
    },
    
    // POST - Créer un nouvel enregistrement
    async create(tableName, data) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${tableName}`;
            
            console.log(`📝 Création dans ${tableName}:`, data);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API create:', response.status, errorText);
                throw new Error(`Erreur API: ${response.status} - ${errorText}`);
            }
            
            const result = await response.json();
            console.log('✅ Création réussie:', result);
            
            // Supabase retourne un array, on prend le premier élément
            return Array.isArray(result) ? result[0] : result;
        } catch (error) {
            console.error(`❌ Erreur create ${tableName}:`, error);
            throw error;
        }
    },
    
    // PUT - Mise à jour complète
    async update(tableName, recordId, data) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${tableName}?id=eq.${recordId}`;
            
            console.log(`📝 Mise à jour ${tableName}/${recordId}:`, data);
            
            const response = await fetch(url, {
                method: 'PATCH', // Supabase utilise PATCH pour les mises à jour
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API update:', response.status, errorText);
                throw new Error(`Erreur API: ${response.status} - ${errorText}`);
            }
            
            const result = await response.json();
            console.log('✅ Mise à jour réussie:', result);
            
            return Array.isArray(result) ? result[0] : result;
        } catch (error) {
            console.error(`❌ Erreur update ${tableName}/${recordId}:`, error);
            throw error;
        }
    },
    
    // PATCH - Mise à jour partielle
    async patch(tableName, recordId, data) {
        // Utilise la même méthode que update (Supabase utilise PATCH)
        return this.update(tableName, recordId, data);
    },
    
    // DELETE - Supprimer un enregistrement (soft delete)
    async delete(tableName, recordId) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${tableName}?id=eq.${recordId}`;
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erreur API delete:', response.status, errorText);
                throw new Error(`Erreur API: ${response.status}`);
            }
            
            console.log(`✅ Suppression réussie: ${tableName}/${recordId}`);
            return true;
        } catch (error) {
            console.error(`❌ Erreur delete ${tableName}/${recordId}:`, error);
            throw error;
        }
    },
    
    // ===================================
    // Méthodes spécifiques pour AvanPass
    // ===================================
    
    // Trouver un client par QR token
    async findClientByQR(qrToken) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/clients?qr_token_client=eq.${qrToken}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                console.error('❌ Erreur findClientByQR:', response.status);
                return null;
            }
            
            const data = await response.json();
            return data[0] || null;
        } catch (error) {
            console.error('❌ Erreur findClientByQR:', error);
            return null;
        }
    },
    
    // Trouver une boutique par login
    async findBoutiqueByLogin(login) {
        try {
            const url = `${this.supabaseUrl}/rest/v1/boutiques?login_commercant=eq.${encodeURIComponent(login)}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                console.error('❌ Erreur findBoutiqueByLogin:', response.status);
                return null;
            }
            
            const data = await response.json();
            return data[0] || null;
        } catch (error) {
            console.error('❌ Erreur findBoutiqueByLogin:', error);
            return null;
        }
    },
    
    // Récupérer les transactions d'un client pour une boutique
    async getClientTransactions(clientId, boutiqueId) {
        try {
            let url = `${this.supabaseUrl}/rest/v1/transactions?client_id=eq.${clientId}`;
            
            if (boutiqueId) {
                url += `&boutique_id=eq.${boutiqueId}`;
            }
            
            url += `&order=date_heure.desc&limit=1000`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                console.error('❌ Erreur getClientTransactions:', response.status);
                return [];
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Erreur getClientTransactions:', error);
            return [];
        }
    },
    
    // Calculer les points d'un client pour une boutique
    async calculatePoints(clientId, boutiqueId) {
        try {
            const transactions = await this.getClientTransactions(clientId, boutiqueId);
            const total = transactions.reduce((sum, t) => sum + (t.valeur_points || 0), 0);
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
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                console.error('❌ Erreur checkActivationCode:', response.status);
                return null;
            }
            
            const data = await response.json();
            return data[0] || null;
        } catch (error) {
            console.error('❌ Erreur checkActivationCode:', error);
            return null;
        }
    },
    
    // ===================================
    // Méthodes pour système MONTANT (v2.1.0)
    // ===================================
    
    // Calculer le montant total dépensé par un client (programme MONTANT)
    async calculateMontantDepense(clientId, boutiqueId) {
        try {
            const transactions = await this.getClientTransactions(clientId, boutiqueId);
            const total = transactions
                .filter(t => t.type === 'passage_valide')
                .reduce((sum, t) => sum + (parseFloat(t.montant_euros) || 0), 0);
            
            console.log(`💰 Montant total dépensé pour client ${clientId}: ${total}€`);
            return total;
        } catch (error) {
            console.error('❌ Erreur calculateMontantDepense:', error);
            return 0;
        }
    },
    
    // Récupérer les paliers de récompenses disponibles (programme MONTANT)
    async getRecompensesDisponibles(clientId, boutiqueId, paliersMontant) {
        try {
            const totalDepense = await this.calculateMontantDepense(clientId, boutiqueId);
            const transactions = await this.getClientTransactions(clientId, boutiqueId);
            
            // Pour chaque palier, déterminer s'il est disponible et s'il a été utilisé
            const recompenses = paliersMontant.map(palier => {
                const disponible = totalDepense >= palier.seuil;
                
                // Vérifier si la récompense a déjà été utilisée
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
            
            // Trier par seuil croissant
            recompenses.sort((a, b) => a.seuil - b.seuil);
            
            console.log(`🎁 Récompenses pour client ${clientId}:`, recompenses);
            return recompenses;
        } catch (error) {
            console.error('❌ Erreur getRecompensesDisponibles:', error);
            return [];
        }
    },
    
    // Calculer les points/montant selon le type de programme
    async calculateProgress(clientId, boutiqueId, boutique) {
        try {
            const typeProgramme = boutique.type_programme || 'points';
            
            if (typeProgramme === 'montant') {
                // Système MONTANT : retourner le montant total dépensé
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
                // Système POINTS ou TAMPONS : retourner les points
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
