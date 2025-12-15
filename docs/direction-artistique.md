# Direction Artistique - ExpertImo

## 1. Identité de Marque

**Nom** : ExpertImo
**Secteur** : Immobilier résidentiel standard
**Positionnement** : Professionnel, sobre, élégant, moderne sans être flashy

---

## 2. Palette de Couleurs (Strictement respectée)

### Couleurs Principales

```
Blanc Pur         : #FFFFFF
Crème Léger       : #F8F8F4
Noir Profond      : #000000
Or Élégant        : #C19C55
```

### Utilisation des Couleurs

- **#FFFFFF / #F8F8F4** : Fond principal, cartes, sections
- **#000000** : Texte principal, titres, navigation
- **#C19C55** : Boutons, icônes, séparateurs, éléments de branding, hover states

**Règle absolue** : Aucune variante de ces couleurs n'est autorisée. Pas de gris intermédiaires.

---

## 3. Typographie

### Titres & En-têtes (H1, H2, H3)
**Font** : Playfair Display (Serif)
- **H1** : 48px / font-weight: 700 / letter-spacing: -0.02em
- **H2** : 36px / font-weight: 600 / letter-spacing: -0.01em
- **H3** : 28px / font-weight: 600 / letter-spacing: normal

### Corps de Texte & Navigation
**Font** : Inter (Sans-Serif)
- **Navigation** : 16px / font-weight: 500
- **Body** : 16px / font-weight: 400 / line-height: 1.6
- **Small Text** : 14px / font-weight: 400

### Hiérarchie
- Tous les titres en **#000000**
- Corps de texte en **#000000**
- Liens de navigation en **#000000**, hover en **#C19C55**

---

## 4. Layout & Structure

### Grille & Espacement

**Conteneur Principal** : max-width: 1280px, centré avec padding horizontal

**Espacement (système 8px)** :
- Petit : 8px, 16px
- Moyen : 24px, 32px
- Large : 48px, 64px
- Extra-large : 96px, 128px

**Principe** : Générosité des espaces blancs. Chaque section doit respirer.

### Séparateurs
- Lignes fines de **1px** en **#C19C55**
- Utilisation parcimonieuse, uniquement pour délimiter des sections importantes

---

## 5. Composants UI

### Boutons

#### État Standard
- Background : transparent ou **#FFFFFF**
- Border : 1px solid **#C19C55**
- Text : **#000000**
- Padding : 12px 32px
- Border-radius : 4px (légèrement arrondi)
- Font : Inter, 16px, font-weight: 500

#### État Hover
- Background : **#C19C55**
- Border : 1px solid **#C19C55**
- Text : **#FFFFFF** ou **#000000** (selon contraste)
- Transition : `transition: all 0.3s ease`

#### Animation
```css
button {
  transition: background-color 0.3s ease, color 0.3s ease;
}
button:hover {
  background-color: #C19C55;
  color: #FFFFFF;
}
```

### Cartes de Propriété

**Structure** :
- Background : **#FFFFFF**
- Border : 1px solid **#F8F8F4**
- Box-shadow : `0 2px 8px rgba(0, 0, 0, 0.08)` (ombre douce)
- Border-radius : 0px (rectangulaire) ou 4px (très subtil)
- Padding : 24px

**Image** :
- Ratio : 4:3 ou 16:9
- Object-fit : cover
- Transition hover : `transform: scale(1.02); transition: transform 0.4s ease;`

**Contenu** :
- Titre propriété : Playfair Display, 24px, #000000
- Prix : Inter, 20px, font-weight: 600, #C19C55
- Description : Inter, 16px, #000000
- Icônes : Outline style, #C19C55

### Header / Navigation

**Structure** :
- Background : **#FFFFFF**
- Border-bottom : 1px solid **#F8F8F4**
- Height : 80px
- Position : sticky top-0

**Logo** :
- Position : Left
- Espace réservé : 200px × 60px

**Navigation** :
- Liens : Inter, 16px, #000000
- Spacing : 32px entre chaque lien
- Hover : color: #C19C55, transition: color 0.3s ease

