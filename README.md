# ANGRS

Application Next.js de demonstration pour la gestion des membres, cotisations, documents et operations sociales de l'Association Nationale des Gendarmes Retraites du Senegal.

## Stack

- Next.js App Router + Tailwind CSS (Proxy pour l'auth)
- API routes Node.js
- JWT + RBAC + protection CSRF
- Base de données PostgreSQL via Prisma (Adapter PG)
- Stockage des fichiers sur Supabase Storage
- Exports PDF / Excel, QR code, impression de carte, mode sombre

## Comptes de demonstration

- `admin@angrs.sn` / `Admin@2026!`
- `gestion@angrs.sn` / `Gestion@2026!`
- `membre@angrs.sn` / `Membre@2026!`

## Demarrage

```bash
npm install
npm run dev
```

## Base de données & Stockage

- Renseigner `DATABASE_URL` (PostgreSQL), `JWT_SECRET` et les identifiants Supabase dans `.env`
- Lancer les migrations : `npm run prisma:migrate`
- Peupler la base : `npm run prisma:seed`

## Production

- Renseigner les variables de production
- Activer un vrai service de sauvegarde et d'audit centralise
