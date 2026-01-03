'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Search,
  Eye,
  Truck,
  Package,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Download
} from 'lucide-react';

interface Shipment {
  id: number;
  order: number;
  awb_number: string;
  courier_partner: string;
  tracking_url: string;
  status: string;
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
  order_details: {
    customer_name: string;
    customer_phone: string;
    total_amount: number;
  };
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

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadShipments();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [shipments, searchTerm, statusFilter]);

  // Initialize filteredShipments when shipments load
  useEffect(() => {
    if (shipments.length > 0) {
      setFilteredShipments(shipments);
    }
  }, [shipments]);

  const loadShipments = async () => {
    try {
      setLoading(true);
      // Mock data for MVP - in production, fetch from API
      const mockShipments: Shipment[] = [
        {
          id: 1,
          order: 23,
          awb_number: 'DEL123456788',
          courier_partner: 'Delhivery',
          tracking_url: 'https://www.delhivery.com/track/package/DEL123456788',
          status: 'in_transit',
          estimated_delivery: '2025-12-16',
          created_at: '2025-12-13T13:00:00Z',
          updated_at: '2025-12-13T15:30:00Z',
          order_details: {
            customer_name: 'Priya Sharma',
            customer_phone: '+91 9876543211',
            total_amount: 890
          }
        },
        {
          id: 2,
          order: 22,
          awb_number: 'DEL123456787',
          courier_partner: 'Delhivery',
          tracking_url: 'https://www.delhivery.com/track/package/DEL123456787',
          status: 'delivered',
          estimated_delivery: '2025-12-14',
          created_at: '2025-12-13T11:00:00Z',
          updated_at: '2025-12-13T16:00:00Z',
          order_details: {
            customer_name: 'Amit Singh',
            customer_phone: '+91 9876543212',
            total_amount: 2100
          }
        },
        {
          id: 3,
          order: 25,
          awb_number: 'DTDC123456789',
          courier_partner: 'DTDC',
          tracking_url: 'https://www.dtdc.in/tracking.asp?awb=DTDC123456789',
          status: 'pending',
          estimated_delivery: '2025-12-18',
          created_at: '2025-12-13T16:00:00Z',
          updated_at: '2025-12-13T16:00:00Z',
          order_details: {
            customer_name: 'Raj Kumar',
            customer_phone: '+91 9876543213',
            total_amount: 1450
          }
        }
      ];
      setShipments(mockShipments);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterShipments = () => {
    let filtered = shipments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(shipment =>
        shipment.awb_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.order_details.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.order.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }

    setFilteredShipments(filtered);
  };

  const getStatusBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'secondary',
      picked_up: 'default',
      in_transit: 'default',
      out_for_delivery: 'default',
      delivered: 'default',
      failed: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pending',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      failed: 'Failed'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleExportShipments = () => {
    const csvContent = [
      ['Shipment ID', 'Order ID', 'AWB Number', 'Courier Partner', 'Status', 'Customer Name', 'Customer Phone', 'Order Value', 'Estimated Delivery', 'Created At', 'Updated At', 'Tracking URL'],
      ...shipments.map(shipment => [
        shipment.id,
        shipment.order,
        shipment.awb_number,
        shipment.courier_partner,
        getStatusLabel(shipment.status),
        shipment.order_details.customer_name,
        shipment.order_details.customer_phone,
        shipment.order_details.total_amount,
        shipment.estimated_delivery,
        shipment.created_at,
        shipment.updated_at,
        shipment.tracking_url || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'shipments_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
              <p className="text-sm text-gray-600">Track and manage all shipments</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleExportShipments}>
                <Download className="w-4 h-4 mr-2" />
                Export Shipments
              </Button>
              <Button asChild>
                <Link href="/admin/orders">
                  <Package className="w-4 h-4 mr-2" />
                  View Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>

            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Shipments List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredShipments.map((shipment) => (
            <motion.div key={shipment.id} variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Shipment #{shipment.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Order #{shipment.order} • {shipment.order_details.customer_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(shipment.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-2xl font-bold">₹{shipment.order_details.total_amount.toLocaleString()}</p>
                      <Badge variant={getStatusBadge(shipment.status)}>
                        {getStatusLabel(shipment.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Shipment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">AWB Number</p>
                      <p className="font-mono font-semibold">{shipment.awb_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Courier Partner</p>
                      <p className="font-medium">{shipment.courier_partner}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">{new Date(shipment.estimated_delivery).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{new Date(shipment.updated_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Customer</p>
                        <p className="font-semibold">{shipment.order_details.customer_name}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Phone</p>
                        <p className="font-semibold">{shipment.order_details.customer_phone}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Order Value</p>
                        <p className="font-semibold">₹{shipment.order_details.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/orders/${shipment.order}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Order
                        </Link>
                      </Button>

                      {shipment.tracking_url && (
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={shipment.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Track
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {shipment.status === 'pending' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Picked Up
                        </Button>
                      )}

                      {shipment.status === 'in_transit' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <MapPin className="w-4 h-4 mr-1" />
                          Out for Delivery
                        </Button>
                      )}

                      {(shipment.status === 'out_for_delivery' || shipment.status === 'in_transit') && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredShipments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
