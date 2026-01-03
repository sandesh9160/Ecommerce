'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ApiService, User } from '@/lib/api';
import { useCart } from '@/lib/CartContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const isHomePage = pathname === '/';
  const isDashboard = pathname === '/dashboard';
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  useEffect(() => {
    // Mark as client-side to prevent hydration mismatch
    setIsClient(true);

    // Check if user is logged in on component mount
    const currentUser = ApiService.getCurrentUser();
    setUser(currentUser);

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      const updatedUser = ApiService.getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    ApiService.logout();
    setUser(null);
    setShowUserMenu(false);
    router.push('/');
  };

  // Only check login status on client side to prevent hydration mismatch
  const isLoggedIn = isClient ? ApiService.isLoggedIn() : false;
  const cartItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600">YuvaKart</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium ml-6">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Categories
          </Link>
          {!isLoggedIn && (
            <>
              <Link
                href="/reviews"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Reviews
              </Link>
              <Link
                href="/faq"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                FAQ
              </Link>
            </>
          )}
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/contact"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Cart Icon (only for logged-in users, non-admin pages) */}
          {isLoggedIn && !isAdminPage && !isAuthPage && (
            <Link href="/cart" className="relative p-2 rounded-md hover:bg-accent transition-colors">
              <svg className="w-5 h-5 text-foreground/60 hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 002 2h-2a2 2 0 01-2-2v-3" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart ({cartItemCount} items)</span>
            </Link>
          )}

          {/* User Menu or Auth Links */}
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.first_name?.[0] || user.username?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.first_name || user.username}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard?tab=orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/dashboard?tab=profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile Settings
                  </Link>
                  {user.username === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            !isAuthPage && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
