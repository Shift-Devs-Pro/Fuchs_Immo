/**
 * ValuesSection
 *
 * Section présentant l'approche et les engagements du conseiller.
 *
 * Responsabilité unique : Afficher les principes et la démarche d'accompagnement.
 */

import { Heart, Shield, Target, Handshake } from 'lucide-react'

const VALUES = [
  {
    icon: Heart,
    title: 'Relations humaines',
    description: 'Une approche humaine qui dépasse les valeurs purement commerciales du métier.',
  },
  {
    icon: Shield,
    title: 'Réputation engagée',
    description: 'J&apos;engage ma réputation sur chaque client rencontré et chaque dossier traité.',
  },
  {
    icon: Target,
    title: 'Suivi personnalisé',
    description: 'De l&apos;estimation au notaire, je prends soin de vos projets dans leur intégralité.',
  },
  {
    icon: Handshake,
    title: 'Interlocuteur unique',
    description: 'Je serai votre unique interlocuteur et assurerai la gestion complète de votre dossier.',
  },
]

export default function ValuesSection() {
  return (
    <section className="py-16 md:py-24 bg-fuchs-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-fuchs-black mb-4">
            Mon engagement
          </h2>
          <p className="text-lg text-fuchs-black/70 max-w-2xl mx-auto">
            Votre satisfaction fonde ma réputation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((value) => {
            const Icon = value.icon
            return (
              <div
                key={value.title}
                className="bg-fuchs-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fuchs-gold/10 mb-4">
                  <Icon className="w-8 h-8 text-fuchs-gold" />
                </div>
                <h3 className="font-display text-xl text-fuchs-black mb-3">
                  {value.title}
                </h3>
                <p className="text-fuchs-black/70 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
