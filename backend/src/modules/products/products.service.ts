import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from '@prisma/client';

/**
 * Products Service
 * Core business logic for product management
 * Handles CRUD operations with Prisma ORM and integrates with AI service for content generation
 */
@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  /**
   * Fetch all products from database
   * Used to display products on the listing page
   * Ordered by creation date (newest first)
   * @returns Array of all products
   */
  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Fetch a single product by ID
   * @param id - Product ID
   * @returns Product details or throws error if not found
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  /**
   * Create a new product with AI-generated content
   * Process:
   * 1. Validate input data
   * 2. Call OpenAI to generate title and description from keywords
   * 3. Save complete product to database
   * 4. Return created product
   *
   * @param createProductDto - Product data including keywords for AI generation
   * @returns Created product with AI-generated title and description
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validate input
    this.validateProductInput(createProductDto);

    try {
      // Generate title and description using OpenAI API
      const { title, description } = await this.aiService.generateProductContent(
        createProductDto.keywords,
      );

      // Create product with generated content
      const product = await this.prisma.product.create({
        data: {
          title,
          description,
          sku: createProductDto.sku,
          stock: createProductDto.stock,
          keywords: createProductDto.keywords,
          // Use first image as featured image
          images: createProductDto.images || [],
          featuredImage:
            createProductDto.images && createProductDto.images.length > 0
              ? createProductDto.images[0]
              : null,
        },
      });

      return product;
    } catch (error: any) {
      // If it's a unique constraint error on SKU
      if (error.code === 'P2002') {
        throw new BadRequestException('SKU must be unique');
      }

      throw new BadRequestException(`Failed to create product: ${error.message}`);
    }
  }

  /**
   * Update an existing product
   * @param id - Product ID
   * @param updateProductDto - Updated product data (partial)
   * @returns Updated product
   */
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Verify product exists
    await this.findOne(id);

    // Validate input if provided
    if (updateProductDto.stock !== undefined || updateProductDto.sku) {
      this.validateProductInput({
        stock: updateProductDto.stock ?? 0,
        sku: updateProductDto.sku ?? '',
        keywords: updateProductDto.keywords ?? '',
      });
    }

    // Update featured image if new images are provided
    if (updateProductDto.images && updateProductDto.images.length > 0) {
      updateProductDto.featuredImage = updateProductDto.images[0];
    }

    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('SKU must be unique');
      }

      throw new BadRequestException(`Failed to update product: ${error.message}`);
    }
  }

  /**
   * Delete a product
   * @param id - Product ID
   * @returns Confirmation message
   */
  async remove(id: string): Promise<{ message: string }> {
    // Verify product exists before deletion
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  /**
   * Validate product input data
   * Ensures required fields are provided and valid
   * @param data - Product data to validate
   */
  private validateProductInput(data: any): void {
    // Stock must be >= 0
    if (data.stock < 0) {
      throw new BadRequestException('Stock must be greater than or equal to 0');
    }

    // SKU is required and must be unique (enforced by database)
    if (!data.sku || data.sku.trim().length === 0) {
      throw new BadRequestException('SKU is required');
    }

    // Keywords are required for AI generation
    if (!data.keywords || data.keywords.trim().length === 0) {
      throw new BadRequestException('Keywords are required for AI generation');
    }
  }
}
