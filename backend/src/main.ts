import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

/**
 * Main Bootstrap Function
 * Initializes the NestJS application and seeds the database
 * Uses Prisma for database operations
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend requests
 app.enableCors({
  origin:true,
  credentials: true,
});

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Start listening on configured port
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                    E-Commerce API Started                  ║
║                     (Prisma + PostgreSQL)                  ║
║                                                            ║
║  Server running on: http://localhost:${port}              ║
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Database: PostgreSQL (via Prisma)                         ║
║                                                            ║
║  API Documentation:                                        ║
║  GET    /api/products        - Get all products           ║
║  POST   /api/products        - Create product             ║
║  GET    /api/products/:id    - Get product by ID          ║
║  PUT    /api/products/:id    - Update product             ║
║  DELETE /api/products/:id    - Delete product             ║
║                                                            ║
║  Prisma Studio: npm run prisma:studio                      ║
║  Migrations: npm run prisma:migrate                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
