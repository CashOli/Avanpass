// ========================================
// TEST RAPIDE SUPABASE - À copier dans F12
// ========================================

// Test 1 : Vérifier que l'API Supabase est chargée
console.log('🔍 Test 1 : Vérification API');
if (typeof API !== 'undefined' && API.supabaseUrl) {
    console.log('✅ API Supabase chargée:', API.supabaseUrl);
} else {
    console.log('❌ API non chargée - Cache pas vidé !');
}

// Test 2 : Lister les clients
console.log('\n🔍 Test 2 : Liste des clients');
API.list('clients', { limit: 5 }).then(response => {
    console.log(`✅ ${response.data.length} clients trouvés:`, response.data.map(c => `${c.prenom} ${c.nom} (${c.email})`));
}).catch(error => {
    console.error('❌ Erreur:', error);
});

// Test 3 : Créer une transaction TEST
console.log('\n🔍 Test 3 : Création transaction TEST');
(async () => {
    try {
        // Récupérer le premier client et la première boutique
        const clients = await API.list('clients', { limit: 1 });
        const boutiques = await API.list('boutiques', { limit: 1 });
        
        if (clients.data.length === 0 || boutiques.data.length === 0) {
            console.error('❌ Pas de client ou boutique');
            return;
        }
        
        const client = clients.data[0];
        const boutique = boutiques.data[0];
        
        console.log(`📝 Test avec: ${client.prenom} ${client.nom} @ ${boutique.nom_boutique}`);
        
        const transaction = await API.create('transactions', {
            client_id: client.id,
            boutique_id: boutique.id,
            type: 'passage_valide',
            valeur_points: 1,
            date_heure: new Date().toISOString(),
            commentaire: 'Test console Supabase',
            operateur: boutique.id
        });
        
        console.log('✅ TRANSACTION CRÉÉE ! Problème 403 RÉSOLU !', transaction);
        console.log('🎉 Supabase fonctionne parfaitement !');
        
    } catch (error) {
        console.error('❌ Erreur création transaction:', error);
        console.error('⚠️ Vérifier si le cache est bien vidé');
    }
})();

console.log('\n📊 Tests lancés... Résultats ci-dessus ⬆️');
