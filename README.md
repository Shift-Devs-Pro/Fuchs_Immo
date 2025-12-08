# Site Web Next.js

Un site web moderne construit avec Next.js 14, TypeScript, et Tailwind CSS.

## Structure du Projet

```
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   ├── globals.css        # Styles globaux
│   ├── about/             # Page "À propos"
│   └── contact/           # Page "Contact"
├── components/            # Composants réutilisables
│   ├── Header.tsx         # En-tête de navigation
│   └── Footer.tsx         # Pied de page
├── lib/                   # Utilitaires
│   └── supabase/          # Configuration Supabase
│       ├── client.ts      # Client Supabase (côté client)
│       └── server.ts      # Client Supabase (côté serveur)
└── public/                # Assets statiques
```

## Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Supabase** - Backend et base de données
- **Lucide React** - Icônes

## Démarrage

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

3. Construire pour la production :
```bash
npm run build
```

## Scripts Disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm start` - Démarre le serveur de production
- `npm run lint` - Lint le code avec ESLint
- `npm run typecheck` - Vérifie les types TypeScript

## Variables d'Environnement

Les variables d'environnement sont configurées dans `.env` :

- `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé publique anonyme Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Clé de rôle de service (côté serveur uniquement)

## Ajout de Pages

Pour ajouter une nouvelle page, créez un dossier dans `app/` avec un fichier `page.tsx` :

```typescript
// app/nouvelle-page/page.tsx
export default function NouvellePage() {
  return (
    <div>
      <h1>Ma Nouvelle Page</h1>
    </div>
  )
}
```

## Ajout de Composants

Créez vos composants dans le dossier `components/` :

```typescript
// components/MonComposant.tsx
export default function MonComposant() {
  return <div>Mon Composant</div>
}
```
