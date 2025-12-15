'use client'

import { useEffect, useState } from 'react'
import { X, Bed, Bath, Maximize, MapPin, Calendar, Zap, Home, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface PropertyDetail {
  id: string
  title: string
  description: string | null
  property_type: string
  transaction_type: 'sale' | 'rent'
  price: number
  surface: number | null
  rooms: number | null
  bedrooms: number | null
  bathrooms: number | null
  address: string
  city: string
  postal_code: string
  year_built: number | null
  energy_class: string | null
  features: string[]
  status: 'available' | 'reserved' | 'sold' | 'rented'
}

interface PropertyPhoto {
  id: string
  bucket_path: string
  display_order: number
  url: string
}

interface PropertyDetailModalProps {
  propertyId: string
  isOpen: boolean
  onClose: () => void
}

export default function PropertyDetailModal({ propertyId, isOpen, onClose }: PropertyDetailModalProps) {
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [photos, setPhotos] = useState<PropertyPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true)
      try {
        // Récupérer les détails du bien
        const { data: propertyData, error: propertyError } = await supabase
          .from('cli_properties')
          .select('*')
          .eq('id', propertyId)
          .single()

        if (propertyError) throw propertyError
        setProperty(propertyData)

        // Récupérer les photos
        const { data: photosData, error: photosError } = await supabase
          .from('cli_property_photos')
          .select('id, bucket_path, display_order')
          .eq('property_id', propertyId)
          .order('display_order', { ascending: true })

        if (photosError) throw photosError

        // Générer les URLs publiques
        const photosWithUrls = (photosData || []).map(photo => {
          const { data: urlData } = supabase.storage
            .from('pics')
            .getPublicUrl(photo.bucket_path)
          return { ...photo, url: urlData.publicUrl }
        })

        setPhotos(photosWithUrls)
      } catch (err) {
        console.error('Erreur chargement détails:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen && propertyId) {
      fetchPropertyDetails()
    }
  }, [isOpen, propertyId])

  useEffect(() => {
    // Fermer avec Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const formatPrice = (price: number, transactionType: 'sale' | 'rent') => {
    return transactionType === 'rent'
      ? `${price.toLocaleString('fr-FR')} € / mois`
      : `${price.toLocaleString('fr-FR')} €`
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Disponible',
      reserved: 'Réservé',
      sold: 'Vendu',
      rented: 'Loué'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      reserved: 'bg-orange-100 text-orange-800',
      sold: 'bg-red-100 text-red-800',
      rented: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Appartement',
      house: 'Maison',
      villa: 'Villa',
      land: 'Terrain',
      commercial: 'Local commercial',
      office: 'Bureau'
    }
    return labels[type] || type
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-fuchs-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div 
        className="relative bg-fuchs-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-fuchs-white/90 rounded-full hover:bg-fuchs-cream transition-colors"
        >
          <X className="w-5 h-5 text-fuchs-black" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-fuchs-black/60">Chargement des détails...</p>
          </div>
        ) : property ? (
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Galerie photos */}
            <div className="relative h-72 md:h-96 bg-fuchs-cream">
              {photos.length > 0 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[currentPhotoIndex]?.url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-fuchs-white/90 rounded-full hover:bg-fuchs-white transition-colors"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-fuchs-white/90 rounded-full hover:bg-fuchs-white transition-colors"
                      >
                        →
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentPhotoIndex ? 'bg-fuchs-gold' : 'bg-fuchs-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-fuchs-gold">
                  Aucune photo disponible
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="p-6 md:p-8">
              {/* En-tête */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display mb-2">{property.title}</h2>
                  <div className="flex items-center gap-2 text-fuchs-black/70">
                    <MapPin className="w-4 h-4 text-fuchs-gold" />
                    <span>{property.address}, {property.postal_code} {property.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-semibold text-fuchs-gold">
                    {formatPrice(property.price, property.transaction_type)}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${getStatusColor(property.status)}`}>
                    {getStatusLabel(property.status)}
                  </span>
                </div>
              </div>

              {/* Caractéristiques principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-fuchs-cream/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-fuchs-gold" />
                  <div>
                    <p className="text-xs text-fuchs-black/60">Type</p>
                    <p className="font-medium">{getPropertyTypeLabel(property.property_type)}</p>
                  </div>
                </div>
                {property.surface && (
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-fuchs-gold" />
                    <div>
                      <p className="text-xs text-fuchs-black/60">Surface</p>
                      <p className="font-medium">{property.surface} m²</p>
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-fuchs-gold" />
                    <div>
                      <p className="text-xs text-fuchs-black/60">Chambres</p>
                      <p className="font-medium">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-fuchs-gold" />
                    <div>
                      <p className="text-xs text-fuchs-black/60">Salles de bain</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Informations complémentaires */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {property.rooms && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-fuchs-gold" />
                    <span>{property.rooms} pièces</span>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-fuchs-gold" />
                    <span>Construit en {property.year_built}</span>
                  </div>
                )}
                {property.energy_class && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-fuchs-gold" />
                    <span>DPE : {property.energy_class}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-fuchs-black/80 whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Caractéristiques / Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Caractéristiques</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-fuchs-cream text-fuchs-black rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton contact */}
              <div className="mt-8 pt-6 border-t border-fuchs-cream">
                <a
                  href="/contact"
                  className="btn-primary inline-block w-full text-center"
                >
                  Nous contacter pour ce bien
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-red-500">Impossible de charger les détails du bien</p>
          </div>
        )}
      </div>
    </div>
  )
}
