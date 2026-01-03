'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { ApiService, Order } from '@/lib/api';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Package,
  AlertTriangle,
  MoreVertical,
  Download,
  ChevronLeft
} from 'lucide-react';

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

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const checkAuthAndLoadData = async () => {
    if (!ApiService.isLoggedIn()) {
      router.push('/admin-login');
      return;
    }
    loadOrders();
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await ApiService.getAdminOrders();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fallback or empty state handled by filteredOrders length
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(lowerSearch) ||
        order.id.toString().includes(lowerSearch) ||
        order.customer_phone.includes(searchTerm) ||
        (order.customer_email && order.customer_email.toLowerCase().includes(lowerSearch))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === paymentFilter);
    }

    setFilteredOrders(filtered);
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

  const handleVerifyPayment = async (orderId: number) => {
    if (!confirm('Are you sure you want to approve this payment?')) return;
    try {
      await ApiService.approvePayment(orderId);
      // Optimistic update
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, payment_status: 'verified', order_status: 'payment_verified' }
          : order
      ));
    } catch (error) {
      console.error('Failed to approve payment:', error);
      alert('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (orderId: number) => {
    if (!confirm('Are you sure you want to reject this payment?')) return;
    try {
      await ApiService.rejectPayment(orderId);
      // Optimistic update
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, payment_status: 'rejected', order_status: 'cancelled' }
          : order
      ));
    } catch (error) {
      console.error('Failed to reject payment:', error);
      alert('Failed to reject payment');
    }
  };

  const handleExportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer Name', 'Phone', 'Email', 'Total Amount', 'Shipping Charge', 'Order Status', 'Payment Status', 'Created At'],
      ...filteredOrders.map(order => [
        order.id,
        order.customer_name,
        order.customer_phone,
        order.customer_email,
        order.total_amount,
        order.shipping_charge,
        order.order_status,
        order.payment_status,
        order.created_at
      ])
    ].map(row => row.map(field => `"${field ?? ''}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'orders_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button variant="ghost" size="sm" className="pl-0 mb-2 hover:bg-transparent hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-500">Manage and track customer orders</p>
          </div>
          <Button variant="outline" onClick={handleExportOrders} className="bg-white hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search order ID, customer name, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="payment_verified">Payment Verified</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div key={order.id} variants={itemVariants} layout>
                <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-slate-900">Order #{order.id}</h3>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 font-medium">{order.customer_name}</p>
                          <p className="text-sm text-slate-500">{order.customer_phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end lg:self-center">
                        <div className="text-right mr-4">
                          <p className="text-2xl font-bold text-slate-900">₹{order.total_amount.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Total Amount</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={getPaymentBadge(order.payment_status)} className="justify-center">
                            {order.payment_status === 'verified' ? 'Payment Verified' :
                              order.payment_status === 'pending' ? 'Payment Pending' : 'Payment Rejected'}
                          </Badge>
                          <Badge variant={getStatusBadge(order.order_status)} className="justify-center">
                            {order.order_status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 mb-6">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-slate-700">
                            <span>{item.quantity} × {item.product_name || `Product #${item.product}`}</span>
                            {/* Note: OrderItem interface in api.ts uses product_id/product_name but mock had product_name directly. Handled by fallback. */}
                            <span className="font-medium">₹{((item.price || 0) * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-sm text-slate-500 max-w-md truncate">
                        <span className="font-medium text-slate-700">Shipping to:</span> {order.shipping_address}
                      </div>

                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm" className="hover:bg-slate-50">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>

                        {order.payment_status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleVerifyPayment(order.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectPayment(order.id)}
                              size="sm"
                              variant="destructive"
                              className="shadow-sm"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {order.payment_status === 'verified' && order.order_status === 'payment_verified' && (
                          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Link href={`/admin/shipments/create?order=${order.id}`}>
                              <Truck className="w-4 h-4 mr-1" />
                              Ship
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No orders found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
