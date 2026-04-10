# 🛍️ AI Shop - Full-stack E-Commerce Application

A complete AI-powered e-commerce platform built with **Next.js 14** frontend, **NestJS** backend, and **PostgreSQL** database.

This repository contains:
- `backend/` → API server with product CRUD and AI content generation
- `frontend/` → React-based storefront with product listing and add-product modal
- `docker-compose.yml` → optional Docker setup for PostgreSQL, backend, and frontend

---

## ✅ What this README includes

1. Project overview and architecture
2. How to install and run locally
3. Environment variables needed
4. Backend and frontend commands
5. Docker alternative
6. How to verify the app works

---

## 🧭 Project Overview

The application provides:
- AI-generated product titles and descriptions
- Product management UI
- Backend REST API
- PostgreSQL persistence
- PWA support via service worker

Key behavior:
- User enters `keywords`, `sku`, `stock`, and optional `images`
- Backend sends keywords to OpenRouter via OpenAI-compatible SDK
- AI generates product title and description
- Backend stores the product in PostgreSQL
- Frontend refreshes and displays the new product

---

## 📁 Repository Structure

```
Ecommerce/
├── backend/                  # NestJS API server
│   ├── prisma/               # Database schema, migrations, seed scripts
│   ├── src/                  # Backend source code
│   ├── package.json          # Backend dependencies and scripts
│   └── README.md             # Backend docs
├── frontend/                 # Next.js frontend app
│   ├── app/                  # Pages and global layout
│   ├── components/           # UI components
│   ├── public/               # Static assets and PWA files
│   ├── package.json          # Frontend dependencies and scripts
│   └── README.md             # Frontend docs
├── docker-compose.yml        # Docker-based local environment
├── README.md                 # This file
└── SETUP.md                  # Additional setup documentation
```

---

## 🔧 Prerequisites

Install before you begin:
- Node.js 16+ or 18+
- npm
- PostgreSQL 12+
- OpenRouter API key

> Note: The backend uses `OPENROUTER_API_KEY` and OpenRouter-compatible OpenAI package.

---

## 🚀 Step-by-step Local Setup

### 1. Open the workspace in VS Code

Make sure you can see `backend/` and `frontend/` folders in the root workspace.

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment

Copy the example env file and update it:

```bash
cd backend
copy .env.example .env.development
```

Edit `backend/.env.development` to match your environment:

```text
DATABASE_URL=postgresql://postgres:hello@localhost:5432/ecommerce_db
PORT=3001
NODE_ENV=development
OPENROUTER_API_KEY=your-openrouter-api-key-here
FRONTEND_URL=http://localhost:3000
```

If you use a different PostgreSQL username, password, or host, update the URL accordingly.

### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 5. Configure frontend environment

Create `frontend/.env.local` with:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

### 6. Prepare the database

If PostgreSQL is running locally, create the database first:

```bash
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

Then run Prisma setup:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 7. Start the backend server

```bash
cd backend
npm run start:dev
```

Expected backend base URL:
- `http://localhost:3001`

### 8. Start the frontend server

```bash
cd ../frontend
npm run dev
```

Expected frontend URL:
- `http://localhost:3000`

### 9. Open the app

Visit:
- `http://localhost:3000`

If everything is correct, the homepage should show the product grid and allow adding new products.

---

## 🧪 Verify the app

### Check backend product list

```bash
curl http://localhost:3001/api/products
```

### Create a product manually

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"keywords":"wireless headphones","sku":"WH-001","stock":20}'
```

### Check frontend

Open `http://localhost:3000` and confirm product cards appear.

---

## 📦 NPM Scripts

### Backend commands

```bash
cd backend
npm install
npm run start:dev
npm run build
npm run start:prod
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

### Frontend commands

```bash
cd frontend
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run export
```

---

## 🐳 Docker Alternative

If you want to run everything with Docker, use the root compose file:

```bash
docker compose up --build
```

Docker maps services as:
- `backend` → `http://localhost:4000`
- `frontend` → `http://localhost:3001`

> Note: In Docker mode, the frontend is available on port `3001`.

---

## ⚙️ Environment Variables Summary

### Backend `backend/.env.development`

```text
DATABASE_URL=postgresql://postgres:hello@localhost:5432/ecommerce_db
PORT=3001
NODE_ENV=development
OPENROUTER_API_KEY=your-openrouter-api-key-here
FRONTEND_URL=http://localhost:3000
```

### Frontend `frontend/.env.local`

```text
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

---

## 🧠 How AI works in this app

- The backend service at `backend/src/modules/ai/ai.service.ts` calls OpenRouter using the official OpenAI-compatible SDK.
- It sends user keywords and receives JSON content with `title` and `description`.
- If the AI call fails, the backend falls back to a safe generated title and description.

---

## 🔍 API Endpoints

- `GET /api/products` → list all products
- `POST /api/products` → create product with AI-generated text
- `GET /api/products/:id` → get one product
- `PUT /api/products/:id` → update product
- `DELETE /api/products/:id` → delete product

---

## 🎯 Finish line

You are done when:
- PostgreSQL is running
- Backend is running on `http://localhost:3001`
- Frontend is running on `http://localhost:3000`
- The app loads in the browser
- Products are visible and you can add new products

---

## 📌 Notes

- If you see AI errors, confirm `OPENROUTER_API_KEY` is valid.
- If the frontend cannot connect, confirm `NEXT_PUBLIC_API_URL` points to the backend.
- If the database is empty, run `npm run prisma:seed` in `backend`.

---

## 📚 Additional docs

- `backend/README.md` for backend details
- `frontend/README.md` for frontend details
- `SETUP.md` for deeper setup instructions

---

**Built with ❤️ for modern e-commerce**
