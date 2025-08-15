import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  BookOpen,
  Image,
  Heart,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  UserPlus,
  BarChart3,
  PieChart
} from 'lucide-react';
import { dashboardApi } from '../../services/dashboardApi';
import type { DashboardStats } from '../../services/dashboardApi';


const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeframe]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardStats = await dashboardApi.getDashboardStats(timeframe);
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      // Set empty stats on error to prevent UI crashes
      setStats({
        totalUsers: 0,
        totalEvents: 0,
        totalBlogPosts: 0,
        totalGalleryItems: 0,
        totalDonations: 0,
        totalContacts: 0,
        monthlyGrowth: {
          users: 0,
          events: 0,
          donations: 0,
          contacts: 0
        },
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: stats.monthlyGrowth.users,
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Active Events',
      value: stats.totalEvents.toLocaleString(),
      change: stats.monthlyGrowth.events,
      icon: Calendar,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts.toLocaleString(),
      change: 5.2,
      icon: BookOpen,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Gallery Items',
      value: stats.totalGalleryItems.toLocaleString(),
      change: 8.1,
      icon: Image,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100'
    },
    {
      title: 'Total Donations',
      value: stats.totalDonations.toLocaleString(),
      change: stats.monthlyGrowth.donations,
      icon: Heart,
      color: 'from-red-400 to-red-600',
      bgColor: 'from-red-50 to-red-100'
    },
    {
      title: 'Contact Messages',
      value: stats.totalContacts.toLocaleString(),
      change: stats.monthlyGrowth.contacts,
      icon: MessageCircle,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-100'
    }
  ] : [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <UserPlus className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'donation': return <Heart className="w-4 h-4" />;
      case 'contact': return <MessageCircle className="w-4 h-4" />;
      case 'blog': return <BookOpen className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-600 bg-blue-100';
      case 'event': return 'text-green-600 bg-green-100';
      case 'donation': return 'text-red-600 bg-red-100';
      case 'contact': return 'text-amber-600 bg-amber-100';
      case 'blog': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with Harmony Africa.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-1">Showing cached or default data. Click refresh to try again.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change > 0;
          
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.bgColor} rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-gray-600 text-sm">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Charts Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Activity Overview</h3>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            {/* Placeholder for chart */}
            <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Activity Chart</p>
                <p className="text-sm text-gray-500">Chart implementation coming soon</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Create Event', href: '/admin/events/new', icon: Calendar, color: 'from-green-400 to-green-600' },
                { name: 'New Blog Post', href: '/admin/blog/new', icon: BookOpen, color: 'from-purple-400 to-purple-600' },
                { name: 'Add Gallery', href: '/admin/gallery/new', icon: Image, color: 'from-pink-400 to-pink-600' },
                { name: 'View Messages', href: '/admin/contacts', icon: MessageCircle, color: 'from-amber-400 to-orange-500' }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => window.location.href = action.href}
                    className={`p-4 bg-gradient-to-r ${action.color} text-white rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{action.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          
          <div className="space-y-4">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 mb-1">{activity.message}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-600 mb-1">by {activity.user}</p>
                    )}
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No recent activity</p>
                <p className="text-gray-400 text-xs mt-1">Activity will appear here as users interact with your platform</p>
              </div>
            )}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm text-amber-600 hover:text-amber-700 font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;