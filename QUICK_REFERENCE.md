# 🛍️ AI Shop - Quick Reference Guide

Fast reference for developers working on the AI Shop e-commerce platform.

## 🚀 Getting Started (30 seconds)

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run start:dev

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev

# Open http://localhost:3000 in browser
```

## 📁 File Structure Quick Guide

```
backend/src/
├── main.ts              → App entry point (server startup)
├── app.module.ts        → Root module (imports everything)
├── entities/
│   └── product.entity.ts    → Database model
├── modules/products/
│   ├── products.controller.ts  → HTTP endpoints
│   ├── products.service.ts     → Business logic
│   └── dto/                    → Input/Output types
└── modules/ai/
    └── ai.service.ts          → OpenAI integration

frontend/
├── app/page.tsx         → Home page
├── app/layout.tsx       → Root layout
├── components/
│   ├── Header/          → Top navigation
│   ├── Products/        → Grid & cards
│   └── Forms/           → Add product modal
└── utils/api.ts         → API client
```

## 🔌 API Endpoints

```
GET    /api/products        → Get all products
POST   /api/products        → Create product (with AI)
GET    /api/products/:id    → Get one product
PUT    /api/products/:id    → Update product
DELETE /api/products/:id    → Delete product
```

## 📝 Environment Variables

**Backend** (`.env.development`):
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=ecommerce_db
PORT=3001
OPENAI_API_KEY=sk-your-key
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🛠️ Common Commands

### Backend
```bash
npm run start:dev        # Development server
npm run build           # Production build
npm test               # Run tests
npm run format         # Format code
```

### Frontend
```bash
npm run dev            # Development server
npm run build          # Production build
npm run start          # Run production build
npm run export         # Static export
```

## 🔧 Development Workflow

### Adding a New API Endpoint

1. **Backend** (`products.controller.ts`):
```typescript
@Post('custom')
async custom() {
  // Handle request
}
```

2. **Frontend** (`utils/api.ts`):
```typescript
async customMethod() {
  return this.instance.post('/products/custom');
}
```

3. **Frontend** (component):
```typescript
await apiClient.customMethod();
```

### Styling Components

Use Tailwind CSS classes:
```typescript
<div className="bg-blue-600 text-white p-4 rounded-lg">
  Styled with Tailwind
</div>
```

Predefined classes:
- `.btn-primary` - Blue button
- `.btn-secondary` - Gray button
- `.card` - Card styling
- `.input-field` - Form input
- `.container-custom` - Max-width container

### Adding Form Validation

```typescript
const validateInput = (data) => {
  if (data.stock < 0) {
    throw new Error('Stock must be >= 0');
  }
  if (!data.sku) {
    throw new Error('SKU required');
  }
};
```

## 🐛 Debugging Tips

### Backend Logging
```typescript
console.log('Debug:', data);
// Check output in terminal running npm run start:dev
```

### Frontend Debugging
```typescript
// In browser console (F12)
// Network tab to see API calls
// Console tab to see errors
```

### Database Debugging
```bash
# Connect to database
psql -U postgres -d ecommerce_db

# List tables
\dt

# View products
SELECT id, title, sku FROM products;
```

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port 3001 in use | Kill process: `lsof -ti:3001 \| xargs kill -9` |
| DB connection error | Verify PostgreSQL running: `psql -U postgres` |
| API not responding | Check CORS in backend: `FRONTEND_URL` env var |
| Images not loading | Verify image URLs are accessible |
| OpenAI error | Check API key and credits at openai.com |

## 📊 Key Files to Know

| File | Purpose |
|------|---------|
| `backend/src/entities/product.entity.ts` | Data structure |
| `backend/src/modules/ai/ai.service.ts` | AI generation |
| `frontend/components/Products/ProductGrid.tsx` | Main display |
| `frontend/utils/api.ts` | API communication |
| `backend/src/main.ts` | Server startup |

## 🎨 Project Default Colors

- **Primary**: Blue-600 (#2563eb)
- **Secondary**: Gray-200 (#e5e7eb)
- **Text**: Gray-800 (#1f2937)
- **Error**: Red-600 (#dc2626)
- **Success**: Green-600 (#16a34a)

## 🔄 Data Flow

```
User Input (Modal)
    ↓
