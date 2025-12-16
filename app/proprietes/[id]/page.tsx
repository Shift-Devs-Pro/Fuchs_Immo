'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

interface Property {
  id: string
  title: string
  description: string | null
  reference: number | null
  property_type: string
  transaction_type: 'sale' | 'rent'
  price: number
  charge_copro: number | null
  surface: number | null
  rooms: number | null
  bedrooms: number | null
  bathrooms: number | null
  address: string
  city: string
  postal_code: string
  year_built: number | null
  energy_class: string | null
  features: string[] | null
  status: 'available' | 'reserved' | 'sold' | 'rented'
}

interface Photo {
  id: string
  url: string
  display_order: number
}

const statusLabels: Record<Property['status'], string> = {
  available: 'Disponible',
  reserved: 'Réservé',
  sold: 'Vendu',
  rented: 'Loué',
}

const transactionLabels: Record<Property['transaction_type'], string> = {
  sale: 'Vente',
  rent: 'Location',
}

const formatPrice = (price: number, transactionType: Property['transaction_type']) => {
  const formatted = price.toLocaleString('fr-FR')
  return transactionType === 'rent' ? `${formatted} € / mois` : `${formatted} €`
}

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params?.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: propertyError } = await supabase
          .from('cli_properties')
          .select(`
            id,
            title,
            description,
            reference,
            property_type,
            transaction_type,
            price,
            charge_copro,
            surface,
            rooms,
            bedrooms,
            bathrooms,
            address,
            city,
            postal_code,
            year_built,
            energy_class,
            features,
            status
          `)
          .eq('id', propertyId)
          .eq('is_published', true)
          .single()

        if (propertyError) throw propertyError
        if (!data) throw new Error('Bien introuvable ou non publié')

        setProperty(data as Property)

        const { data: photosData, error: photosError } = await supabase
          .from('cli_property_photos')
          .select('id, bucket_path, display_order')
          .eq('property_id', propertyId)
          .order('display_order', { ascending: true })

        if (!photosError && photosData) {
          const parsedPhotos: Photo[] = photosData
            .map((photo) => {
              const { data: publicUrlData } = supabase.storage
                .from('pics')
                .getPublicUrl(photo.bucket_path)

              if (!publicUrlData?.publicUrl) return null

              return {
                id: photo.id || photo.bucket_path,
                url: publicUrlData.publicUrl,
                display_order: photo.display_order ?? 0,
              }
            })
            .filter((photo): photo is Photo => Boolean(photo))

          setPhotos(parsedPhotos)
          setCurrentPhotoIndex(0)
        }
      } catch (err) {
        console.error('Erreur chargement bien:', err)
        setError('Impossible de charger ce bien pour le moment.')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const mainPhoto = useMemo(() => {
    if (!photos.length) return null
    return photos[currentPhotoIndex]?.url || photos[0]?.url || null
  }, [photos, currentPhotoIndex])

  const goToPhoto = (index: number) => {
    if (!photos.length) return
    const nextIndex = (index + photos.length) % photos.length
    setCurrentPhotoIndex(nextIndex)
  }

  const goNext = () => goToPhoto(currentPhotoIndex + 1)
  const goPrev = () => goToPhoto(currentPhotoIndex - 1)


  const openLightbox = (index: number) => {
    if (!photos.length) return
    setCurrentPhotoIndex(index)
    setZoomLevel(1)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setZoomLevel(1)
  }

  // Toggle zoom between 1 and 2 on image click
  const toggleZoom = () => {
    setZoomLevel((z) => (z === 1 ? 2 : 1))
  }

  useEffect(() => {
    if (isLightboxOpen) {
      setZoomLevel(1)
    }
  }, [currentPhotoIndex, isLightboxOpen])

  if (loading) {
    return (
      <main className="min-h-screen bg-fuchs-cream pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="bg-fuchs-white shadow-soft rounded-lg p-12 text-center">
            <p className="text-fuchs-black/70">Chargement du bien...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-fuchs-cream pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="bg-fuchs-white shadow-soft rounded-lg p-12 text-center space-y-4">
            <p className="text-lg">{error || 'Ce bien est introuvable.'}</p>
            <Link href="/proprietes" className="btn-primary inline-flex justify-center">
              Retour au catalogue
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-fuchs-cream pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/proprietes"
          className="inline-flex items-center gap-2 text-fuchs-gold hover:text-fuchs-gold/80 transition-colors mb-6 text-sm"
        >
          ← Retour au catalogue
        </Link>

        <div className="bg-fuchs-white shadow-soft rounded-lg overflow-hidden">
          <div
            className="relative h-80 md:h-96 bg-fuchs-cream overflow-hidden cursor-zoom-in"
            onClick={() => openLightbox(currentPhotoIndex)}
          >
            {mainPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={mainPhoto}
                src={mainPhoto}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 relative z-10"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-fuchs-gold">
                Image à venir
              </div>
            )}

            {photos.length > 1 && (
              <>
                <button
                  aria-label="Photo précédente"
                    onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-fuchs-black/50 text-fuchs-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-fuchs-black/70 transition-colors z-20"
                >
                  ‹
                </button>
                <button
                  aria-label="Photo suivante"
                    onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-fuchs-black/50 text-fuchs-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-fuchs-black/70 transition-colors z-20"
                >
                  ›
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => goToPhoto(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentPhotoIndex
                          ? 'bg-fuchs-gold w-5'
                          : 'bg-fuchs-white/80 hover:bg-fuchs-white'
                      }`}
                      aria-label={`Aller à la photo ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <p className="uppercase tracking-[0.18em] text-xs text-fuchs-black/60 mb-2">
                  {property.reference && <span>Réf. {property.reference} • </span>}{property.property_type} • {transactionLabels[property.transaction_type]}
                </p>
                <h1 className="text-3xl font-display mb-2">{property.title}</h1>
                <p className="text-fuchs-black/70">
                  {property.address}, {property.postal_code} {property.city}
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-semibold text-fuchs-gold">{formatPrice(property.price, property.transaction_type)}</p>
                <p className="text-sm text-fuchs-black/60">{statusLabels[property.status]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-fuchs-cream/40 rounded-lg p-4">
                <p className="text-xs text-fuchs-black/60 mb-1 flex items-center gap-2">
                  <span aria-hidden="true">📐</span> Surface
                </p>
                <p className="text-lg font-semibold">{property.surface ? `${property.surface} m²` : 'Non renseignée'}</p>
              </div>
              <div className="bg-fuchs-cream/40 rounded-lg p-4">
                <p className="text-xs text-fuchs-black/60 mb-1 flex items-center gap-2">
                  <span aria-hidden="true">🚪</span> Pièces
                </p>
                <p className="text-lg font-semibold">{property.rooms ?? '—'}</p>
              </div>
              <div className="bg-fuchs-cream/40 rounded-lg p-4">
                <p className="text-xs text-fuchs-black/60 mb-1 flex items-center gap-2">
                  <span aria-hidden="true">🛏️</span> Chambres
                </p>
                <p className="text-lg font-semibold">{property.bedrooms ?? '—'}</p>
              </div>
              <div className="bg-fuchs-cream/40 rounded-lg p-4">
                <p className="text-xs text-fuchs-black/60 mb-1 flex items-center gap-2">
                  <span aria-hidden="true">🛁</span> Salles de bain
                </p>
                <p className="text-lg font-semibold">{property.bathrooms ?? '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-fuchs-black/80 leading-relaxed whitespace-pre-line">
                  {property.description || 'Aucune description disponible pour le moment.'}
                </p>
              </div>

              <div className="bg-fuchs-cream/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Informations complémentaires</h3>
                <div className="space-y-2 text-sm text-fuchs-black/80">
                  <div className="flex justify-between">
                    <span className="text-fuchs-black/60">Année de construction</span>
                    <span>{property.year_built || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fuchs-black/60">Classe énergie</span>
                    <span>{property.energy_class || '—'}</span>
                  </div>
                  {property.charge_copro && (
                    <div className="flex justify-between">
                      <span className="text-fuchs-black/60">Charges de copropriété</span>
                      <span>{property.charge_copro} €/mois</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-fuchs-black/60">Type de transaction</span>
                    <span>{transactionLabels[property.transaction_type]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fuchs-black/60">Statut</span>
                    <span>{statusLabels[property.status]}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-fuchs-cream/40 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Points forts</h3>
              {property.features && property.features.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-fuchs-white border border-fuchs-cream rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-fuchs-black/60 text-sm">Aucun point fort renseigné.</p>
              )}
            </div>

            {photos.length > 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Galerie photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`${property.title} - photo ${photo.display_order + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-soft cursor-pointer"
                      onClick={() => openLightbox(index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </main>

      {isLightboxOpen && mainPhoto && property && (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
        <div className="absolute top-4 right-4 flex gap-2 z-40">
          <button
            onClick={closeLightbox}
            className="bg-fuchs-gold text-fuchs-white px-4 py-2 rounded hover:bg-fuchs-gold/90"
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>

        <div
          className="flex-1 flex items-center justify-center px-4"
          onClick={(e) => {
            // close when clicking on the overlay (sides)
            if (e.target === e.currentTarget) closeLightbox()
          }}
        >
          <div className="relative max-h-[90vh] max-w-6xl w-full h-full flex items-center justify-center">
            {photos.length > 1 && (
              <button
                aria-label="Photo précédente"
                onClick={goPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-fuchs-black/60 text-fuchs-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-fuchs-black/80 z-30 text-2xl"
              >
                ‹
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainPhoto || undefined}
              alt={property.title}
              className="max-h-[90vh] max-w-full object-contain select-none z-10"
            />

            {photos.length > 1 && (
              <button
                aria-label="Photo suivante"
                onClick={goNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-fuchs-black/60 text-fuchs-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-fuchs-black/80 z-30 text-2xl"
              >
                ›
              </button>
            )}
          </div>
        </div>

        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-fuchs-black/60 px-4 py-2 rounded-full">
            <span className="text-white text-sm">
              {currentPhotoIndex + 1} / {photos.length}
            </span>
          </div>
        )}
        </div>
      )}
    </>
  )
}
