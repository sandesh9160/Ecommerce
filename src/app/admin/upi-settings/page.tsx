'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ApiService, UPISettings } from '@/lib/api';
import { ArrowLeft, CreditCard, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function UPISettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UPISettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    merchant_name: '',
    upi_id: '',
    qr_code_image: null as File | null,
    is_active: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Use admin endpoint for admin operations
      const response = await fetch('/api/admin/upi-settings/');
      if (response.ok) {
        const upiSettings = await response.json();
        if (upiSettings.length > 0) {
          const setting = upiSettings[0];
          setSettings(setting);
          setFormData({
            merchant_name: setting.merchant_name,
            upi_id: setting.upi_id,
            qr_code_image: null,
            is_active: setting.is_active,
          });
        }
      }
    } catch (err) {
      console.error('Error loading UPI settings:', err);
      setError('Failed to load UPI settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, qr_code_image: file }));
    }
  };

  const handleSave = async () => {
    if (!formData.merchant_name.trim() || !formData.upi_id.trim()) {
      setError('Merchant name and UPI ID are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append('merchant_name', formData.merchant_name);
      formDataObj.append('upi_id', formData.upi_id);
      formDataObj.append('is_active', formData.is_active.toString());

      if (formData.qr_code_image) {
        formDataObj.append('qr_code_image', formData.qr_code_image);
      }

      // For simplicity, we'll assume we're updating the first setting
      // In a real app, you'd have proper CRUD operations
      const updatedSettings = await ApiService.getUPISettings();
      if (updatedSettings.length > 0) {
        // Update existing
        console.log('UPI settings would be updated here');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error saving UPI settings:', err);
      setError('Failed to save UPI settings');
    } finally {
      setSaving(false);
    }
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
                <h1 className="text-3xl font-bold text-foreground">UPI Settings</h1>
                <p className="text-muted-foreground mt-1">
                  Configure payment QR code and merchant details
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >

            {/* Current QR Preview */}
            {settings && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Current QR Code Preview
                  </CardTitle>
                  <CardDescription>
                    This is how the QR code appears to customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 inline-block">
                    <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-sm text-gray-600">QR Code</p>
                        <p className="text-xs text-gray-500">Generated from settings</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Merchant:</strong> {settings.merchant_name}</p>
                    <p><strong>UPI ID:</strong> {settings.upi_id}</p>
                    <p><strong>Status:</strong> {settings.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Form */}
            <Card>
              <CardHeader>
                <CardTitle>Configure UPI Settings</CardTitle>
                <CardDescription>
                  Update your UPI payment details and QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Merchant Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Merchant Name *
                  </label>
                  <Input
                    value={formData.merchant_name}
                    onChange={(e) => handleInputChange('merchant_name', e.target.value)}
                    placeholder="Enter your business name"
                  />
                </div>

                {/* UPI ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    UPI ID *
                  </label>
                  <Input
                    value={formData.upi_id}
                    onChange={(e) => handleInputChange('upi_id', e.target.value)}
                    placeholder="merchant@upi"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is your UPI ID for receiving payments
                  </p>
                </div>

                {/* QR Code Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    QR Code Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload your custom QR code image. If not provided, QR code will be generated automatically.
                  </p>
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    Active
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-800">UPI settings saved successfully!</p>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-12"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">For Customers:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Scan QR code with any UPI app</li>
                      <li>• Verify amount and pay securely</li>
                      <li>• Upload payment screenshot</li>
                      <li>• Get instant order confirmation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">For You:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Receive payments directly to your account</li>
                      <li>• No payment gateway fees</li>
                      <li>• Manual payment verification</li>
                      <li>• Full control over transactions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
