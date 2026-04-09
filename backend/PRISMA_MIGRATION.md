# 🔄 TypeORM to Prisma Migration Guide

## Overview

The backend has been migrated from **TypeORM** to **Prisma ORM** with PostgreSQL. This guide explains the changes and how to set up the new system.

## What Changed

### ❌ Removed
- `@nestjs/typeorm` dependency
- `typeorm` dependency
- `src/entities/product.entity.ts` (TypeORM entity with decorators)
- `src/config/database.config.ts` (TypeORM DataSource configuration)
- TypeORM-specific scripts in package.json

### ✅ Added
- `@prisma/client` dependency
- `prisma` dev dependency
- `prisma/schema.prisma` - Prisma schema file (replaces entities)
- `prisma/seed.js` - Seed script for database initialization
- `src/services/prisma.service.ts` - Prisma client management service
- Prisma-specific scripts in package.json

## Key Differences

### Before (TypeORM)
```typescript
// Entity with decorators
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;
}

// Service injection
@InjectRepository(Product)
private productRepository: Repository<Product>;

// Query
const products = await this.productRepository.find({ order: { createdAt: 'DESC' } });
```

### After (Prisma)
```typescript
// Schema definition
model Product {
  id String @id @default(cuid())
  title String
}

// Service injection
constructor(private prisma: PrismaService) {}

// Query
const products = await this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI tools

### 2. Environment Configuration

Update `.env.development`:

```bash
# Old format (TypeORM)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=ecommerce_db

# New format (Prisma)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce_db
```

The format is: `postgresql://username:password@host:port/database`

### 3. Create Database

Ensure PostgreSQL is running and create the database:

```bash
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

### 4. Run Prisma Migrations

Generate Prisma client and create database schema:

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will:
1. Create the `products` table in PostgreSQL
2. Apply all Prisma migrations
3. Generate the Prisma client types

### 5. Seed Database (Optional)

Seed with 5 default products:

```bash
npm run prisma:seed
```

Or the database will auto-seed on first app startup.

### 6. Start Application

```bash
npm run start:dev
```

## Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create a new migration (after schema changes)
npm run prisma:migrate

# Open Prisma Studio (visual DB inspector)
npm run prisma:studio

# Seed database
npm run prisma:seed
```

## File Changes Summary

### `backend/package.json`
- Removed TypeORM dependencies
- Added Prisma dependencies
- Updated scripts for Prisma CLI

### `backend/.env.development`
- Changed `DATABASE_HOST`, `PORT`, etc. to single `DATABASE_URL`

### `backend/src/app.module.ts`
- Removed `TypeOrmModule.forRoot()`
- Prisma connection is now automatic

### `backend/src/modules/products/products.module.ts`
- Removed `TypeOrmModule.forFeature([Product])`
- Added `PrismaService` as provider

### `backend/src/modules/products/products.service.ts`
- Changed from `Repository<Product>` to `PrismaService`
- Updated all queries to use Prisma syntax
- Error handling updated for Prisma error codes

Examples:
```typescript
// OLD: TypeORM
const products = await this.productRepository.find();

// NEW: Prisma
const products = await this.prisma.product.findMany();
```

### `backend/src/main.ts`
- Minor console output updates
- Now shows Prisma specifics

### `src/services/prisma.service.ts` (NEW)
- Manages Prisma client lifecycle
- Handles connection and disconnection
- Injected into services via dependency injection

### `prisma/schema.prisma` (NEW)
- Defines all database models
- Replaces TypeORM entities
- Single source of truth for database schema

### `prisma/seed.js` (NEW)
- Seeds database with 5 default products
- Run with `npm run prisma:seed`

## Migration Path

If you had an existing TypeORM database:

1. **Backup your database** (important!)
   ```bash
   pg_dump -U postgres ecommerce_db > backup.sql
   ```

2. **Delete Prisma generated files** (if migrating existing project)
   ```bash
   rm -rf node_modules/@prisma
   rm .env.local
   ```

