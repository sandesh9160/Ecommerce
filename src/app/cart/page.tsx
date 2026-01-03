'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/CartContext';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal, getItemCount } = useCart();
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    setUpdatingItem(productId);
    try {
      updateQuantity(productId, newQuantity);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const totalItems = getItemCount();
  const subtotal = getTotal();
  const shippingCharge = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const total = subtotal + shippingCharge;

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet.
                Start shopping to fill it up!
              </p>
              <Button asChild size="lg">
                <Link href="/">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
                <p className="text-muted-foreground mt-1">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.product.id}`}
                              className="block group"
                            >
                              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.product.category_name}
                            </p>
                            <p className="text-lg font-bold text-green-600 mt-1">
                              ₹{item.product.price}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItem === item.product.id}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>

                            <span className="w-12 text-center font-medium">
                              {updatingItem === item.product.id ? '...' : item.quantity}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock || updatingItem === item.product.id}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className={shippingCharge === 0 ? 'text-green-600' : ''}>
                        {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                      </span>
                    </div>

                    {shippingCharge > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add ₹{(500 - subtotal).toLocaleString()} more for free shipping
                      </p>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button asChild className="w-full" size="lg">
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>

                    <div className="text-xs text-muted-foreground text-center space-y-1">
                      <p>✓ Secure checkout</p>
                      <p>✓ Free returns within 7 days</p>
                      <p>✓ Cash on delivery available</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
