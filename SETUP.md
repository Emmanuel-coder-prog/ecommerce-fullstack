# 🛍️ AI Shop - Complete Setup Guide

Complete guide to set up and run the AI-powered e-commerce application with backend, frontend, and database.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- OpenAI API Key

### 2. Clone and Setup Backend

```bash
cd backend
npm install
```

Update `.env.development`:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=ecommerce_db
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=sk-your-key
FRONTEND_URL=http://localhost:3000
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

The `.env.local` is pre-configured to point to `http://localhost:3001/api`.

### 4. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open Browser
Visit **http://localhost:3000**

---

## 📋 Detailed Setup Instructions

### Prerequisites Installation

#### macOS
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Verify installations
node --version
psql --version
```

#### Windows
1. Download and install Node.js from https://nodejs.org/
2. Download and install PostgreSQL from https://www.postgresql.org/download/windows/
3. Add PostgreSQL to PATH
4. Verify: Open Command Prompt and run:
   ```bash
   node --version
   psql --version
   ```

#### Linux (Ubuntu/Debian)
```bash
# Update package manager
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Verify
node --version
psql --version
```

---

### Database Setup

#### Create PostgreSQL Database

**Option 1: Using psql (Command Line)**

```bash
# Login to PostgreSQL
psql -U postgres

# Execute in psql:
CREATE DATABASE ecommerce_db;
CREATE USER postgres_user WITH PASSWORD 'postgres_password';
ALTER ROLE postgres_user SET client_encoding TO 'utf8';
ALTER ROLE postgres_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres_user SET default_transaction_deferrable TO on;
ALTER ROLE postgres_user SET default_timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO postgres_user;
GRANT CONNECT ON DATABASE ecommerce_db TO postgres_user;
\c ecommerce_db
GRANT CREATE ON SCHEMA public TO postgres_user;

# Exit psql
\q
```

**Option 2: Using GUI (DBeaver, pgAdmin)**

1. Download DBeaver: https://dbeaver.io/download/
2. Connect to PostgreSQL server
3. Create new database: `ecommerce_db`
4. Create new user with role: `postgres_user`
5. Grant all privileges on database to user

---

### Backend Configuration

#### 1. Navigate to Backend Directory
```bash
cd backend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Create `.env.development` File
```bash
# Copy example
cp .env.example .env.development

# Edit with your values
nano .env.development  # or use your editor
```

**Essential Environment Variables:**
```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=ecommerce_db

# Server
PORT=3001
NODE_ENV=development

# OpenAI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### 4. Verify Database Connection

```bash
# Test connection
npm run typeorm migration:generate -- -n TestMigration
```

#### 5. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run start:dev
```

Expected output:
```
╔════════════════════════════════════════════════════════════╗
║                    E-Commerce API Started                  ║
║                                                            ║
║  Server running on: http://localhost:3001                  ║
║  Database: ecommerce_db
║  Environment: development
║                                                            ║
║  API Documentation:                                        ║
║  GET    /api/products        - Get all products           ║
║  POST   /api/products        - Create product             ║
║  GET    /api/products/:id    - Get product by ID          ║
║  PUT    /api/products/:id    - Update product             ║
║  DELETE /api/products/:id    - Delete product             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

#### 6. Test Backend

```bash
# In another terminal, test endpoints:
curl http://localhost:3001/api/products

# Create test product
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "smartphone",
    "sku": "TEST-001",
    "stock": 10
  }'
```

---

### Frontend Configuration

#### 1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configuration
The `.env.local` is already configured:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

**To change the backend URL:**
```bash
nano .env.local  # Edit the API URL
```

#### 4. Start Frontend Server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 14.0.0
  ✓ ready started server on 0.0.0.0:3000, url: http://localhost:3000
  ○ Compiled client and server successfully
  ✓ Ready in 1.2s
```

#### 5. Open Application
Visit **http://localhost:3000** in your browser

---

### Verify Everything Works

#### ✅ Backend Checks

```bash
# 1. Check server is running
curl http://localhost:3001/api/products

# 2. Verify seeded products
# Should return array of 5 default products

# 3. Test product creation
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "wireless speaker",
    "sku": "WS-001",
    "stock": 25
  }'
```

#### ✅ Frontend Checks

1. Open http://localhost:3000
2. Verify 5 seeded products are displayed
3. Click "Add Product" button
4. Fill in form:
   - Keywords: "test product"
   - SKU: "TEST-002"
   - Stock: 10
5. Click "Create Product"
6. Verify loading state shows "Generating product details with AI..."
7. Verify new product appears in grid

#### ✅ Database Check

```bash
# Connect to database
psql -U postgres -d ecommerce_db

# List products
SELECT id, title, sku, stock FROM products;

# Exit
\q
```

---

## 🔧 Development Workflow

### Running Both Applications

**Recommended Setup: Two Terminal Tabs**

**Tab 1 - Backend Development Server**
```bash
cd backend
npm run start:dev
```

