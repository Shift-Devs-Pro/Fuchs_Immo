/**
 * ServicesSection
 *
 * Section présentant les services pour vendeurs et acquéreurs.
 *
 * Responsabilité unique : Détailler l'accompagnement pour la vente et l'achat.
 */

import { Home, Key, TrendingUp, FileCheck } from 'lucide-react'

export default function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-fuchs-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-fuchs-black mb-4">
            Mes services
          </h2>
          <p className="text-lg text-fuchs-black/70 max-w-2xl mx-auto">
            Un accompagnement complet pour vendeurs et acquéreurs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Vente */}
          <div className="bg-fuchs-cream rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-fuchs-gold rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl text-fuchs-black">
                Pour la vente de votre bien
              </h3>
            </div>
            <ul className="space-y-3 text-fuchs-black/80">
              <li className="flex items-start">
                <span className="text-fuchs-gold mr-2">•</span>
                <span>Une estimation gratuite au juste prix</span>
              </li>
              <li className="flex items-start">
                <span className="text-fuchs-gold mr-2">•</span>
                <span>Une diffusion d&apos;envergure et moderne sur plus d&apos;une centaine de sites internet en illimité</span>
              </li>
              <li className="flex items-start">
                <span className="text-fuchs-gold mr-2">•</span>
                <span>Un suivi personnalisé dans une démarche de qualité et de satisfaction jusqu&apos;aux signatures notariées</span>
              </li>
            </ul>
          </div>

          {/* Achat */}
          <div className="bg-fuchs-cream rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-fuchs-gold rounded-lg flex items-center justify-center mr-4">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl text-fuchs-black">
                Pour l&apos;achat d&apos;un bien
              </h3>
            </div>
            <ul className="space-y-3 text-fuchs-black/80">
              <li className="flex items-start">
                <span className="text-fuchs-gold mr-2">•</span>
                <span>Un recueil précis de vos besoins et attentes</span>
              </li>
              <li className="flex items-start">
                <span className="text-fuchs-gold mr-2">•</span>
                <span>Une présentation de biens correspondant à vos critères</span>
              </li>
              <li className="flex items-start">
                <span className="text-fuchs-gold mr-2">•</span>
                <span>Un suivi personnalisé dans une démarche de qualité et de satisfaction jusqu&apos;aux signatures notariées</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Réseau de compétences */}
        <div className="bg-gradient-to-br from-fuchs-gold to-fuchs-gold/80 rounded-lg p-8 text-white">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-2xl">
              Un réseau de compétences à votre service
            </h3>
          </div>
          <p className="mb-4">
            J&apos;ai formé autour de moi un véritable réseau de professionnels compétents qui peuvent vous accompagner :
          </p>
          <div className="flex flex-wrap gap-3">
            {['Architectes', 'Notaires', 'Services juridiques', 'Courtiers', 'Artisans', 'Gestionnaires de patrimoine', 'Défiscalisation', 'Déménageurs', 'Gestion d\'immeubles'].map((partner) => (
              <span
                key={partner}
                className="px-3 py-1 bg-white/20 rounded-full text-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
