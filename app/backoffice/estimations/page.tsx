'use client'

/**
 * EstimationsManagementPage
 *
 * Page de gestion des demandes d'estimation dans le backoffice.
 * Permet de consulter, suivre et gérer les demandes d'estimation gratuite.
 *
 * Responsabilité unique : Interface de gestion des demandes d'estimation.
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Home, 
  MapPin, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Calendar,
  Ruler,
  BedDouble,
  Bath,
  DoorOpen,
  X,
  Trash2,
  FileText
} from 'lucide-react'

interface EstimationRequest {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  code_postal: string
  ville: string
  type_bien: 'appartement' | 'maison' | 'terrain'
  surface_habitable: number
  surface_terrain: number | null
  nombre_pieces: string
  nombre_chambres: string
  nombre_salles_de_bain: string
  annee_construction: number | null
  etat_general: string | null
  parking: string | null
  commentaires: string | null
  status: 'new' | 'contacted' | 'visit_scheduled' | 'estimated' | 'closed'
  notes: string | null
  estimated_value: number | null
  created_at: string
}

export default function EstimationsManagementPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [estimations, setEstimations] = useState<EstimationRequest[]>([])
  const [loadingEstimations, setLoadingEstimations] = useState(true)
  const [selectedEstimation, setSelectedEstimation] = useState<EstimationRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<EstimationRequest['status'] | 'all'>('all')
  const [notesInput, setNotesInput] = useState('')
  const [estimatedValueInput, setEstimatedValueInput] = useState('')

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
      fetchEstimations()
    }
  }, [user])

  useEffect(() => {
    if (selectedEstimation) {
      setNotesInput(selectedEstimation.notes || '')
      setEstimatedValueInput(selectedEstimation.estimated_value?.toString() || '')
    }
  }, [selectedEstimation])

  const fetchEstimations = async () => {
    setLoadingEstimations(true)
    try {
      const { data, error } = await supabase
        .from('cli_estimation_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setEstimations(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des estimations:', error)
    } finally {
      setLoadingEstimations(false)
    }
  }

  const handleStatusChange = async (estimationId: string, newStatus: EstimationRequest['status']) => {
    try {
      const { error } = await supabase
        .from('cli_estimation_requests')
        .update({ status: newStatus })
        .eq('id', estimationId)

      if (error) throw error

      fetchEstimations()
      if (selectedEstimation?.id === estimationId) {
        setSelectedEstimation({ ...selectedEstimation, status: newStatus })
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedEstimation) return

    try {
      const { error } = await supabase
        .from('cli_estimation_requests')
        .update({ notes: notesInput })
        .eq('id', selectedEstimation.id)

      if (error) throw error

      fetchEstimations()
      setSelectedEstimation({ ...selectedEstimation, notes: notesInput })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notes:', error)
    }
  }

  const handleSaveEstimatedValue = async () => {
    if (!selectedEstimation) return

    try {
      const value = estimatedValueInput ? parseFloat(estimatedValueInput) : null
      const { error } = await supabase
        .from('cli_estimation_requests')
        .update({ estimated_value: value })
        .eq('id', selectedEstimation.id)

      if (error) throw error

      fetchEstimations()
      setSelectedEstimation({ ...selectedEstimation, estimated_value: value })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'estimation:', error)
    }
  }

  const handleDelete = async (estimationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande d\'estimation ?')) return

    try {
      const { error } = await supabase
        .from('cli_estimation_requests')
        .delete()
        .eq('id', estimationId)

      if (error) throw error

      fetchEstimations()
      if (selectedEstimation?.id === estimationId) {
        setSelectedEstimation(null)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/backoffice'
  }

  const getStatusLabel = (status: EstimationRequest['status']) => {
    const labels = {
      new: 'Nouvelle',
      contacted: 'Contacté',
      visit_scheduled: 'Visite prévue',
      estimated: 'Estimé',
      closed: 'Clôturé'
    }
    return labels[status]
  }

  const getStatusColor = (status: EstimationRequest['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      visit_scheduled: 'bg-purple-100 text-purple-800',
      estimated: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status]
  }

  const getTypeBienLabel = (type: string) => {
    const labels: Record<string, string> = {
      appartement: 'Appartement',
      maison: 'Maison',
      terrain: 'Terrain'
    }
    return labels[type] || type
  }

  const getTypeBienIcon = (type: string) => {
    const icons: Record<string, string> = {
      appartement: '🏢',
      maison: '🏠',
      terrain: '🌳'
    }
    return icons[type] || '🏠'
  }

  const getEtatGeneralLabel = (etat: string | null) => {
    if (!etat) return '-'
    const labels: Record<string, string> = {
      neuf: 'Neuf',
      excellent: 'Excellent état',
      bon: 'Bon état',
      rafraichir: 'À rafraîchir',
      renover: 'À rénover'
    }
    return labels[etat] || etat
  }

  const getParkingLabel = (parking: string | null) => {
    if (!parking) return '-'
    const labels: Record<string, string> = {
      aucun: 'Aucun',
      rue: 'Stationnement rue',
      place: 'Place de parking',
      garage: 'Garage',
      multiple: 'Plusieurs places/garages'
    }
    return labels[parking] || parking
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (value: number | null) => {
    if (!value) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value)
  }

  const filteredEstimations = filterStatus === 'all' 
    ? estimations 
    : estimations.filter(e => e.status === filterStatus)

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/backoffice/dashboard"
              className="flex items-center gap-2 text-fuchs-black/70 hover:text-fuchs-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </Link>
            <h1 className="text-3xl font-display text-fuchs-black">
              Demandes d&apos;estimation
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-fuchs-black/70 hover:text-red-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {(['all', 'new', 'contacted', 'visit_scheduled', 'estimated'] as const).map((status) => {
            const count = status === 'all' 
              ? estimations.length 
              : estimations.filter(e => e.status === status).length
            const label = status === 'all' ? 'Toutes' : getStatusLabel(status)
            const isActive = filterStatus === status
            
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`p-4 rounded-lg text-center transition-all ${
                  isActive 
                    ? 'bg-fuchs-gold text-white' 
                    : 'bg-white hover:bg-fuchs-gold/10'
                }`}
              >
                <div className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-fuchs-black'}`}>
                  {count}
                </div>
                <div className={`text-sm ${isActive ? 'text-white/80' : 'text-fuchs-black/60'}`}>
                  {label}
                </div>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des demandes */}
          <div className="lg:col-span-2 space-y-4">
            {loadingEstimations ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-fuchs-black/60">Chargement des demandes...</p>
              </div>
            ) : filteredEstimations.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-fuchs-black/20 mx-auto mb-4" />
                <p className="text-fuchs-black/60">Aucune demande d&apos;estimation</p>
              </div>
            ) : (
              filteredEstimations.map((estimation) => (
                <div
                  key={estimation.id}
                  onClick={() => setSelectedEstimation(estimation)}
                  className={`bg-white rounded-lg p-6 cursor-pointer transition-all border-2 ${
                    selectedEstimation?.id === estimation.id
                      ? 'border-fuchs-gold shadow-lg'
                      : 'border-transparent hover:border-fuchs-gold/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeBienIcon(estimation.type_bien)}</span>
                      <div>
                        <h3 className="font-semibold text-fuchs-black">
                          {getTypeBienLabel(estimation.type_bien)} - {estimation.surface_habitable} m²
                        </h3>
                        <p className="text-sm text-fuchs-black/60 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {estimation.ville} ({estimation.code_postal})
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(estimation.status)}`}>
                      {getStatusLabel(estimation.status)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4 text-fuchs-black/60">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {estimation.prenom} {estimation.nom}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(estimation.created_at)}
                      </span>
                    </div>
                    {estimation.estimated_value && (
                      <span className="font-semibold text-fuchs-gold">
                        {formatPrice(estimation.estimated_value)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Détail de la demande sélectionnée */}
          <div className="lg:col-span-1">
            {selectedEstimation ? (
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-display text-fuchs-black">Détails</h2>
                  <button
                    onClick={() => setSelectedEstimation(null)}
                    className="p-1 hover:bg-fuchs-cream rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Informations du demandeur */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-fuchs-black/60 uppercase tracking-wide mb-3">
                    Demandeur
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-fuchs-gold" />
                      {selectedEstimation.prenom} {selectedEstimation.nom}
                    </p>
                    <a 
                      href={`mailto:${selectedEstimation.email}`}
                      className="flex items-center gap-2 text-fuchs-black hover:text-fuchs-gold"
                    >
                      <Mail className="w-4 h-4 text-fuchs-gold" />
                      {selectedEstimation.email}
                    </a>
                    <a 
                      href={`tel:${selectedEstimation.telephone}`}
                      className="flex items-center gap-2 text-fuchs-black hover:text-fuchs-gold"
                    >
                      <Phone className="w-4 h-4 text-fuchs-gold" />
                      {selectedEstimation.telephone}
                    </a>
                  </div>
                </div>

                {/* Localisation */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-fuchs-black/60 uppercase tracking-wide mb-3">
                    Localisation
                  </h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-fuchs-gold mt-0.5" />
                    <div>
                      <p>{selectedEstimation.adresse}</p>
                      <p>{selectedEstimation.code_postal} {selectedEstimation.ville}</p>
                    </div>
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-fuchs-black/60 uppercase tracking-wide mb-3">
                    Caractéristiques
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-fuchs-gold" />
                      <span>{getTypeBienLabel(selectedEstimation.type_bien)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-fuchs-gold" />
                      <span>{selectedEstimation.surface_habitable} m²</span>
                    </div>
                    {selectedEstimation.surface_terrain && (
                      <div className="flex items-center gap-2">
                        <span className="text-fuchs-gold">🌳</span>
                        <span>Terrain: {selectedEstimation.surface_terrain} m²</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <DoorOpen className="w-4 h-4 text-fuchs-gold" />
                      <span>{selectedEstimation.nombre_pieces} pièces</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-fuchs-gold" />
                      <span>{selectedEstimation.nombre_chambres} ch.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-fuchs-gold" />
                      <span>{selectedEstimation.nombre_salles_de_bain} sdb</span>
                    </div>
                    {selectedEstimation.annee_construction && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-fuchs-gold" />
                        <span>Construit en {selectedEstimation.annee_construction}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-sm">
                    <p><strong>État :</strong> {getEtatGeneralLabel(selectedEstimation.etat_general)}</p>
                    <p><strong>Parking :</strong> {getParkingLabel(selectedEstimation.parking)}</p>
                  </div>
                </div>

                {/* Commentaires du demandeur */}
                {selectedEstimation.commentaires && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-fuchs-black/60 uppercase tracking-wide mb-3">
                      Commentaires du demandeur
                    </h3>
                    <p className="text-sm bg-fuchs-cream p-3 rounded-lg">
                      {selectedEstimation.commentaires}
                    </p>
                  </div>
                )}

                {/* Statut */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-fuchs-black/60 uppercase tracking-wide mb-3">
                    Statut
                  </h3>
                  <select
                    value={selectedEstimation.status}
                    onChange={(e) => handleStatusChange(selectedEstimation.id, e.target.value as EstimationRequest['status'])}
                    className="w-full px-3 py-2 border border-fuchs-black/20 rounded-lg focus:ring-2 focus:ring-fuchs-gold"
                  >
                    <option value="new">Nouvelle</option>
                    <option value="contacted">Contacté</option>
                    <option value="visit_scheduled">Visite prévue</option>
                    <option value="estimated">Estimé</option>
                    <option value="closed">Clôturé</option>
                  </select>
                </div>

                {/* Valeur estimée */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-fuchs-black/60 uppercase tracking-wide mb-3">
                    Valeur estimée (€)
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={estimatedValueInput}
                      onChange={(e) => setEstimatedValueInput(e.target.value)}
                      placeholder="Ex: 350000"
                      className="flex-1 px-3 py-2 border border-fuchs-black/20 rounded-lg focus:ring-2 focus:ring-fuchs-gold"
                    />
                    <button
                      onClick={handleSaveEstimatedValue}
                      className="px-4 py-2 bg-fuchs-gold text-white rounded-lg hover:bg-fuchs-gold/90"
                    >
                      OK
                    </button>
                  </div>
                </div>

                {/* Notes internes */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-fuchs-black/60 uppercase tracking-wide mb-3">
                    Notes internes
                  </h3>
                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    rows={3}
                    placeholder="Ajouter des notes..."
                    className="w-full px-3 py-2 border border-fuchs-black/20 rounded-lg focus:ring-2 focus:ring-fuchs-gold resize-none"
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="mt-2 w-full px-4 py-2 bg-fuchs-cream hover:bg-fuchs-gold/20 rounded-lg transition-colors text-sm"
                  >
                    Sauvegarder les notes
                  </button>
                </div>

                {/* Actions */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => handleDelete(selectedEstimation.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer cette demande
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-fuchs-black/20 mx-auto mb-4" />
                <p className="text-fuchs-black/60">
                  Sélectionnez une demande pour voir les détails
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
