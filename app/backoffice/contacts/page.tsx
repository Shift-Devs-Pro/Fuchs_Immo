'use client'

/**
 * ContactsManagementPage
 *
 * Page de gestion des demandes de contact dans le backoffice.
 * Permet de consulter, assigner, changer le statut et gérer les demandes.
 *
 * Responsabilité unique : Interface de gestion des demandes de contact.
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface ContactRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  subject: string
  message: string
  property_id: string | null
  status: 'new' | 'in_progress' | 'resolved' | 'closed'
  assigned_to: string | null
  notes: string | null
  created_at: string
}

interface Property {
  id: string
  title: string
}

export default function ContactsManagementPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [properties, setProperties] = useState<Record<string, string>>({})
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<ContactRequest['status'] | 'all'>('all')

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
      fetchContacts()
      fetchProperties()
    }
  }, [user])

  const fetchContacts = async () => {
    setLoadingContacts(true)
    try {
      const { data, error } = await supabase
        .from('cli_contact_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setContacts(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error)
    } finally {
      setLoadingContacts(false)
    }
  }

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('cli_properties')
        .select('id, title')

      if (error) throw error

      const propertiesMap: Record<string, string> = {}
      data?.forEach((prop: Property) => {
        propertiesMap[prop.id] = prop.title
      })
      setProperties(propertiesMap)
    } catch (error) {
      console.error('Erreur lors du chargement des propriétés:', error)
    }
  }

  const handleStatusChange = async (contactId: string, newStatus: ContactRequest['status']) => {
    try {
      const { error } = await supabase
        .from('cli_contact_requests')
        .update({ status: newStatus })
        .eq('id', contactId)

      if (error) throw error

      fetchContacts()
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus })
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
    }
  }

  const handleAddNote = async (contactId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('cli_contact_requests')
        .update({ notes })
        .eq('id', contactId)

      if (error) throw error

      fetchContacts()
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, notes })
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de notes:', error)
    }
  }

  const handleDelete = async (contactId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return

    try {
      const { error } = await supabase
        .from('cli_contact_requests')
        .delete()
        .eq('id', contactId)

      if (error) throw error

      fetchContacts()
      if (selectedContact?.id === contactId) {
        setSelectedContact(null)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/backoffice'
  }

  const getStatusLabel = (status: ContactRequest['status']) => {
    const labels = {
      new: 'Nouveau',
      in_progress: 'En cours',
      resolved: 'Résolu',
      closed: 'Fermé'
    }
    return labels[status]
  }

  const getStatusColor = (status: ContactRequest['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status]
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
              <h1 className="text-3xl font-display mb-2">Gestion des contacts</h1>
              <nav className="flex gap-4 text-sm">
                <a href="/backoffice/dashboard" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Dashboard
                </a>
                <span className="text-fuchs-black/30">•</span>
                <a href="/backoffice/properties" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Biens
                </a>
                <span className="text-fuchs-black/30">•</span>
                <span className="text-fuchs-gold">Contacts</span>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-fuchs-gold text-fuchs-white rounded hover:bg-fuchs-gold/90 transition-colors"
            >
              Déconnexion
            </button>
          </div>

          {loadingContacts ? (
            <div className="text-center py-12">
              <p className="text-fuchs-black/60">Chargement des demandes...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-fuchs-black/60">Aucune demande de contact</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium">Filtrer par statut :</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      filterStatus === 'all'
                        ? 'bg-fuchs-gold text-fuchs-white'
                        : 'bg-fuchs-cream text-fuchs-black hover:bg-fuchs-cream/70'
                    }`}
                  >
                    Tous ({contacts.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('new')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      filterStatus === 'new'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    Nouveaux ({contacts.filter(c => c.status === 'new').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('in_progress')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      filterStatus === 'in_progress'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    En cours ({contacts.filter(c => c.status === 'in_progress').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('resolved')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      filterStatus === 'resolved'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Résolus ({contacts.filter(c => c.status === 'resolved').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('closed')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      filterStatus === 'closed'
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Fermés ({contacts.filter(c => c.status === 'closed').length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {contacts
                      .filter(contact => filterStatus === 'all' || contact.status === filterStatus)
                      .map((contact) => (
                    <div
                      key={contact.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        selectedContact?.id === contact.id
                          ? 'border-fuchs-gold bg-fuchs-gold/5'
                          : 'border-fuchs-cream hover:border-fuchs-gold/50'
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-lg">
                            {contact.first_name} {contact.last_name}
                          </h3>
                          <p className="text-sm text-fuchs-black/60">{contact.email}</p>
                          {contact.phone && (
                            <p className="text-sm text-fuchs-black/60">{contact.phone}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {getStatusLabel(contact.status)}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="font-medium text-sm mb-1">Sujet : {contact.subject}</p>
                        {contact.property_id && properties[contact.property_id] && (
                          <p className="text-sm text-fuchs-black/60">
                            Propriété : {properties[contact.property_id]}
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-fuchs-black/70 line-clamp-2">
                        {contact.message}
                      </p>

                      <p className="text-xs text-fuchs-black/50 mt-3">
                        {new Date(contact.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                {selectedContact ? (
                  <div className="border border-fuchs-cream rounded-lg p-6 sticky top-24">
                    <h3 className="font-display text-xl mb-4">Détails</h3>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Statut</label>
                        <select
                          value={selectedContact.status}
                          onChange={(e) => handleStatusChange(selectedContact.id, e.target.value as ContactRequest['status'])}
                          className="w-full px-3 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                        >
                          <option value="new">Nouveau</option>
                          <option value="in_progress">En cours</option>
                          <option value="resolved">Résolu</option>
                          <option value="closed">Fermé</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Message complet</label>
                        <p className="text-sm text-fuchs-black/70 p-3 bg-fuchs-cream/50 rounded">
                          {selectedContact.message}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Notes internes</label>
                        <textarea
                          value={selectedContact.notes || ''}
                          onChange={(e) => {
                            const newNotes = e.target.value
                            setSelectedContact({ ...selectedContact, notes: newNotes })
                          }}
                          onBlur={(e) => handleAddNote(selectedContact.id, e.target.value)}
                          className="w-full px-3 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold resize-none"
                          rows={4}
                          placeholder="Ajouter des notes..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="block w-full px-4 py-2 bg-fuchs-gold text-fuchs-white text-center rounded hover:bg-fuchs-gold/90 transition-colors"
                      >
                        Envoyer un email
                      </a>
                      <button
                        onClick={() => handleDelete(selectedContact.id)}
                        className="block w-full px-4 py-2 bg-red-100 text-red-800 text-center rounded hover:bg-red-200 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-fuchs-cream rounded-lg p-6 text-center text-fuchs-black/60">
                    Sélectionnez une demande pour voir les détails
                  </div>
                )}
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
