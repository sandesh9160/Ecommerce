'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiService, UPISettings } from '@/lib/api';
import { ArrowLeft, Upload, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [upiSettings, setUpiSettings] = useState<UPISettings | null>(null);

  // Load UPI settings and order details
  useEffect(() => {
    loadUpiSettings();
    loadOrder();
  }, [orderId]);

  const loadUpiSettings = async () => {
    try {
      const settings = await ApiService.getUPISettings();
      if (settings.length > 0) {
        setUpiSettings(settings[0]);
      }
    } catch (error) {
      console.error('Error loading UPI settings:', error);
      // Fallback settings
      setUpiSettings({
        id: 1,
        merchant_name: 'YuvaKart',
        upi_id: 'merchant@upi',
        qr_code_image: null,
        is_active: true,
        created_at: '',
        updated_at: ''
      });
    }
  };

  // UPI QR Code generation
  const qrCodeUrl = order && upiSettings
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${upiSettings.upi_id}&pn=${upiSettings.merchant_name}&am=${order.total_amount}&cu=INR`
    : '';

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      // For now, we'll assume the order was just created and show the payment form
      // In a real app, you'd fetch the order details
      setOrder({
        id: parseInt(orderId),
        total_amount: 0, // This would come from the order
        customer_name: '',
        customer_phone: '',
        shipping_address: '',
      });
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (screenshot of payment)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setPaymentProof(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!paymentProof) {
      setError('Please select a payment screenshot');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', paymentProof);
      if (utrNumber.trim()) {
        formData.append('utr_number', utrNumber.trim());
      }

      await ApiService.uploadPaymentProof(parseInt(orderId), formData);

      setSuccess(true);

      // Redirect to order success page after a delay
      setTimeout(() => {
        router.push(`/order-success/${orderId}`);
      }, 2000);

    } catch (err) {
      console.error('Error uploading payment proof:', err);
      setError('Failed to upload payment proof. Please try again.');
    } finally {
      setUploading(false);
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

  if (success) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Payment Proof Uploaded!
              </h1>
              <p className="text-muted-foreground mb-8">
                Your payment proof has been submitted successfully. Our team will verify it within 24 hours.
                You will receive order updates via WhatsApp.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1 text-left">
                    <li>✓ Payment verification (within 24 hours)</li>
                    <li>✓ Order confirmation via WhatsApp</li>
                    <li>✓ Shipment preparation</li>
                    <li>✓ Tracking information</li>
                  </ul>
                </div>
                <Button asChild size="lg">
                  <Link href={`/order-tracking/${orderId}`}>
                    Track Your Order
                  </Link>
                </Button>
              </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Complete Payment</h1>
                <p className="text-muted-foreground mt-1">
                  Order #{orderId} - Pay securely via UPI
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* UPI Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >

              {/* Payment Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">How to Pay:</h3>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                      <li>Scan the QR code on the right</li>
                      <li>Verify the amount and pay</li>
                      <li>Take a screenshot of the payment confirmation</li>
                      <li>Upload the screenshot below</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-900">Secure & No Fees</h4>
                        <p className="text-sm text-green-800">
                          Direct UPI payment with zero transaction fees. Your money goes directly to the merchant.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UPI QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Scan to Pay</CardTitle>
                  <CardDescription>
                    Pay ₹{order?.total_amount?.toLocaleString() || '0'} using any UPI app
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 inline-block mb-4">
                    <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="UPI Payment QR Code"
                          className="w-full h-full rounded"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-6xl mb-4">📱</div>
                          <p className="text-sm text-gray-600">Loading QR Code...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>UPI ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{upiSettings?.upi_id || 'merchant@upi'}</span></p>
                    <p>Amount: <span className="font-semibold">₹{order?.total_amount?.toLocaleString() || '0'}</span></p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upload Payment Proof */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >

              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Payment Proof
                  </CardTitle>
                  <CardDescription>
                    Upload a screenshot of your payment confirmation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="payment-proof"
                    />
                    <label htmlFor="payment-proof" className="cursor-pointer">
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {paymentProof ? paymentProof.name : 'Click to upload payment screenshot'}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG up to 5MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* UTR Number (Optional) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      UTR/Transaction ID (Optional)
                    </label>
                    <Input
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Enter UTR number from payment app"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This helps us verify your payment faster
                    </p>
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

                  {/* Upload Button */}
                  <Button
                    onClick={handleUpload}
                    disabled={!paymentProof || uploading}
                    className="w-full h-12"
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Payment Proof
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono">#{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-semibold">₹{order?.total_amount?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>UPI</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <p>📞 <strong>Payment Issues:</strong> Contact us at +91-XXXXXXXXXX</p>
                    <p>💬 <strong>WhatsApp:</strong> Send us your order details</p>
                    <p>📧 <strong>Email:</strong> support@yuvakart.com</p>
                  </div>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
