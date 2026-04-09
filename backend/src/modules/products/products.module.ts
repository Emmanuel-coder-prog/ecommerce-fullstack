import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../../services/prisma.service';

/**
 * Products Module
 * Encapsulates all product-related functionality
 * Handles product CRUD operations and AI integration
 * Uses Prisma ORM for database operations
 */
@Module({
  controllers: [ProductsController],
  providers: [ProductsService, AiService, PrismaService],
  exports: [ProductsService], // Export for use in other modules
})
export class ProductsModule {}
