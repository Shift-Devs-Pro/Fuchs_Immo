/*
  # Fix Property Photos RLS Policies

  ## Description
  Correction des policies RLS pour cli_property_photos afin d'éviter les
  conflits avec les policies strictes de cli_properties.

  ## Problème identifié
  - Les policies actuelles font référence à cli_properties qui a des RLS strictes
  - Cela crée des conflits d'accès pour les utilisateurs authentifiés
  - Les utilisateurs avec rôles (admin, manager) ne peuvent pas insérer de photos

  ## Solution
  - Utiliser fn_get_user_role() pour vérifier les permissions
  - Permettre aux admins et managers de gérer les photos
  - Simplifier les policies SELECT pour éviter les conflits

  ## Changements
  1. Drop des anciennes policies
  2. Création de nouvelles policies basées sur les rôles
  3. Utilisation de SECURITY DEFINER pour éviter la récursion
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view photos of published properties" ON cli_property_photos;
DROP POLICY IF EXISTS "Authenticated users can view all property photos" ON cli_property_photos;
DROP POLICY IF EXISTS "Authenticated users can insert property photos" ON cli_property_photos;
DROP POLICY IF EXISTS "Authenticated users can update property photos" ON cli_property_photos;
DROP POLICY IF EXISTS "Authenticated users can delete property photos" ON cli_property_photos;

-- Policy SELECT pour le public : photos des biens publiés
-- Utilise une fonction SECURITY DEFINER pour éviter les problèmes RLS
CREATE OR REPLACE FUNCTION fn_is_property_published(prop_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT is_published
  FROM cli_properties
  WHERE id = prop_id;
$$;

CREATE POLICY "Public can view photos of published properties"
  ON cli_property_photos
  FOR SELECT
  TO anon
  USING (
    fn_is_property_published(property_id) = true
  );

-- Policy SELECT pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can view all property photos"
  ON cli_property_photos
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy INSERT : admins et managers peuvent ajouter des photos
CREATE POLICY "Admins and managers can insert property photos"
  ON cli_property_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    fn_get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
  );

-- Policy UPDATE : admins et managers peuvent modifier des photos
CREATE POLICY "Admins and managers can update property photos"
  ON cli_property_photos
  FOR UPDATE
  TO authenticated
  USING (
    fn_get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
  )
  WITH CHECK (
    fn_get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
  );

-- Policy DELETE : admins et managers peuvent supprimer des photos
CREATE POLICY "Admins and managers can delete property photos"
  ON cli_property_photos
  FOR DELETE
  TO authenticated
  USING (
    fn_get_user_role(auth.uid()) IN ('super_admin', 'admin', 'manager')
  );