**CTA Button** (ex: "Estimation gratuite") :
- Style bouton primaire (voir ci-dessus)
- Position : Right

### Footer

**Structure** :
- Background : **#F8F8F4**
- Padding : 64px vertical
- Sections : 3 colonnes (Liens, Contact, Réseaux)
- Text : Inter, 14px, #000000
- Liens hover : #C19C55

---

## 6. Icônes

**Style** : Outline (contour fin)
**Couleur** : **#C19C55**
**Taille** : 24px standard, 32px pour features importantes
**Stroke-width** : 1.5px

**Exemples d'usage** :
- Chambres, Salles de bain, Surface (sur cartes propriétés)
- Téléphone, Email, Localisation (Contact)
- Recherche, Filtres (Catalogue)

---

## 7. Animations & Interactions

### Micro-animations

**Images de propriété (hover)** :
```css
.property-image {
  transition: transform 0.4s ease;
}
.property-image:hover {
  transform: scale(1.03);
}
```

**Boutons** :
```css
button {
  transition: all 0.3s ease;
}
```

**Cartes** :
```css
.property-card {
  transition: box-shadow 0.3s ease;
}
.property-card:hover {
  box-shadow: 0 4px 16px rgba(193, 156, 85, 0.15);
}
```

### Chargement de contenu
- **Fade-in** : `opacity 0 → 1` sur 0.4s
- Pas de slides, pas de rotations complexes

---

## 8. Photographie

### Standards
- Haute qualité, bien éclairées
- Tons naturels, lumière du jour privilégiée
- Pas de filtres artificiels
- Composition professionnelle

### Format
- Ratio : 4:3 pour galeries, 16:9 pour hero sections
- Résolution : minimum 1920px de large
- Optimisées pour le web (WebP, compression intelligente)

### Mise en page
- Images entourées d'espace blanc généreux
- Grilles propres avec gaps constants (16px ou 24px)

---

## 9. Pages Clés

### Page d'Accueil
1. **Hero Section** : Grande image + titre + CTA "Voir nos biens"
2. **Propriétés en Vedette** : 3 cartes en grille
3. **Services** : 3 blocs avec icônes
4. **À propos (résumé)** : Photo + texte court
5. **CTA Final** : Estimation gratuite

### Catalogue
1. **Barre de Recherche** : Filtres (prix, localisation, type, surface)
2. **Grille de Propriétés** : 3 colonnes desktop, responsive
3. **Pagination** : Simple, numérotée

### Page Propriété Individuelle
1. **Galerie Photos** : Grande image + thumbnails
2. **Informations** : Prix, surface, chambres, localisation
3. **Description détaillée**
4. **Carte interactive** : Google Maps
5. **Formulaire de Contact** : Demande de visite

### Contact & Estimation
- Formulaires clairs, labels visibles
- Validation côté client
- Boutons CTA bien visibles

---

## 10. Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptations
- Navigation mobile : Menu hamburger (#C19C55)
- Grilles : 1 colonne mobile → 2 colonnes tablet → 3 colonnes desktop
- Typographie : Réduction de 20% sur mobile
- Espaces : Réduction de 30% sur mobile

---

## 11. Accessibilité

- Contraste texte/fond : minimum WCAG AA
- Taille de texte : minimum 16px
- Zones cliquables : minimum 44×44px
- Alt text sur toutes les images
- Navigation au clavier fonctionnelle

---

## 12. Performance

- Images lazy-loading
- Fonts préchargées
- CSS critique inline
- Animations GPU-accelerated (transform, opacity)

---

## Résumé des Principes Directeurs

✓ **Simplicité** : Pas de fioritures, droit au but
✓ **Élégance sobre** : L'or comme accent, jamais en excès
✓ **Clarté** : Lecture facile, hiérarchie évidente
✓ **Espace** : Générosité des blancs, sections aérées
✓ **Cohérence** : Même style sur toutes les pages
✓ **Performance** : Rapidité avant tout

**Couleurs strictes** : #FFFFFF, #F8F8F4, #000000, #C19C55
**Typo** : Playfair Display (titres) + Inter (corps)
**Animations** : Subtiles, fluides, 0.3-0.4s
