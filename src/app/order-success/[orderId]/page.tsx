'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Truck, MessageCircle, Clock, Package, MapPin } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading order details
    setTimeout(() => {
      setOrder({
        id: parseInt(orderId),
        status: 'pending',
        total_amount: 0,
        customer_name: 'Customer',
        created_at: new Date().toISOString(),
      });
      setLoading(false);
    }, 1000);
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Success Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Thank you for shopping with YuvaKart
            </p>
            <p className="text-lg text-muted-foreground">
              Order #{orderId}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Order ID</p>
                      <p className="font-mono">#{orderId}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Date</p>
                      <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Status</p>
                      <p className="capitalize">{order.status}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Total</p>
                      <p className="font-semibold">₹{order.total_amount?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    What's Next?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Payment Verification</h4>
                        <p className="text-sm text-muted-foreground">
                          We'll verify your payment within 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Order Processing</h4>
                        <p className="text-sm text-muted-foreground">
                          Your order will be prepared for shipment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Shipping</h4>
                        <p className="text-sm text-muted-foreground">
                          You'll receive tracking information via WhatsApp
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          Your order will be delivered to your doorstep
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Communication Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >

            {/* WhatsApp Updates */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp Updates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get real-time order updates via WhatsApp
                </p>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Track Your Order</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor your order status and delivery
                </p>
                <Button asChild className="w-full">
                  <Link href={`/order-tracking/${orderId}`}>
                    <Truck className="w-4 h-4 mr-2" />
                    Track Order
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Customer Support */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is here to help
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center space-y-4"
          >
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Continue Shopping</h3>
              <p className="text-muted-foreground mb-6">
                Discover more products and add them to your cart
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/">
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/categories">
                    Browse Categories
                  </Link>
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Questions about your order? <Link href="/contact" className="text-primary hover:underline">Contact our support team</Link></p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