Frontend validates
    ↓
API Client sends POST
    ↓
Backend Controller receives
    ↓
ProductService validates
    ↓
OpenAI API generates content
    ↓
TypeORM saves to PostgreSQL
    ↓
Response sent to Frontend
    ↓
ProductGrid refreshes
    ↓
Toast notification
```

## 📦 Key Dependencies

### Backend
- `@nestjs/core` - Framework
- `@nestjs/typeorm` - ORM
- `typeorm` - Database
- `pg` - PostgreSQL driver
- `openai` - AI API

### Frontend
- `next` - React framework
- `react` - UI library
- `tailwindcss` - Styling
- `axios` - HTTP client
- `next-pwa` - PWA support
- `react-hot-toast` - Notifications

## 🌐 Ports

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **PostgreSQL**: localhost:5432

## 📱 Testing the App

```bash
# Test product creation via curl
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "test product",
    "sku": "TEST-001",
    "stock": 10
  }'

# Test getting all products
curl http://localhost:3001/api/products | json_pp
```

## 🎯 Key Concepts

### Product Entity
```typescript
{
  id: UUID,              // Auto-generated
  title: string,         // AI-generated
  description: string,   // AI-generated
  sku: string,          // Unique ID
  stock: number,        // Quantity
  images: string[],     // URLs
  featuredImage: string // First image
  keywords: string,     // Input for AI
  createdAt: Date,      // Auto-set
  updatedAt: Date       // Auto-set
}
```

### AI Generation Process
1. User provides keywords
2. Backend receives keywords
3. OpenAI API called
4. AI generates title & description
5. Product saved to database
6. Response sent to frontend
7. Product displays in grid

### PWA Capabilities
- Install as app
- Work offline
- Use home screen shortcut
- Native-like experience

## 📚 Documentation Files

- **README.md** - Project overview
- **SETUP.md** - Complete setup guide
- **CHECKLIST.md** - Implementation checklist
- **backend/README.md** - Backend docs
- **frontend/README.md** - Frontend docs

## 🚀 Production Deployment

1. **Build**: `npm run build`
2. **Configure**: Set env vars
3. **Deploy**: Push to hosting (Vercel, Heroku, etc.)
4. **Database**: Migrate to production DB
5. **Monitor**: Set up logging

## 💡 Pro Tips

1. **Hot Reload**: Changes auto-reload in dev
2. **TypeScript**: Use types for better DX
3. **Console**: Check browser console for errors
4. **DevTools**: Network tab shows API calls
5. **Comments**: Code is well-documented
6. **Validation**: Always validate inputs
7. **Error**: Handle all error cases
8. **Mobile**: Test on mobile devices (PWA)

## 🔐 Security Checklist

- [x] Never commit `.env` files
- [x] Validate all inputs
- [x] Use HTTPS in production
- [x] Rotate API keys regularly
- [x] Limit OpenAI API usage
- [x] Enable CORS carefully
- [x] Use strong DB passwords

## 📈 Performance Tips

1. Use ProductGrid component (optimized)
2. Cache API responses (Service Worker)
3. Minimize bundle size (Next.js auto-optimization)
4. Database indexes (TypeORM)
5. Lazy load images
6. Rate limit API calls

## 🎓 Learning Path

1. Start with README.md
2. Read SETUP.md for environment
3. Check component structure
4. Review API integration (utils/api.ts)
5. Examine services (AI, Products)
6. Study database setup
7. Try adding features

---

**Happy Coding! 🚀**

For detailed info, see full README files.
