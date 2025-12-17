// ===================================
// CLIENT - Gestion des 3 types de programmes
// Version 2.1.0 - Système MONTANT + TAMPONS
// ===================================

// Extension du clientApp pour supporter les 3 types de programmes
const ClientProgrammes = {
    // Render la carte selon le type de programme
    async renderCardByType(boutique, client) {
        const typeProgramme = boutique.type_programme || 'points';
        
        switch(typeProgramme) {
            case 'montant':
                return await this.renderCardMontant(boutique, client);
            case 'tampons':
                return await this.renderCardTampons(boutique, client);
            case 'points':
            default:
                return await this.renderCardPoints(boutique, client);
        }
    },
    
    // ===================================
    // CARTE MODE POINTS (existant)
    // ===================================
    async renderCardPoints(boutique, client) {
        const points = await API.calculatePoints(client.id, boutique.id);
        const progress = Math.min((points / boutique.recompense_seuil_points) * 100, 100);
        const hasReward = points >= boutique.recompense_seuil_points;
        
        return `
            <div class="card-points-section">
                <div class="card-points">
                    <span class="points-current">${points}</span>
                    <span class="points-separator">/</span>
                    <span class="points-total">${boutique.recompense_seuil_points}</span>
                    <span class="points-label">points</span>
                </div>
                
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                
                ${hasReward ? `
                    <div class="reward-badge">
                        <i class="fas fa-gift"></i>
                        Récompense disponible !
                    </div>
                ` : `
                    <p class="reward-text">
                        Encore ${boutique.recompense_seuil_points - points} passage(s) pour :
                        <strong>${boutique.recompense_libelle}</strong>
                    </p>
                `}
            </div>
        `;
    },
    
    // ===================================
    // CARTE MODE TAMPONS (nouveau)
    // ===================================
    async renderCardTampons(boutique, client) {
        const points = await API.calculatePoints(client.id, boutique.id);
        const tamponsNombre = boutique.tampons_nombre || 10;
        const tamponsRemplis = Math.min(points, tamponsNombre);
        const carteComplete = tamponsRemplis >= tamponsNombre;
        
        // Générer les cases de tampons
        let tamponsHTML = '';
        for (let i = 0; i < tamponsNombre; i++) {
            const isLast = i === tamponsNombre - 1;
            const isFilled = i < tamponsRemplis;
            const cssClass = isFilled ? 'tampon-filled' : 'tampon-empty';
            const content = isLast ? '🎁' : (isFilled ? '✓' : (i + 1));
            
            tamponsHTML += `
                <div class="tampon-case ${cssClass} ${isLast ? 'tampon-reward' : ''}">
                    ${content}
                </div>
            `;
        }
        
        return `
            <div class="card-tampons-section">
                <div class="tampons-grid">
                    ${tamponsHTML}
                </div>
                
                ${carteComplete ? `
                    <div class="reward-badge">
                        <i class="fas fa-gift"></i>
                        Carte complète ! Récompense disponible !
                    </div>
                ` : `
                    <p class="tampons-progress">
                        ${tamponsRemplis} / ${tamponsNombre} tampons
                        ${tamponsRemplis === tamponsNombre - 1 ? 
                            '<strong class="presque-fini">🔥 Plus qu\'un tampon !</strong>' : 
                            `<br>Encore ${tamponsNombre - tamponsRemplis} pour : <strong>${boutique.recompense_libelle}</strong>`
                        }
                    </p>
                `}
            </div>
        `;
    },
    
    // ===================================
    // CARTE MODE MONTANT (nouveau)
    // ===================================
    async renderCardMontant(boutique, client) {
        const montantTotal = await API.calculateMontantDepense(client.id, boutique.id);
        const paliersMontant = boutique.paliers_montant || [];
        
        if (paliersMontant.length === 0) {
            return `
                <div class="card-montant-section">
                    <p class="text-muted text-center">
                        Aucun palier de récompense configuré
                    </p>
                </div>
            `;
        }
        
        const recompenses = await API.getRecompensesDisponibles(client.id, boutique.id, paliersMontant);
        
        // Générer le HTML des paliers
        let paliersHTML = recompenses.map(palier => {
            let status = 'verrouille';
            let statusText = `Plus que ${palier.manque.toFixed(2)}€`;
            let icon = '🔒';
            let progressPercent = 0;
            
            if (palier.utilise) {
                status = 'utilise';
                statusText = 'Récompense utilisée';
                icon = '✅';
                progressPercent = 100;
            } else if (palier.disponible) {
                status = 'disponible';
                statusText = 'Disponible ! 🎁';
                icon = '✅';
                progressPercent = 100;
            } else {
                progressPercent = Math.min((montantTotal / palier.seuil) * 100, 100);
            }
            
            return `
                <div class="palier ${status}">
                    <div class="palier-icon">${icon}</div>
                    <div class="palier-info">
                        <strong>${palier.seuil}€ → ${palier.recompense}</strong>
                        <span class="palier-status">${statusText}</span>
                        ${!palier.utilise && !palier.disponible ? `
                            <div class="palier-progress-bar">
                                <div class="palier-progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="card-montant-section">
                <div class="montant-total">
                    <span class="montant-label">Total dépensé</span>
                    <span class="montant-value">${montantTotal.toFixed(2)}€</span>
                </div>
                
                <div class="paliers-container">
                    <h4 class="paliers-title">Vos récompenses</h4>
                    ${paliersHTML}
                </div>
            </div>
        `;
    }
};

console.log('✅ ClientProgrammes chargé (3 types de programmes)');
