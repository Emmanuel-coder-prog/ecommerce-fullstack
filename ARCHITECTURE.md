# 🏗️ AI Shop - Architecture & Design

Complete architecture overview of the AI-powered e-commerce application.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT SIDE (Browser)                      │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │             Next.js Frontend Application (Port 3000)         │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │  App Router Pages                     │                  │   │
│  │  │  - layout.tsx (root layout)           │                  │   │
│  │  │  - page.tsx (home page)               │                  │   │
│  │  └──────┬───────────────────────────────┘                  │   │
│  │         │                                                    │   │
│  │         ↓                                                    │   │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │  React Components                     │                  │   │
│  │  │                                       │                  │   │
│  │  │  Header Component                    │                  │   │
│  │  │  ├── Title                           │                  │   │
│  │  │  └── Add Product Button              │                  │   │
│  │  │                                       │                  │   │
│  │  │  ProductGrid Component               │                  │   │
│  │  │  ├── Fetch products (API call)       │                  │   │
│  │  │  ├── Loading state                   │                  │   │
│  │  │  └── Map to ProductCard              │                  │   │
│  │  │                                       │                  │   │
│  │  │  ProductCard Component (Repeated)    │                  │   │
│  │  │  ├── Product image                   │                  │   │
│  │  │  ├── Title and description           │                  │   │
│  │  │  └── Stock status                    │                  │   │
│  │  │                                       │                  │   │
│  │  │  ProductFormModal Component          │                  │   │
│  │  │  ├── Keyword input (textarea)        │                  │   │
│  │  │  ├── SKU input                       │                  │   │
│  │  │  ├── Stock input                     │                  │   │
│  │  │  ├── Image management                │                  │   │
│  │  │  ├── Form validation                 │                  │   │
│  │  │  └── Submit button                   │                  │   │
│  │  └──────┬───────────────────────────────┘                  │   │
│  │         │                                                    │   │
│  │         ↓                                                    │   │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │  API Client (utils/api.ts)            │                  │   │
│  │  │                                       │                  │   │
│  │  │  Axios Instance:                     │                  │   │
│  │  │  - Base URL: http://localhost:3001   │                  │   │
│  │  │  - Headers configured                │                  │   │
│  │  │  - Error interceptors                │                  │   │
│  │  │                                       │                  │   │
│  │  │  Methods:                            │                  │   │
│  │  │  - getAllProducts()                  │                  │   │
│  │  │  - getProductById()                  │                  │   │
│  │  │  - createProduct()                   │                  │   │
│  │  │  - updateProduct()                   │                  │   │
│  │  │  - deleteProduct()                   │                  │   │
│  │  └──────┬───────────────────────────────┘                  │   │
│  │         │                                                    │   │
│  │         ↓ HTTP Requests/Responses                           │   │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │  Service Worker (public/sw.js)       │                  │   │
│  │  │  - Offline caching                   │                  │   │
│  │  │  - API response caching              │                  │   │
│  │  │  - Static asset caching              │                  │   │
│  │  └──────────────────────────────────────┘                  │   │
│  │         │                                                    │   │
│  │         └─────────────────────────────┐                    │   │
│  │  ┌──────────────────────────────────────────┐              │   │
│  │  │  Tailwind CSS & Global Styles            │              │   │
│  │  │  - Responsive breakpoints                │              │   │
│  │  │  - Utility classes                       │              │   │
│  │  │  - Component styles                      │              │   │
│  │  └──────────────────────────────────────────┘              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Browser APIs & Features                                    │   │
│  │  - localStorage / sessionStorage                            │   │
│  │  - Service Worker registration                             │   │
│  │  - Fetch API for HTTP                                      │   │
│  │  - DOM manipulation                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                         ↓ REST API (HTTP)
                   (CORS enabled)
                         ↓
