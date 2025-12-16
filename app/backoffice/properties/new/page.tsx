'use client'

/**
 * NewPropertyPage
 *
 * Page de création d'un nouveau bien immobilier.
 * Formulaire complet pour saisir toutes les informations d'un bien.
 *
 * Responsabilité unique : Interface de création de propriété.
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import PropertyPhotosManager from '@/components/PropertyPhotosManager'
import { Upload, ChevronUp, ChevronDown, X } from 'lucide-react'

interface SelectedFileEntry {
  file: File
  preview: string
}

export default function NewPropertyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileEntry[]>([])
  const [dragActive, setDragActive] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reference: '',
    property_type: '',
    transaction_type: 'sale' as 'sale' | 'rent',
    price: '',
    charge_copro: '',
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

  const handlePhotosSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleIncomingFiles(e.target.files)
  }

  const handleIncomingFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const incoming = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    // Ajoute les nouvelles photos à la fin pour respecter l'ordre d'arrivée
    setSelectedFiles((prev) => [...prev, ...incoming])
  }

  const clearSelectedFiles = () => {
    selectedFiles.forEach((entry) => URL.revokeObjectURL(entry.preview))
    setSelectedFiles([])
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => {
      const toRemove = prev[index]
      if (toRemove) URL.revokeObjectURL(toRemove.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const moveSelectedFile = (index: number, direction: 'up' | 'down') => {
    setSelectedFiles((prev) => {
      if (direction === 'up' && index === 0) return prev
      if (direction === 'down' && index === prev.length - 1) return prev

      const next = [...prev]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
      return next
    })
  }

  const uploadSelectedPhotos = async (newPropertyId: string) => {
    if (selectedFiles.length === 0) return

    // Récupère l'ordre actuel pour chaîner correctement
    let startOrder = 0
    const { data: existing, error: existingError } = await supabase
      .from('cli_property_photos')
      .select('display_order')
      .eq('property_id', newPropertyId)

    if (!existingError && existing) {
      const maxOrder = existing.reduce((acc, item) => Math.max(acc, item.display_order ?? 0), 0)
      startOrder = existing.length ? maxOrder + 1 : 0
    }

    for (const [index, entry] of selectedFiles.entries()) {
      const { file } = entry
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `${newPropertyId}/${Date.now()}-${index}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('pics')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('cli_property_photos')
        .insert({
          property_id: newPropertyId,
          bucket_path: fileName,
          display_order: startOrder + index,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          alt_text: null
        })

      if (dbError) throw dbError
    }

    clearSelectedFiles()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    setSuccessMessage(null)

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
        charge_copro: formData.charge_copro ? parseInt(formData.charge_copro) : null,
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

      let newPropertyId = propertyId

      if (!propertyId) {
        const { data, error } = await supabase
          .from('cli_properties')
          .insert([{ ...propertyData, created_by: user?.id }])
          .select()
          .single()

        if (error) throw error
        newPropertyId = data.id
        setPropertyId(data.id)
      } else {
        const { error } = await supabase
          .from('cli_properties')
          .update(propertyData)
          .eq('id', propertyId)

        if (error) throw error
      }

      if (newPropertyId) {
        await uploadSelectedPhotos(newPropertyId)
      }

      setSuccessMessage('Bien enregistré. Les photos sont synchronisées.')
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

  if (loading) {
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
              <h1 className="text-3xl font-display mb-2">Ajouter un bien</h1>
              <nav className="flex gap-4 text-sm">
                <a href="/backoffice/dashboard" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Dashboard
                </a>
                <span className="text-fuchs-black/30">•</span>
                <a href="/backoffice/properties" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Biens
                </a>
                <span className="text-fuchs-black/30">•</span>
                <span className="text-fuchs-gold">Nouveau</span>
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
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
              {successMessage}
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  Charges de copropriété (€/mois)
                </label>
                <input
                  type="number"
                  name="charge_copro"
                  value={formData.charge_copro}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                  placeholder="Ex: 150"
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
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  const el = e.currentTarget as HTMLDivElement
                  if (!dragActive) el.style.boxShadow = '0 0 0 1px rgba(178, 136, 44, 0.95)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  const el = e.currentTarget as HTMLDivElement
                  if (!dragActive) el.style.boxShadow = ''
                }}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
                onDrop={(e: React.DragEvent<HTMLDivElement>) => {
                  e.preventDefault()
                  setDragActive(false)
                  handleIncomingFiles(e.dataTransfer.files)
                }}
                >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotosSelection}
                  className="hidden"
                  id="new-photos-upload"
                />
                <label
                  htmlFor="new-photos-upload"
                  className="cursor-pointer flex flex-col items-center text-center gap-2"
                >
                  <Upload className="w-10 h-10 text-fuchs-gold" />
                  <p className="text-sm font-medium text-fuchs-black">
                  {selectedFiles.length ? 'Ajouter d&apos;autres photos' : 'Cliquez ou déposez vos photos'}
                  </p>
                  <p className="text-xs text-fuchs-black/60">
                  PNG, JPG jusqu&apos;à 10MB — Plusieurs fichiers autorisés
                  </p>
                </label>
                </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                 {selectedFiles.length > 1 &&( 
                  <p className="text-sm text-fuchs-black/70">
                    Ajustez l&apos;ordre avant l&apos;envoi. Vous pourrez encore réordonner ou supprimer après enregistrement.
                  </p>)}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedFiles.map((entry, idx) => (
                      <div
                        key={`${entry.file.name}-${idx}`}
                        className="relative group border border-fuchs-cream rounded-lg overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={entry.preview}
                          alt={entry.file.name}
                          className="w-full h-40 object-cover"
                        />

                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-fuchs-gold text-fuchs-white px-2 py-1 rounded text-xs flex items-center gap-1">
                            Principale
                          </div>
                        )}

                        {idx > 0 && (<div className="absolute top-2 left-2 bg-fuchs-white/90 text-xs px-2 py-1 rounded">#{idx + 1}</div>)}

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => moveSelectedFile(idx, 'up')}
                              className="p-2 bg-fuchs-white text-fuchs-black rounded hover:bg-fuchs-cream"
                              title="Monter"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}

                          {idx < selectedFiles.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveSelectedFile(idx, 'down')}
                              className="p-2 bg-fuchs-white text-fuchs-black rounded hover:bg-fuchs-cream"
                              title="Descendre"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => removeSelectedFile(idx)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Supprimer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-2 bg-fuchs-white">
                          <p className="text-xs text-fuchs-black/70 truncate">{entry.file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>

          {propertyId && (
            <div className="mt-10 border-t border-fuchs-cream pt-8">
              <h2 className="text-xl font-medium mb-4">Photos du bien</h2>
              <p className="text-sm text-fuchs-black/70 mb-4">
                Ajoutez les photos pour ce bien. Les nouvelles seront ajoutées à la fin ; réordonnez ou supprimez si besoin. La première photo est utilisée comme principale.
              </p>
              <PropertyPhotosManager
                propertyId={propertyId}
                onPhotosChange={() => setSuccessMessage('Photos mises à jour')}
              />

              <div className="mt-6 flex gap-3">
                <a
                  href={`/backoffice/properties/${propertyId}`}
                  className="px-4 py-2 bg-fuchs-cream text-fuchs-black rounded hover:bg-fuchs-cream/70 transition-colors"
                >
                  Ouvrir la fiche de ce bien
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
