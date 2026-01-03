'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ShoppingBag, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual forgot password API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful password reset request
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md w-full space-y-8"
          >
            {/* Success State */}
            <motion.div variants={itemVariants} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto h-20 w-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
              <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                <CardContent className="pt-6">
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-gray-700">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={() => setSuccess(false)}
                        variant="outline"
                        className="w-full"
                      >
                        Try different email
                      </Button>
                      <Button
                        onClick={() => router.push('/login')}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        Back to Login
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full space-y-8"
        >
          {/* Header with Back Button */}
          <motion.div variants={itemVariants}>
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </motion.div>

          {/* Logo/Brand */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mx-auto h-16 w-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <ShoppingBag className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </motion.div>

          {/* Reset Form */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
                <CardDescription className="text-center">
                  No worries, we'll help you get back in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/70 backdrop-blur-sm border-white/20"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      We'll send a reset link to this email
                    </p>
                  </motion.div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center bg-red-50/80 backdrop-blur-sm p-3 rounded-lg border border-red-200/50"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        </motion.div>
                      ) : null}
                      {isLoading ? 'Sending reset link...' : 'Send reset link'}
                    </Button>
                  </motion.div>
                </form>

                {/* Additional Help */}
                <motion.div variants={itemVariants} className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link
                      href="/login"
                      className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500">
                    For security reasons, password reset links expire after 24 hours
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="flex justify-center flex-wrap gap-2 mt-8">
              <Badge variant="outline" className="flex items-center gap-1 bg-white/50 backdrop-blur-sm">
                🔐 Secure Reset
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 bg-white/50 backdrop-blur-sm">
                📧 Email Delivery
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 bg-white/50 backdrop-blur-sm">
                ⏰ 24h Validity
              </Badge>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
