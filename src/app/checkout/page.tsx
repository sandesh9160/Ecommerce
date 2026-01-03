'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useCart } from '@/lib/CartContext';
import { ApiService, UPISettings } from '@/lib/api';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Phone, Mail, CheckCircle, Save } from 'lucide-react';

interface CheckoutForm {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address_type: string;
  apartment_flat: string;
  street: string;
  landmark: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
  full_address: string;
  shipping_address: string; // For backward compatibility
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getItemCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [upiSettings, setUpiSettings] = useState<UPISettings | null>(null);
  const [formData, setFormData] = useState<CheckoutForm>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address_type: 'home',
    apartment_flat: '',
    street: '',
    landmark: '',
    village: '',
    mandal: '',
    district: '',
    state: '',
    pincode: '',
    full_address: '',
    shipping_address: '', // For backward compatibility
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  const subtotal = getTotal();
  const shippingCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingCharge;
  const totalItems = getItemCount();
  const isLoggedIn = ApiService.isLoggedIn();
  const accessToken = ApiService.getAccessToken();

  // Load UPI settings on component mount
  useEffect(() => {
    loadUpiSettings();
  }, []);

  const loadUpiSettings = async () => {
    try {
      const settings = await ApiService.getUPISettings();
      if (settings.length > 0) {
        setUpiSettings(settings[0]); // Use the first active UPI setting
      }
    } catch (error) {
      console.error('Error loading UPI settings:', error);
      // Fallback to default UPI ID
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

  // Generate QR code URL dynamically
  const qrCodeUrl = upiSettings
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiSettings.upi_id}&pn=${upiSettings.merchant_name}&am=${total}&cu=INR`
    : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=YuvaKart&am=${total}&cu=INR`;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.customer_phone.replace(/\s+/g, ''))) {
      newErrors.customer_phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email address';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Shipping address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Generate shipping address from form fields
      const shippingAddress = generateShippingAddress();

      // Save address if user is logged in
      if (isLoggedIn && accessToken) {
        try {
          await ApiService.createAddress({
            address_type: formData.address_type as 'home' | 'work' | 'other',
            apartment_flat: formData.apartment_flat,
            street: formData.street,
            landmark: formData.landmark,
            village: formData.village,
            mandal: formData.mandal,
            district: formData.district,
            state: formData.state,
            pincode: formData.pincode,
            full_address: formData.full_address,
            is_default: false
          }, accessToken);
        } catch (error) {
          console.error('Error saving address:', error);
          // Continue with order creation even if address saving fails
        }
      }

      const orderData = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        shipping_address: shippingAddress,
        total_amount: total,
        shipping_charge: shippingCharge,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const order = await ApiService.createOrder(orderData);

      // Clear cart and redirect to payment page
      clearCart();
      router.push(`/payment/${order.id}`);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateShippingAddress = (): string => {
    // Use full_address if provided, otherwise construct from fields
    if (formData.full_address.trim()) {
      return formData.full_address.trim();
    }

    // Construct address from individual fields
    const addressParts = [];

    if (formData.apartment_flat) {
      addressParts.push(`Flat/Apartment: ${formData.apartment_flat}`);
    }
    if (formData.street) {
      addressParts.push(`Street: ${formData.street}`);
    }
    if (formData.landmark) {
      addressParts.push(`Landmark: ${formData.landmark}`);
    }
    if (formData.village) {
      addressParts.push(`Village: ${formData.village}`);
    }
    if (formData.mandal) {
      addressParts.push(`Mandal: ${formData.mandal}`);
    }
    if (formData.district) {
      addressParts.push(`District: ${formData.district}`);
    }
    if (formData.state) {
      addressParts.push(`State: ${formData.state}`);
    }
    if (formData.pincode) {
      addressParts.push(`Pincode: ${formData.pincode}`);
    }

    return addressParts.join(', ');
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
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
                <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
                <p className="text-muted-foreground mt-1">
                  Complete your order
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/cart">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Order Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={formData.customer_name}
                      onChange={(e) => handleInputChange('customer_name', e.target.value)}
                      placeholder="Enter your full name"
                      className={errors.customer_name ? 'border-red-500' : ''}
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <Input
                      value={formData.customer_phone}
                      onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                      placeholder="Enter your phone number"
                      type="tel"
                      className={errors.customer_phone ? 'border-red-500' : ''}
                    />
                    {errors.customer_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address (Optional)
                    </label>
                    <Input
                      value={formData.customer_email}
                      onChange={(e) => handleInputChange('customer_email', e.target.value)}
                      placeholder="Enter your email address"
                      type="email"
                      className={errors.customer_email ? 'border-red-500' : ''}
                    />
                    {errors.customer_email && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address Type *
                    </label>
                    <select
                      value={formData.address_type || 'home'}
                      onChange={(e) => handleInputChange('address_type', e.target.value)}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Address Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Flat/Apartment No.
                      </label>
                      <Input
                        value={formData.apartment_flat || ''}
                        onChange={(e) => handleInputChange('apartment_flat', e.target.value)}
                        placeholder="e.g. 101, A Block"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Street *
                      </label>
                      <Input
                        value={formData.street || ''}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        placeholder="Street name"
                        className={errors.street ? 'border-red-500' : ''}
                      />
                      {errors.street && (
                        <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Landmark
                      </label>
                      <Input
                        value={formData.landmark || ''}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        placeholder="Near temple, hospital, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Village
                      </label>
                      <Input
                        value={formData.village || ''}
                        onChange={(e) => handleInputChange('village', e.target.value)}
                        placeholder="Village name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mandal
                      </label>
                      <Input
                        value={formData.mandal || ''}
                        onChange={(e) => handleInputChange('mandal', e.target.value)}
                        placeholder="Mandal name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        District *
                      </label>
                      <Input
                        value={formData.district || ''}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="District name"
                        className={errors.district ? 'border-red-500' : ''}
                      />
                      {errors.district && (
                        <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        State *
                      </label>
                      <Input
                        value={formData.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="State name"
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Pincode *
                      </label>
                      <Input
                        value={formData.pincode || ''}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="6-digit pincode"
                        type="text"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        className={errors.pincode ? 'border-red-500' : ''}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>

                  {/* Full Address Summary */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Complete Address Summary *
                    </label>
                    <Textarea
                      value={formData.full_address || ''}
                      onChange={(e) => handleInputChange('full_address', e.target.value)}
                      placeholder="Complete address for delivery"
                      rows={3}
                      className={errors.full_address ? 'border-red-500' : ''}
                    />
                    {errors.full_address && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_address}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Pay securely using UPI (Google Pay, PhonePe, Paytm, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">UPI Payment</p>
                        <p className="text-sm text-blue-700">
                          Secure payment via any UPI app
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary & UPI QR */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × ₹{item.product.price}
                          </p>
                        </div>
                        <p className="font-medium text-sm">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
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

                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UPI QR Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment QR Code
                  </CardTitle>
                  <CardDescription>
                    Scan this QR code after placing your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block mb-4">
                    {/* QR Code Placeholder */}
                    <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-sm text-gray-600">QR Code</p>
                        <p className="text-xs text-gray-500">Will show after order</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>📱 Pay ₹{total.toLocaleString()} using any UPI app</p>
                    <p>📸 Upload payment screenshot to complete order</p>
                    <p>🚚 Free delivery within 3-7 business days</p>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? 'Placing Order...' : `Place Order - ₹${total.toLocaleString()}`}
              </Button>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>✓ No payment gateway fees</p>
                <p>✓ Secure UPI payment</p>
                <p>✓ 7-day return policy</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
