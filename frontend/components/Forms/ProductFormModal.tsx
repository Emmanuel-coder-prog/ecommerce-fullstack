'use client';

import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { apiClient } from '@/utils/api';
import toast from 'react-hot-toast';

/**
 * Props for ProductFormModal
 */
interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /* Callback fired after successful product creation */
  onProductCreated?: () => void;
}

/**
 * ProductFormModal Component
 * Modal dialog for adding new products
 * Includes form validation and AI content generation loading state
 * 
 * Form Fields:
 * - Keywords: Used by OpenAI to generate title and description
 * - SKU: Unique identifier for the product
 * - Stock: Quantity available
 * - Images: Multiple image upload (base64 or URLs)
 */
export default function ProductFormModal({
  isOpen,
  onClose,
  onProductCreated,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    keywords: '',
    sku: '',
    stock: 1,
    price: 0,
    images: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);

  /**
   * Handle input field changes
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericValue = name === 'stock' || name === 'price'
      ? Number(value.replace(/,/g, '.'))
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'stock' || name === 'price'
          ? Number.isNaN(numericValue)
            ? 0
            : numericValue
          : value,
    }));
  };

  /**
   * Handle image URL addition
   * Users can paste image URLs or base64 data
   */
  const handleAddImage = () => {
    if (!imageInput.trim()) {
      setImageError('Please enter an image URL');
      return;
    }

    // Basic validation: check if it looks like a valid URL or base64
    if (
      !imageInput.startsWith('http') &&
      !imageInput.startsWith('data:image')
    ) {
      setImageError('Please enter a valid image URL or base64 data');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput],
    }));
    setImageInput('');
    setImageError(null);
  };

  /**
   * Remove an image from the list
   */
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /**
   * Handle form submission
   * Sends product data to backend which triggers AI content generation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.keywords.trim()) {
      toast.error('Keywords are required');
      return;
    }

    if (!formData.sku.trim()) {
      toast.error('SKU is required');
      return;
    }

    if (formData.stock < 0) {
      toast.error('Stock must be greater than or equal to 0');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setIsLoading(true);

    try {
      const productPayload = {
        keywords: formData.keywords,
        sku: formData.sku,
        stock: Number(formData.stock),
        price: Number(formData.price),
        images: formData.images.length > 0 ? formData.images : undefined,
      };

      // Send to API - backend will use OpenAI to generate title and description
      const newProduct = await apiClient.createProduct(productPayload);

      toast.success('Product created successfully!');

      // Reset form
      setFormData({
        keywords: '',
        sku: '',
        stock: 1,
        price: 0,
        images: [],
      });

      // Close modal and refresh product list
      onClose();
      onProductCreated?.();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create product';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop - Close on click outside */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-96 overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Keywords Field */}
          <div>
            <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
              Product Keywords <span className="text-red-500">*</span>
            </label>
            <textarea
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              placeholder="e.g., wireless headphones with noise cancellation, premium sound quality"
              className="input-field resize-none h-20"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              These keywords will be used by AI to generate the product title and description
            </p>
          </div>

          {/* SKU Field */}
          <div>
            <label htmlFor="sku" className="block text-sm font-semibold text-gray-700 mb-2">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="e.g., WH-001-BLK"
              className="input-field"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique Stock Keeping Unit for inventory tracking
            </p>
          </div>

          {/* Stock Field */}
          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="input-field"
              disabled={isLoading}
            />
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
              Product Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="input-field"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a numeric price for the product in USD.
            </p>
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images
            </label>

            {/* File Upload Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImageError(null);
                  try {
                    setIsLoading(true);
                    const url = await apiClient.uploadImage(file);
                    setFormData((prev) => ({
                      ...prev,
                      images: [...prev.images, url],
                    }));
                    toast.success('Image uploaded!');
                  } catch (err) {
                    setImageError('Failed to upload image.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="input-field"
                disabled={isLoading}
              />
            </div>

            {/* Image Error */}
            {imageError && (
              <p className="text-red-600 text-sm mb-3">{imageError}</p>
            )}

            {/* Image Preview List */}
            {formData.images.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {formData.images.length} image(s) added
                </p>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                    <span className="text-sm text-gray-600 truncate">
                      {index === 0 && '⭐ '}
                      {image.substring(0, 50)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              The first image will be set as the featured image
            </p>
          </div>

          {/* Loading State Message */}
          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <Loader size={18} className="text-blue-600 animate-spin" />
              <p className="text-blue-700 text-sm">
                Generating product details with AI...
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader size={18} className="animate-spin" />}
              Create Product
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
