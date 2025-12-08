/*
  # Activation RLS et Policies pour cli_property_photos
  
  ## Description
  Active le Row Level Security sur la table cli_property_photos et définit
  les policies d'accès pour sécuriser les données.
  
  ## Sécurité (RLS)
  - RLS activé sur cli_property_photos
  - Lecture publique pour les photos de biens publiés
  - Lecture complète pour les utilisateurs authentifiés
  - Création, modification, suppression réservées aux utilisateurs authentifiés
  
  ## Policies créées
  1. SELECT public : permet à tous de voir les photos des biens publiés
  2. SELECT authenticated : permet aux utilisateurs authentifiés de voir toutes les photos
  3. INSERT authenticated : permet aux utilisateurs authentifiés de créer des photos
  4. UPDATE authenticated : permet aux utilisateurs authentifiés de modifier des photos
  5. DELETE authenticated : permet aux utilisateurs authentifiés de supprimer des photos
*/

-- Activation du RLS sur la table cli_property_photos
ALTER TABLE cli_property_photos ENABLE ROW LEVEL SECURITY;

-- Policy SELECT pour le public : uniquement les photos des biens publiés
CREATE POLICY "Public can view photos of published properties"
  ON cli_property_photos
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM cli_properties
      WHERE cli_properties.id = cli_property_photos.property_id
      AND cli_properties.is_published = true
    )
  );

-- Policy SELECT pour les utilisateurs authentifiés : toutes les photos
CREATE POLICY "Authenticated users can view all property photos"
  ON cli_property_photos
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy INSERT pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can insert property photos"
  ON cli_property_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy UPDATE pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update property photos"
  ON cli_property_photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy DELETE pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete property photos"
  ON cli_property_photos
  FOR DELETE
  TO authenticated
  USING (true);
