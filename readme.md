# TechXChange

Marketplace web app built with:
- Backend: Express + TypeScript + MongoDB
- Frontend: Next.js + TypeScript + TailwindCSS

## Quick Start

### Clone & install
git clone <repo-url>
cd techxchange

### Install both apps
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Running the apps

Backend
```bash
cd backend
cp .env.example .env     # add Mongo URI + JWT secret
npm run dev              # http://localhost:4000/api
```
Frontend
```bash
cd frontend
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev              # http://localhost:3000
```

### Environment

Backend (.env):
```bash
MONGO_URI=mongodb://localhost:27017/techxchange
JWT_SECRET=supersecret
PORT=4000
```
Frontend (.env.local):
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Features
- Auth: register, login, profile edit
- Sellers: browse sellers, view profile, my listings, add products
- Products: browse, search, filter, details, seller link
- Admin: simple dashboard at /admin

### Scripts

Backend
```bash
npm run dev     # dev server (ts-node-dev)
npm run build   # compile TS
npm start       # run compiled build
```
Frontend
```bash
npm run dev     # dev server (Next.js)
npm run build   # production build
npm start       # run production build
```


test