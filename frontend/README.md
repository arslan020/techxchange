# TechXChange Frontend

Marketplace frontend built with Next.js 13 (App Router), TypeScript, and TailwindCSS.

## Quick Start
```bash
cd frontend
npm install
cp .env.local.example .env.local   # add your backend URL
npm run dev
```

Visit: http://localhost:3000

## Environment

Create .env.local:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
This is the base URL for the backend.

## Features
- 🔐 Auth — Login / Register, profile editing
- 🛒 Products — Browse, search, filter, view details
- 🏪 Sellers — Browse sellers, view seller profile + listings
- ✍️ Seller tools — Add product (image links), manage “My Listings”
- 👤 Profile — Update name & password
- 🛡️ Admin — Simple dashboard at /admin

## Scripts

- npm run dev     # start dev server
- npm run build   # build for production
- npm start       # run production build