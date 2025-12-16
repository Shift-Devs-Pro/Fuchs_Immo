/**
 * EstimationPage
 *
 * Page de demande d'estimation gratuite d'un bien immobilier.
 *
 * Responsabilité : Collecter les informations nécessaires pour une estimation.
 */

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin, Home, Ruler, Bath, BedDouble, DoorOpen, Calendar, LandPlot, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function EstimationPage() {
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    // Localisation
    adresse: '',
    codePostal: '',
    ville: '',
    // Caractéristiques du bien
    typeBien: '',
    surfaceHabitable: '',
    surfaceTerrain: '',
    nombrePieces: '',
    nombreChambres: '',
    nombreSallesDeBain: '',
    anneeConstruction: '',
    // Informations complémentaires
    etatGeneral: '',
    parking: '',
    commentaires: ''
  })

  // Préremplir les champs depuis les paramètres URL
  useEffect(() => {
    const ville = searchParams.get('ville')
    const typeBien = searchParams.get('typeBien')
    const surface = searchParams.get('surface')
    
    if (ville || typeBien || surface) {
      setFormData(prev => ({
        ...prev,
        ville: ville || prev.ville,
        typeBien: typeBien || prev.typeBien,
        surfaceHabitable: surface || prev.surfaceHabitable
      }))
    }
  }, [searchParams])

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
        .from('cli_estimation_requests')
        .insert({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          adresse: formData.adresse,
          code_postal: formData.codePostal,
          ville: formData.ville,
          type_bien: formData.typeBien,
          surface_habitable: parseInt(formData.surfaceHabitable),
          surface_terrain: formData.surfaceTerrain ? parseInt(formData.surfaceTerrain) : null,
          nombre_pieces: formData.nombrePieces,
          nombre_chambres: formData.nombreChambres,
          nombre_salles_de_bain: formData.nombreSallesDeBain,
          annee_construction: formData.anneeConstruction ? parseInt(formData.anneeConstruction) : null,
          etat_general: formData.etatGeneral || null,
          parking: formData.parking || null,
          commentaires: formData.commentaires || null
        })

      if (insertError) throw insertError
      
      setIsSubmitted(true)
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err)
      setError('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-fuchs-cream via-fuchs-white to-fuchs-cream py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-fuchs-black mb-6">
              Demande envoyée !
            </h1>
            <p className="text-lg md:text-xl text-fuchs-black/70 max-w-2xl mx-auto mb-8">
              Merci pour votre demande d&apos;estimation. Je vous recontacterai dans les plus brefs délais pour organiser une visite et vous fournir une estimation précise de votre bien.
            </p>
            <a href="/" className="btn-primary inline-block">
              Retour à l&apos;accueil
            </a>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-fuchs-cream via-fuchs-white to-fuchs-cream py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl text-fuchs-black mb-6">
            Estimation Gratuite
          </h1>
          <p className="text-lg md:text-xl text-fuchs-black/70 max-w-2xl mx-auto">
            Obtenez une estimation précise et gratuite de votre bien immobilier
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-fuchs-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-fuchs-cream rounded-lg p-8 md:p-12 border border-fuchs-black/20">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Section: Informations personnelles */}
              <div>
                <h2 className="font-display text-2xl text-fuchs-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-fuchs-gold text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Vos coordonnées
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-fuchs-black mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      required
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-fuchs-black mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
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
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                      placeholder="votre@email.fr"
                    />
                  </div>
                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-fuchs-black mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      required
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                      placeholder="06 XX XX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Localisation */}
              <div>
                <h2 className="font-display text-2xl text-fuchs-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-fuchs-gold text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <MapPin className="w-5 h-5 text-fuchs-gold" />
                  Localisation du bien
                </h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="adresse" className="block text-sm font-medium text-fuchs-black mb-2">
                      Adresse précise *
                    </label>
                    <input
                      type="text"
                      id="adresse"
                      name="adresse"
                      required
                      value={formData.adresse}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                      placeholder="Numéro et nom de rue"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="codePostal" className="block text-sm font-medium text-fuchs-black mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        id="codePostal"
                        name="codePostal"
                        required
                        value={formData.codePostal}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                        placeholder="67000"
                      />
                    </div>
                    <div>
                      <label htmlFor="ville" className="block text-sm font-medium text-fuchs-black mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        id="ville"
                        name="ville"
                        required
                        value={formData.ville}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                        placeholder="Strasbourg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Caractéristiques du bien */}
              <div>
                <h2 className="font-display text-2xl text-fuchs-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-fuchs-gold text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <Home className="w-5 h-5 text-fuchs-gold" />
                  Caractéristiques du bien
                </h2>
                
                {/* Type de bien */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-fuchs-black mb-3">
                    Type de bien *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'appartement', label: 'Appartement', icon: '🏢' },
                      { value: 'maison', label: 'Maison', icon: '🏠' },
                      { value: 'terrain', label: 'Terrain', icon: '🌳' }
                    ].map((type) => (
                      <label
                        key={type.value}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.typeBien === type.value
                            ? 'border-fuchs-gold bg-fuchs-gold/10'
                            : 'border-fuchs-black/10 bg-fuchs-white hover:border-fuchs-gold/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="typeBien"
                          value={type.value}
                          checked={formData.typeBien === type.value}
                          onChange={handleChange}
                          className="sr-only"
                          required
                        />
                        <span className="text-2xl mb-2">{type.icon}</span>
                        <span className="text-sm font-medium text-fuchs-black">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Surfaces */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="surfaceHabitable" className="block text-sm font-medium text-fuchs-black mb-2">
                      <Ruler className="w-4 h-4 inline mr-2 text-fuchs-gold" />
                      Surface habitable (m²) *
                    </label>
                    <input
                      type="number"
                      id="surfaceHabitable"
                      name="surfaceHabitable"
                      required
                      min="1"
                      value={formData.surfaceHabitable}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                      placeholder="Ex: 120"
                    />
                  </div>
                  <div>
                    <label htmlFor="surfaceTerrain" className="block text-sm font-medium text-fuchs-black mb-2">
                      <LandPlot className="w-4 h-4 inline mr-2 text-fuchs-gold" />
                      Surface terrain (m²)
                    </label>
                    <input
                      type="number"
                      id="surfaceTerrain"
                      name="surfaceTerrain"
                      min="0"
                      value={formData.surfaceTerrain}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                      placeholder="Ex: 500"
                    />
                  </div>
                </div>

                {/* Pièces */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="nombrePieces" className="block text-sm font-medium text-fuchs-black mb-2">
                      <DoorOpen className="w-4 h-4 inline mr-2 text-fuchs-gold" />
                      Pièces *
                    </label>
                    <select
                      id="nombrePieces"
                      name="nombrePieces"
                      required
                      value={formData.nombrePieces}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                    >
                      <option value="">--</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                      <option value="10+">10+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nombreChambres" className="block text-sm font-medium text-fuchs-black mb-2">
                      <BedDouble className="w-4 h-4 inline mr-2 text-fuchs-gold" />
                      Chambres *
                    </label>
                    <select
                      id="nombreChambres"
                      name="nombreChambres"
                      required
                      value={formData.nombreChambres}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                    >
                      <option value="">--</option>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                      <option value="8+">8+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="nombreSallesDeBain" className="block text-sm font-medium text-fuchs-black mb-2">
                      <Bath className="w-4 h-4 inline mr-2 text-fuchs-gold" />
                      Salles de bain *
                    </label>
                    <select
                      id="nombreSallesDeBain"
                      name="nombreSallesDeBain"
                      required
                      value={formData.nombreSallesDeBain}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                    >
                      <option value="">--</option>
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                      <option value="5+">5+</option>
                    </select>
                  </div>
                </div>

                {/* Année et état */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="anneeConstruction" className="block text-sm font-medium text-fuchs-black mb-2">
                      <Calendar className="w-4 h-4 inline mr-2 text-fuchs-gold" />
                      Année de construction
                    </label>
                    <input
                      type="number"
                      id="anneeConstruction"
                      name="anneeConstruction"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.anneeConstruction}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                      placeholder="Ex: 1990"
                    />
                  </div>
                  <div>
                    <label htmlFor="etatGeneral" className="block text-sm font-medium text-fuchs-black mb-2">
                      État général
                    </label>
                    <select
                      id="etatGeneral"
                      name="etatGeneral"
                      value={formData.etatGeneral}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="neuf">Neuf</option>
                      <option value="excellent">Excellent état</option>
                      <option value="bon">Bon état</option>
                      <option value="rafraichir">À rafraîchir</option>
                      <option value="renover">À rénover</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Informations complémentaires */}
              <div>
                <h2 className="font-display text-2xl text-fuchs-black mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-fuchs-gold text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Informations complémentaires
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="parking" className="block text-sm font-medium text-fuchs-black mb-2">
                      Stationnement
                    </label>
                    <select
                      id="parking"
                      name="parking"
                      value={formData.parking}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="aucun">Aucun</option>
                      <option value="rue">Stationnement rue</option>
                      <option value="place">Place de parking</option>
                      <option value="garage">Garage</option>
                      <option value="multiple">Plusieurs places/garages</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="commentaires" className="block text-sm font-medium text-fuchs-black mb-2">
                      Commentaires ou précisions
                    </label>
                    <textarea
                      id="commentaires"
                      name="commentaires"
                      rows={4}
                      value={formData.commentaires}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-fuchs-white border border-fuchs-black/10 rounded-lg focus:ring-2 focus:ring-fuchs-gold focus:border-transparent transition-all resize-none"
                      placeholder="Ajoutez toute information utile pour l'estimation : travaux récents, particularités, équipements..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Demander mon estimation gratuite
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-fuchs-black/60 mt-4">
                  En soumettant ce formulaire, vous acceptez d&apos;être recontacté pour votre demande d&apos;estimation.
                </p>
              </div>
            </form>
          </div>

          {/* Reassurance */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-fuchs-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-fuchs-black mb-2">Estimation précise</h3>
              <p className="text-sm text-fuchs-black/60">Basée sur le marché local et les ventes récentes</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-fuchs-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="font-semibold text-fuchs-black mb-2">Réponse rapide</h3>
              <p className="text-sm text-fuchs-black/60">Retour sous 48h avec prise de rendez-vous</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-fuchs-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-fuchs-black mb-2">Sans engagement</h3>
              <p className="text-sm text-fuchs-black/60">Estimation 100% gratuite et confidentielle</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