3. **Install new dependencies**
   ```bash
   npm install
   ```

4. **Push schema to database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed database**
   ```bash
   npm run prisma:seed
   ```

6. **Test application**
   ```bash
   npm run start:dev
   ```

## Schema Changes

### Product Model Structure

```prisma
model Product {
  id String @id @default(cuid())
  title String
  description String
  sku String @unique
  stock Int @default(0)
  images String[]
  featuredImage String?
  keywords String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("products")
}
```

**Key differences from TypeORM:**
- Uses `@id @default(cuid())` instead of UUID (shorter IDs)
- String arrays as `String[]` directly (PostgreSQL arrays)
- Nullable fields with `?` suffix
- `@updatedAt` automatic timestamp handling
- `@@map("products")` for table name mapping

## Database Query Examples

### Get All Products

```typescript
// OLD: TypeORM
const products = await this.productRepository.find({
  order: { createdAt: 'DESC' }
});

// NEW: Prisma
const products = await this.prisma.product.findMany({
  orderBy: { createdAt: 'desc' }
});
```

### Get Single Product

```typescript
// OLD: TypeORM
const product = await this.productRepository.findOne({ where: { id } });

// NEW: Prisma
const product = await this.prisma.product.findUnique({ where: { id } });
```

### Create Product

```typescript
// OLD: TypeORM
const product = this.productRepository.create(data);
await this.productRepository.save(product);

// NEW: Prisma
const product = await this.prisma.product.create({ data });
```

### Update Product

```typescript
// OLD: TypeORM
await this.productRepository.update(id, data);

// NEW: Prisma
await this.prisma.product.update({ where: { id }, data });
```

### Delete Product

```typescript
// OLD: TypeORM
await this.productRepository.delete(id);

// NEW: Prisma
await this.prisma.product.delete({ where: { id } });
```

## Error Handling

Prisma has different error codes:

```typescript
try {
  await this.prisma.product.create({ data });
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint failed (e.g., duplicate SKU)
    throw new BadRequestException('SKU must be unique');
  }
  if (error.code === 'P2025') {
    // Record not found
    throw new BadRequestException('Product not found');
  }
}
```

Common Prisma error codes:
- `P2002` - Unique constraint violation
- `P2025` - Record not found
- `P2003` - Foreign key constraint failed
- `P2004` - Database operation timed out

## Advantages of Prisma

1. **Type Safety** - Generated types match your schema exactly
2. **Simpler Syntax** - More intuitive than TypeORM decorators
3. **Built-in Migrations** - Automatic migration management
4. **Prisma Studio** - Visual database inspector
5. **Better Errors** - More helpful error messages
6. **Performance** - Optimized query generation
7. **Flexibility** - Easy to extend with raw SQL when needed

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm install
npm run prisma:generate
```

### "Database connection error"
Check `.env.development`:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
```

Verify PostgreSQL is running:
```bash
psql -U postgres -l  # List databases
```

### "Unique constraint violation on SKU"
The database enforces unique SKU. Either:
- Use a unique SKU
- Delete the existing product first
- Clear and reseed the database

### Migrations stuck

Reset database and migrations:
```bash
npx prisma migrate reset
```

This will:
1. Drop all tables
2. Re-run all migrations
3. Seed the database

## Next Steps

1. ✅ Install dependencies
2. ✅ Update `.env.development`
3. ✅ Run `npm run prisma:migrate`
4. ✅ Seed database (optional)
5. ✅ Start with `npm run start:dev`
6. ✅ Test API endpoints

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma with NestJS](https://www.prisma.io/docs/guides/database/using-prisma-with-nodejs)
- [PostgreSQL with Prisma](https://www.prisma.io/docs/reference/database-reference/connection-urls)
- [Prisma Error Codes](https://www.prisma.io/docs/reference/api-reference/error-reference)

---

**Migration Complete!** 🎉

Prisma is now the ORM for your e-commerce platform.
