'use client';

import { Plus } from 'lucide-react';

/**
 * Header Component
 * Main navigation header with title and "Add Product" button
 */
interface HeaderProps {
  onAddProduct: () => void;
}

export default function Header({ onAddProduct }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container-custom py-6">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div>
            <h1 className="text-3xl font-bold">🛍️ AI Shop</h1>
            <p className="text-blue-100 mt-1">Powered by OpenAI</p>
          </div>

          {/* Add Product Button */}
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>
    </header>
  );
}
