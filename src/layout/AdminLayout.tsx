import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { contactApi } from '../services/contactApi';
import { donationsApi } from '../services/donationsApi';
import { blogApi } from '../services/blogApi';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Image,
  Heart,
  MessageCircle,
  Mail,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Home,
  BarChart3,
  FileText,
  Send
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator';
  avatar?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'donation' | 'contact' | 'event' | 'blog' | 'volunteer';
  data?: unknown;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser] = useState<AdminUser>({
    id: '1',
    name: 'Admin',
    email: 'admin@harmonyafrica.org',
    role: 'admin',
    avatar: 'https://i.postimg.cc/qRvy86nf/Screenshot-2025-06-30-at-16-16-58.png'
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to safely parse dates
  const parseDate = (dateValue: string | { _seconds: number; _nanoseconds: number }): Date => {
    if (typeof dateValue === 'string') {
      return new Date(dateValue);
    } else if (dateValue && '_seconds' in dateValue) {
      return new Date(dateValue._seconds * 1000);
    }
    return new Date();
  };

  // Fetch real notifications from APIs
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const notifications: Notification[] = [];

      // Fetch recent data from different APIs
      const [contacts, donations, blogs] = await Promise.allSettled([
        contactApi.getAllContactSubmissions(),
        donationsApi.getAllDonations(),
        blogApi.getAllBlogPosts()
      ]);

      // Process recent donations (last 3)
      if (donations.status === 'fulfilled') {
        donations.value
          .sort((a, b) => parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime())
          .slice(0, 3)
          .forEach(donation => {
            notifications.push({
              id: `donation-${donation.id}`,
              title: 'New donation received',
              message: donation.isAnonymous 
                ? `Anonymous donation of $${donation.amount}` 
                : `${donation.donorName} donated $${donation.amount}`,
              time: getRelativeTime(parseDate(donation.createdAt)),
              read: false,
              type: 'donation',
              data: donation
            });
          });
      }

      // Process recent contacts (last 2)
      if (contacts.status === 'fulfilled') {
        contacts.value
          .sort((a, b) => parseDate(b.createdAt || '').getTime() - parseDate(a.createdAt || '').getTime())
          .slice(0, 2)
          .forEach(contact => {
            notifications.push({
              id: `contact-${contact.id}`,
              title: 'New contact submission',
              message: `${contact.name}: ${contact.subject}`,
              time: getRelativeTime(parseDate(contact.createdAt || '')),
              read: false,
              type: 'contact',
              data: contact
            });
          });
      }

      // Process recent blog posts (last 1)
      if (blogs.status === 'fulfilled') {
        blogs.value
          .filter(blog => blog.isPublished)
          .sort((a, b) => parseDate(b.publishedAt).getTime() - parseDate(a.publishedAt).getTime())
          .slice(0, 1)
          .forEach(blog => {
            notifications.push({
              id: `blog-${blog.id}`,
              title: 'New blog post published',
              message: `"${blog.title}" has been published`,
              time: getRelativeTime(parseDate(blog.publishedAt)),
              read: false,
              type: 'blog',
              data: blog
            });
          });
      }

      // Sort all notifications by time (most recent first)
      const sortedNotifications = notifications.sort((a, b) => {
        const timeA = parseRelativeTime(a.time);
        const timeB = parseRelativeTime(b.time);
        return timeA - timeB;
      }).slice(0, 10); // Limit to 10 most recent

      setNotificationList(sortedNotifications);
      setNotifications(sortedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Set empty notifications on error
      setNotificationList([]);
      setNotifications(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to get relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  // Helper function to parse relative time for sorting
  const parseRelativeTime = (timeStr: string): number => {
    if (timeStr === 'Just now') return 0;
    const match = timeStr.match(/(\d+)\s+(minute|hour|day)/);
    if (!match) return 9999;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'minute': return value;
      case 'hour': return value * 60;
      case 'day': return value * 60 * 24;
      default: return 9999;
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    // Refresh notifications when opened
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const handleNotificationItemClick = (notification: Notification) => {
    // Navigate to relevant page based on notification type
    switch (notification.type) {
      case 'donation':
        navigate('/admin/donations');
        break;
      case 'contact':
        navigate('/admin/contacts');
        break;
      case 'event':
        navigate('/admin/events');
        break;
      case 'blog':
        navigate('/admin/blog');
        break;
      case 'volunteer':
        navigate('/admin/volunteers');
        break;
      default:
        navigate('/admin/dashboard');
    }
    setShowNotifications(false);
  };

  // Load initial notifications
  useEffect(() => {
    fetchNotifications();
    
    // Set up periodic refresh every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Check if user is authenticated (placeholder - implement real auth)
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && !location.pathname.includes('/admin/login')) {
      navigate('/admin/login');
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const sidebarItems = [
    {
      group: 'Main',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ]
    },
    {
      group: 'Content Management',
      items: [
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
        { name: 'Gallery', href: '/admin/gallery', icon: Image },
        { name: 'Programs', href: '/admin/programs', icon: FileText },
      ]
    },
    {
      group: 'User Management',
      items: [
        { name: 'Contacts', href: '/admin/contacts', icon: MessageCircle },
        { name: 'Volunteers', href: '/admin/volunteers', icon: UserCheck },
        { name: 'Donations', href: '/admin/donations', icon: Heart },
        { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
        { name: 'Campaigns', href: '/admin/campaigns', icon: Send },
      ]
    },
    {
      group: 'System',
      items: [
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const isActiveRoute = (href: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HA</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-6">
          {sidebarItems.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {group.group}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(item.href, item.exact);
                  
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg text-sm font-medium hover:from-amber-100 hover:to-orange-100 transition-all duration-200 border border-amber-200 shadow-sm hover:shadow-md"
          >
            <Home className="w-5 h-5" />
            <span>View Website</span>
            <div className="ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-200 w-full border border-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative notification-dropdown">
              <button 
                onClick={handleNotificationClick}
                className="relative p-2 text-gray-500 hover:text-gray-700 rounded-md transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    <button
                      onClick={fetchNotifications}
                      disabled={loading}
                      className="text-xs text-amber-600 hover:text-amber-700 disabled:opacity-50"
                    >
                      Refresh
                    </button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-500">Loading notifications...</p>
                      </div>
                    ) : notificationList.length > 0 ? (
                      notificationList.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationItemClick(notification)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-800 mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm font-medium mb-1">No new notifications</p>
                        <p className="text-xs">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        navigate('/admin/notifications');
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin User */}
            <div className="flex items-center space-x-3">
              <img
                src={adminUser.avatar}
                alt={adminUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-sm">
                <div className="font-medium text-gray-800">{adminUser.name}</div>
                <div className="text-gray-500 text-xs capitalize">{adminUser.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;