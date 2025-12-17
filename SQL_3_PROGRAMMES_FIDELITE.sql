-- ==========================================
-- MIGRATION : 3 Types de Programmes de Fidélité
-- AvanPass v2.1.0
-- ==========================================
-- Ajout des colonnes pour supporter :
-- 1. Points (actuel)
-- 2. Tampons (nouveau)
-- 3. Montant (nouveau)
-- ==========================================

-- ==========================================
-- TABLE : boutiques
-- ==========================================

-- Ajouter le type de programme
ALTER TABLE boutiques 
ADD COLUMN IF NOT EXISTS type_programme VARCHAR(20) DEFAULT 'points';
-- Valeurs possibles : 'points', 'tampons', 'montant'

COMMENT ON COLUMN boutiques.type_programme IS 
'Type de programme de fidélité : points (visites), tampons (carte visuelle), montant (euros dépensés)';

-- Configuration pour le mode TAMPONS
ALTER TABLE boutiques 
ADD COLUMN IF NOT EXISTS tampons_nombre INT DEFAULT 10;

COMMENT ON COLUMN boutiques.tampons_nombre IS 
'Nombre de cases/tampons pour une carte complète (6, 8, 10, 12)';

-- Configuration pour le mode MONTANT (paliers)
ALTER TABLE boutiques 
ADD COLUMN IF NOT EXISTS paliers_montant JSONB DEFAULT '[]';

COMMENT ON COLUMN boutiques.paliers_montant IS 
'Liste des paliers de récompenses par montant dépensé. 
Format : [{"seuil": 20, "recompense": "Café offert"}, {"seuil": 50, "recompense": "Dessert offert"}]';

-- Exemples de configuration selon le type :

-- Exemple 1 : POINTS (actuel, inchangé)
-- type_programme = 'points'
-- recompense_seuil_points = 10
-- recompense_libelle = '1 café offert'

-- Exemple 2 : TAMPONS
-- type_programme = 'tampons'
-- tampons_nombre = 8
-- recompense_libelle = '1 pâtisserie offerte'

-- Exemple 3 : MONTANT
-- type_programme = 'montant'
-- paliers_montant = [
--   {"seuil": 20, "recompense": "Café offert"},
--   {"seuil": 50, "recompense": "Dessert offert"},
--   {"seuil": 100, "recompense": "Menu complet offert"}
-- ]

-- ==========================================
-- TABLE : transactions
-- ==========================================

-- Ajouter le montant en euros pour le programme MONTANT
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS montant_euros DECIMAL(10,2) DEFAULT 0;

COMMENT ON COLUMN transactions.montant_euros IS 
'Montant en euros de la transaction (utilisé pour le programme par montant)';

-- Modifier la colonne valeur_points pour être optionnelle (NULL si programme montant)
ALTER TABLE transactions 
ALTER COLUMN valeur_points DROP NOT NULL;

-- ==========================================
-- INDEX pour performances
-- ==========================================

-- Index sur type_programme pour filtrer rapidement
CREATE INDEX IF NOT EXISTS idx_boutiques_type_programme 
ON boutiques(type_programme);

-- Index sur montant_euros pour calculs rapides
CREATE INDEX IF NOT EXISTS idx_transactions_montant_euros 
ON transactions(montant_euros);

-- ==========================================
-- FONCTIONS UTILITAIRES
-- ==========================================

-- Fonction pour calculer le total dépensé par un client (programme MONTANT)
CREATE OR REPLACE FUNCTION calcul_total_depense(p_client_id UUID, p_boutique_id UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(montant_euros) 
         FROM transactions 
         WHERE client_id = p_client_id 
           AND boutique_id = p_boutique_id
           AND type = 'passage_valide'),
        0
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calcul_total_depense IS 
'Calcule le montant total dépensé par un client dans une boutique';

-- Fonction pour déterminer les récompenses disponibles (programme MONTANT)
CREATE OR REPLACE FUNCTION recompenses_disponibles(
    p_client_id UUID, 
    p_boutique_id UUID
)
RETURNS TABLE(
    seuil DECIMAL(10,2),
    recompense TEXT,
    disponible BOOLEAN,
    utilise BOOLEAN
) AS $$
DECLARE
    v_total_depense DECIMAL(10,2);
    v_boutique RECORD;
    v_palier JSONB;
