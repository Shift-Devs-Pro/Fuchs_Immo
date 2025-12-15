'use client'

/**
 * LoginForm
 *
 * Formulaire de connexion au backoffice.
 * Utilise Supabase Auth pour l'authentification des utilisateurs existants uniquement.
 *
 * Responsabilité unique : Gérer la connexion des utilisateurs autorisés.
 */

import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // Utilisateur déjà connecté, rediriger vers le dashboard
          window.location.href = '/backoffice/dashboard'
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de session:', err)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Email ou mot de passe incorrect')
        setLoading(false)
        return
      }

      if (data.user) {
        window.location.href = '/backoffice/dashboard'
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion')
      setLoading(false)
    }
  }

  // Afficher un loader pendant la vérification de session
  if (checkingSession) {
    return (
      <div className="text-center py-8">
        <p className="text-fuchs-black/60">Vérification de la session...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold transition-all duration-300"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}
