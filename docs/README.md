# Documentation - Fuchs Immobilier

## Direction Artistique

La Direction Artistique complète est disponible dans le fichier [`direction-artistique.md`](./direction-artistique.md).

### Visualisation du Style Guide

Pour visualiser tous les éléments de la direction artistique en action, visitez la page `/style-guide` du site.

Cette page présente :
- La palette de couleurs complète
- La typographie (Playfair Display + Inter)
- Les boutons avec leurs états (normal, hover)
- Les cartes de propriété
- Le système d'espacement
- Les icônes
- Les principes directeurs

## Couleurs Officielles

```css
Or Élégant    : #C19C55
Noir Profond  : #000000
Blanc Pur     : #FFFFFF
Crème Léger   : #F8F8F4
```

**IMPORTANT** : Ces couleurs sont les seules autorisées. Aucune variante n'est permise.

## Typographie

### Titres (H1, H2, H3)
- **Font** : Playfair Display (Serif)
- **Usage** : Tous les titres et en-têtes

### Corps de Texte
- **Font** : Inter (Sans-Serif)
- **Usage** : Texte courant, navigation, boutons

## Composants Principaux

### Header
- Sticky, position top
- Logo Fuchs Immobilier (avec placeholder pour logo)
- Navigation horizontale
- CTA "Estimation Gratuite"

### Footer
- 3 colonnes (Info, Navigation, Contact)
- Fond crème avec bordure or
- Liens avec hover or

### PropertyCard
- Image 4:3 ou 16:9
- Titre, prix, caractéristiques (chambres, SDB, surface)
- Description courte
- Bouton "Voir les détails"
- Effet hover : shadow-hover

### SearchBar
- Filtres : Localisation, Type, Prix
- Bouton de recherche

## Structure du Projet

```
/app
  /style-guide       → Page de visualisation de la DA
  /catalogue         → Catalogue de biens (à créer)
  /about             → À propos (à personnaliser)
  /contact           → Contact (à personnaliser)
  /estimation        → Estimation gratuite (à créer)

/components
  /estate
    PropertyCard.tsx → Carte de propriété
    SearchBar.tsx    → Barre de recherche
  Header.tsx         → En-tête du site
  Footer.tsx         → Pied de page

/docs
  direction-artistique.md → DA complète
  README.md               → Ce fichier
```

## Utilisation des Classes Tailwind Personnalisées

### Boutons

```tsx
// Bouton primaire
<button className="btn-primary">Texte</button>

// Bouton secondaire
<button className="btn-secondary">Texte</button>
```

### Container

```tsx
<div className="container-custom">
  Contenu centré avec padding responsive
</div>
```

### Séparateur Or

```tsx
<div className="separator-gold"></div>
```

### Couleurs

```tsx
// Texte
text-fuchs-black
text-fuchs-gold
text-fuchs-white

// Background
bg-fuchs-white
bg-fuchs-cream
bg-fuchs-gold
bg-fuchs-black

// Border
border-fuchs-gold
border-fuchs-cream
```

### Ombres

```tsx
shadow-soft   → Ombre douce standard
shadow-hover  → Ombre au hover (or)
```

## Animations

Toutes les animations utilisent une durée de **0.3s** ou **0.4s** avec un easing `ease`.

```css
transition-all duration-300
transition-all duration-400
```

## Prochaines Étapes

1. Créer les pages manquantes :
   - `/catalogue` avec filtres et liste de propriétés
   - `/estimation` avec formulaire d'estimation
   - Personnaliser `/about` et `/contact`

2. Intégration Backend (Supabase) :
   - Tables pour les propriétés
   - Système de filtrage
   - Gestion des images
   - Formulaires de contact

3. Ajout de fonctionnalités :
   - Carte interactive (Google Maps / OpenStreetMap)
   - Galerie photos immersive
   - Système de favoris
   - Partage sur réseaux sociaux

4. Optimisations :
   - Images responsive (Next.js Image)
   - Lazy loading
   - SEO (métadonnées par page)
   - Performance (Lighthouse 90+)
