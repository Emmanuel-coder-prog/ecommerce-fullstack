'use client';

import { Product } from '@/utils/api';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * ProductCard Component
 * Displays individual product information in a card format
 * Shows: featured image, title, description, stock status
 * Clickable to navigate to product detail page
 */
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  // Determine stock status and styling
  const isInStock = product.stock > 0;
  const stockStatus = isInStock ? `${product.stock} in stock` : 'Out of stock';
  const stockColor = isInStock ? 'text-green-600' : 'text-red-600';

  // Handle card click
  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div
      className="card overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {product.featuredImage ? (
          <img
            src={
              product.featuredImage.startsWith('http')
                ? product.featuredImage
                : product.featuredImage.startsWith('/uploads/')
                ? `http://localhost:3001${product.featuredImage}`
                : `http://localhost:3001/uploads/${product.featuredImage}`
            }
            alt={product.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Stock Status Badge */}
        <div className={`flex items-center gap-2 mb-3 ${stockColor} text-sm font-medium`}>
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

        {/* SKU and Keywords */}
        <div className="border-t pt-2 text-xs text-gray-500">
          <p>SKU: <span className="font-mono text-gray-700">{product.sku}</span></p>
        </div>
      </div>
    </div>
  );
}
