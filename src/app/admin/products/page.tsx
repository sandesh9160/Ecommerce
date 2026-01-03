'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ApiService, Product, Category } from '@/lib/api';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Package,
  ChevronLeft,
  ArrowUpDown,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sorting
  const [sortField, setSortField] = useState<keyof Product>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    if (!ApiService.isLoggedIn()) {
      router.push('/admin-login');
      return;
    }
    await loadData();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        ApiService.getAdminProducts(),
        ApiService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await ApiService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="pl-0 mb-2 hover:bg-transparent hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products</h1>
            <p className="text-slate-500">Manage your product inventory</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" onClick={() => alert('Add Product feature coming soon')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="relative min-w-[200px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    className="w-full h-10 pl-9 pr-4 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-100 transition-colors appearance-none cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Product Name
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('category')}>
                    Category
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1">
                      Price
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('stock')}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <ImageIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{product.name}</div>
                            <div className="text-slate-500 text-xs">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                          {product.category_name}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        ₹{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={product.stock > 0 ? 'text-green-700' : 'text-red-700'}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => alert('Edit feature coming soon')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Package className="w-12 h-12 text-slate-300 mb-4" />
                        <p>No products found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
