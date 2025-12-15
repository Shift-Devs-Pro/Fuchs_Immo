/**
 * BackofficePage
 *
 * Page de connexion et d'accès au backoffice.
 * Point d'entrée pour l'administration de l'application.
 *
 * Responsabilité unique : Interface de connexion au backoffice.
 */

import LoginForm from './LoginForm'

export const metadata = {
  title: 'Backoffice | ExpertImo',
  description: 'Accès au backoffice de gestion',
}

export default function BackofficePage() {
  return (
    <main className="min-h-screen bg-fuchs-cream pt-24 pb-16">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="bg-fuchs-white shadow-soft rounded-lg p-8">
          <h1 className="text-3xl font-display text-center mb-8">Backoffice</h1>

          <LoginForm />

          <p className="text-sm text-fuchs-black/60 text-center mt-6">
            Accès réservé aux administrateurs
          </p>
        </div>
      </div>
    </main>
  )
}