┌─────────────────────────────────────────────────────────────────────┐
│                           SERVER SIDE                                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │        NestJS Backend Application (Port 3001)               │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │  Main Entry Point (main.ts)           │                  │   │
│  │  │  - Bootstrap NestJS app               │                  │   │
│  │  │  - Enable CORS                        │                  │   │
│  │  │  - Set global prefix /api             │                  │   │
│  │  │  - Seed database                      │                  │   │
│  │  │  - Start listening on port 3001       │                  │   │
│  │  └──────┬───────────────────────────────┘                  │   │
│  │         │                                                    │   │
│  │         ↓                                                    │   │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │  App Module (app.module.ts)           │                  │   │
│  │  │  - ConfigModule (env variables)       │                  │   │
│  │  │  - TypeOrmModule (database)           │                  │   │
│  │  │  - ProductsModule (features)          │                  │   │
│  │  └──────┬───────────────────────────────┘                  │   │
│  │         │                                                    │   │
│  │         ↓                                                    │   │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │  Products Module                      │                  │   │
│  │  │  (products.module.ts)                  │                  │   │
│  │  │                                       │                  │   │
│  │  │  Imports:                            │                  │   │
│  │  │  - TypeOrmModule.forFeature([...])   │                  │   │
│  │  │                                       │                  │   │
│  │  │  Controllers:                        │                  │   │
│  │  │  - ProductsController                │                  │   │
│  │  │                                       │                  │   │
│  │  │  Providers:                          │                  │   │
│  │  │  - ProductsService                   │                  │   │
│  │  │  - AiService                         │                  │   │
│  │  └──────┬───────────────────────────────┘                  │   │
│  │         │                                                    │   │
│  │  ┌──────┴───────────────────────────────┐                  │   │
│  │  │                                       │                  │   │
│  │  ↓                                       ↓                  │   │
│  │  ┌──────────────────┐     ┌──────────────────────┐         │   │
│  │  │ ProductsController│     │ Products Service     │         │   │
│  │  │                  │     │                      │         │   │
│  │  │ HTTP Endpoints:  │     │ Business Logic:      │         │   │
│  │  │ GET /products    │────→│ - findAll()          │         │   │
│  │  │ GET /products/:id│     │ - findOne()          │         │   │
│  │  │ POST /products   │────→│ - create()           │         │   │
│  │  │ PUT /products/:id│     │ - update()           │         │   │
│  │  │ DELETE /products │     │ - remove()           │         │   │
│  │  │                  │     │ - validateInput()    │         │   │
│  │  │ DTOs:            │     │ - seedProducts()     │         │   │
│  │  │ - CreateProduct  │     │                      │         │   │
│  │  │ - UpdateProduct  │     │ Calls:               │         │   │
│  │  │ - ProductResponse│     │ ↓ TypeORM            │         │   │
│  │  │                  │     │ ↓ AI Service         │         │   │
│  │  └──────┬───────────┘     └──────┬───────────────┘         │   │
│  │         │                         │                         │   │
│  │         └────────────┬────────────┘                         │   │
│  │                      │                                      │   │
│  │                      ↓                                      │   │
│  │         ┌──────────────────────────┐                       │   │
│  │         │ AI Service (ai.service.ts)│                       │   │
│  │         │                          │                       │   │
│  │         │ generateProductContent()  │                       │   │
│  │         │ - Receives: keywords      │                       │   │
│  │         │ - Calls: OpenAI API       │                       │   │
│  │         │ - Returns: title+desc     │                       │   │
│  │         │ - Error: Fallback content │                       │   │
│  │         │                          │                       │   │
│  │         │ OpenAI API Call:          │                       │   │
│  │         │ POST /v1/chat/completions │                       │   │
│  │         │ model: gpt-3.5-turbo      │                       │   │
│  │         │ temperature: 0.7          │                       │   │
│  │         │ max_tokens: 250           │                       │   │
│  │         └──────────┬────────────────┘                       │   │
│  │                    │                                        │   │
│  │                    ↓ (external API)                         │   │
│  │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │ TypeORM & Product Entity             │                  │   │
│  │  │ (entities/product.entity.ts)          │                  │   │
│  │  │                                       │                  │   │
│  │  │ @Entity('products')                  │                  │   │
│  │  │ {                                    │                  │   │
│  │  │   id: UUID (auto)                   │                  │   │
│  │  │   title: string (AI-gen)            │                  │   │
│  │  │   description: string (AI-gen)      │                  │   │
│  │  │   sku: string (unique)              │                  │   │
│  │  │   stock: number                     │                  │   │
│  │  │   images: string[]                  │                  │   │
│  │  │   featuredImage: string             │                  │   │
│  │  │   keywords: string                  │                  │   │
│  │  │   createdAt: timestamp (auto)       │                  │   │
│  │  │   updatedAt: timestamp (auto)       │                  │   │
│  │  │ }                                    │                  │   │
│  │  └──────────┬───────────────────────────┘                  │   │
│  │             │                                               │   │
│  │             ↓ Object-Relational Mapping                     │   │
│  │  ┌──────────────────────────────────────┐                  │   │
│  │  │ PostgreSQL Database                  │                  │   │
│  │  │ (localhost:5432/ecommerce_db)        │                  │   │
│  │  │                                       │                  │   │
│  │  │ products table:                      │                  │   │
│  │  │ - id (UUID, PK)                      │                  │   │
│  │  │ - title (VARCHAR)                    │                  │   │
│  │  │ - description (TEXT)                 │                  │   │
│  │  │ - sku (VARCHAR, UNIQUE)              │                  │   │
│  │  │ - stock (INT)                        │                  │   │
│  │  │ - images (TEXT[])                    │                  │   │
│  │  │ - featuredImage (VARCHAR)            │                  │   │
│  │  │ - keywords (VARCHAR)                 │                  │   │
│  │  │ - createdAt (TIMESTAMP)              │                  │   │
│  │  │ - updatedAt (TIMESTAMP)              │                  │   │
│  │  │                                       │                  │   │
│  │  │ Seeded with 5 default products       │                  │   │
│  │  └──────────────────────────────────────┘                  │   │
│  │                                                               │   │
│  │  Database Config (config/database.config.ts)               │   │
│  │  - Postgres driver (pg)                                     │   │
│  │  - Synchronize: enabled (dev)                               │   │
│  │  - Logging: enabled (dev)                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                         ↑ REST API
                    (responses)
                         ↑
        ┌─────────────────────────────────────────┐
        │       EXTERNAL SERVICES                 │
        │                                         │
        │ OpenAI API (api.openai.com)            │
        │ - Chat Completions endpoint            │
        │ - GPT-3.5-turbo model                  │
        │ - Authentication via API key           │
        │                                         │
        └─────────────────────────────────────────┘
