// ===================================
// UTILS - Fonctions utilitaires
// ===================================

const Utils = {
    // Générer un UUID v4
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    // Générer un token QR unique et sécurisé
    generateQRToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    // Générer un code d'activation
    generateActivationCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 12; i++) {
            if (i > 0 && i % 4 === 0) code += '-';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },
    
    // Formater une date
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    },
    
    // Afficher un message
    showMessage(elementId, message, type = 'info') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.textContent = message;
        element.className = `message ${type} show`;
        
        // Auto-masquer après 5 secondes
        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    },
    
    // Masquer un message
    hideMessage(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('show');
        }
    },
    
    // Générer un QR code dans un élément
    generateQRCode(elementId, text, size = 256) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element non trouvé:', elementId);
            return;
        }
        
        // Vider l'élément
        element.innerHTML = '';
        
        // Vérifier que QRCode est disponible
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded');
            element.innerHTML = `
                <div style="padding: 2rem; text-align: center; background: #fee2e2; border-radius: 8px;">
                    <p style="color: #991b1b; font-weight: 600;">⚠️ Bibliothèque QR non chargée</p>
                    <p style="color: #991b1b; font-size: 0.9rem; margin-top: 0.5rem;">Rafraîchissez la page (F5)</p>
                </div>
            `;
            return;
        }
        
        // Générer le QR code avec la bibliothèque QRCode.js
        try {
            new QRCode(element, {
                text: text,
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            console.log('✅ QR Code généré avec succès');
        } catch (error) {
            console.error('❌ Erreur génération QR:', error);
            element.innerHTML = `
                <div style="padding: 2rem; text-align: center; background: #fee2e2; border-radius: 8px;">
                    <p style="color: #991b1b; font-weight: 600;">❌ Erreur génération QR</p>
                    <p style="color: #991b1b; font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
                </div>
            `;
        }
    },
    
    // Afficher/masquer un spinner de chargement
    showLoading(show = true) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            if (show) {
                loadingScreen.classList.remove('hidden');
            } else {
                loadingScreen.classList.add('hidden');
            }
        }
    },
    
    // Formater les points
    formatPoints(points) {
        return points >= 0 ? `+${points}` : `${points}`;
    },
    
    // Vérifier si une carte est valide
    isCardValid(statut) {
        return statut === 'active';
    },
    
    // Obtenir le libellé du statut
    getStatusLabel(statut) {
        const labels = {
            'active': 'Active',
            'inactive': 'Inactive',
            'suspendue': 'Suspendue',
            'expiree': 'Expirée',
            'en_attente': 'En attente',
            'disponible': 'Disponible',
            'utilise': 'Utilisé',
            'annule': 'Annulé'
        };
        return labels[statut] || statut;
    },
    
    // Créer un élément HTML à partir d'une string
    createElement(htmlString) {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content.firstChild;
    },
    
    // Confirmer une action
    confirm(message) {
        return window.confirm(message);
    },
    
    // Export CSV
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }
        
        // Récupérer les colonnes
        const headers = Object.keys(data[0]);
        
        // Créer le contenu CSV
        let csv = headers.join(',') + '\n';
        data.forEach(row => {
            const values = headers.map(header => {
                let value = row[header] || '';
                // Échapper les guillemets et virgules
                value = String(value).replace(/"/g, '""');
                if (value.includes(',') || value.includes('\n')) {
                    value = `"${value}"`;
                }
                return value;
            });
            csv += values.join(',') + '\n';
        });
        
        // Télécharger le fichier
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
};
