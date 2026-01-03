'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ApiService, Product } from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import { ShoppingCart, ArrowLeft, Plus, Minus, Truck, Shield, RotateCcw, Star, Share2, Heart } from 'lucide-react';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, items } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      // Try to fetch from API first
      try {
        const productData = await ApiService.getProduct(parseInt(productId));
        setProduct(productData);
        return;
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Fallback to mock data
      const mockProducts = [
        {
          id: 1,
          name: 'Samsung Mobile Phone',
          description: 'Latest Samsung smartphone with advanced features including 5G connectivity, 128GB storage, and a stunning AMOLED display. Perfect for modern lifestyle with excellent camera capabilities.',
          price: 12999,
          image: '',
          category: 1,
          category_name: 'Electronics',
          stock: 15,
          is_active: true,
          is_in_stock: true,
          created_at: '2025-12-13T16:54:00Z',
          updated_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 2,
          name: 'Power Bank 10000mAh',
          description: 'High capacity power bank for all your devices. Fast charging technology with multiple USB ports. Compatible with smartphones, tablets, and other USB devices.',
          price: 899,
          image: '',
          category: 1,
          category_name: 'Electronics',
          stock: 25,
          is_active: true,
          is_in_stock: true,
          created_at: '2025-12-13T16:54:00Z',
          updated_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 3,
          name: 'Stainless Steel Water Bottle',
          description: 'Durable water bottle keeps water cool for hours. Made from premium stainless steel with double-wall insulation. Eco-friendly and perfect for daily use.',
          price: 299,
          image: '',
          category: 2,
          category_name: 'Home & Kitchen',
          stock: 40,
          is_active: true,
          is_in_stock: true,
          created_at: '2025-12-13T16:54:00Z',
          updated_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 4,
          name: 'Non-Stick Cookware Set',
          description: 'Complete kitchen set with non-stick coating. Includes frying pan, saucepan, and wok. Easy to clean and maintains food quality.',
          price: 1499,
          image: '',
          category: 2,
          category_name: 'Home & Kitchen',
          stock: 8,
          is_active: true,
          is_in_stock: true,
          created_at: '2025-12-13T16:54:00Z',
          updated_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 5,
          name: 'Herbal Shampoo 200ml',
          description: 'Natural herbal shampoo for healthy hair. Made with organic ingredients that nourish and strengthen hair roots. Gentle on scalp.',
          price: 185,
          image: '',
          category: 3,
          category_name: 'Personal Care',
          stock: 30,
          is_active: true,
          is_in_stock: true,
          created_at: '2025-12-13T16:54:00Z',
          updated_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 6,
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium wireless headphones with noise cancellation. Crystal clear sound quality with 30-hour battery life. Comfortable for long listening sessions.',
          price: 2499,
          image: '',
          category: 1,
          category_name: 'Electronics',
          stock: 12,
          is_active: true,
          is_in_stock: true,
          created_at: '2025-12-13T16:54:00Z',
          updated_at: '2025-12-13T16:54:00Z'
        },
        {
          id: 7,
          name: 'Organic Green Tea',
          description: 'Premium organic green tea leaves, 500g pack. Rich in antioxidants and provides numerous health benefits. Traditional brewing for authentic taste.',
          price: 399,
          image: '',
          category: 2,
          category_name: 'Home & Kitchen',
          stock: 35,
          is_active: true,
          is_in_stock: true,
          created_at: '2025-12-13T16:54:00Z',
          updated_at: '2025-12-13T16:54:00Z'
        }
      ];

      const productData = mockProducts.find(p => p.id === parseInt(productId));
      if (productData) {
        setProduct(productData);
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

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 text-xl">Oops!</CardTitle>
            <CardDescription>{error || 'Product not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/">Back to Store</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cartItem = items.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <span className="text-9xl opacity-20 filter grayscale">📦</span>
              </div>
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button variant="secondary" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-slate-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-slate-400 hover:text-blue-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 space-y-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                    {product.category_name}
                  </Badge>
                  <div className="flex items-center text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-slate-600 font-medium">4.8 (120 reviews)</span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-baseline space-x-4 mb-6">
                  <p className="text-3xl font-bold text-slate-900">
                    ₹{product.price.toLocaleString()}
                  </p>
                  {/* Mock original price for visual appeal */}
                  <p className="text-lg text-slate-400 line-through">
                    ₹{(product.price * 1.2).toFixed(0)}
                  </p>
                  <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                    20% OFF
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Stock & Quantity */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${(product.is_in_stock || product.stock > 0) ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`font-medium ${(product.is_in_stock || product.stock > 0) ? 'text-green-700' : 'text-red-700'}`}>
                    {(product.is_in_stock || product.stock > 0) ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {(product.is_in_stock || product.stock > 0) && (
                    <span className="text-slate-500">
                      • {product.stock} units available
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-12 w-12 rounded-l-xl hover:bg-slate-50"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="h-12 w-12 rounded-r-xl hover:bg-slate-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={!(product.is_in_stock || product.stock > 0)}
                    className="flex-1 h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isInCart ? `Update Cart (${cartItem?.quantity})` : 'Add to Cart'}
                  </Button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Truck className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Free Delivery</h4>
                    <p className="text-xs text-slate-500 mt-1">On orders over ₹500</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Shield className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">1 Year Warranty</h4>
                    <p className="text-xs text-slate-500 mt-1">Official manufacturer warranty</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <RotateCcw className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Easy Returns</h4>
                    <p className="text-xs text-slate-500 mt-1">7 days replacement policy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Shield className="w-6 h-6 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Secure Payment</h4>
                    <p className="text-xs text-slate-500 mt-1">100% secure transaction</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">You might also like</h2>
            <Button variant="link" asChild className="text-blue-600">
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-slate-100 hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-slate-50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                      <span className="text-4xl opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">📦</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm">
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">Quick View</Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-500 mb-1">Category Name</p>
                    <h3 className="font-semibold text-slate-900 mb-2 truncate">Related Product {i}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-600 font-bold">₹999</p>
                      <div className="flex text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-slate-400 ml-1">4.5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
