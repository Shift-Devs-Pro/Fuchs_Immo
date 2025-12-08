/**
 * ContactPage
 *
 * Page de contact pour joindre le conseiller EXPERTIMO.
 *
 * Responsabilité : Afficher les coordonnées et le formulaire de contact.
 */

import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-fuchs-cream via-fuchs-white to-fuchs-cream py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl text-fuchs-black mb-6">
            Contactez-moi
          </h1>
          <p className="text-lg md:text-xl text-fuchs-black/70 max-w-2xl mx-auto">
            Ensemble, concrétisons votre projet immobilier
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 md:py-24 bg-fuchs-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div>
              <h2 className="font-display text-3xl text-fuchs-black mb-6">
                Grégoire Fuchs
              </h2>
              <p className="text-fuchs-black/70 mb-8 leading-relaxed">
                Conseiller immobilier indépendant EXPERTIMO, je suis à votre écoute pour vous accompagner dans tous vos projets immobiliers.
              </p>

              <div className="space-y-6">
                {/* Téléphone */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-fuchs-gold rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-fuchs-black mb-1">Téléphone</h3>
                    <a
                      href="tel:0687370519"
                      className="text-fuchs-black/70 hover:text-fuchs-gold transition-colors"
                    >
                      06 87 37 05 19
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-fuchs-gold rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-fuchs-black mb-1">Email</h3>
                    <a
                      href="mailto:contact@expertimo-fuchs.fr"
                      className="text-fuchs-black/70 hover:text-fuchs-gold transition-colors"
                    >
                      contact@expertimo-fuchs.fr
                    </a>
                  </div>
                </div>

                {/* Secteur */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-fuchs-gold rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-fuchs-black mb-1">Secteur d&apos;intervention</h3>
                    <p className="text-fuchs-black/70">
                      Votre région
                    </p>
                  </div>
                </div>

                {/* Disponibilité */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-fuchs-gold rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-fuchs-black mb-1">Disponibilité</h3>
                    <p className="text-fuchs-black/70">
                      Du lundi au samedi<br />
                      9h00 - 19h00
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA réseau EXPERTIMO */}
              <div className="mt-8 p-6 bg-fuchs-cream rounded-lg">
                <p className="text-sm text-fuchs-black/70 mb-2">
                  Avec l&apos;appui du réseau EXPERTIMO
                </p>
                <p className="font-semibold text-fuchs-black">
                  Leader reconnu en France
                </p>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="bg-fuchs-cream rounded-lg p-8">
              <h3 className="font-display text-2xl text-fuchs-black mb-6">
                Envoyez-moi un message
              </h3>

              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-fuchs-black mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-fuchs-black mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                    placeholder="votre@email.fr"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-fuchs-black mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-fuchs-black mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    required
                    className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="vente">Vendre mon bien</option>
                    <option value="achat">Acheter un bien</option>
                    <option value="estimation">Demande d&apos;estimation</option>
                    <option value="information">Demande d&apos;information</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-fuchs-black mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all resize-none"
                    placeholder="Décrivez votre projet..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-fuchs-gold text-white font-semibold rounded-lg hover:bg-fuchs-gold/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Envoyer le message
                </button>

                <p className="text-xs text-fuchs-black/50 text-center">
                  * Champs obligatoires
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-fuchs-gold to-fuchs-gold/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            N&apos;attendez plus, contactez-moi dès aujourd&apos;hui pour une première consultation gratuite.
          </p>
          <a
            href="tel:0687370519"
            className="inline-flex items-center px-8 py-4 bg-white text-fuchs-gold font-semibold rounded-lg hover:bg-fuchs-cream transition-all transform hover:scale-105"
          >
            <Phone className="w-5 h-5 mr-2" />
            06 87 37 05 19
          </a>
        </div>
      </section>
    </>
  )
}
