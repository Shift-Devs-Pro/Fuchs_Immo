export default function SearchBar() {
  return (
    <div className="bg-fuchs-white shadow-soft p-8 rounded">
      <h3 className="text-2xl mb-6">Rechercher un bien</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Localisation
          </label>
          <input
            type="text"
            id="location"
            placeholder="Ville, quartier..."
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Type de bien
          </label>
          <select
            id="type"
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
          >
            <option value="">Tous</option>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
          </select>
        </div>

        <div>
          <label htmlFor="priceMax" className="block text-sm font-medium mb-2">
            Prix maximum
          </label>
          <input
            type="number"
            id="priceMax"
            placeholder="500 000 €"
            className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
          />
        </div>

        <div className="flex items-end">
          <button className="btn-secondary w-full">Rechercher</button>
        </div>
      </div>
    </div>
  )
}