**Tab 2 - Frontend Development Server**
```bash
cd frontend
npm run dev
```

### Making Changes

#### Backend Code Changes
- Edit files in `backend/src/`
- Server auto-reloads with changes
- No need to restart

#### Frontend Code Changes
- Edit files in `frontend/(app|components|utils)/`
- Browser auto-reloads with changes
- State is preserved during reload

### Debugging

#### Backend
```bash
# Debug mode
npm run start:debug

# View logs in src/main.ts
console.log('Debug info:', data);
```

#### Frontend
```bash
# Browser DevTools
- Press F12 in browser
- Check Console for errors
- Network tab to inspect API calls
```

---

## 🚀 Deployment

### Deploying Backend

#### Option 1: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main
```

#### Option 2: Railway
1. Go to https://railway.app
2. Connect GitHub
3. Create new project
4. Add PostgreSQL database
5. Add environment variables
6. Deploy

#### Option 3: AWS EC2
1. Launch EC2 instance (Ubuntu 20.04)
2. Install Node.js and PostgreSQL
3. Clone repository
4. Configure environment
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name "api"
   pm2 startup
   pm2 save
   ```

### Deploying Frontend

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL https://your-api.com/api
```

#### Option 2: Netlify
1. Connect GitHub to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Auto-deploy on push

#### Option 3: Docker
**Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Build
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Run
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build image
docker build -t ai-shop-frontend .

# Run container
docker run -p 3000:3000 ai-shop-frontend
```

---

## 🐛 Troubleshooting

### Backend Issues

#### 1. Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list              # macOS

# Start PostgreSQL if needed
sudo systemctl start postgresql  # Linux
brew services start postgresql@15  # macOS

# Verify connection
psql -U postgres -h localhost
```

#### 2. OpenAI API Error
```
Error: Failed to generate content: API error
```

**Solution:**
- Verify API key in `.env.development`
- Check API key has credits at https://platform.openai.com/account/usage
- Ensure NODE_ENV is not 'production' (limits calls)
- Test API key:
  ```bash
  curl https://api.openai.com/v1/models \
    -H "Authorization: Bearer $OPENAI_API_KEY"
  ```

#### 3. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9  # macOS/Linux

# Or change port in .env.development
PORT=3002
```

### Frontend Issues

#### 1. Cannot Connect to API
```
Failed to load products. Please try again later.
```

**Solution:**
- Verify backend is running on port 3001
- Check NEXT_PUBLIC_API_URL in `.env.local`
- Check browser console for CORS errors
- Verify FRONTEND_URL in backend .env

#### 2. PWA Not Installing
**Solution:**
- PWA only works over HTTPS (production only)
- Clear browser cache: DevTools > Application > Clear storage
- In development, PWA is disabled

#### 3. Build Error
```
Error: Module not found
```

**Solution:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Useful Commands

### Backend
```bash
# Development
npm run start:dev          # Start with hot reload
npm run build             # Build for production
npm run start:prod        # Start production build

# Database
npm run typeorm           # Run TypeORM CLI
npm run migration:generate # Generate migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert migration

# Testing & Linting
npm test                  # Run tests
npm run lint              # Run ESLint
npm run format            # Format code
```

### Frontend
```bash
# Development
npm run dev               # Start dev server
npm run build             # Build for production
npm run start             # Start production server
npm run export            # Export static HTML
npm run lint              # Run ESLint
```

---

## 📊 Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (PWA)                            │
│                  http://localhost:3000                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (React 18, Tailwind CSS)           │   │
│  │  - Product Grid Display                              │   │
│  │  - Add Product Modal                                 │   │
│  │  - API Client (axios)                                │   │
│  │  - Service Worker (offline support)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                   NestJS Backend                             │
│               http://localhost:3001/api                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Products Module                                     │   │
│  │  - ProductsController (HTTP endpoints)               │   │
│  │  - ProductsService (business logic)                  │   │
│  │  - Product Entity (TypeORM)                          │   │
│  │  - AI Service (OpenAI integration)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ TypeORM
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│              localhost:5432/ecommerce_db                     │
│  - products table with all product data                      │
└─────────────────────────────────────────────────────────────┘
                              ↓ 
┌─────────────────────────────────────────────────────────────┐
│                   OpenAI API (Remote)                        │
│    https://api.openai.com/v1/chat/completions              │
│  - Generates product titles and descriptions                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Next Steps

1. **Customize**: Modify colors, fonts, layout in `tailwind.config.js`
2. **Add Features**: 
   - User authentication
   - Shopping cart
   - Checkout process
   - Payment integration
3. **Database**: Create indexes for better performance
4. **Monitoring**: Add logging and error tracking
5. **Testing**: Add unit and integration tests

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review component documentation in README files
3. Check API responses in browser DevTools
4. Review backend logs in terminal

---

## 📄 License

MIT

---

**Happy Coding! 🚀**
