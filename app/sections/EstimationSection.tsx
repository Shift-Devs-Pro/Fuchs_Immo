/**
 * EstimationSection
 *
 * Section de la page d'accueil pour demander une estimation rapide.
 * Redirige vers la page estimation avec les champs préremplis.
 *
 * Responsabilité unique : Point d'entrée rapide pour une estimation.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator } from 'lucide-react'

export default function EstimationSection() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    ville: '',
    typeBien: '',
    surface: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construire l'URL avec les paramètres
    const params = new URLSearchParams()
    if (formData.ville) params.set('ville', formData.ville)
    if (formData.typeBien) params.set('typeBien', formData.typeBien)
    if (formData.surface) params.set('surface', formData.surface)
    
    const queryString = params.toString()
    router.push(`/estimation${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-fuchs-gold/10 via-fuchs-cream to-fuchs-gold/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-fuchs-gold rounded-full mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-fuchs-black mb-4">
            Estimation gratuite de votre bien
          </h2>
          <p className="text-lg text-fuchs-black/70 max-w-2xl mx-auto">
            Obtenez une estimation précise en quelques clics
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-fuchs-white shadow-soft p-8 rounded">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="ville" className="block text-sm font-medium mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  placeholder="Ex: Strasbourg"
                  className="w-full px-4 py-3 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                />
              </div>

              <div>
                <label htmlFor="typeBien" className="block text-sm font-medium mb-2">
                  Type de bien
                </label>
                <select
                  id="typeBien"
                  name="typeBien"
                  value={formData.typeBien}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                >
                  <option value="">Sélectionnez</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>

              <div>
                <label htmlFor="surface" className="block text-sm font-medium mb-2">
                  Surface (m²)
                </label>
                <input
                  type="number"
                  id="surface"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Ex: 120"
                  min="1"
                  className="w-full px-4 py-3 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
                />
              </div>

              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full py-3">
                  Estimer mon bien
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
