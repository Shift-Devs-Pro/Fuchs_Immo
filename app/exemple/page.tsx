import Button from '@/components/Button'
import Card from '@/components/Card'

export default function ExemplePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Exemples de Composants</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Boutons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Bouton Principal</Button>
            <Button variant="secondary">Bouton Secondaire</Button>
            <Button variant="outline">Bouton Outline</Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button variant="primary" size="sm">Petit</Button>
            <Button variant="primary" size="md">Moyen</Button>
            <Button variant="primary" size="lg">Grand</Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button variant="primary" disabled>Désactivé</Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cartes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-xl font-semibold mb-2">Carte Simple</h3>
              <p className="text-gray-600">Ceci est une carte avec du contenu.</p>
            </Card>

            <Card padding="lg">
              <h3 className="text-xl font-semibold mb-2">Grande Carte</h3>
              <p className="text-gray-600">Cette carte a un padding plus large.</p>
            </Card>

            <Card padding="sm">
              <h3 className="text-xl font-semibold mb-2">Petite Carte</h3>
              <p className="text-gray-600">Cette carte a un padding réduit.</p>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Carte Complexe</h2>
          <Card>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Exemple de Contenu</h3>
              <p className="text-gray-600">
                Vous pouvez combiner différents composants pour créer des interfaces riches.
              </p>
              <div className="flex gap-4">
                <Button variant="primary">Action Principale</Button>
                <Button variant="outline">Action Secondaire</Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
