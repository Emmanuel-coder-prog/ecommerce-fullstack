/**
 * Data Transfer Objects for Product API
 * Used for validating and typing request/response data
 */

/**
 * DTO for creating a new product
 * Sent from frontend to backend when adding a product
 */
export class CreateProductDto {
  /** Keywords to guide AI generation of title and description */
  keywords!: string;

  /** Stock Keeping Unit - must be unique */
  sku!: string;

  /** Available stock quantity */
  stock!: number;

  /** Array of image URLs (base64 or URLs) */
  images?: string[];
}

/**
 * DTO for updating an existing product
 * All fields are optional - only provided fields will be updated
 */
export class UpdateProductDto {
  /** New product title */
  title?: string;

  /** New product description */
  description?: string;

  /** New SKU */
  sku?: string;

  /** New stock quantity */
  stock?: number;

  /** New image URLs */
  images?: string[];

  /** New featured image */
  featuredImage?: string;

  /** New keywords */
  keywords?: string;
}

/**
 * DTO for product response
 * Sent from backend to frontend with complete product information
 */
export class ProductResponseDto {
  id?: string;
  title?: string;
  description?: string;
  sku?: string;
  stock?: number;
  images?: string[];
  featuredImage?: string | null;
  keywords?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
