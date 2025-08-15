// src/layout/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes
} from 'react-icons/fa';
import Footer from '../components/Footer';
import type { ReactNode } from 'react';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

interface MainLayoutProps {
  children: ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'Events', href: '/events' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  { name: 'Donate', href: '/donate' },
  { name: 'Mission', href: '/mission' },
  { name: 'Impact', href: '/impact' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' }
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Check admin authentication status
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
      setIsAdminLoggedIn(!!(adminToken || isAuthenticated === 'true'));
    };

    checkAdminAuth();
    
    // Listen for storage changes (when admin logs in/out in another tab)
    window.addEventListener('storage', checkAdminAuth);
    return () => window.removeEventListener('storage', checkAdminAuth);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden transform group-hover:scale-105 transition-transform bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-white/20 shadow-lg">
              <img
                src="https://i.postimg.cc/15BBN2MW/harmony-logo.png"
                alt="Harmony Africa Foundation Logo"
                className="w-full h-full object-cover bg-white"
                onError={(e) => {
                  // Fallback to gradient circle with "H" if logo image fails to load
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center';
                    fallback.innerHTML = '<span class="text-white font-bold text-lg lg:text-xl">H</span>';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div className="hidden sm:block">
              <span className={`font-bold text-lg lg:text-xl transition-colors duration-300 ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                Harmony Africa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 xl:space-x-2">
            {(isAdminLoggedIn ? navItems.slice(0, 4) : navItems.slice(0, 8)).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 xl:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                  location.pathname === item.href
                    ? 'text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-md'
                    : scrolled 
                      ? 'text-gray-700 bg-white/90 hover:bg-white border border-gray-200 shadow-sm hover:shadow-md' 
                      : 'text-gray-800 bg-white/90 hover:bg-white border border-white/50 shadow-sm'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* More menu for additional items */}
            <div className="relative group">
              <button 
                className={`px-3 xl:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                  scrolled 
                    ? 'text-gray-700 bg-white/90 hover:bg-white border border-gray-200 shadow-sm hover:shadow-md' 
                    : 'text-gray-800 bg-white/90 hover:bg-white border border-white/50 shadow-sm'
                }`}
              >
                Explore More
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {navItems.slice(8).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAdminLoggedIn && (
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-md bg-gray-800 text-white hover:bg-gray-700 border border-gray-600"
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              to="/donate"
              className="px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors text-gray-900 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-white/20"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-5 py-3 rounded-lg text-base font-semibold transition-all duration-300 transform hover:scale-105 border ${
                    location.pathname === item.href
                      ? 'text-white shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 border-transparent'
                      : 'text-gray-700 bg-gray-50 border-gray-200 hover:shadow-md hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                {isAdminLoggedIn && (
                  <Link
                    to="/admin/dashboard"
                    className="block text-center px-4 py-3 rounded-lg font-semibold text-white bg-gray-800 hover:bg-gray-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/donate"
                  className="block text-center px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check admin authentication status
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
      setIsAdminLoggedIn(!!(adminToken || isAuthenticated === 'true'));
    };

    checkAdminAuth();
    
    // Listen for storage changes (when admin logs in/out in another tab)
    window.addEventListener('storage', checkAdminAuth);
    return () => window.removeEventListener('storage', checkAdminAuth);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      {/* Admin Bar - shows when admin is logged in and viewing public site */}
      {isAdminLoggedIn && (
        <div className="bg-gray-800 text-white py-2 px-4 text-sm flex items-center justify-between fixed top-16 md:top-20 left-0 right-0 z-40 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Admin Mode - Viewing Public Site</span>
          </div>
          <Link 
            to="/admin/dashboard"
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs font-medium transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      )}
      
      <main className={`flex-grow ${isAdminLoggedIn ? 'pt-24 md:pt-28' : 'pt-16 md:pt-20'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;