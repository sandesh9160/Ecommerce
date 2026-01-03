'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiService } from '@/lib/api';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

// Make the entire component client-only to prevent hydration mismatches
export default function AdminLoginPage() {
  // All hooks must be called in the same order on every render
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state while client-side hydration completes
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.login({
        username_or_email: formData.username.trim(),
        password: formData.password.trim()
      });

      // Check if user is admin/staff
      if (!response.user.is_staff && !response.user.is_superuser) {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      // Store tokens and user data
      localStorage.setItem('accessToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect to admin dashboard
      router.push('/admin/dashboard');

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials or server error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />

          <CardHeader className="text-center pb-2 pt-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-gray-400">
              Secure authentication for administrators
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'username' ? 'text-purple-400' : 'text-gray-500'}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter admin username"
                    disabled={loading}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-200 h-11"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === 'password' ? 'text-purple-400' : 'text-gray-500'}`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter secure password"
                    disabled={loading}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-200 h-11"
                  />
                </div>
              </div>

              <div className="h-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </motion.div>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-6 shadow-lg shadow-purple-900/20 border-0"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Login to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <div className="bg-black/20 p-4 text-center">
            <p className="text-xs text-gray-500">
              Restricted Area • Authorized Personnel Only
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
