'use client';

import { useEffect, useState } from 'react';
import { Product, apiClient } from '@/utils/api';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <RefreshCw size={40} className="text-blue-500 mx-auto" />
          </div>
          <p className="text-slate-300">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <p className="text-rose-400 mb-4">{error}</p>
          <button onClick={fetchProducts} className="btn-secondary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p className="text-slate-300 text-lg">No products available. Create your first product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Trending Now</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {products.length} products ready to explore
            </p>
          </div>
          {/* <button onClick={fetchProducts} className="btn-secondary inline-flex items-center gap-2">
            <RefreshCw size={18} /> Refresh
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
