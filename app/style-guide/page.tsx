export default function StyleGuidePage() {
  return (
    <div className="bg-fuchs-white">
      {/* Hero */}
      <section className="bg-fuchs-cream py-16">
        <div className="container-custom">
          <h1 className="text-center mb-4">Fuchs Immobilier</h1>
          <p className="text-center text-xl">Guide de Style & Direction Artistique</p>
        </div>
      </section>

      {/* Colors */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="mb-8">Palette de Couleurs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-full h-32 bg-fuchs-white border border-fuchs-black mb-4 rounded"></div>
              <p className="font-medium">Blanc Pur</p>
              <p className="text-sm text-fuchs-gold">#FFFFFF</p>
            </div>
            <div className="text-center">
              <div className="w-full h-32 bg-fuchs-cream border border-fuchs-black mb-4 rounded"></div>
              <p className="font-medium">Crème Léger</p>
              <p className="text-sm text-fuchs-gold">#F8F8F4</p>
            </div>
            <div className="text-center">
              <div className="w-full h-32 bg-fuchs-black mb-4 rounded"></div>
              <p className="font-medium">Noir Profond</p>
              <p className="text-sm text-fuchs-gold">#000000</p>
            </div>
            <div className="text-center">
              <div className="w-full h-32 bg-fuchs-gold mb-4 rounded"></div>
              <p className="font-medium">Or Élégant</p>
              <p className="text-sm text-fuchs-gold">#C19C55</p>
            </div>
          </div>
        </div>
      </section>

      <div className="separator-gold my-16"></div>

      {/* Typography */}
      <section className="py-16 bg-fuchs-cream">
        <div className="container-custom">
          <h2 className="mb-8">Typographie</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-fuchs-gold mb-2">Titres - Playfair Display</p>
              <h1 className="mb-2">Heading 1 - 48px</h1>
              <h2 className="mb-2">Heading 2 - 36px</h2>
              <h3 className="mb-2">Heading 3 - 28px</h3>
            </div>

            <div>
              <p className="text-sm text-fuchs-gold mb-2">Corps de Texte - Inter</p>
              <p className="text-base mb-2">
                Corps de texte régulier - 16px. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-sm">
                Petit texte - 14px. Utilisé pour les informations secondaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="separator-gold my-16"></div>

      {/* Buttons */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="mb-8">Boutons</h2>

          <div className="space-y-8">
            <div>
              <p className="text-sm text-fuchs-gold mb-4">Bouton Primaire</p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">
                  Découvrir nos biens
                </button>
                <button className="btn-primary">
                  Demander une estimation
                </button>
                <button className="btn-primary">
                  Nous contacter
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-fuchs-gold mb-4">Bouton Secondaire</p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-secondary">
                  Voir le bien
                </button>
                <button className="btn-secondary">
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="separator-gold my-16"></div>

      {/* Property Card Example */}
      <section className="py-16 bg-fuchs-cream">
        <div className="container-custom">
          <h2 className="mb-8">Carte de Propriété</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-fuchs-white border border-fuchs-cream shadow-soft rounded transition-all duration-400 hover:shadow-hover overflow-hidden group"
              >
                <div className="relative h-64 bg-fuchs-cream overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-fuchs-gold">
                    [Image de propriété]
                  </div>
                  <div className="absolute inset-0 bg-fuchs-black opacity-0 group-hover:opacity-5 transition-opacity duration-400"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl mb-2">Villa Moderne</h3>
                  <p className="text-fuchs-gold text-xl font-semibold mb-4">450 000 €</p>

                  <div className="flex gap-4 text-sm mb-4">
                    <span className="flex items-center gap-1">
                      <span className="text-fuchs-gold">■</span> 4 chambres
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-fuchs-gold">■</span> 2 SDB
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-fuchs-gold">■</span> 150 m²
                    </span>
                  </div>

                  <p className="text-sm mb-6">
                    Belle villa moderne dans un quartier calme et résidentiel.
                  </p>

                  <button className="btn-primary w-full">
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="separator-gold my-16"></div>

      {/* Spacing System */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="mb-8">Système d&apos;Espacement (8px)</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-fuchs-gold"></div>
              <p className="text-sm">8px - Petit</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-fuchs-gold"></div>
              <p className="text-sm">16px - Moyen</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-fuchs-gold"></div>
              <p className="text-sm">24px - Large</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-fuchs-gold"></div>
              <p className="text-sm">32px - Extra Large</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-fuchs-gold"></div>
              <p className="text-sm">64px - Sections</p>
            </div>
          </div>
        </div>
      </section>

      <div className="separator-gold my-16"></div>

      {/* Icons Placeholder */}
      <section className="py-16 bg-fuchs-cream">
        <div className="container-custom">
          <h2 className="mb-8">Icônes (Style Outline)</h2>

          <p className="mb-8">
            Utilisation d&apos;icônes de style &quot;outline&quot; en couleur or (#C19C55)
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 text-center">
            {['Chambres', 'SDB', 'Surface', 'Téléphone', 'Email', 'Localisation'].map((icon) => (
              <div key={icon}>
                <div className="w-16 h-16 mx-auto mb-2 border-2 border-fuchs-gold rounded-full flex items-center justify-center">
                  <span className="text-fuchs-gold text-2xl">◇</span>
                </div>
                <p className="text-sm">{icon}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="mb-8">Principes Directeurs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-fuchs-cream">
              <h3 className="text-xl mb-4">Simplicité</h3>
              <p>Pas de fioritures, communication directe et efficace</p>
            </div>
            <div className="p-8 border border-fuchs-cream">
              <h3 className="text-xl mb-4">Élégance sobre</h3>
              <p>L&apos;or comme accent subtil, jamais en excès</p>
            </div>
            <div className="p-8 border border-fuchs-cream">
              <h3 className="text-xl mb-4">Clarté</h3>
              <p>Lecture facile, hiérarchie visuelle évidente</p>
            </div>
            <div className="p-8 border border-fuchs-cream">
              <h3 className="text-xl mb-4">Espace</h3>
              <p>Générosité des blancs, sections aérées</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
