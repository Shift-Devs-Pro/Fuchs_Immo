'use client'

/**
 * DashboardPage
 *
 * Page principale du backoffice pour les utilisateurs authentifiés.
 * Protégée par vérification de session Supabase.
 *
 * Responsabilité unique : Interface de gestion du backoffice.
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    properties: 0,
    publishedProperties: 0,
    contacts: 0,
    newContacts: 0,
    estimations: 0,
    newEstimations: 0
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
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const { count: propertiesCount } = await supabase
        .from('cli_properties')
        .select('*', { count: 'exact', head: true })

      const { count: publishedCount } = await supabase
        .from('cli_properties')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      const { count: contactsCount } = await supabase
        .from('cli_contact_requests')
        .select('*', { count: 'exact', head: true })

      const { count: newContactsCount } = await supabase
        .from('cli_contact_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

      const { count: estimationsCount } = await supabase
        .from('cli_estimation_requests')
        .select('*', { count: 'exact', head: true })

      const { count: newEstimationsCount } = await supabase
        .from('cli_estimation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

      setStats({
        properties: propertiesCount || 0,
        publishedProperties: publishedCount || 0,
        contacts: contactsCount || 0,
        newContacts: newContactsCount || 0,
        estimations: estimationsCount || 0,
        newEstimations: newEstimationsCount || 0
      })
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
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
              <h1 className="text-3xl font-display mb-2">Tableau de bord</h1>
              <nav className="flex gap-4 text-sm">
                <span className="text-fuchs-gold">Dashboard</span>
                <span className="text-fuchs-black/30">•</span>
                <a href="/backoffice/properties" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Biens
                </a>
                <span className="text-fuchs-black/30">•</span>
                <a href="/backoffice/contacts" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Contacts
                </a>
                <span className="text-fuchs-black/30">•</span>
                <a href="/backoffice/estimations" className="text-fuchs-black/60 hover:text-fuchs-gold transition-colors">
                  Estimations
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

          <div className="space-y-6">
            <div className="border-b border-fuchs-cream pb-4">
              <h2 className="text-xl font-medium mb-2">Bienvenue</h2>
              <p className="text-fuchs-black/70">
                Connecté en tant que : <span className="font-medium">{user?.email}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a
                href="/backoffice/properties"
                className="p-6 bg-fuchs-cream rounded-lg hover:bg-fuchs-gold/10 transition-colors cursor-pointer"
              >
                <h3 className="font-medium mb-2 text-fuchs-black/70">Propriétés</h3>
                <p className="text-3xl font-display text-fuchs-gold">{stats.properties}</p>
                <p className="text-sm text-fuchs-black/60 mt-2">
                  {stats.publishedProperties} publiées
                </p>
              </a>
              <a
                href="/backoffice/contacts"
                className="p-6 bg-fuchs-cream rounded-lg hover:bg-fuchs-gold/10 transition-colors cursor-pointer"
              >
                <h3 className="font-medium mb-2 text-fuchs-black/70">Demandes de contact</h3>
                <p className="text-3xl font-display text-fuchs-gold">{stats.contacts}</p>
                <p className="text-sm text-fuchs-black/60 mt-2">
                  {stats.newContacts} nouvelles
                </p>
              </a>
              <a
                href="/backoffice/properties"
                className="p-6 bg-fuchs-cream rounded-lg hover:bg-fuchs-gold/10 transition-colors cursor-pointer"
              >
                <h3 className="font-medium mb-2 text-fuchs-black/70">Taux de publication</h3>
                <p className="text-3xl font-display text-fuchs-gold">
                  {stats.properties > 0 ? Math.round((stats.publishedProperties / stats.properties) * 100) : 0}%
                </p>
                <p className="text-sm text-fuchs-black/60 mt-2">
                  Biens publiés
                </p>
              </a>
              <a
                href="/backoffice/contacts"
                className="p-6 bg-fuchs-cream rounded-lg hover:bg-fuchs-gold/10 transition-colors cursor-pointer"
              >
                <h3 className="font-medium mb-2 text-fuchs-black/70">Taux de réponse</h3>
                <p className="text-3xl font-display text-fuchs-gold">
                  {stats.contacts > 0 ? Math.round(((stats.contacts - stats.newContacts) / stats.contacts) * 100) : 0}%
                </p>
                <p className="text-sm text-fuchs-black/60 mt-2">
                  Demandes traitées
                </p>
              </a>
              <a
                href="/backoffice/estimations"
                className="p-6 bg-fuchs-cream rounded-lg hover:bg-fuchs-gold/10 transition-colors cursor-pointer"
              >
                <h3 className="font-medium mb-2 text-fuchs-black/70">Estimations</h3>
                <p className="text-3xl font-display text-fuchs-gold">{stats.estimations}</p>
                <p className="text-sm text-fuchs-black/60 mt-2">
                  {stats.newEstimations} nouvelles
                </p>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 border border-fuchs-cream rounded-lg">
                <h3 className="font-medium text-lg mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <a
                    href="/backoffice/properties/new"
                    className="block px-4 py-3 bg-fuchs-gold text-fuchs-white rounded hover:bg-fuchs-gold/90 transition-colors text-center"
                  >
                    + Ajouter un bien
                  </a>
                  <a
                    href="/backoffice/properties"
                    className="block px-4 py-3 bg-fuchs-cream text-fuchs-black rounded hover:bg-fuchs-cream/70 transition-colors text-center"
                  >
                    Voir tous les biens
                  </a>
                  <a
                    href="/backoffice/contacts"
                    className="block px-4 py-3 bg-fuchs-cream text-fuchs-black rounded hover:bg-fuchs-cream/70 transition-colors text-center"
                  >
                    Voir les demandes de contact
                  </a>
                  <a
                    href="/backoffice/estimations"
                    className="block px-4 py-3 bg-fuchs-cream text-fuchs-black rounded hover:bg-fuchs-cream/70 transition-colors text-center"
                  >
                    Voir les demandes d&apos;estimation
                  </a>
                </div>
              </div>

              <div className="p-6 border border-fuchs-cream rounded-lg">
                <h3 className="font-medium text-lg mb-4">Activité récente</h3>
                <div className="space-y-3 text-sm text-fuchs-black/70">
                  {stats.properties === 0 && stats.contacts === 0 && stats.estimations === 0 ? (
                    <p>Aucune activité récente</p>
                  ) : (
                    <>
                      {stats.properties > 0 && (
                        <p>• {stats.properties} bien(s) au total</p>
                      )}
                      {stats.publishedProperties > 0 && (
                        <p>• {stats.publishedProperties} bien(s) publié(s)</p>
                      )}
                      {stats.contacts > 0 && (
                        <p>• {stats.contacts} demande(s) de contact</p>
                      )}
                      {stats.newContacts > 0 && (
                        <p className="text-fuchs-gold font-medium">• {stats.newContacts} nouvelle(s) demande(s) de contact à traiter</p>
                      )}
                      {stats.estimations > 0 && (
                        <p>• {stats.estimations} demande(s) d&apos;estimation</p>
                      )}
                      {stats.newEstimations > 0 && (
                        <p className="text-fuchs-gold font-medium">• {stats.newEstimations} nouvelle(s) demande(s) d&apos;estimation à traiter</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