```

---

## Data Flow Sequence

### 1. Product Listing Flow
```
User Visits App
    ↓
Next.js loads page.tsx
    ↓
ProductGrid component mounts
    ↓
useEffect hooks triggers
    ↓
apiClient.getAllProducts()
    ↓
Axios GET request to /api/products
    ↓
NestJS ProductsController.findAll()
    ↓
ProductsService.findAll()
    ↓
TypeORM query with ordering
    ↓
PostgreSQL returns products[]
    ↓
Response sent to frontend
    ↓
setProducts() state update
    ↓
ProductGrid re-renders
    ↓
Map to ProductCard components
    ↓
User sees product grid
```

### 2. Create Product with AI Flow
```
User clicks "Add Product"
    ↓
ProductFormModal opens
    ↓
User fills form:
  - Keywords
  - SKU
  - Stock
  - Images (URLs)
    ↓
User clicks "Create Product"
    ↓
Form validation runs
    ↓
apiClient.createProduct() called
    ↓
Axios POST request to /api/products
{keywords, sku, stock, images}
    ↓
NestJS ProductsController.create()
    ↓
ProductsService.create() called
    ↓
validateProductInput() runs
    ↓
aiService.generateProductContent(keywords)
    ↓
OpenAI API called with keywords
    ↓
GPT processes request
    ↓
OpenAI returns:
{title, description}
    ↓
Product entity created with all data
    ↓
TypeORM saves to PostgreSQL
    ↓
Database returns saved product
    ↓
Response sent to frontend
    ↓
Modal closes
    ↓
Toast success notification
    ↓
ProductGrid refreshes
    ↓
New product appears in grid
```

### 3. Update Product Flow
```
PUT /api/products/:id
    ↓
ProductsController.update()
    ↓
Merge new data with existing
    ↓
Update timestamps
    ↓
TypeORM saves changes
    ↓
Response to frontend
    ↓
Grid updates display
```

### 4. Delete Product Flow
```
DELETE /api/products/:id
    ↓
ProductsController.remove()
    ↓
ProductsService.remove()
    ↓
TypeORM deletes from DB
    ↓
Success response
    ↓
Toast confirmation
    ↓
Grid refreshes without product
```

---

## Component Hierarchy

```
layout.tsx (Root)
│
└── Head/Meta tags
    │
    └── page.tsx (Home Page)
        │
        ├── <Toaster /> (React Hot Toast)
        │
        ├── Header
        │   ├── Title: "🛍️ AI Shop"
        │   └── "Add Product" Button
        │
        ├── Main Content
        │   ├── Page Title Section
        │   │
        │   └── ProductGrid
        │       ├── [Loading State]
        │       ├── [Error State]
        │       ├── [Empty State]
        │       │
        │       └── ProductCard[] (repeated)
        │           ├── Image Container
        │           ├── Title
        │           ├── Description (2 lines max)
        │           ├── Stock Status
        │           └── SKU Info
        │
        ├── ProductFormModal
        │   ├── Backdrop (overlay)
        │   │
        │   └── Modal Dialog
        │       ├── Header
        │       │   ├── Title
        │       │   └── Close button
        │       │
        │       ├── Form
        │       │   ├── Keywords textarea
        │       │   ├── SKU input
        │       │   ├── Stock input
        │       │   │
        │       │   └── Images Section
        │       │       ├── Image input field
        │       │       ├── Add Image button
        │       │       └── Image preview list
        │       │
        │       ├── Loading state (spinner)
        │       │
        │       └── Actions
        │           ├── Cancel button
        │           └── Create Product button
        │
        └── Footer
            └── Copyright info
