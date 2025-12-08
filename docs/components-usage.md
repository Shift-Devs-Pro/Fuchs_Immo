# Guide d'Utilisation des Composants

## PropertyCard

Carte pour afficher une propriété immobilière.

### Import

```tsx
import PropertyCard from '@/components/estate/PropertyCard'
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| title | string | Titre de la propriété |
| price | string | Prix (format avec €) |
| bedrooms | number | Nombre de chambres |
| bathrooms | number | Nombre de salles de bain |
| surface | number | Surface en m² |
| description | string | Description courte |
| imageUrl | string? | URL de l'image (optionnel) |

### Exemple

```tsx
<PropertyCard
  title="Villa Moderne"
  price="450 000 €"
  bedrooms={4}
  bathrooms={2}
  surface={150}
  description="Belle villa moderne dans un quartier calme et résidentiel."
  imageUrl="https://example.com/image.jpg"
/>
```

### Grille de Propriétés

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {properties.map((property) => (
    <PropertyCard
      key={property.id}
      title={property.title}
      price={property.price}
      bedrooms={property.bedrooms}
      bathrooms={property.bathrooms}
      surface={property.surface}
      description={property.description}
      imageUrl={property.imageUrl}
    />
  ))}
</div>
```

---

## SearchBar

Barre de recherche avec filtres pour les propriétés.

### Import

```tsx
import SearchBar from '@/components/estate/SearchBar'
```

### Utilisation

```tsx
<SearchBar />
```

### Personnalisation

Pour connecter la recherche à un état :

```tsx
'use client'

import { useState } from 'react'
import SearchBar from '@/components/estate/SearchBar'

export default function CataloguePage() {
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceMax: 0
  })

  const handleSearch = () => {
    // Logique de recherche
  }

  return (
    <div>
      <SearchBar />
      {/* Résultats */}
    </div>
  )
}
```

---

## Boutons

### Bouton Primaire

Border or, texte noir, hover : fond or + texte blanc

```tsx
<button className="btn-primary">
  Découvrir nos biens
</button>
```

### Bouton Secondaire

Fond or, texte blanc, hover : opacité réduite

```tsx
<button className="btn-secondary">
  Voir le bien
</button>
```

### Bouton Link

Pour transformer un Link en bouton :

```tsx
import Link from 'next/link'

<Link href="/catalogue" className="btn-primary">
  Découvrir nos biens
</Link>
```

---

## Layout Components

### Container

Container responsive avec padding automatique

```tsx
<div className="container-custom">
  Votre contenu
</div>
```

### Section avec Séparateur

```tsx
<section className="py-16">
  <div className="container-custom">
    <h2 className="mb-8">Titre de Section</h2>
    {/* Contenu */}
  </div>
</section>

<div className="separator-gold"></div>

<section className="py-16 bg-fuchs-cream">
  {/* Autre section */}
</section>
```

---

## Grilles Responsive

### 3 Colonnes (Desktop)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### 2 Colonnes

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div>Colonne 1</div>
  <div>Colonne 2</div>
</div>
```

---

## Formulaires

### Input Standard

```tsx
<div>
  <label htmlFor="name" className="block text-sm font-medium mb-2">
    Nom
  </label>
  <input
    type="text"
    id="name"
    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
  />
</div>
```

### Select

```tsx
<div>
  <label htmlFor="type" className="block text-sm font-medium mb-2">
    Type de bien
  </label>
  <select
    id="type"
    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
  >
    <option value="">Tous</option>
    <option value="appartement">Appartement</option>
    <option value="maison">Maison</option>
  </select>
</div>
```

### Textarea

```tsx
<div>
  <label htmlFor="message" className="block text-sm font-medium mb-2">
    Message
  </label>
  <textarea
    id="message"
    rows={5}
    className="w-full px-4 py-2 border border-fuchs-cream rounded focus:outline-none focus:ring-2 focus:ring-fuchs-gold"
  />
</div>
```

---

## Cartes Simples

### Carte avec Padding

```tsx
<div className="bg-fuchs-white border border-fuchs-cream shadow-soft rounded p-6">
  <h3 className="text-2xl mb-4">Titre</h3>
  <p>Contenu de la carte</p>
</div>
```

### Carte avec Hover

```tsx
<div className="bg-fuchs-white border border-fuchs-cream shadow-soft rounded p-6 transition-all duration-400 hover:shadow-hover">
  <h3 className="text-2xl mb-4">Titre</h3>
  <p>Contenu de la carte</p>
</div>
```

---

## Hero Section

Section d'accueil avec fond crème

```tsx
<section className="bg-fuchs-cream py-24">
  <div className="container-custom text-center">
    <h1 className="mb-6">
      Votre partenaire immobilier de confiance
    </h1>
    <p className="text-xl mb-8 max-w-2xl mx-auto">
      Description courte de votre activité
    </p>
    <div className="flex gap-4 justify-center">
      <button className="btn-primary">Découvrir</button>
      <button className="btn-secondary">Contact</button>
    </div>
  </div>
</section>
```

---

## Icônes (Placeholder)

En attendant l'intégration d'une librairie d'icônes :

```tsx
<span className="text-fuchs-gold text-xl">■</span>
<span className="text-fuchs-gold text-xl">◇</span>
```

Pour une vraie intégration, utiliser Lucide React :

```bash
npm install lucide-react
```

```tsx
import { Home, Bed, Bath, Maximize } from 'lucide-react'

<div className="flex gap-4">
  <Bed className="w-5 h-5 text-fuchs-gold" />
  <span>4 chambres</span>
</div>
```
