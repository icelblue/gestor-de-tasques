# GT · Gestor de Tasques

App frontend pura (React + Vite + Tailwind v4). Persistència en `localStorage`.

## Desenvolupament local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Sortida a `dist/`.

## Desplegament a Vercel

1. Puja aquest repositori a GitHub.
2. Importa el projecte a Vercel — detectarà automàticament el preset **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. El fitxer `vercel.json` ja inclou el rewrite SPA per a routing client-side.

No requereix backend ni variables d'entorn.
