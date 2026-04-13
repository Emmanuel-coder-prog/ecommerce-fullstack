'use client';

import { Product } from '@/utils/api';
import { ShoppingCart, AlertCircle, Heart, Sparkles, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

function generateDisplayValues(product: Product) {
  const discountPercent = product.stock <= 5 ? 45 : product.stock <= 12 ? 35 : 25;
  const price = product.price ?? 0;
  const oldPrice = Math.round(price * (1 + discountPercent / 100));
  const rating = Math.min(5, 4 + ((product.title.length % 10) / 10));
  const reviewCount = 40 + ((product.title.length * 7) % 260);
  const saleText = product.stock <= 5 ? 'Selling fast' : 'Shop now';

  return {
    price: `$${price.toFixed(2)}`,
    oldPrice: `$${oldPrice.toFixed(2)}`,
    discountPercent,
    rating: rating.toFixed(1),
    reviewCount,
    saleText,
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const isInStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 12;
  const stockStatus = isInStock ? `${product.stock} in stock` : 'Out of stock';
  const stockColor = isInStock ? 'text-emerald-400' : 'text-rose-400';
  const { price, oldPrice, discountPercent, rating, reviewCount, saleText } = generateDisplayValues(product);

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const apiHost = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '').replace(/\/$/, '')
    : 'http://localhost:3001';

  const imageUrl = product.featuredImage
    ? product.featuredImage.startsWith('http')
      ? product.featuredImage
      : `${apiHost}${product.featuredImage.startsWith('/') ? product.featuredImage : `/uploads/${product.featuredImage}`}`
    : null;

  return (
    <div
      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-72 overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100">
            <span className="text-slate-500">No image available</span>
          </div>
        )}

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="badge-pill bg-rose-500 text-white">-{discountPercent}%</span>
          <span className="badge-pill bg-slate-950/90 text-white">{saleText}</span>
        </div>

        <button className="absolute right-4 top-4 rounded-full bg-white p-3 text-rose-500 shadow-lg shadow-slate-200 transition hover:scale-105">
          <Heart size={18} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
          <span>{product.sku}</span>
          <span className={lowStock ? 'badge-pill bg-amber-500 text-slate-950' : 'badge-pill bg-emerald-500 text-slate-950'}>
            {lowStock ? 'Almost gone' : 'Best seller'}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-950 transition-colors duration-200 group-hover:text-sky-600">
            {product.title}
          </h3>
          <p className="mt-3 max-h-[4.5rem] overflow-hidden text-sm leading-6 text-slate-600">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-slate-950">{price}</span>
              <span className="text-sm text-slate-500 line-through">{oldPrice}</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-amber-500">
              <Star size={16} />
              <span className="text-slate-950">{rating}</span>
              <span className="text-slate-500">({reviewCount})</span>
            </div>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-700 border border-slate-200">
            {product.stock === 0 ? 'Sold out' : lowStock ? 'Only a few left' : 'In stock'}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            {isInStock ? <ShoppingCart size={18} /> : <AlertCircle size={18} />}
            <span className={stockColor}>{stockStatus}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <Sparkles size={16} />
            <span>AI curated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
