/**
 * StorySection
 *
 * Section présentant le conseiller et son expertise.
 *
 * Responsabilité unique : Présenter l'identité et l'approche du conseiller EXPERTIMO.
 */

export default function StorySection() {
  return (
    <section className="py-16 md:py-24 bg-fuchs-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-fuchs-black mb-6">
              Votre conseiller immobilier indépendant
            </h2>
            <div className="space-y-4 text-fuchs-black/80 leading-relaxed">
              <p>
                Choisir EXPERTIMO pour l&apos;achat ou la vente de votre maison, appartement ou terrain, c&apos;est opter pour le professionnalisme et la sérénité.
              </p>
              <p>
                Aujourd&apos;hui, la maîtrise de notre marché, mon approche humaine de la profession et la proximité avec mes clients m&apos;apportent un réseau de qualité et de confiance. Cette qualité de travail me permet de vendre pour vous dans les meilleures conditions et dans un délai optimal.
              </p>
              <p>
                EXPERTIMO allie modernité, compétence et convivialité pour répondre au mieux à vos besoins et vous accompagner dans la réalisation de vos projets d&apos;achat ou de vente.
              </p>
            </div>
          </div>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pics_greg.jpeg"
              alt="Conseiller EXPERTIMO"
              className="rounded-lg shadow-xl"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 bg-fuchs-gold text-white p-6 rounded-lg shadow-lg">
              <div className="text-2xl font-display mb-1">Grégoire FUCHS</div>
              <div className="text-sm">Réseau EXPERTIMO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
