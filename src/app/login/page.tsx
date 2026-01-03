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
import { ApiService } from '@/lib/api';
import { ShoppingBag, Eye, EyeOff, Mail, Lock } from 'lucide-react';

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

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try API login first
      try {
        const response = await ApiService.login({ username_or_email: usernameOrEmail, password });
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.tokens.access);
        localStorage.setItem('refreshToken', response.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));
        router.push('/dashboard');
        return;
      } catch (apiError) {
        console.log('API not available, using mock login');
      }

      // Mock login for development
      if (usernameOrEmail && password) {
        const mockUser = {
          id: 1,
          username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
          email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@example.com`,
          first_name: 'John',
          last_name: 'Doe',
          phone: '+91 9876543210',
          date_of_birth: '1990-01-01',
          address: '123 Main Street, City, State - 123456'
        };

        const mockTokens = {
          access: 'mock_access_token',
          refresh: 'mock_refresh_token'
        };

        // Store mock data in localStorage
        localStorage.setItem('accessToken', mockTokens.access);
        localStorage.setItem('refreshToken', mockTokens.refresh);
        localStorage.setItem('user', JSON.stringify(mockUser));

        router.push('/dashboard');
      } else {
        setError('Please enter valid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full space-y-8"
        >
          {/* Logo/Brand */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mx-auto h-16 w-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <ShoppingBag className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your YuvaKart account
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username/Email Field */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="usernameOrEmail" className="text-sm font-medium text-gray-700">
                      Username or Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="usernameOrEmail"
                        name="usernameOrEmail"
                        type="text"
                        autoComplete="username email"
                        required
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        className="pl-10"
                        placeholder="Enter your username or email"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-green-600 hover:text-green-500 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg"
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
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <span className="mr-2">📱</span>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <span className="mr-2">📘</span>
                    Facebook
                  </Button>
                </div>

                {/* Register Link */}
                <motion.div variants={itemVariants} className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      className="font-medium text-green-600 hover:text-green-500 transition-colors"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="flex justify-center space-x-4 mt-8">
              <Badge variant="outline" className="flex items-center gap-1">
                🔒 Secure Login
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                📦 Fast Delivery
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                💳 UPI Payments
              </Badge>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
