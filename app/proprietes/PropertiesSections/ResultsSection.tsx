/**
 * ResultsSection
 *
 * Section d'affichage des résultats de recherche de biens immobiliers depuis la base de données.
 * Affiche les propriétés en grille avec pagination et compteur.
 *
 * Responsabilité unique : Affichage des résultats paginés.
 */

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import PropertyCard from '@/components/estate/PropertyCard'

interface Property {
  id: string
  title: string
  price: number
  bedrooms: number | null
  bathrooms: number | null
  surface: number | null
  description: string | null
  transaction_type: 'sale' | 'rent'
}

type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'surface-desc'

export default function ResultsSection() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [currentPage] = useState(1)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('cli_properties')
          .select('id, title, price, bedrooms, bathrooms, surface, description, transaction_type')
          .eq('is_published', true)

        switch (sortBy) {
          case 'recent':
            query = query.order('created_at', { ascending: false })
            break
          case 'price-asc':
            query = query.order('price', { ascending: true })
            break
          case 'price-desc':
            query = query.order('price', { ascending: false })
            break
          case 'surface-desc':
            query = query.order('surface', { ascending: false, nullsFirst: false })
            break
        }

        const { data, error } = await query

        if (error) throw error
        setProperties(data || [])
      } catch (err) {
        console.error('Erreur chargement biens:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [sortBy])

  const formatPrice = (price: number, transactionType: 'sale' | 'rent') => {
    return transactionType === 'rent'
      ? `${price.toLocaleString('fr-FR')} € / mois`
      : `${price.toLocaleString('fr-FR')} €`
  }

  const totalResults = properties.length
  const totalPages = 1

  if (loading) {
    return (
      <section>
        <div className="text-center py-12">
          <p className="text-fuchs-black/60">Chargement des biens...</p>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section>
        <div className="text-center py-12">
          <h1 className="text-3xl font-display mb-4">Catalogue des biens</h1>
          <p className="text-fuchs-black/70">Aucun bien disponible pour le moment</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      {/* En-tête avec compteur et tri */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display mb-2">Catalogue des biens</h1>
          <p className="text-fuchs-black/70">
            {totalResults} bien{totalResults > 1 ? 's' : ''} disponible{totalResults > 1 ? 's' : ''}
          </p>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium mb-2">
            Trier par
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
          >
            <option value="recent">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="surface-desc">Surface décroissante</option>
          </select>
        </div>
      </div>

      {/* Grille des résultats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            propertyId={property.id}
            title={property.title}
            price={formatPrice(property.price, property.transaction_type)}
            bedrooms={property.bedrooms || 0}
            bathrooms={property.bathrooms || 0}
            surface={property.surface || 0}
            description={property.description || ''}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={currentPage === 1}
            className="px-4 py-2 border border-fuchs-cream rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-fuchs-cream transition-all duration-300"
          >
            Précédent
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded transition-all duration-300 ${
                  page === currentPage
                    ? 'bg-fuchs-gold text-fuchs-white'
                    : 'border border-fuchs-cream hover:bg-fuchs-cream'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-fuchs-cream rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-fuchs-cream transition-all duration-300"
          >
            Suivant
          </button>
        </div>
      )}
    </section>
  )
}
