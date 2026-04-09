'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header/Header';
import ProductGrid from '@/components/Products/ProductGrid';
import ProductFormModal from '@/components/Forms/ProductFormModal';
import { Toaster } from 'react-hot-toast';

/**
 * Home Page Component
 * Main landing page displaying products grid and add product functionality
 * 
 * Features:
 * - Responsive product grid layout
 * - Add product modal with form validation
 * - Real-time product updates
 * - Error handling and toast notifications
 */
export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Callback when product is successfully created
   * Triggers product grid refresh
   */
  const handleProductCreated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <>
      {/* Toast notification system */}
      <Toaster position="top-right" />

      {/* Main Layout */}
      <div className="min-h-screen bg-gray-50">
        {/* Header with navigation and add product button */}
        <Header onAddProduct={() => setIsFormModalOpen(true)} />

        {/* Main Content */}
        <main className="container-custom py-12">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Discover our collection of products with AI-generated descriptions
            </p>
          </div>

          {/* Products Grid - key forces re-render on product creation */}
          <ProductGrid key={refreshTrigger} />
        </main>

        {/* Product Form Modal */}
        <ProductFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onProductCreated={handleProductCreated}
        />

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-6 mt-16">
          <div className="container-custom text-center">
            <p className="mb-2">🛍️ AI Shop </p>
            <p className="text-gray-400 text-sm">
              Built with modern web technologies for an amazing shopping experience
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
