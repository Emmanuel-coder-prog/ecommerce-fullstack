import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service
 * Manages Prisma Client instance for database operations
 * Handles connection lifecycle (init and disconnect)
 * Can be injected into other services as a dependency
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Initialize database connection on module load
   * This is called automatically by NestJS
   * Includes retry logic with exponential backoff
   */
  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        console.log('✓ Prisma connected to PostgreSQL database');
        return;
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error('✗ Failed to connect to database after 5 attempts');
          throw error;
        }
        const delay = (6 - retries) * 1000;
        console.log(`Connection failed, retrying in ${delay}ms... (${retries} attempts left)`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  /**
   * Disconnect from database on application shutdown
   * This is called automatically by NestJS
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('✓ Prisma disconnected from database');
  }
}
