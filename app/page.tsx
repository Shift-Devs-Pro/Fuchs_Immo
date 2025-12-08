/**
 * HomePage
 *
 * Page d'accueil de l'application immobilière.
 * Orchestre l'affichage du Hero et des biens vedettes.
 *
 * Responsabilité : Assemblage des sections principales de l'accueil.
 */

import HeroSection from './sections/HeroSection'
import FeaturedPropertiesSection from './sections/FeaturedPropertiesSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPropertiesSection />
    </>
  )
}
