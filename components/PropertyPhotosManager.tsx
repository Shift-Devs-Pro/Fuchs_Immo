'use client'

/**
 * PropertyPhotosManager
 *
 * Composant de gestion des photos d'une propriété.
 * Permet l'upload, la visualisation, le réordonnancement et la suppression des photos.
 *
 * Responsabilité unique : Interface de gestion des photos de propriété.
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { X, Upload, ChevronUp, ChevronDown, Star } from 'lucide-react'

interface PropertyPhoto {
  id: string
  property_id: string
  bucket_path: string
  display_order: number
  file_name: string
  file_size: number | null
  mime_type: string | null
  width: number | null
  height: number | null
  alt_text: string | null
  created_at: string
}

interface PropertyPhotosManagerProps {
  propertyId: string | null
  onPhotosChange?: () => void
}

export default function PropertyPhotosManager({ propertyId, onPhotosChange }: PropertyPhotosManagerProps) {
  const [photos, setPhotos] = useState<PropertyPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userDebug, setUserDebug] = useState<string>('')

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!propertyId) return

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('cli_property_photos')
          .select('*')
          .eq('property_id', propertyId)
          .order('display_order', { ascending: true })

        if (error) throw error
        setPhotos(data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des photos:', err)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchPhotos()
    }
    checkAuth()
  }, [propertyId])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setUserDebug(`✓ Connecté: ${session.user.email}`)
    } else {
      setUserDebug('✗ Non connecté - Veuillez vous connecter au backoffice')
    }
  }

  const refetchPhotos = async () => {
    if (!propertyId) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cli_property_photos')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true })

      if (error) throw error
      setPhotos(data || [])
    } catch (err) {
      console.error('Erreur lors du chargement des photos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    if (!propertyId) {
      setError('Veuillez d\'abord enregistrer la propriété avant d\'ajouter des photos')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${propertyId}/${Date.now()}-${index}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('pics')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        const nextOrder = photos.length + index

        const { error: dbError } = await supabase
          .from('cli_property_photos')
          .insert({
            property_id: propertyId,
            bucket_path: fileName,
            display_order: nextOrder,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            alt_text: null
          })

        if (dbError) throw dbError
      })

      await Promise.all(uploadPromises)
      await refetchPhotos()

      if (onPhotosChange) {
        onPhotosChange()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
      console.error('Erreur upload:', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (photo: PropertyPhoto) => {
    if (!confirm('Supprimer cette photo ?')) return

    try {
      const { error: storageError } = await supabase.storage
        .from('pics')
        .remove([photo.bucket_path])

      if (storageError) throw storageError

      const { error: dbError } = await supabase
        .from('cli_property_photos')
        .delete()
        .eq('id', photo.id)

      if (dbError) throw dbError

      await reorderPhotos(photos.filter(p => p.id !== photo.id))
      await refetchPhotos()

      if (onPhotosChange) {
        onPhotosChange()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      console.error('Erreur suppression:', err)
    }
  }

  const reorderPhotos = async (newPhotos: PropertyPhoto[]) => {
    try {
      const updates = newPhotos.map((photo, index) =>
        supabase
          .from('cli_property_photos')
          .update({ display_order: index })
          .eq('id', photo.id)
      )

      await Promise.all(updates)
    } catch (err) {
      console.error('Erreur lors du réordonnancement:', err)
    }
  }

  const movePhoto = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === photos.length - 1) return

    const newPhotos = [...photos]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    ;[newPhotos[index], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[index]]

    setPhotos(newPhotos)
    await reorderPhotos(newPhotos)

    if (onPhotosChange) {
      onPhotosChange()
    }
  }

  const setAsMain = async (index: number) => {
    if (index === 0) return

    const newPhotos = [...photos]
    const [photoToMove] = newPhotos.splice(index, 1)
    newPhotos.unshift(photoToMove)

    setPhotos(newPhotos)
    await reorderPhotos(newPhotos)

    if (onPhotosChange) {
      onPhotosChange()
    }
  }

  const getPhotoUrl = (bucketPath: string) => {
    const { data } = supabase.storage
      .from('pics')
      .getPublicUrl(bucketPath)

    return data.publicUrl
  }

  if (!propertyId) {
    return (
      <div className="p-6 bg-fuchs-cream/50 rounded-lg text-center">
        <p className="text-fuchs-black/60">Enregistrez d&apos;abord la propriété pour ajouter des photos</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userDebug && (
        <div className={`p-3 rounded text-sm ${userDebug.startsWith('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {userDebug}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Photos du bien</label>
        <div className="border-2 border-dashed border-fuchs-cream rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50' : ''}`}
          >
            <Upload className="w-12 h-12 text-fuchs-gold mb-2" />
            <p className="text-sm font-medium text-fuchs-black">
              {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des photos'}
            </p>
            <p className="text-xs text-fuchs-black/60 mt-1">
              PNG, JPG jusqu&apos;à 10MB - Plusieurs fichiers autorisés
            </p>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-fuchs-black/60">Chargement des photos...</p>
        </div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group border border-fuchs-cream rounded-lg overflow-hidden"
            >
              <img
                src={getPhotoUrl(photo.bucket_path)}
                alt={photo.alt_text || photo.file_name}
                className="w-full h-48 object-cover"
              />

              {index === 0 && (
                <div className="absolute top-2 left-2 bg-fuchs-gold text-fuchs-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Principale
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    onClick={() => setAsMain(index)}
                    className="p-2 bg-fuchs-gold text-fuchs-white rounded hover:bg-fuchs-gold/90"
                    title="Définir comme photo principale"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}

                {index > 0 && (
                  <button
                    onClick={() => movePhoto(index, 'up')}
                    className="p-2 bg-fuchs-white text-fuchs-black rounded hover:bg-fuchs-cream"
                    title="Monter"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}

                {index < photos.length - 1 && (
                  <button
                    onClick={() => movePhoto(index, 'down')}
                    className="p-2 bg-fuchs-white text-fuchs-black rounded hover:bg-fuchs-cream"
                    title="Descendre"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(photo)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Supprimer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 bg-fuchs-white">
                <p className="text-xs text-fuchs-black/60 truncate">{photo.file_name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-fuchs-cream/50 rounded-lg">
          <p className="text-fuchs-black/60">Aucune photo pour ce bien</p>
        </div>
      )}
    </div>
  )
}
