'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Settings, Save, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

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

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'YuvaKart',
    storeDescription: 'Smart Shopping, Easy Living for rural and semi-urban India',
    contactEmail: 'support@yuvakart.com',
    contactPhone: '+91-XXXXXXXXXX',
    shippingCharge: '50',
    freeShippingThreshold: '500',
    upiId: 'merchant@upi',
    whatsappNumber: '+91-XXXXXXXXXX',
    address: 'Your Store Address, City, State - PIN',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  });

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    // Show success message
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
              <p className="text-sm text-gray-600">Configure your YuvaKart store settings</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >

          {/* Store Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Store Information
                </CardTitle>
                <CardDescription>Basic store details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <Input
                    value={settings.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Store Description</label>
                  <Textarea
                    value={settings.storeDescription}
                    onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                    placeholder="Enter store description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Store Address</label>
                  <Textarea
                    value={settings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>Customer support and communication details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <Input
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="support@yourstore.com"
                    type="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone</label>
                  <Input
                    value={settings.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                  <Input
                    value={settings.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Payment Settings
                </CardTitle>
                <CardDescription>UPI and payment configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">UPI ID</label>
                  <Input
                    value={settings.upiId}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                    placeholder="merchant@upi"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This UPI ID will be used for all payments
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Zero Transaction Fees</p>
                      <p className="text-xs text-blue-700">Direct UPI payments with no gateway fees</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Shipping Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Shipping Settings
                </CardTitle>
                <CardDescription>Delivery charges and shipping rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Charge (₹)</label>
                    <Input
                      value={settings.shippingCharge}
                      onChange={(e) => handleInputChange('shippingCharge', e.target.value)}
                      placeholder="50"
                      type="number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Free Shipping (₹)</label>
                    <Input
                      value={settings.freeShippingThreshold}
                      onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
                      placeholder="500"
                      type="number"
                    />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Free Shipping Available</p>
                      <p className="text-xs text-green-700">
                        Orders above ₹{settings.freeShippingThreshold} get free delivery
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Rural Delivery</p>
                      <p className="text-xs text-orange-700">
                        Additional charges may apply for remote locations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Save Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <div className="bg-white rounded-lg shadow-sm border p-6 w-full max-w-md">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Save Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Changes will take effect immediately
              </p>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current system configuration and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Framework</span>
                    <Badge variant="outline">Django + Next.js</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Database</span>
                    <Badge variant="outline">SQLite</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <Badge variant="default">UPI Direct</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Shipping Partner</span>
                    <Badge variant="secondary">Delhivery</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Target Market</span>
                    <Badge variant="outline">Rural India</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Cost</span>
                    <Badge variant="default">Under ₹700</Badge>
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
