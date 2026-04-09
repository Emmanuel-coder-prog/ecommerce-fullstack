'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, apiClient } from '@/utils/api';
import { ArrowLeft, ShoppingCart, AlertCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Product Detail Page
 * Displays full product information including AI-generated content
 * Shows featured image, description, and product details
 */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id as string;

  /**
   * Fetch product details on component mount
   */
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  /**
   * Fetch product details from API
   */
  const fetchProduct = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiClient.getProductById(productId);
      setProduct(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load product details';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    router.back();
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package size={40} className="text-blue-600 mx-auto" />
          </div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={handleBack}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /**
   * Determine stock status and styling
   */
  const isInStock = product.stock > 0;
  const stockStatus = isInStock ? `${product.stock} in stock` : 'Out of stock';
  const stockColor = isInStock ? 'text-green-600' : 'text-red-600';

  /**
   * Get image source URL
   */
  const getImageSrc = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:3001${imageUrl}`;
    }
    return `http://localhost:3001/uploads/${imageUrl}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.featuredImage ? (
                  <img
                    src={getImageSrc(product.featuredImage)}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-lg">No image</span>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={getImageSrc(image)}
                        alt={`${product.title} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and SKU */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <p className="text-gray-500">SKU: <span className="font-mono text-gray-700">{product.sku}</span></p>
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${stockColor} bg-gray-50`}>
                {isInStock ? (
                  <>
                    <ShoppingCart size={16} />
                    <span>{stockStatus}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    <span>{stockStatus}</span>
                  </>
                )}
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {product.keywords.split(',').map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Metadata */}
              <div className="border-t pt-6 space-y-2 text-sm text-gray-500">
                <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}