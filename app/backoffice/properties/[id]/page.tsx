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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
    if (user && propertyId) {
      fetchProperty()
    }
  }, [user, propertyId])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
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
      if (!formData.title || !formData.property_type || !formData.price || !formData.address || !formData.city || !formData.postal_code) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      const propertyData = {
        title: formData.title,
        description: formData.description || null,
        property_type: formData.property_type,
        transaction_type: formData.transaction_type,
        price: parseFloat(formData.price),
        surface: formData.surface ? parseFloat(formData.surface) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        address: formData.address,
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
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
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

            <div className="space-y-6">
              <h2 className="text-xl font-medium border-b border-fuchs-cream pb-2">Photos</h2>
              <PropertyPhotosManager propertyId={propertyId} />
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