BEGIN
    -- Récupérer la boutique et ses paliers
    SELECT * INTO v_boutique 
    FROM boutiques 
    WHERE id = p_boutique_id;
    
    -- Vérifier que c'est un programme par montant
    IF v_boutique.type_programme != 'montant' THEN
        RETURN;
    END IF;
    
    -- Calculer le total dépensé
    v_total_depense := calcul_total_depense(p_client_id, p_boutique_id);
    
    -- Pour chaque palier configuré
    FOR v_palier IN SELECT * FROM jsonb_array_elements(v_boutique.paliers_montant)
    LOOP
        seuil := (v_palier->>'seuil')::DECIMAL(10,2);
        recompense := v_palier->>'recompense';
        disponible := v_total_depense >= seuil;
        
        -- Vérifier si la récompense a déjà été utilisée
        utilise := EXISTS(
            SELECT 1 FROM transactions
            WHERE client_id = p_client_id
              AND boutique_id = p_boutique_id
              AND type = 'recompense_utilisee'
              AND commentaire LIKE '%' || recompense || '%'
        );
        
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION recompenses_disponibles IS 
'Liste les récompenses disponibles et utilisées pour un client (programme montant)';

-- ==========================================
-- TRIGGER : Mise à jour automatique
-- ==========================================

-- Trigger pour valider les données lors d'une insertion de boutique
CREATE OR REPLACE FUNCTION validate_boutique_programme()
RETURNS TRIGGER AS $$
BEGIN
    -- Validation du type de programme
    IF NEW.type_programme NOT IN ('points', 'tampons', 'montant') THEN
        RAISE EXCEPTION 'Type de programme invalide: %', NEW.type_programme;
    END IF;
    
    -- Validation pour TAMPONS
    IF NEW.type_programme = 'tampons' THEN
        IF NEW.tampons_nombre IS NULL OR NEW.tampons_nombre < 4 OR NEW.tampons_nombre > 20 THEN
            RAISE EXCEPTION 'Le nombre de tampons doit être entre 4 et 20';
        END IF;
    END IF;
    
    -- Validation pour MONTANT
    IF NEW.type_programme = 'montant' THEN
        IF NEW.paliers_montant IS NULL OR jsonb_array_length(NEW.paliers_montant) = 0 THEN
            RAISE EXCEPTION 'Au moins un palier de montant doit être défini';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_boutique_programme
BEFORE INSERT OR UPDATE ON boutiques
FOR EACH ROW
EXECUTE FUNCTION validate_boutique_programme();

-- ==========================================
-- DONNÉES DE TEST
-- ==========================================

-- Mise à jour de la boutique existante (garder le mode POINTS)
UPDATE boutiques 
SET type_programme = 'points',
    tampons_nombre = 10,
    paliers_montant = '[]'
WHERE login_commercant = 'cafe@ducoin.fr';

-- Exemple d'insertion d'une boutique avec TAMPONS
-- (À décommenter si vous voulez tester)
/*
INSERT INTO boutiques (
    id, nom_boutique, adresse, telephone, email,
    login_commercant, password_hash,
    type_programme, tampons_nombre, recompense_libelle,
    statut, date_creation
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'Fast Burger',
    '456 Rue du Commerce, 97110 Pointe-à-Pitre',
    '0590 11 22 33',
    'contact@fastburger.gp',
    'burger@fast.fr',
    'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791',
    'tampons',
    8,
    '1 menu offert',
    'active',
    NOW()
);
*/

-- Exemple d'insertion d'une boutique avec MONTANT
-- (À décommenter si vous voulez tester)
/*
INSERT INTO boutiques (
    id, nom_boutique, adresse, telephone, email,
    login_commercant, password_hash,
    type_programme, paliers_montant,
    statut, date_creation
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    'Restaurant Le Gourmet',
    '789 Avenue des Saveurs, 97110 Pointe-à-Pitre',
    '0590 44 55 66',
    'contact@legourmet.gp',
    'resto@gourmet.fr',
    'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791',
    'montant',
    '[
        {"seuil": 20, "recompense": "Café offert"},
        {"seuil": 50, "recompense": "Dessert offert"},
        {"seuil": 100, "recompense": "Entrée offerte"},
        {"seuil": 200, "recompense": "Menu complet offert"}
    ]',
    'active',
    NOW()
);
*/

-- ==========================================
-- VÉRIFICATION
-- ==========================================

-- Vérifier les colonnes ajoutées
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'boutiques'
  AND column_name IN ('type_programme', 'tampons_nombre', 'paliers_montant')
ORDER BY ordinal_position;

SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'transactions'
  AND column_name = 'montant_euros'
ORDER BY ordinal_position;

-- Afficher la configuration de la boutique de test
SELECT 
    nom_boutique,
    type_programme,
    recompense_seuil_points,
    recompense_libelle,
    tampons_nombre,
    paliers_montant
FROM boutiques
WHERE login_commercant = 'cafe@ducoin.fr';

-- ==========================================
-- FIN DE LA MIGRATION
-- ==========================================

-- Rappel : Après avoir exécuté ce script dans Supabase SQL Editor :
-- 1. Vérifier que les colonnes sont bien créées
-- 2. Modifier js/api.js pour supporter les nouveaux champs
-- 3. Modifier js/client.js pour afficher les 3 types de cartes
-- 4. Modifier js/commercant.js pour saisir le montant si nécessaire
-- 5. Créer l'interface de configuration pour le commerçant
