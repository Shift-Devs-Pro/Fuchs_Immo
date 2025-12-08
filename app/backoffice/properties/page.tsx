'use client'

/**
 * PropertiesManagementPage
 *
 * Page de gestion des biens immobiliers dans le backoffice.
 * Permet de créer, modifier, supprimer et gérer les biens.
 *
 * Responsabilité unique : Interface de gestion des propriétés.
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

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
  status: 'available' | 'reserved' | 'sold' | 'rented'
  is_featured: boolean
  is_published: boolean
  created_at: string
}

export default function PropertiesManagementPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)

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
    if (user) {
      fetchProperties()
    }
  }, [user])

  const fetchProperties = async () => {
    setLoadingProperties(true)
    try {
      const { data, error } = await supabase
        .from('cli_properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProperties(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des propriétés:', error)
    } finally {
      setLoadingProperties(false)
    }
  }

  const handleTogglePublish = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cli_properties')
        .update({ is_published: !currentStatus })
        .eq('id', propertyId)

      if (error) throw error

      fetchProperties()
    } catch (error) {
      console.error('Erreur lors de la publication:', error)
    }
  }

  const handleToggleFeatured = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cli_properties')
        .update({ is_featured: !currentStatus })
        .eq('id', propertyId)

      if (error) throw error

      fetchProperties()
    } catch (error) {
      console.error('Erreur lors du changement de statut featured:', error)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) return

    try {
      const { error } = await supabase
        .from('cli_properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error

      fetchProperties()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
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

  return (
    <main className="min-h-screen bg-fuchs-cream pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-fuchs-white shadow-soft rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display mb-2">Gestion des biens</h1>
              <nav className="flex gap-4 text-sm">
                <a href="/backoffice/dashboard" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Dashboard
                </a>
                <span className="text-fuchs-black/30">•</span>
                <span className="text-fuchs-gold">Biens</span>
                <span className="text-fuchs-black/30">•</span>
                <a href="/backoffice/contacts" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Contacts
                </a>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-fuchs-gold text-fuchs-white rounded hover:bg-fuchs-gold/90 transition-colors"
            >
              Déconnexion
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => window.location.href = '/backoffice/properties/new'}
              className="px-6 py-3 bg-fuchs-gold text-fuchs-white rounded-lg hover:bg-fuchs-gold/90 transition-colors font-medium"
            >
              + Ajouter un bien
            </button>
          </div>

          {loadingProperties ? (
            <div className="text-center py-12">
              <p className="text-fuchs-black/60">Chargement des biens...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-fuchs-black/60">Aucun bien enregistré</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-fuchs-cream">
                  <tr>
                    <th className="text-left py-4 px-4 font-medium">Titre</th>
                    <th className="text-left py-4 px-4 font-medium">Type</th>
                    <th className="text-left py-4 px-4 font-medium">Prix</th>
                    <th className="text-left py-4 px-4 font-medium">Ville</th>
                    <th className="text-left py-4 px-4 font-medium">Statut</th>
                    <th className="text-left py-4 px-4 font-medium">Publié</th>
                    <th className="text-left py-4 px-4 font-medium">Featured</th>
                    <th className="text-right py-4 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-fuchs-cream hover:bg-fuchs-cream/30 transition-colors">
                      <td className="py-4 px-4">{property.title}</td>
                      <td className="py-4 px-4 capitalize">
                        {property.transaction_type === 'sale' ? 'Vente' : 'Location'}
                      </td>
                      <td className="py-4 px-4">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(property.price)}
                      </td>
                      <td className="py-4 px-4">{property.city}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                          property.status === 'sold' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {property.status === 'available' ? 'Disponible' :
                           property.status === 'reserved' ? 'Réservé' :
                           property.status === 'sold' ? 'Vendu' : 'Loué'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleTogglePublish(property.id, property.is_published)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            property.is_published
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {property.is_published ? 'Publié' : 'Brouillon'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleFeatured(property.id, property.is_featured)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            property.is_featured
                              ? 'bg-fuchs-gold/20 text-fuchs-gold hover:bg-fuchs-gold/30'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {property.is_featured ? '★ Featured' : '☆'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => window.location.href = `/backoffice/properties/${property.id}`}
                            className="px-3 py-1 bg-fuchs-cream text-fuchs-black rounded hover:bg-fuchs-cream/70 transition-colors text-sm"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
