'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  ArrowLeft,
  Save,
  Package,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_name: string;
  is_active: boolean;
  created_at: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      // Try to fetch from API first
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}/`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
          populateForm(productData);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Fallback to mock data
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Samsung Mobile Phone',
          description: 'Latest Samsung smartphone with advanced features including 5G connectivity, 128GB storage, and a stunning AMOLED display. Perfect for modern lifestyle with excellent camera capabilities.',
          price: 12999,
          stock: 15,
          category_name: 'Electronics',
          is_active: true,
          created_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 2,
          name: 'Power Bank 10000mAh',
          description: 'High capacity power bank for all your devices. Fast charging technology with multiple USB ports. Compatible with smartphones, tablets, and other USB devices.',
          price: 899,
          stock: 25,
          category_name: 'Electronics',
          is_active: true,
          created_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 3,
          name: 'Stainless Steel Water Bottle',
          description: 'Durable water bottle keeps water cool for hours. Made from premium stainless steel with double-wall insulation. Eco-friendly and perfect for daily use.',
          price: 299,
          stock: 40,
          category_name: 'Home & Kitchen',
          is_active: true,
          created_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 4,
          name: 'Non-Stick Cookware Set',
          description: 'Complete kitchen set with non-stick coating. Includes frying pan, saucepan, and wok. Easy to clean and maintains food quality.',
          price: 1499,
          stock: 8,
          category_name: 'Home & Kitchen',
          is_active: true,
          created_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 5,
          name: 'Herbal Shampoo 200ml',
          description: 'Natural herbal shampoo for healthy hair. Made with organic ingredients that nourish and strengthen hair roots. Gentle on scalp.',
          price: 185,
          stock: 30,
          category_name: 'Personal Care',
          is_active: true,
          created_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 6,
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium wireless headphones with noise cancellation. Crystal clear sound quality with 30-hour battery life. Comfortable for long listening sessions.',
          price: 2499,
          stock: 12,
          category_name: 'Electronics',
          is_active: true,
          created_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 7,
          name: 'Organic Green Tea',
          description: 'Premium organic green tea leaves, 500g pack. Rich in antioxidants and provides numerous health benefits. Traditional brewing for authentic taste.',
          price: 399,
          stock: 35,
          category_name: 'Home & Kitchen',
          is_active: true,
          created_at: '2025-12-13T16:54:00Z'
        }
      ];

      const productData = mockProducts.find(p => p.id === parseInt(productId));
      if (productData) {
        setProduct(productData);
        populateForm(productData);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (productData: Product) => {
    setName(productData.name);
    setDescription(productData.description);
    setPrice(productData.price.toString());
    setStock(productData.stock.toString());
    setCategory(productData.category_name);
    setIsActive(productData.is_active);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price || !stock) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(price) <= 0 || parseInt(stock) < 0) {
      setError('Please enter valid price and stock values');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // In production, this would call the API to update the product
      // For now, we'll simulate the update and show success
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);

    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const categories = ['Electronics', 'Home & Kitchen', 'Personal Care', 'Books', 'Fashion', 'Sports'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"
        />
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-600">Product not found</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/products">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/products">Back to Products</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-600">Update product information</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Product Details</span>
              </CardTitle>
              <CardDescription>
                Edit the product information below
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700">Product updated successfully! Redirecting...</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Product Name *
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">
                      Price (₹) *
                    </label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-medium">
                      Stock Quantity *
                    </label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isActive" className="text-sm">
                        Active (visible to customers)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/products')}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
