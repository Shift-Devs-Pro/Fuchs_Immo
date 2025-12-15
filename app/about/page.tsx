/**
 * AboutPage
 *
 * Page "À propos" de l'application.
 * Présente le conseiller EXPERTIMO, son approche et ses services.
 *
 * Responsabilité : Assemblage des sections About.
 */

import StorySection from './AboutSections/StorySection'
import ValuesSection from './AboutSections/ValuesSection'
import ServicesSection from './AboutSections/ServicesSection'

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-fuchs-cream via-fuchs-white to-fuchs-cream py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl text-fuchs-black mb-6">
            Professionnalisme et sérénité
          </h1>
          <p className="text-lg md:text-xl text-fuchs-black/70 max-w-3xl mx-auto mb-4">
            Conseiller immobilier indépendant EXPERTIMO, je m&apos;engage personnellement dans la réussite de vos projets immobiliers.
          </p>
          <p className="text-base text-fuchs-black/60 max-w-2xl mx-auto italic">
            &quot;Chers vendeurs, chers acquéreurs, c&apos;est avec un immense plaisir que je vous accueille dans mon univers qui s&apos;épanouit grâce à vos projets.&quot;
          </p>
        </div>
      </section>

      <StorySection />
      <ValuesSection />
      <ServicesSection />
    </>
  )
}
