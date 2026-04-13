import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Product interface
 * Matches the Product entity structure from backend
 */
export interface Product {
  id: string;
  title: string;
  description: string;
  sku: string;
  stock: number;
  price: number;
  images: string[];
  featuredImage: string;
  keywords: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API client for communicating with the backend
 * Handles all product-related API requests
 */
class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Get API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.warn(
        'NEXT_PUBLIC_API_URL is not defined. Defaulting to http://localhost:3001/api for local development.',
      );
    }

    this.baseURL = apiUrl?.replace(/\/$/, '') || 'http://localhost:3001/api';

    // Create axios instance with default config
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Add response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message);
        throw error;
      }
    );
  }

  /**
   * Fetch all products from backend
   * GET /products
   * @returns Array of products
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await this.instance.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to load products. Please try again later.');
    }
  }

  /**
   * Fetch a single product by ID
   * GET /products/:id
   * @param id - Product UUID
   * @returns Single product details
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await this.instance.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw new Error('Failed to load product details.');
    }
  }

  /**
   * Create a new product with AI-generated content
   * POST /products
   * Sends keywords to backend, which uses OpenAI to generate title and description
   * @param productData - Product data including keywords, stock, SKU, and images
   * @returns Created product
   */
  async createProduct(productData: {
    keywords: string;
    sku: string;
    stock: number;
    price: number;
    images?: string[];
  }): Promise<Product> {
    const payload = {
      ...productData,
      stock: Number(productData.stock),
      price: Number(productData.price),
    };

    try {
      const response = await this.instance.post<Product>('/products', payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorMessage = (error.response.data as any).message || 'Failed to create product';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create product. Please check your input and try again.');
    }
  }

  /**
   * Update an existing product
   * PUT /products/:id
   * @param id - Product UUID
   * @param updateData - Fields to update
   * @returns Updated product
   */
  async updateProduct(
    id: string,
    updateData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Product> {
    try {
      const response = await this.instance.put<Product>(`/products/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw new Error('Failed to update product. Please try again later.');
    }
  }

  /**
   * Delete a product
   * DELETE /products/:id
   * @param id - Product UUID
   * @returns Confirmation message
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      const response = await this.instance.delete<{ message: string }>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw new Error('Failed to delete product. Please try again later.');
    }
  }

  /**
   * Upload an image file to the backend
   * @param file - File object to upload
   * @returns URL of the uploaded image
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post<{ url: string }>(
        `${this.baseURL}/upload`,
        formData
        // Note: Do NOT set Content-Type header manually for FormData
        // axios will automatically set it with the correct boundary
      );
      return response.data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image.');
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
