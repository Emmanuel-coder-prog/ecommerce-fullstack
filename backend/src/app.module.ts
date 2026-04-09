import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';

/**
 * Application Module
 * Root module that imports all other modules
 * Configures environment variables
 * Prisma handles database connection automatically
 */
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production'
        ? '.env'
        : '.env.development',
      isGlobal: true,
    }),
    // Import feature modules
    ProductsModule,
    require('./modules/upload/upload.module').UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
