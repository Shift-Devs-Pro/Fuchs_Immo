/*
  # Création de la table cli_property_photos
  
  ## Description
  Cette migration crée la table miroir pour gérer les photos des biens immobiliers
  stockées dans le bucket 'pics'. Elle assure la traçabilité complète entre les fichiers
  et les propriétés auxquelles ils appartiennent.
  
  ## Nouvelles tables
  - `cli_property_photos`
    - `id` (uuid, PK) - Identifiant unique de la photo
    - `property_id` (uuid, FK) - Référence vers cli_properties
    - `bucket_path` (text) - Chemin du fichier dans le bucket 'pics'
    - `display_order` (integer) - Ordre d'affichage (0 = photo principale)
    - `file_name` (text) - Nom original du fichier
    - `file_size` (bigint) - Taille du fichier en octets
    - `mime_type` (text) - Type MIME (image/jpeg, image/png, etc.)
    - `width` (integer) - Largeur de l'image en pixels
    - `height` (integer) - Hauteur de l'image en pixels
    - `alt_text` (text) - Texte alternatif pour l'accessibilité
    - `created_at` (timestamptz) - Date de création
    - `updated_at` (timestamptz) - Date de dernière modification
  
  ## Contraintes
  - PK sur id
  - FK property_id → cli_properties(id) avec ON DELETE CASCADE
  - Index sur property_id pour optimiser les recherches
  - Index sur (property_id, display_order) pour le tri
  - CHECK sur display_order >= 0
  
  ## Triggers
  - Trigger de mise à jour automatique de updated_at
  
  ## Notes importantes
  - La photo avec display_order = 0 est considérée comme la photo principale
  - ON DELETE CASCADE : suppression d'un bien = suppression de ses photos
  - Les fichiers physiques dans le bucket doivent être gérés séparément
*/

-- Création de la table cli_property_photos
CREATE TABLE IF NOT EXISTS cli_property_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  bucket_path text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  file_name text NOT NULL,
  file_size bigint,
  mime_type text,
  width integer,
  height integer,
  alt_text text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  CONSTRAINT fk_property
    FOREIGN KEY (property_id)
    REFERENCES cli_properties(id)
    ON DELETE CASCADE,
  
  CONSTRAINT check_display_order_positive
    CHECK (display_order >= 0)
);

-- Index pour optimiser les recherches par propriété
CREATE INDEX IF NOT EXISTS idx_property_photos_property_id 
  ON cli_property_photos(property_id);

-- Index composé pour optimiser le tri par ordre d'affichage
CREATE INDEX IF NOT EXISTS idx_property_photos_property_display 
  ON cli_property_photos(property_id, display_order);

-- Fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION fn_update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS trg_update_cli_property_photos_updated_at ON cli_property_photos;
CREATE TRIGGER trg_update_cli_property_photos_updated_at
  BEFORE UPDATE ON cli_property_photos
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at_column();
