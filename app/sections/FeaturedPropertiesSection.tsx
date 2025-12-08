/**
 * FeaturedPropertiesSection
 *
 * Section affichant les biens immobiliers mis en avant depuis la base de données.
 * Consomme le composant PropertyCard du Design System.
 *
 * Responsabilité unique : Affichage des biens vedettes en grille responsive.
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

export default function FeaturedPropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('cli_properties')
          .select('id, title, price, bedrooms, bathrooms, surface, description, transaction_type')
          .eq('is_published', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) throw error
        setProperties(data || [])
      } catch (err) {
        console.error('Erreur chargement biens vedettes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  const formatPrice = (price: number, transactionType: 'sale' | 'rent') => {
    return transactionType === 'rent'
      ? `${price.toLocaleString('fr-FR')} € / mois`
      : `${price.toLocaleString('fr-FR')} €`
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-fuchs-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-fuchs-black/60">Chargement des biens...</p>
          </div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-fuchs-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl text-fuchs-black mb-4">
              Biens d&apos;exception
            </h2>
            <p className="text-lg text-fuchs-black/70 max-w-2xl mx-auto">
              Aucun bien vedette pour le moment
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-fuchs-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl text-fuchs-black mb-4">
            Biens d&apos;exception
          </h2>
          <p className="text-lg text-fuchs-black/70 max-w-2xl mx-auto">
            Découvrez notre sélection de propriétés premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

        <div className="text-center mt-12">
          <a
            href="/proprietes"
            className="btn-primary inline-block"
          >
            Voir tous les biens
          </a>
        </div>
      </div>
    </section>
  )
}
