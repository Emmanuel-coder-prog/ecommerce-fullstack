import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dto/product.dto';

/**
 * Products Controller
 * Handles HTTP requests for product-related operations
 * Endpoints follow REST conventions
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /products
   * Fetch all products from the database
   * Used by frontend product listing page
   * @returns Array of all products
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findAll();
    return products.map(this.toResponseDto);
  }

  /**
   * GET /products/:id
   * Fetch a single product by ID
   * @param id - Product UUID
   * @returns Single product details
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return this.toResponseDto(product);
  }

  /**
   * POST /products
   * Create a new product with AI-generated title and description
   * Steps:
   * 1. Receive keywords, SKU, stock, and images from frontend
   * 2. Call OpenAI to generate title and description
   * 3. Save product to database
   * 4. Return created product
   *
   * @param createProductDto - Product data including keywords for AI generation
   * @returns Created product with AI-generated content
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.create(createProductDto);
    return this.toResponseDto(product);
  }

  /**
   * PUT /products/:id
   * Update an existing product
   * @param id - Product UUID
   * @param updateProductDto - Fields to update
   * @returns Updated product
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.update(id, updateProductDto);
    return this.toResponseDto(product);
  }

  /**
   * DELETE /products/:id
   * Delete a product by ID
   * @param id - Product UUID
   * @returns Confirmation message
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.remove(id);
  }

  /**
   * Helper method to convert Product entity to response DTO
   * Ensures consistent response format across all endpoints
   * @param product - Product entity from database
   * @returns Formatted product response
   */
  private toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      sku: product.sku,
      stock: product.stock,
      images: product.images,
      featuredImage: product.featuredImage,
      keywords: product.keywords,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
