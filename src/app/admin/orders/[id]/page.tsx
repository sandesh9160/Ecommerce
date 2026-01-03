'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ApiService } from '@/lib/api';
import {
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  MapPin,
  Clock,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
  MapPinIcon,
  Calendar,
  CreditCard,
  Download
} from 'lucide-react';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  shipping_charge: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  awb_number?: string;
  items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
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

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipmentCreated, setShipmentCreated] = useState(false);
  const [localChanges, setLocalChanges] = useState<{payment_status?: string; order_status?: string}>({});

  useEffect(() => {
    // Check for shipment_created query parameter
    if (searchParams.get('shipment_created') === 'true') {
      setShipmentCreated(true);
      // Remove the query parameter from URL after showing the message
      setTimeout(() => {
        router.replace(`/admin/orders/${orderId}`);
      }, 5000);
    }

    loadOrderDetails();
  }, [orderId, searchParams]);

  // Apply local changes after order data is loaded
  useEffect(() => {
    if (order && Object.keys(localChanges).length > 0) {
      // Only apply changes if they're not already applied
      const needsUpdate = Object.entries(localChanges).some(([key, value]) => order[key as keyof Order] !== value);
      if (needsUpdate) {
        setOrder(prev => prev ? { ...prev, ...localChanges } : null);
      }
    }
  }, [localChanges]); // Only depend on localChanges to avoid infinite loop

  const loadOrderDetails = async () => {
    try {
      setLoading(true);

      // Try to fetch from admin API first (since this is admin page)
      try {
        const orders = await ApiService.getAdminOrders();
        const orderData = orders.find(o => o.id === parseInt(orderId));
        if (orderData) {
          setOrder(orderData);
          return;
        }
      } catch (apiError) {
        console.log('Admin API not available, using mock data');
      }

      // Fallback to mock data
      const mockOrders: Order[] = [
        {
          id: 24,
          customer_name: 'Rajesh Kumar',
          customer_phone: '+91 9876543210',
          customer_email: 'rajesh@example.com',
          shipping_address: '123 Main Street, Village Name, District, State - 123456',
          total_amount: 1250,
          shipping_charge: 50,
          order_status: 'shipped',
          payment_status: 'verified',
          created_at: '2025-12-13T14:30:00Z',
          updated_at: '2025-12-13T16:00:00Z',
          awb_number: 'DEL123456789',
          items: [
            { id: 1, product_name: 'Samsung Mobile Phone', quantity: 1, price: 1200, total: 1200 }
          ]
        },
        {
          id: 23,
          customer_name: 'Priya Sharma',
          customer_phone: '+91 9876543211',
          customer_email: 'priya@example.com',
          shipping_address: '456 Village Road, Mandal, District, State - 123457',
          total_amount: 890,
          shipping_charge: 0,
          order_status: 'shipped',
          payment_status: 'verified',
          created_at: '2025-12-13T12:15:00Z',
          updated_at: '2025-12-13T13:00:00Z',
          awb_number: 'DEL123456788',
          items: [
            { id: 2, product_name: 'Power Bank 10000mAh', quantity: 1, price: 890, total: 890 }
          ]
        },
        {
          id: 22,
          customer_name: 'Amit Singh',
          customer_phone: '+91 9876543212',
          customer_email: 'amit@example.com',
          shipping_address: '789 Rural Area, Block, District, State - 123458',
          total_amount: 2100,
          shipping_charge: 0,
          order_status: 'delivered',
          payment_status: 'verified',
          created_at: '2025-12-13T10:45:00Z',
          updated_at: '2025-12-13T15:30:00Z',
          awb_number: 'DEL123456787',
          items: [
            { id: 3, product_name: 'Stainless Steel Water Bottle', quantity: 2, price: 1050, total: 2100 }
          ]
        },
        {
          id: 21,
          customer_name: 'Sunita Patel',
          customer_phone: '+91 9876543213',
          customer_email: 'sunita@example.com',
          shipping_address: '321 Rural Lane, Village Center, District, State - 123459',
          total_amount: 550,
          shipping_charge: 50,
          order_status: 'pending',
          payment_status: 'pending',
          created_at: '2025-12-13T09:20:00Z',
          updated_at: '2025-12-13T09:20:00Z',
          items: [
            { id: 4, product_name: 'Non-Stick Cookware Set', quantity: 1, price: 500, total: 500 }
          ]
        },
        {
          id: 20,
          customer_name: 'Vikram Gupta',
          customer_phone: '+91 9876543214',
          customer_email: 'vikram@example.com',
          shipping_address: '654 Farm Road, Agricultural Area, District, State - 123460',
          total_amount: 185,
          shipping_charge: 0,
          order_status: 'delivered',
          payment_status: 'verified',
          created_at: '2025-12-12T16:45:00Z',
          updated_at: '2025-12-13T11:15:00Z',
          awb_number: 'DEL123456786',
          items: [
            { id: 5, product_name: 'Herbal Shampoo 200ml', quantity: 1, price: 185, total: 185 }
          ]
        }
      ];

      const orderData = mockOrders.find(o => o.id === parseInt(orderId));
      if (orderData) {
        setOrder(orderData);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error loading order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'secondary',
      payment_verified: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const getPaymentBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'secondary',
      verified: 'default',
      rejected: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const handleVerifyPayment = async () => {
    if (!order) return;

    try {
      await ApiService.approvePayment(order.id);

      // Update local state
      setLocalChanges({
        payment_status: 'verified',
        order_status: 'payment_verified'
      });

      // Update order state
      setOrder(prev => prev ? { ...prev, payment_status: 'verified', order_status: 'payment_verified' } : null);
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment. Please try again.');
    }
  };

  const handleRejectPayment = async () => {
    if (!order) return;

    try {
      await ApiService.rejectPayment(order.id);

      // Update local state
      setLocalChanges({
        payment_status: 'rejected',
        order_status: 'cancelled'
      });

      // Update order state
      setOrder(prev => prev ? { ...prev, payment_status: 'rejected', order_status: 'cancelled' } : null);
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Failed to reject payment. Please try again.');
    }
  };

  const handleCreateShipment = () => {
    router.push(`/admin/shipments/create?order=${orderId}`);
  };

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                <p className="text-sm text-gray-600">Order not found</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/orders">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
              <CardDescription>{error || 'Order not found'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/orders">Back to Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Use local changes to override order data for display
  const displayOrderStatus = localChanges.order_status || order.order_status;
  const displayPaymentStatus = localChanges.payment_status || order.payment_status;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-600">Order #{order.id}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link href="/admin/orders">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Success Message for Shipment Creation */}
        {shipmentCreated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Shipment created successfully!</span>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >

          {/* Order Information */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">

            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Status</p>
                    <Badge variant={getStatusBadge(displayOrderStatus)} className="mt-1">
                      {displayOrderStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                    <Badge variant={getPaymentBadge(displayPaymentStatus)} className="mt-1">
                      {displayPaymentStatus === 'verified' ? 'Payment Verified' :
                       displayPaymentStatus === 'pending' ? 'Payment Pending' : 'Payment Rejected'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(order.updated_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                  {displayPaymentStatus === 'pending' ? (
                    <>
                      <Button onClick={handleVerifyPayment} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Payment
                      </Button>
                      <Button onClick={handleRejectPayment} variant="destructive">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Payment
                      </Button>
                    </>
                  ) : displayPaymentStatus === 'verified' && displayOrderStatus === 'payment_verified' ? (
                    <Button onClick={handleCreateShipment}>
                      <Truck className="w-4 h-4 mr-2" />
                      Create Shipment
                    </Button>
                  ) : displayPaymentStatus === 'rejected' ? (
                    <Badge variant="destructive" className="px-3 py-1">
                      Payment Rejected
                    </Badge>
                  ) : null}

                  {order.awb_number && (
                    <Button variant="outline" asChild>
                      <a
                        href={`https://www.delhivery.com/track/package/${order.awb_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Track Shipment
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Detailed breakdown of items in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{(order.total_amount - order.shipping_charge).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>₹{order.shipping_charge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Information */}
            {order.awb_number && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">AWB Number</p>
                      <p className="font-mono font-semibold text-lg">{order.awb_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Courier Partner</p>
                      <p className="font-medium">Delhivery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </motion.div>

          {/* Customer Information */}
          <motion.div variants={itemVariants} className="space-y-6">

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="font-semibold">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${order.customer_phone}`} className="font-semibold hover:text-blue-600">
                        {order.customer_phone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${order.customer_email}`} className="font-semibold hover:text-blue-600">
                        {order.customer_email}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{order.shipping_address}</p>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {displayPaymentStatus === 'verified' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Payment Verified</p>
                        <p className="text-xs text-muted-foreground">Payment processed successfully</p>
                      </div>
                    </div>
                  )}

                  {order.awb_number && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Shipment Created</p>
                        <p className="text-xs text-muted-foreground">AWB: {order.awb_number}</p>
                      </div>
                    </div>
                  )}

                  {order.order_status === 'delivered' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Order Delivered</p>
                        <p className="text-xs text-muted-foreground">Package delivered successfully</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
