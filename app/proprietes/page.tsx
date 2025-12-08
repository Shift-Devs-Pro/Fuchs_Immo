/**
 * PropertiesPage
 *
 * Page de listing des biens immobiliers avec filtres et pagination.
 * Orchestre les sections de filtres et de résultats.
 *
 * Responsabilité unique : Page catalogue complète des propriétés.
 */

import FiltersSection from './PropertiesSections/FiltersSection'
import ResultsSection from './PropertiesSections/ResultsSection'

export const metadata = {
  title: 'Catalogue des Biens | Sillage Immobilier',
  description: 'Découvrez notre catalogue complet de biens immobiliers d\'exception. Appartements, maisons, villas et terrains à vendre.',
}

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-fuchs-cream pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filtres en haut */}
        <div className="mb-8">
          <FiltersSection />
        </div>

        {/* Résultats en dessous */}
        <div>
          <ResultsSection />
        </div>
      </div>
    </main>
  )
}
