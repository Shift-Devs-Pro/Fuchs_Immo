/*
  # Création de la table cli_estimation_requests
  
  ## Description
  Cette migration crée la table pour stocker les demandes d'estimation gratuite
  soumises via le formulaire du site.
  
  ## Nouvelles tables
  - `cli_estimation_requests`
    - `id` (uuid, PK) - Identifiant unique de la demande
    - Informations personnelles : nom, prenom, email, telephone
    - Localisation : adresse, code_postal, ville
    - Caractéristiques : type_bien, surface_habitable, surface_terrain, 
      nombre_pieces, nombre_chambres, nombre_salles_de_bain, annee_construction
    - Compléments : etat_general, parking, commentaires
    - Gestion : status, notes, created_at, updated_at
  
  ## Contraintes
  - PK sur id
  - Index sur status pour filtrer rapidement
  - Index sur created_at pour le tri chronologique
  
  ## Triggers
  - Trigger de mise à jour automatique de updated_at
*/

-- Création de la table cli_estimation_requests
CREATE TABLE IF NOT EXISTS cli_estimation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations personnelles
  nom text NOT NULL,
  prenom text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  
  -- Localisation du bien
  adresse text NOT NULL,
  code_postal text NOT NULL,
  ville text NOT NULL,
  
  -- Caractéristiques du bien
  type_bien text NOT NULL CHECK (type_bien IN ('appartement', 'maison', 'terrain')),
  surface_habitable integer NOT NULL,
  surface_terrain integer,
  nombre_pieces text NOT NULL,
  nombre_chambres text NOT NULL,
  nombre_salles_de_bain text NOT NULL,
  annee_construction integer,
  
  -- Informations complémentaires
  etat_general text,
  parking text,
  commentaires text,
  
  -- Gestion de la demande
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'visit_scheduled', 'estimated', 'closed')),
  notes text,
  estimated_value numeric(12, 2),
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_estimation_requests_status ON cli_estimation_requests(status);
CREATE INDEX IF NOT EXISTS idx_estimation_requests_created_at ON cli_estimation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_estimation_requests_ville ON cli_estimation_requests(ville);

-- Fonction trigger pour updated_at
CREATE OR REPLACE FUNCTION update_cli_estimation_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS trigger_cli_estimation_requests_updated_at ON cli_estimation_requests;
CREATE TRIGGER trigger_cli_estimation_requests_updated_at
  BEFORE UPDATE ON cli_estimation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_cli_estimation_requests_updated_at();

-- Commentaires sur la table
COMMENT ON TABLE cli_estimation_requests IS 'Demandes d''estimation gratuite soumises via le formulaire';
COMMENT ON COLUMN cli_estimation_requests.status IS 'Statut: new (nouvelle), contacted (contacté), visit_scheduled (visite prévue), estimated (estimé), closed (clôturé)';
COMMENT ON COLUMN cli_estimation_requests.estimated_value IS 'Valeur estimée du bien après visite';
