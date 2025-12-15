'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface PropertyCardProps {
  propertyId: string
  title: string
  price: string
  bedrooms: number
  bathrooms: number
  surface: number
  description: string
  imageUrl?: string
}

export default function PropertyCard({
  propertyId,
  title,
  price,
  bedrooms,
  bathrooms,
  surface,
  description,
  imageUrl,
}: PropertyCardProps) {
  const [mainPhoto, setMainPhoto] = useState<string | null>(imageUrl || null)

  useEffect(() => {
    const fetchMainPhoto = async () => {
      try {
        const { data, error } = await supabase
          .from('cli_property_photos')
          .select('bucket_path')
          .eq('property_id', propertyId)
          .eq('display_order', 0)
          .maybeSingle()

        if (error) throw error

        if (data) {
          const { data: urlData } = supabase.storage
            .from('pics')
            .getPublicUrl(data.bucket_path)

          setMainPhoto(urlData.publicUrl)
        }
      } catch (err) {
        console.error('Erreur chargement photo:', err)
      }
    }

    if (propertyId && !imageUrl) {
      fetchMainPhoto()
    }
  }, [propertyId, imageUrl])

  return (
    <div className="bg-fuchs-white border border-fuchs-cream shadow-soft rounded transition-all duration-400 hover:shadow-hover overflow-hidden group">
      <div className="relative h-64 bg-fuchs-cream overflow-hidden">
        {mainPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainPhoto}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-fuchs-gold">
            Image à venir
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl mb-2">{title}</h3>
        <p className="text-fuchs-gold text-xl font-semibold mb-4">{price}</p>

        <div className="flex gap-4 text-sm mb-4">
          <span className="flex items-center gap-1">
            <span className="text-fuchs-gold">■</span> {bedrooms} chambres
          </span>
          <span className="flex items-center gap-1">
            <span className="text-fuchs-gold">■</span> {bathrooms} SDB
          </span>
          <span className="flex items-center gap-1">
            <span className="text-fuchs-gold">■</span> {surface} m²
          </span>
        </div>

        <p className="text-sm mb-6 line-clamp-2">{description}</p>

        <Link
          href={`/proprietes/${propertyId}`}
          className="btn-primary w-full inline-flex justify-center"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  )
}