```

---

## Module Dependencies

### Backend Modules
```
AppModule
│
├── ConfigModule
│   └── Environment variables
│
├── TypeOrmModule
│   ├── DataSource (PostgreSQL)
│   └── Product Entity
│
└── ProductsModule
    ├── TypeOrmModule.forFeature([Product])
    ├── ProductsController
    ├── ProductsService
    └── AiService
```

### Frontend Vendors
```
Next.js
├── React 18
├── TypeScript
├── Tailwind CSS
├── Axios
├── React Hot Toast
├── Lucide React
└── Next PWA
```

---

## State Management Flow

### Frontend State
```
App (page.tsx)
├── isFormModalOpen (boolean)
│   └── Toggle modal visibility
│
└── refreshTrigger (number)
    └── Trigger ProductGrid refresh
        │
        └── ProductGrid Component
            ├── products[] (array)
            │   └── All fetched products
            │
            ├── isLoading (boolean)
            │   └── Show/hide spinner
            │
            └── error (string | null)
                └── Display error message

ProductFormModal
├── formData (object)
│   ├── keywords
│   ├── sku
│   ├── stock
│   └── images[]
│
├── isLoading (boolean)
│   └── Show during AI generation
│
└── imageInput (string)
    └── Temporary image URL input
```

### Backend State (Services)
```
ProductsService
├── productRepository (TypeORM)
└── aiService (OpenAI)

AiService
└── openai (OpenAI client)

TypeORM Connection
├── DataSource
└── PostgreSQL Connection Pool
```

---

## Error Handling Flow

### Frontend Errors
```
User Action
    ↓
Try-Catch wraps API call
    ↓
API returns error
    ↓
Error caught in catch block
    ↓
Console.error logs error
    ↓
Error message extracted
    ↓
Toast.error() displays message
    ↓
User sees error notification
```

### Backend Errors
```
Controller receives request
    ↓
Service validates input
    ↓
If invalid:
  └── throw BadRequestException
    ↓
If database error:
  └── throw InternalServerException
    ↓
If AI error:
  └── throw BadRequestException
    ↓
NestJS exception filter catches
    ↓
JSON error response sent
    ↓
Frontend receives error
    ↓
User sees toast notification
```

---

## Authentication Flow (Optional Enhancement)

```
User Login (Future)
    ↓
JWT Token Created
    ↓
Token stored in localStorage
    ↓
API requests include token
    ↓
Backend validates token
    ↓
If valid: Process request
If invalid: 401 Unauthorized
    ↓
Frontend redirects to login
```

---

## Caching Flow (PWA)

### Service Worker Strategies
```
Network Request
    ↓
Service Worker intercepts
    ↓
URL = API endpoint?
├── YES: Network-First
│   ├── Try network
│   └── Fall back to cache
│
└── NO: Cache-First
    ├── Check cache
    └── Fall back to network
```

---

## Performance Optimization Flow

```
Code
  ↓
TypeScript Compilation
  ↓
Tree Shaking (unused code removal)
  ↓
Minification/Uglification
  ↓
Code Splitting (Next.js)
  ↓
Gzip Compression
  ↓
CDN Distribution (optional)
  ↓
Browser receives optimized bundle
  ↓
Service Worker caches static assets
  ↓
Subsequent loads are faster
```

---

## Deployment Architecture (Production)

```
┌─── User's Browser (HTTP/S) ───┐
│                               │
├─── Cloudflare / CDN           │
│    └─ Cache static files      │
│                               │
├─── Vercel Deployment          │
│    ├─ Next.js Frontend        │
│    └─ Static Assets           │
│                               │
└─── Backend Server             │
    ├─ Heroku/Railway/AWS       │
    ├─ NestJS API               │
    └─ PostgreSQL Database      │
        └─ RDS / Managed DB    │

OpenAI API (External)
  └─ Separate HTTPS call
```

---

## Security Layers

```
Frontend
├── Input Validation
├── Client-side error checking
└── CORS Origin validation

Backend
├── Input validation
├── SQL injection prevention (TypeORM)
├── API rate limiting (optional)
├── Error message sanitization
└── Secure environment variables

Database
├── Unique constraints
├── Type validation
├── Connection pooling
└── Encrypted connections

API Keys
├── Environment variables
├── Never exposed in code
├── Rotated regularly
└── Monitored for abuse
```

---

This architecture enables:
- **Scalability**: Modular components
- **Maintainability**: Clear separation of concerns
- **Performance**: Optimized caching and bundling
- **Security**: Multiple layers of validation
- **User Experience**: Responsive, fast, offline-capable

---

*Built with modern web architecture principles* 🚀
