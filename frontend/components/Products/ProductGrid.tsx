'use client';

import { useEffect, useState } from 'react';
import { Product, apiClient } from '@/utils/api';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

/**
 * ProductGrid Component
 * Displays all products in a responsive grid layout
 * Handles loading, error states, and product fetching
 */
export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch products on component mount
   */
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Fetch all products from API
   */
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiClient.getAllProducts();
      setProducts(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <RefreshCw size={40} className="text-blue-600 mx-auto" />
          </div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render empty state
   */
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p className="text-gray-600 text-lg">No products available. Create your first product!</p>
      </div>
    );
  }

  /**
   * Render products grid
   * Responsive: 1 column on mobile, 2 on tablet, 3 on desktop, 4 on large screens
   */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
