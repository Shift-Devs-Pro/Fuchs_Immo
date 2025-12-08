/**
 * FiltersSection
 *
 * Section de filtres avancés pour la recherche de biens immobiliers.
 * Permet de filtrer par localisation, type, prix, surface, chambres, etc.
 *
 * Responsabilité unique : Interface de filtrage pour le catalogue.
 */

'use client'

export default function FiltersSection() {
  return (
    <section className="bg-fuchs-white shadow-soft rounded-lg p-6">
      <h2 className="text-2xl font-display mb-6">Affiner votre recherche</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Localisation */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Localisation
          </label>
          <input
            type="text"
            id="location"
            placeholder="Ville, quartier..."
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          />
        </div>

        {/* Type de bien */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Type de bien
          </label>
          <select
            id="type"
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          >
            <option value="">Tous les types</option>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="villa">Villa</option>
            <option value="terrain">Terrain</option>
            <option value="local-commercial">Local commercial</option>
          </select>
        </div>

        {/* Prix min */}
        <div>
          <label htmlFor="priceMin" className="block text-sm font-medium mb-2">
            Prix min.
          </label>
          <input
            type="number"
            id="priceMin"
            placeholder="Prix min."
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          />
        </div>

        {/* Prix max */}
        <div>
          <label htmlFor="priceMax" className="block text-sm font-medium mb-2">
            Prix max.
          </label>
          <input
            type="number"
            id="priceMax"
            placeholder="Prix max."
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          />
        </div>

        {/* Surface min */}
        <div>
          <label htmlFor="surfaceMin" className="block text-sm font-medium mb-2">
            Surface min. (m²)
          </label>
          <input
            type="number"
            id="surfaceMin"
            placeholder="Surface min."
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          />
        </div>

        {/* Surface max */}
        <div>
          <label htmlFor="surfaceMax" className="block text-sm font-medium mb-2">
            Surface max. (m²)
          </label>
          <input
            type="number"
            id="surfaceMax"
            placeholder="Surface max."
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          />
        </div>

        {/* Chambres minimum */}
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium mb-2">
            Chambres minimum
          </label>
          <select
            id="bedrooms"
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          >
            <option value="">Indifférent</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Salles de bain minimum */}
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium mb-2">
            Salles de bain min.
          </label>
          <select
            id="bathrooms"
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          >
            <option value="">Indifférent</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-4 items-end">
          <button className="btn-primary flex-1">
            Appliquer les filtres
          </button>
          <button className="btn-secondary px-6">
            Réinitialiser
          </button>
        </div>
      </div>
    </section>
  )
}
