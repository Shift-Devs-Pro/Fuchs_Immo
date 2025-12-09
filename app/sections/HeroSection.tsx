/**
 * HeroSection
 *
 * Section hero de la page d'accueil.
 * Affiche le titre principal, la baseline et la barre de recherche rapide.
 *
 * Responsabilité unique : Présentation initiale et point d'entrée de recherche.
 */

import SearchBar from '@/components/estate/SearchBar'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-fuchs-cream via-fuchs-white to-fuchs-cream py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-fuchs-black mb-6">
            Trouvez votre bien idéal
          </h1>
          <p className="text-lg md:text-xl text-fuchs-black/70 max-w-2xl mx-auto mb-8">
            Fuchs Immobilier vous accompagne dans la recherche de votre prochain chez-vous
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-display text-fuchs-gold mb-2">500+</div>
            <div className="text-sm text-fuchs-black/60">Biens disponibles</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-display text-fuchs-gold mb-2">98%</div>
            <div className="text-sm text-fuchs-black/60">Clients satisfaits</div>
          </div>
        </div>
      </div>
    </section>
  )
}
