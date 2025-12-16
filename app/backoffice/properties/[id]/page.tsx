'use client'

/**
 * EditPropertyPage
 *
 * Page d'édition d'un bien immobilier existant.
 * Charge les données du bien et permet leur modification.
 *
 * Responsabilité unique : Interface d'édition de propriété.
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'
import PropertyPhotosManager from '@/components/PropertyPhotosManager'
import { Upload, ChevronUp, ChevronDown, X } from 'lucide-react'

interface SelectedFileEntry {
  file: File
  preview: string
}

interface PropertyPhoto {
  id: string
  property_id: string
  bucket_path: string
  display_order: number
  file_name: string
  file_size: number | null
  mime_type: string | null
  alt_text: string | null
  created_at: string
}

interface CombinedItem {
  id: string
  type: 'existing' | 'new'
  photo?: PropertyPhoto
  entry?: SelectedFileEntry
}
interface Property {
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
  latitude: number | null
  longitude: number | null
  year_built: number | null
  energy_class: string | null
  features: string[]
  status: 'available' | 'reserved' | 'sold' | 'rented'
  is_featured: boolean
  is_published: boolean
}

export default function EditPropertyPage() {
  const params = useParams()
  const propertyId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileEntry[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadingSelected, setUploadingSelected] = useState(false)
  const [combinedItems, setCombinedItems] = useState<CombinedItem[]>([])
  const [toDeletePhotos, setToDeletePhotos] = useState<PropertyPhoto[]>([])
  const [photosRefreshKey, setPhotosRefreshKey] = useState(0)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [existingPhotos, setExistingPhotos] = useState<PropertyPhoto[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reference: '',
    property_type: '',
    transaction_type: 'sale' as 'sale' | 'rent',
    price: '',
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    year_built: '',
    energy_class: '',
    features: [] as string[],
    status: 'available' as 'available' | 'reserved' | 'sold' | 'rented',
    is_featured: false,
    is_published: false
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/backoffice'
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        window.location.href = '/backoffice'
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('cli_properties')
          .select('*')
          .eq('id', propertyId)
          .single()

        if (error) throw error

        if (data) {
          setProperty(data)
          setFormData({
            title: data.title,
            description: data.description || '',
            reference: data.reference?.toString() || '',
            property_type: data.property_type,
            transaction_type: data.transaction_type,
            price: data.price.toString(),
            surface: data.surface?.toString() || '',
            rooms: data.rooms?.toString() || '',
            bedrooms: data.bedrooms?.toString() || '',
            bathrooms: data.bathrooms?.toString() || '',
            address: data.address,
            city: data.city,
            postal_code: data.postal_code,
            latitude: data.latitude?.toString() || '',
            longitude: data.longitude?.toString() || '',
            year_built: data.year_built?.toString() || '',
            energy_class: data.energy_class || '',
            features: data.features || [],
            status: data.status,
            is_featured: data.is_featured,
            is_published: data.is_published
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du bien')
      }
    }

    if (user && propertyId) {
      fetchProperty()
      fetchExistingPhotosInternal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, propertyId, toDeletePhotos])

  const fetchExistingPhotosInternal = async () => {
    if (!propertyId) return
    try {
      const { data, error } = await supabase
        .from('cli_property_photos')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true })

      if (error) throw error
      setExistingPhotos(data || [])

      // Merge fetched existing photos with any "new" items already present in combinedItems
        setCombinedItems((prev) => {
          const newItems = prev.filter((i) => i.type === 'new')
          const existingItems = (data || [])
            .filter((photo: PropertyPhoto) => !toDeletePhotos.some((d) => d.id === photo.id))
            .map((photo: PropertyPhoto) => ({ id: photo.id, type: 'existing' as const, photo }))
          return [...existingItems, ...newItems]
        })
    } catch (err) {
      console.error('Erreur fetch photos existantes:', err)
    }
  }

  useEffect(() => {
    // refetch when photosRefreshKey changes (after upload)
    if (propertyId) fetchExistingPhotosInternal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosRefreshKey, propertyId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handlePhotosSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    handleIncomingFiles(files)
  }

  const handleIncomingFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const incoming = Array.from(files).map((file) => ({ file, preview: URL.createObjectURL(file) }))
    // append to both selectedFiles (for compatibility) and combinedItems as 'new' items
    setSelectedFiles((prev) => [...prev, ...incoming])
    setCombinedItems((prev) => [
      ...prev,
      ...incoming.map((entry, idx) => ({ id: `new-${Date.now()}-${idx}-${Math.random().toString(36).slice(2,8)}`, type: 'new' as const, entry }))
    ])
  }

  const moveCombinedItem = (index: number, direction: 'up' | 'down') => {
    setCombinedItems((prev) => {
      if (direction === 'up' && index === 0) return prev
      if (direction === 'down' && index === prev.length - 1) return prev
      const next = [...prev]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
      return next
    })
  }

  const removeCombinedItem = async (index: number) => {
    const item = combinedItems[index]
    if (!item) return

    // if it's a 'new' item we just revoke preview and remove
    if (item.type === 'new') {
      if (item.entry) URL.revokeObjectURL(item.entry.preview)
      setCombinedItems((prev) => prev.filter((_, i) => i !== index))
      setSelectedFiles((prev) => prev.filter((p) => p.preview !== item.entry?.preview))
      return
    }

    // existing: delete from storage and db immediately
    if (item.type === 'existing' && item.photo) {
      // mark for deletion and remove from combinedItems (deletion will be applied on save)
      setToDeletePhotos((prev) => [...prev, item.photo!])
      setCombinedItems((prev) => prev.filter((_, i) => i !== index))
      setSuccessMessage('Photo marquée pour suppression (sera supprimée à l\'enregistrement).')
    }
  }

  const applyPhotoChanges = async () => {
    if (!propertyId) return

    setUploadingSelected(true)
    setError(null)

    try {
      // First, delete marked photos (storage + db)
      for (const photo of toDeletePhotos) {
        try {
          const { error: storageErr } = await supabase.storage.from('pics').remove([photo.bucket_path])
          if (storageErr) console.warn('Erreur suppression storage:', storageErr)
        } catch (e) {
          console.warn('Erreur suppression storage:', e)
        }

        const { error: dbErr } = await supabase.from('cli_property_photos').delete().eq('id', photo.id)
        if (dbErr) console.warn('Erreur suppression db:', dbErr)
      }

      // Then, iterate combinedItems and update existing orders or upload new ones
      for (let order = 0; order < combinedItems.length; order++) {
        const item = combinedItems[order]
        if (!item) continue

        if (item.type === 'existing' && item.photo) {
          const { error: updErr } = await supabase
            .from('cli_property_photos')
            .update({ display_order: order })
            .eq('id', item.photo.id)
          if (updErr) throw updErr
        }

        if (item.type === 'new' && item.entry) {
          const file = item.entry.file
          const fileExt = file.name.split('.').pop() || 'jpg'
          const fileName = `${propertyId}/${Date.now()}-${order}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('pics')
            .upload(fileName, file, { cacheControl: '3600', upsert: false })

          if (uploadError) throw uploadError

          const { error: dbError } = await supabase
            .from('cli_property_photos')
            .insert({
              property_id: propertyId,
              bucket_path: fileName,
              display_order: order,
              file_name: file.name,
              file_size: file.size,
              mime_type: file.type,
              alt_text: null
            })

          if (dbError) throw dbError
        }
      }

      // clear previews for new items
      combinedItems.forEach((it) => { if (it.type === 'new' && it.entry) URL.revokeObjectURL(it.entry.preview) })

      // refresh
      setToDeletePhotos([])
      setPhotosRefreshKey((k) => k + 1)
      fetchExistingPhotosInternal()
      setSuccessMessage('Photos synchronisées.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
      throw err
    } finally {
      setUploadingSelected(false)
    }
  }

  const getPhotoUrl = (bucketPath: string) => {
    const { data } = supabase.storage.from('pics').getPublicUrl(bucketPath)
    return data.publicUrl
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (!formData.title || !formData.property_type || !formData.price || !formData.city || !formData.postal_code) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      const propertyData = {
        title: formData.title,
        description: formData.description || null,
        reference: formData.reference ? parseInt(formData.reference) : null,
        property_type: formData.property_type,
        transaction_type: formData.transaction_type,
        price: parseFloat(formData.price),
        surface: formData.surface ? parseFloat(formData.surface) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        address: formData.address || null,
        city: formData.city,
        postal_code: formData.postal_code,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        energy_class: formData.energy_class || null,
        features: formData.features,
        status: formData.status,
        is_featured: formData.is_featured,
        is_published: formData.is_published
      }

      const { error } = await supabase
        .from('cli_properties')
        .update(propertyData)
        .eq('id', propertyId)

      if (error) throw error

      // Apply photo changes (deletions, reorder, uploads) only when saving
      await applyPhotoChanges()

      window.location.href = '/backoffice/properties'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/backoffice'
  }

  if (loading || !property) {
    return (
      <main className="min-h-screen bg-fuchs-cream pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Chargement...</p>
        </div>
      </main>
    )
  }

  const availableFeatures = [
    'Parking',
    'Garage',
    'Jardin',
    'Terrasse',
    'Balcon',
    'Piscine',
    'Cave',
    'Ascenseur',
    'Climatisation',
    'Cheminée',
    'Meublé',
    'Cuisine équipée',
    'Alarme',
    'Interphone',
    'Gardien',
    'Fibre optique'
  ]

  return (
    <main className="min-h-screen bg-fuchs-cream pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-fuchs-white shadow-soft rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display mb-2">Modifier le bien</h1>
              <nav className="flex gap-4 text-sm">
                <a href="/backoffice/dashboard" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Dashboard
                </a>
                <span className="text-fuchs-black/30">•</span>
                <a href="/backoffice/properties" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Biens
                </a>
                <span className="text-fuchs-black/30">•</span>
                <span className="text-fuchs-gold">Édition</span>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-fuchs-gold text-fuchs-white rounded hover:bg-fuchs-gold/90 transition-colors"
            >
              Déconnexion
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-medium border-b border-fuchs-cream pb-2">Informations générales</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                  placeholder="Ex: Magnifique villa avec vue sur la mer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Référence
                  </label>
                  <input
                    type="number"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold resize-none"
                  placeholder="Décrivez le bien en détail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type de bien <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: Villa, Appartement, Maison"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type de transaction <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                  >
                    <option value="sale">Vente</option>
                    <option value="rent">Location</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Prix <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                  placeholder="Ex: 450000"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-medium border-b border-fuchs-cream pb-2">Caractéristiques</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Surface (m²)</label>
                  <input
                    type="number"
                    name="surface"
                    value={formData.surface}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de pièces</label>
                  <input
                    type="number"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Chambres</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Salles de bain</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Année de construction</label>
                  <input
                    type="number"
                    name="year_built"
                    value={formData.year_built}
                    onChange={handleChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Classe énergétique</label>
                  <select
                    name="energy_class"
                    value={formData.energy_class}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Équipements et prestations</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableFeatures.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-4 h-4 text-fuchs-gold focus:ring-fuchs-gold border-fuchs-cream rounded"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-medium border-b border-fuchs-cream pb-2">Localisation</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                  placeholder="Ex: 15 rue de la Paix"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: Paris"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 75001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="any"
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 48.8566"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="any"
                    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                    placeholder="Ex: 2.3522"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-medium border-b border-fuchs-cream pb-2">Publication</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                >
                  <option value="available">Disponible</option>
                  <option value="reserved">Réservé</option>
                  <option value="sold">Vendu</option>
                  <option value="rented">Loué</option>
                </select>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="w-4 h-4 text-fuchs-gold focus:ring-fuchs-gold border-fuchs-cream rounded"
                  />
                  <span className="text-sm font-medium">Publier le bien</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-fuchs-gold focus:ring-fuchs-gold border-fuchs-cream rounded"
                  />
                  <span className="text-sm font-medium">Mettre en avant</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium border-b border-fuchs-cream pb-2">Photos</h2>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-6 bg-white transition-shadow ${dragActive ? 'border-fuchs-gold/80 shadow-[0_0_0_2px_rgba(178,136,44,0.12)]' : 'border-fuchs-cream'}`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
                onDrop={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(false); handleIncomingFiles(e.dataTransfer.files) }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  const el = e.currentTarget as HTMLDivElement
                  if (!dragActive) el.style.boxShadow = '0 0 0 1px rgba(178, 136, 44, 0.95)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  const el = e.currentTarget as HTMLDivElement
                  if (!dragActive) el.style.boxShadow = ''
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotosSelection}
                  className="hidden"
                  id="edit-photos-upload"
                />
                <label htmlFor="edit-photos-upload" className="cursor-pointer flex flex-col items-center text-center gap-2">
                  <Upload className="w-10 h-10 text-fuchs-gold" />
                  <p className="text-sm font-medium text-fuchs-black">{combinedItems.some(i => i.type === 'new') ? 'Ajouter d&apos;autres photos' : 'Cliquez ou déposez vos photos'}</p>
                  <p className="text-xs text-fuchs-black/60">PNG, JPG jusqu&apos;à 10MB — Plusieurs fichiers autorisés</p>
                </label>
              </div>

              {combinedItems.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {combinedItems.map((item, idx) => (
                      <div key={item.id} className="relative group border border-fuchs-cream rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.type === 'existing' ? getPhotoUrl(item.photo!.bucket_path) : item.entry!.preview} alt={item.type === 'existing' ? (item.photo!.alt_text || item.photo!.file_name) : item.entry!.file.name} className="w-full h-40 object-cover" />

                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-fuchs-gold text-fuchs-white px-2 py-1 rounded text-xs flex items-center gap-1">
                            Principale
                          </div>
                        )}

                        {idx > 0 && (<div className="absolute top-2 left-2 bg-fuchs-white/90 text-xs px-2 py-1 rounded">#{idx + 1}</div>)}

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {idx > 0 && (
                            <button type="button" onClick={() => moveCombinedItem(idx, 'up')} className="p-2 bg-fuchs-white text-fuchs-black rounded hover:bg-fuchs-cream" title="Monter">
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}

                          {idx < combinedItems.length - 1 && (
                            <button type="button" onClick={() => moveCombinedItem(idx, 'down')} className="p-2 bg-fuchs-white text-fuchs-black rounded hover:bg-fuchs-cream" title="Descendre">
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          )}

                          <button type="button" onClick={() => removeCombinedItem(idx)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600" title="Supprimer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-2 bg-fuchs-white"><p className="text-xs text-fuchs-black/70 truncate">{item.type === 'existing' ? item.photo!.file_name : item.entry!.file.name}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mt-3 p-3 bg-green-100 border border-green-300 text-green-800 rounded text-sm">{successMessage}</div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-fuchs-cream">
              <a
                href="/backoffice/properties"
                className="px-6 py-3 bg-fuchs-cream text-fuchs-black rounded hover:bg-fuchs-cream/70 transition-colors"
              >
                Annuler
              </a>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-fuchs-gold text-fuchs-white rounded hover:bg-fuchs-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
