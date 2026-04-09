# 🛍️ AI Shop - E-Commerce Backend API

Powerful AI-powered e-commerce API built with **NestJS**, **PostgreSQL**, and **OpenAI**.

## Features

✨ **Product Management**
- RESTful API for CRUD operations
- PostgreSQL with Prisma ORM for data persistence
- Type-safe database queries

🤖 **AI Integration**
- OpenAI GPT-3.5/GPT-4 integration
- Automatic product title and description generation
- Powered by natural language processing

🗄️ **Database**
- PostgreSQL with Prisma ORM
- Schema-driven data modeling
- Built-in migration system

🔒 **Production Ready**
- CORS enabled for frontend communication
- Error handling and validation
- Environment-based configuration

## Project Structure

```
backend/
├── prisma/                  # Prisma database schema
│   ├── schema.prisma        # Database schema definition
│   ├── seed.js              # Database seed script
│   └── migrations/          # Database migrations
├── src/
│   ├── services/            # Shared services
│   │   └── prisma.service.ts    # Prisma client service
│   ├── modules/             # Feature modules
│   │   ├── ai/              # OpenAI integration
│   │   │   └── ai.service.ts     # AI content generation service
│   │   └── products/        # Product management
│   │       ├── dto/              # Data transfer objects
│   │       ├── products.controller.ts
│   │       ├── products.service.ts
│   │       └── products.module.ts
│   ├── app.module.ts        # Root application module
│   └── main.ts              # Application entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── .env.development         # Development environment variables
├── .env.example             # Example environment variables
├── PRISMA_MIGRATION.md      # Prisma setup guide
└── README.md                # This file
```

## Prerequisites

- **Node.js** 16+ and npm/yarn
- **PostgreSQL** 12+ database instance
- **OpenAI API Key** (get from https://platform.openai.com/api-keys)

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.development` and update:

```bash
# Database Configuration (Prisma)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce_db

# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI API Key (required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**DATABASE_URL format:** `postgresql://username:password@host:port/database`

### 3. Set Up PostgreSQL Database

```bash
# Create database using psql
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

Or use PostgreSQL GUI tool (pgAdmin, DBeaver, etc.)

### 4. Run Prisma Migrations

Initialize the database schema with Prisma:

```bash
# Generate Prisma client
npm run prisma:generate

# Create database schema from Prisma schema
npm run prisma:migrate

# (Optional) Seed database with default products
npm run prisma:seed
```

### 5. Start Application

### 5. Start Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will start on **http://localhost:3001**

## Database Seeding

The application automatically seeds 5 default products on startup if the database is empty.

**Seeded Products:**
1. Wireless Bluetooth Headphones
2. Portable USB-C Power Bank
3. 4K USB-C Hub
4. Mechanical Gaming Keyboard RGB
5. Portable SSD 1TB USB 3.1

Products can be viewed via `GET /api/products`

## API Endpoints

### Get All Products
```
GET /api/products
Response: Product[]
```

### Get Product by ID
```
GET /api/products/:id
Response: Product
```

### Create Product (with AI Generation)
```
POST /api/products
Body: {
  "keywords": "string (required)",
  "sku": "string (required, unique)",
  "stock": "number (required, >= 0)",
  "images": "string[] (optional)"
}
Response: Product
```

**How it works:**
1. Receives keywords from frontend
2. Sends keywords to OpenAI API
3. AI generates title and description
4. Saves complete product to database
5. Returns created product

### Update Product
```
PUT /api/products/:id
Body: Partial<Product>
Response: Product
```

### Delete Product
```
DELETE /api/products/:id
Response: { message: string }
```

## Product Entity Structure

```typescript
{
  id: string;                    // UUID (auto-generated)
  title: string;                 // AI-generated
  description: string;           // AI-generated
  sku: string;                   // Unique identifier
  stock: number;                 // Quantity available
  images: string[];              // Array of image URLs
  featuredImage: string;         // First image (auto-set)
  keywords: string;              // Original keywords for generation
  createdAt: Date;               // Auto-set
  updatedAt: Date;               // Auto-set
}
```

## Error Handling

The API provides meaningful error messages:

```json
{
  "statusCode": 400,
  "message": "Stock must be greater than or equal to 0",
  "error": "Bad Request"
}
```

Common errors:
- `400 Bad Request`: Invalid input data
- `400 Bad Request`: SKU must be unique
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Server error

## Configuration Details

### Prisma Configuration
- **Database**: PostgreSQL
- **Schema**: Defined in `prisma/schema.prisma`
- **Migrations**: Auto-generated in `prisma/migrations/`
- **Seeding**: Handled by `prisma/seed.js`
- **Client**: Auto-generated from schema, type-safe queries

### OpenAI Configuration
- **Model**: gpt-3.5-turbo (can be changed to gpt-4)
- **Temperature**: 0.7 (creative but consistent)
- **Max tokens**: 250
- **Timeout**: 30 seconds

### CORS Configuration
- **Origin**: Configured from FRONTEND_URL env variable
- **Methods**: GET, HEAD, PUT, PATCH, POST, DELETE
- **Credentials**: Enabled

## Prisma Commands

```bash
# Generate Prisma client from schema
npm run prisma:generate

# Create or update database schema from schema.prisma
npm run prisma:migrate

# View database in Prisma Studio (visual inspector)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npm run prisma:reset

# Seed database with default data
npm run prisma:seed
```

## Development Tips

### View Database
```bash
# Using Prisma Studio (recommended)
npm run prisma:studio

# Using psql command line
psql -U postgres -d ecommerce_db

# Using GUI tools like DBeaver
```

### Debug Prisma Queries
```bash
# Enable query logging
export DEBUG=prisma:client

npm run start:dev
```

### Test Products Endpoint
```bash
# Get all products
curl http://localhost:3001/api/products

# Create product
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "wireless earbuds",
    "sku": "WE-001",
    "stock": 50
  }'
```

## Migration from TypeORM

If you're migrating from an older TypeORM-based version, see [PRISMA_MIGRATION.md](./PRISMA_MIGRATION.md) for detailed instructions.

**Key changes:**
- Removed TypeORM dependencies
- Replaced entity decorators with Prisma schema
- Changed DATABASE_HOST/PORT/etc to single DATABASE_URL
- Added PrismaService for dependency injection
- Updated service queries to use Prisma client API

## Performance Optimization

- Prisma queries are type-safe and optimized
- API responses are minimized
- CORS pre-flight requests are handled efficiently
- Database connections are pooled via Prisma Client
- Automatic query result caching available

## Production Deployment

### Environment Setup
```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
OPENAI_API_KEY=your-api-key
```

### Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed  # Optional
```

### Start Server
```bash
npm run build
npm run start:prod
```

### Recommended Hosting
- **Heroku**: PaaS with PostgreSQL support
- **Railway**: Modern cloud platform
- **AWS EC2**: Full control and scalability
- **DigitalOcean**: Affordable VPS option

## Troubleshooting

### OpenAI API Errors
- Verify API key is correct
- Check API key has sufficient credits
- Ensure NODE_ENV is not production (limits requests)

### Database Connection Errors
- Verify PostgreSQL is running
- Check connection credentials in .env file
- Ensure database exists: `SELECT datname FROM pg_database;`

### Image Upload Issues
- Images should be base64 encoded or valid URLs
- Maximum image URL length: 500 characters

## License

MIT
