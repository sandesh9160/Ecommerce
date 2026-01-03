'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Upload,
  Package,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function AdminNewProductPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    is_active: true,
    image: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories/');
      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } else {
        // Fallback categories
        setCategories([
          { id: 1, name: 'Electronics', description: 'Mobile phones, chargers, and electronic gadgets' },
          { id: 2, name: 'Home & Kitchen', description: 'Household items and kitchen essentials' },
          { id: 3, name: 'Personal Care', description: 'Soaps, shampoos, and personal hygiene products' },
          { id: 4, name: 'Groceries', description: 'Daily essentials and food items' }
        ]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, send data to backend
      console.log('Creating product:', formData);

      // Show success message
      alert('Product created successfully!');

      // Reset form or redirect
      // router.push('/admin/products');

    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-600">Create a new product for your store</p>
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

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* Basic Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Enter the core details of your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product in detail"
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing & Inventory */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Pricing & Inventory
                </CardTitle>
                <CardDescription>Set pricing and stock information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="0"
                      className={errors.stock ? 'border-red-500' : ''}
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.stock}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Image */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Product Image
                </CardTitle>
                <CardDescription>Upload a high-quality image for your product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-900">Upload Product Image</p>
                        <p className="text-sm text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button type="button" variant="outline" className="mt-4">
                          Choose File
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Status */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Product Status
                </CardTitle>
                <CardDescription>Control product visibility and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    Make product active and visible to customers
                  </label>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Inactive products won't be visible on your store but can be activated later.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Actions */}
          <motion.div variants={itemVariants} className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </motion.div>

        </motion.form>

        {/* Preview Card */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Product Preview</CardTitle>
              <CardDescription className="text-blue-700">
                How your product will appear to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {formData.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {formData.description || 'Product description will appear here...'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl font-bold text-green-600">
                        ₹{formData.price || '0.00'}
                      </span>
                      <Badge variant={formData.is_active ? 'default' : 'secondary'}>
                        {formData.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
