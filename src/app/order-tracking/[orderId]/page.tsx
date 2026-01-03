'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Clock, Truck, Package, MapPin, MessageCircle, RefreshCw } from 'lucide-react';

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  icon: React.ReactNode;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock order data - in real app, fetch from API
  const mockOrder = {
    id: parseInt(orderId),
    status: 'shipped',
    order_status: 'shipped',
    payment_status: 'verified',
    total_amount: 1250,
    shipping_charge: 50,
    customer_name: 'John Doe',
    customer_phone: '+91 9876543210',
    shipping_address: '123 Main Street, Village Name, District, State - 123456',
    created_at: '2025-12-13T10:00:00Z',
    updated_at: '2025-12-13T14:00:00Z',
    awb_number: 'DEL123456789',
    tracking_url: 'https://www.delhivery.com/track/package/DEL123456789',
    shipment_status: 'in_transit',
  };

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getTrackingSteps = (status: string): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        id: 'ordered',
        title: 'Order Placed',
        description: 'Your order has been successfully placed',
        status: 'completed',
        timestamp: 'Dec 13, 2025 10:00 AM',
        icon: <Package className="w-5 h-5" />,
      },
      {
        id: 'payment_verified',
        title: 'Payment Verified',
        description: 'Your payment has been verified',
        status: status === 'payment_verified' || status === 'shipped' || status === 'delivered' ? 'completed' : 'pending',
        timestamp: status === 'payment_verified' || status === 'shipped' || status === 'delivered' ? 'Dec 13, 2025 11:00 AM' : undefined,
        icon: <CheckCircle className="w-5 h-5" />,
      },
      {
        id: 'shipped',
        title: 'Order Shipped',
        description: 'Your order has been shipped via Delhivery',
        status: status === 'shipped' || status === 'delivered' ? 'completed' : status === 'payment_verified' ? 'current' : 'pending',
        timestamp: status === 'shipped' || status === 'delivered' ? 'Dec 13, 2025 2:00 PM' : undefined,
        icon: <Truck className="w-5 h-5" />,
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered successfully',
        status: status === 'delivered' ? 'completed' : 'pending',
        timestamp: status === 'delivered' ? 'Dec 14, 2025 10:00 AM' : undefined,
        icon: <MapPin className="w-5 h-5" />,
      },
    ];

    return steps;
  };

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

  if (!order) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Order Not Found</CardTitle>
              <CardDescription>
                We couldn't find an order with ID #{orderId}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const trackingSteps = getTrackingSteps(order.order_status);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Track Your Order</h1>
                <p className="text-muted-foreground mt-1">
                  Order #{orderId}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Tracking Timeline */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Order Status
                    </CardTitle>
                    <CardDescription>
                      Track your order from placement to delivery
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {trackingSteps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          {/* Status Icon */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === 'completed'
                              ? 'bg-green-100 text-green-600'
                              : step.status === 'current'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              step.icon
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${
                                step.status === 'completed'
                                  ? 'text-green-700'
                                  : step.status === 'current'
                                  ? 'text-blue-700'
                                  : 'text-gray-500'
                              }`}>
                                {step.title}
                              </h4>
                              {step.timestamp && (
                                <span className="text-sm text-muted-foreground">
                                  {step.timestamp}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {step.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                {order.awb_number && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Package className="w-5 h-5 mr-2" />
                          Shipping Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">AWB Number</p>
                            <p className="font-mono font-semibold">{order.awb_number}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Courier</p>
                            <p>Delhivery</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Status</p>
                            <Badge variant={order.shipment_status === 'delivered' ? 'default' : 'secondary'}>
                              {order.shipment_status?.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Estimated Delivery</p>
                            <p>3-7 business days</p>
                          </div>
                        </div>

                        {order.tracking_url && (
                          <Button asChild className="w-full">
                            <a
                              href={order.tracking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center"
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Track on Delhivery
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Order Summary & Actions */}
            <div className="space-y-6">

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Order ID:</span>
                      <span className="font-mono">#{orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Order Date:</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment:</span>
                      <Badge variant={order.payment_status === 'verified' ? 'default' : 'secondary'}>
                        {order.payment_status?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant="outline">
                        {order.order_status?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>₹{order.total_amount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-muted-foreground">{order.shipping_address}</p>
                      <p className="text-muted-foreground">{order.customer_phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support Options */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full flex items-center justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp Support
                    </Button>
                    <Button variant="outline" asChild className="w-full flex items-center justify-start">
                      <Link href="/contact">
                        <MapPin className="w-4 h-4 mr-2" />
                        Contact Us
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Continue Shopping */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">Happy with your purchase?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Continue shopping for more great products
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/">
                          Shop More
                        </Link>
                      </Button>
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
