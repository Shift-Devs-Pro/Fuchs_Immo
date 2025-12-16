/**
 * ContactPage
 *
 * Page de contact pour joindre le conseiller EXPERTIMO.
 *
 * Responsabilité : Afficher les coordonnées et le formulaire de contact.
 */

'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('cli_contact_requests')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          status: 'new'
        })

      if (insertError) throw insertError

      setIsSubmitted(true)
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err)
      setError('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              {/* Photo du conseiller */}
              <div className="mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pics_greg.jpeg"
                  alt="Grégoire Fuchs - Conseiller EXPERTIMO"
                  className="w-48 h-48 object-cover rounded-full shadow-lg mx-auto md:mx-0"
                  loading="lazy"
                />
              </div>

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
                      href="mailto:N/A"
                      className="text-fuchs-black/70 hover:text-fuchs-gold transition-colors"
                    >
                      N/A
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
                      Alsace
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
            <div className="bg-fuchs-cream rounded-lg p-8 border border-fuchs-black/20">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h3 className="font-display text-2xl text-fuchs-black mb-4">
                    Message envoyé !
                  </h3>
                  <p className="text-fuchs-black/70 mb-6">
                    Merci pour votre message. Je vous recontacterai dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        subject: '',
                        message: ''
                      })
                    }}
                    className="text-fuchs-gold hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl text-fuchs-black mb-6">
                    Envoyez-moi un message
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-fuchs-black mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-fuchs-black mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-fuchs-black mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
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
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
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
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
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
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all resize-none"
                        placeholder="Décrivez votre projet..."
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-fuchs-gold text-white font-semibold rounded-lg hover:bg-fuchs-gold/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Envoyer le message
                        </>
                      )}
                    </button>

                    <p className="text-xs text-fuchs-black/50 text-center">
                      * Champs obligatoires
                    </p>
                  </form>
                </>
              )}
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
