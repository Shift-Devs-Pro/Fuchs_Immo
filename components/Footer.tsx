import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-fuchs-cream border-t border-fuchs-gold">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">
              <span className="text-fuchs-gold">Fuchs</span> Immobilier
            </h3>
            <p className="text-sm mb-4">
              Votre partenaire immobilier de confiance pour tous vos projets résidentiels.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-fuchs-gold">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-fuchs-gold">
                  Nos Biens
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-fuchs-gold">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-fuchs-gold">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/estimation" className="hover:text-fuchs-gold">
                  Estimation Gratuite
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-fuchs-gold">■</span>
                <span>contact@fuchs-immobilier.fr</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-fuchs-gold">■</span>
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-fuchs-gold">■</span>
                <span>123 Avenue Example, 75001 Paris</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="separator-gold mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Fuchs Immobilier. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
