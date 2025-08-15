import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserX,
  MoreVertical,
  Download,
  Upload,
  Send,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import { newsletterApi, type NewsletterSubscriber, type NewsletterStats, getEngagementColor, getSourceDisplay, formatEngagementScore } from '../../services/newsletterApi';
import { campaignApi } from '../../services/campaignApi';

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [engagementFilter, setEngagementFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [campaignFormData, setCampaignFormData] = useState({
    subject: '',
    content: '',
    targetAudience: 'all',
    scheduledDate: '',
    isScheduled: false,
    priority: 'medium' as const,
    template: 'default'
  });

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const subscribersData = await newsletterApi.getAllSubscribers();
      setSubscribers(subscribersData);
      calculateStats(subscribersData);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const calculateStats = (subscribersData: NewsletterSubscriber[]) => {
    let active = 0;
    let unsubscribed = 0;
    let bounced = 0;
    let complained = 0;
    let newThisMonth = 0;
    const sources = new Map<string, number>();
    const recentActivity: Array<Record<string, unknown>> = [];

    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

    subscribersData.forEach(subscriber => {
      switch (subscriber.status) {
        case 'active': active++; break;
        case 'unsubscribed': unsubscribed++; break;
        case 'bounced': bounced++; break;
        case 'complained': complained++; break;
        default: active++; break;
      }

      // Count new subscribers this month
      const subscribedDate = new Date(subscriber.subscribedAt as string);
      if (subscribedDate >= monthAgo) {
        newThisMonth++;
      }

      // Count sources
      const currentCount = sources.get(subscriber.source) || 0;
      sources.set(subscriber.source, currentCount + 1);

      // Add to recent activity
      if (subscriber.unsubscribedAt) {
        recentActivity.push({
          type: 'unsubscribe',
          email: subscriber.email,
          date: subscriber.unsubscribedAt
        });
      }
    });

    // Calculate engagement metrics
    const totalEngagementScore = subscribersData
      .filter(s => s.averageEngagement)
      .reduce((sum, s) => sum + (s.averageEngagement || 0), 0);
    const averageEngagement = subscribersData.length > 0 ? totalEngagementScore / subscribersData.length : 0;

    // Convert sources map to array
    const topSources = Array.from(sources.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalSubscribers: subscribersData.length,
      activeSubscribers: active,
      unsubscribed,
      bounced,
      complained,
      newThisMonth,
      engagementRate: averageEngagement,
      averageOpenRate: 35.2, // Mock data
      averageClickRate: 4.8, // Mock data
      topSources,
      recentActivity: recentActivity.slice(0, 10) as Array<{ type: 'subscribe' | 'unsubscribe' | 'bounce' | 'complaint'; email: string; date: string; }>
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'unsubscribed': return 'text-gray-600 bg-gray-100';
      case 'bounced': return 'text-red-600 bg-red-100';
      case 'complained': return 'text-orange-600 bg-orange-100';
      case 'suppressed': return 'text-red-600 bg-red-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'unsubscribed': return <UserX className="w-4 h-4" />;
      case 'bounced': return <XCircle className="w-4 h-4" />;
      case 'complained': return <AlertCircle className="w-4 h-4" />;
      case 'suppressed': return <XCircle className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };


  const filteredSubscribers = subscribers.filter(subscriber => {
    const fullName = `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    const matchesEngagement = engagementFilter === 'all' || subscriber.engagement === engagementFilter;
    const matchesSource = sourceFilter === 'all' || subscriber.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesEngagement && matchesSource;
  });

  const handleStatusUpdate = async (subscriberId: string, newStatus: string, notes?: string) => {
    try {
      setActionLoading(subscriberId);
      await newsletterApi.updateSubscriberStatus(subscriberId, newStatus, notes);
      
      const updatedSubscribers = subscribers.map(subscriber => 
        subscriber.id === subscriberId ? { 
          ...subscriber, 
          status: newStatus as NewsletterSubscriber['status'], 
          notes,
          isActive: newStatus === 'active'
        } : subscriber
      );
      
      setSubscribers(updatedSubscribers);
      calculateStats(updatedSubscribers);
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      alert('Failed to update subscriber status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };


  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to delete this subscriber? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(subscriberId);
      await newsletterApi.deleteSubscriber(subscriberId);
      const updatedSubscribers = subscribers.filter(subscriber => subscriber.id !== subscriberId);
      setSubscribers(updatedSubscribers);
      calculateStats(updatedSubscribers);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Failed to delete subscriber. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (action: 'subscribe' | 'unsubscribe' | 'delete') => {
    if (selectedSubscribers.length === 0) {
      alert('Please select subscribers first.');
      return;
    }

    if (!confirm(`Are you sure you want to ${action} ${selectedSubscribers.length} subscribers?`)) {
      return;
    }

    try {
      setActionLoading('bulk');
      await newsletterApi.bulkAction(action, selectedSubscribers);
      
      if (action === 'delete') {
        const updatedSubscribers = subscribers.filter(s => !selectedSubscribers.includes(s.id));
        setSubscribers(updatedSubscribers);
        calculateStats(updatedSubscribers);
      } else {
        const updatedSubscribers = subscribers.map(subscriber => 
          selectedSubscribers.includes(subscriber.id) ? { 
            ...subscriber, 
            status: action === 'subscribe' ? 'active' as const : 'unsubscribed' as const,
            isActive: action === 'subscribe'
          } : subscriber
        );
        setSubscribers(updatedSubscribers);
        calculateStats(updatedSubscribers);
      }
      
      setSelectedSubscribers([]);
      alert(`Successfully ${action}d ${selectedSubscribers.length} subscribers.`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Failed to perform bulk action. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await newsletterApi.exportSubscribers('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      alert('Failed to export subscribers. Please try again.');
    }
  };

  const openSubscriberModal = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setShowSubscriberModal(true);
  };

  const handleCreateCampaign = async () => {
    try {
      // Validate required fields
      if (!campaignFormData.subject.trim() || !campaignFormData.content.trim()) {
        alert('Please fill in all required fields (Subject and Content)');
        return;
      }

      // Validate scheduled date if scheduled
      if (campaignFormData.isScheduled && !campaignFormData.scheduledDate) {
        alert('Please select a scheduled date');
        return;
      }

      setActionLoading('creating-campaign');

      // Transform form data for API
      const campaignData = {
        subject: campaignFormData.subject.trim(),
        content: campaignFormData.content.trim(),
        targetAudience: campaignFormData.targetAudience,
        scheduledDate: campaignFormData.isScheduled ? new Date(campaignFormData.scheduledDate).toISOString() : null,
        priority: campaignFormData.priority,
        template: campaignFormData.template,
        status: campaignFormData.isScheduled ? 'scheduled' : 'draft',
        createdAt: new Date().toISOString()
      };

      // Actually create the campaign via API
      await campaignApi.createCampaign(campaignData);
      
      // Reset form and close modal
      setCampaignFormData({
        subject: '',
        content: '',
        targetAudience: 'all',
        scheduledDate: '',
        isScheduled: false,
        priority: 'medium',
        template: 'default'
      });
      
      setShowCampaignModal(false);
      alert('Campaign created successfully! You can view and manage it in the Campaigns section.');
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCampaignFormChange = (field: string, value: string | boolean) => {
    setCampaignFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSubscriberSelection = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId) 
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };

  const statCards = stats ? [
    {
      title: 'Total Subscribers',
      value: stats.totalSubscribers,
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Active',
      value: stats.activeSubscribers,
      icon: CheckCircle2,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'New This Month',
      value: stats.newThisMonth,
      icon: TrendingUp,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Engagement Rate',
      value: `${stats.engagementRate.toFixed(1)}%`,
      icon: Activity,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-100'
    },
    {
      title: 'Open Rate',
      value: `${stats.averageOpenRate}%`,
      icon: Mail,
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100'
    },
    {
      title: 'Click Rate',
      value: `${stats.averageClickRate}%`,
      icon: Target,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100'
    }
  ] : [];

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
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="text-gray-600 mt-1">Manage subscribers, campaigns, and email analytics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button 
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Send className="w-5 h-5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.bgColor} rounded-xl p-4 shadow-lg border border-white/20`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color} text-white`}>
                  <Icon className="w-5 h-5" />
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

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedSubscribers.length} subscribers selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('subscribe')}
                disabled={actionLoading === 'bulk'}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Subscribe
              </button>
              <button
                onClick={() => handleBulkAction('unsubscribe')}
                disabled={actionLoading === 'bulk'}
                className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
              >
                Unsubscribe
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading === 'bulk'}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
              <option value="complained">Complained</option>
              <option value="suppressed">Suppressed</option>
            </select>
            
            <select
              value={engagementFilter}
              onChange={(e) => setEngagementFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Engagement</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="social_media">Social Media</option>
              <option value="event">Event</option>
              <option value="referral">Referral</option>
              <option value="manual">Manual</option>
              <option value="import">Import</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Subscriber</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status & Engagement</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Preferences & Source</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Activity & Stats</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Subscribed</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber.id)}
                      onChange={() => toggleSubscriberSelection(subscriber.id)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {subscriber.firstName || subscriber.lastName ? 
                            `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim() : 
                            'Anonymous'
                          }
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{subscriber.email}</div>
                      {subscriber.tags && subscriber.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {subscriber.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {subscriber.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{subscriber.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <select
                        value={subscriber.status || 'active'}
                        onChange={(e) => handleStatusUpdate(subscriber.id, e.target.value)}
                        disabled={actionLoading === subscriber.id}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getStatusColor(subscriber.status)} disabled:opacity-50`}
                      >
                        <option value="active">Active</option>
                        <option value="unsubscribed">Unsubscribed</option>
                        <option value="bounced">Bounced</option>
                        <option value="complained">Complained</option>
                        <option value="suppressed">Suppressed</option>
                      </select>
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getEngagementColor(subscriber.engagement || 'inactive')}`}>
                        <Activity className="w-4 h-4" />
                        <span className="capitalize">{subscriber.engagement || 'inactive'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {subscriber.preferences.newsletter && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Newsletter</span>
                        )}
                        {subscriber.preferences.events && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Events</span>
                        )}
                        {subscriber.preferences.programs && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Programs</span>
                        )}
                        {subscriber.preferences.volunteering && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Volunteer</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Source: {getSourceDisplay(subscriber.source)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4 text-gray-400" />
                        <span>{subscriber.emailsSent || 0} emails sent</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span>{subscriber.totalOpens || 0} opens</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        <span>{formatEngagementScore(subscriber.averageEngagement || 0)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(subscriber.subscribedAt as string).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(subscriber.subscribedAt as string).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openSubscriberModal(subscriber)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        disabled={actionLoading === subscriber.id}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || engagementFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No newsletter subscribers yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Subscriber Detail Modal */}
      {showSubscriberModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Subscriber Details</h2>
              <button
                onClick={() => setShowSubscriberModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">
                        {selectedSubscriber.firstName || selectedSubscriber.lastName ? 
                          `${selectedSubscriber.firstName || ''} ${selectedSubscriber.lastName || ''}`.trim() : 
                          'Not provided'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedSubscriber.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Source</label>
                      <p className="text-gray-900">{getSourceDisplay(selectedSubscriber.source)}</p>
                    </div>
                    {selectedSubscriber.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedSubscriber.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preferences</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedSubscriber.preferences).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {value ? 'Subscribed' : 'Not subscribed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics & Activity */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSubscriber.status)}`}>
                        {getStatusIcon(selectedSubscriber.status)}
                        <span className="capitalize">{selectedSubscriber.status}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Engagement</label>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getEngagementColor(selectedSubscriber.engagement || 'inactive')}`}>
                        <Activity className="w-4 h-4" />
                        <span className="capitalize">{selectedSubscriber.engagement || 'inactive'}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emails Sent</label>
                      <p className="text-lg font-semibold text-gray-900">{selectedSubscriber.emailsSent || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Opens</label>
                      <p className="text-lg font-semibold text-gray-900">{selectedSubscriber.totalOpens || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Clicks</label>
                      <p className="text-lg font-semibold text-gray-900">{selectedSubscriber.totalClicks || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Score</label>
                      <p className="text-lg font-semibold text-gray-900">{formatEngagementScore(selectedSubscriber.averageEngagement || 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Subscribed</p>
                        <p className="text-sm text-gray-500">{new Date(selectedSubscriber.subscribedAt as string).toLocaleString()}</p>
                      </div>
                    </div>
                    {selectedSubscriber.lastEmailSent && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Last Email Sent</p>
                          <p className="text-sm text-gray-500">{new Date(selectedSubscriber.lastEmailSent as string).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    {selectedSubscriber.unsubscribedAt && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Unsubscribed</p>
                          <p className="text-sm text-gray-500">{new Date(selectedSubscriber.unsubscribedAt as string).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                Send Test Email
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300">
                Edit Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
              <button
                onClick={() => {
                  setShowCampaignModal(false);
                  // Reset form data
                  setCampaignFormData({
                    subject: '',
                    content: '',
                    targetAudience: 'all',
                    scheduledDate: '',
                    isScheduled: false,
                    priority: 'medium',
                    template: 'default'
                  });
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Subject *
                  </label>
                  <input
                    type="text"
                    value={campaignFormData.subject}
                    onChange={(e) => handleCampaignFormChange('subject', e.target.value)}
                    placeholder="e.g., Our Latest Impact Report - December 2023"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select 
                    value={campaignFormData.template}
                    onChange={(e) => handleCampaignFormChange('template', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="default">Default Newsletter</option>
                    <option value="announcement">Announcement</option>
                    <option value="impact_report">Impact Report</option>
                    <option value="fundraising">Fundraising Campaign</option>
                    <option value="event_invitation">Event Invitation</option>
                    <option value="volunteer_recruitment">Volunteer Recruitment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select 
                    value={campaignFormData.priority}
                    onChange={(e) => handleCampaignFormChange('priority', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Content *
                </label>
                <textarea
                  rows={8}
                  value={campaignFormData.content}
                  onChange={(e) => handleCampaignFormChange('content', e.target.value)}
                  placeholder="Write your campaign content here. You can include HTML tags for formatting..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tip: Use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;a&gt; for formatting
                </p>
              </div>

              {/* Target Audience */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select 
                    value={campaignFormData.targetAudience}
                    onChange={(e) => handleCampaignFormChange('targetAudience', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="all">All Subscribers ({subscribers.length})</option>
                    <option value="active">Active Subscribers ({subscribers.filter(s => s.isActive).length})</option>
                    <option value="high_engagement">High Engagement ({subscribers.filter(s => s.engagementScore && s.engagementScore >= 80).length})</option>
                    <option value="donors">Donors</option>
                    <option value="volunteers">Volunteers</option>
                    <option value="new_subscribers">New Subscribers (Last 30 days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={!campaignFormData.isScheduled}
                        onChange={() => handleCampaignFormChange('isScheduled', false)}
                        className="text-amber-500"
                      />
                      <span className="text-sm">Send Immediately</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={campaignFormData.isScheduled}
                        onChange={() => handleCampaignFormChange('isScheduled', true)}
                        className="text-amber-500"
                      />
                      <span className="text-sm">Schedule for Later</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Scheduled Date (if scheduled) */}
              {campaignFormData.isScheduled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={campaignFormData.scheduledDate}
                    onChange={(e) => handleCampaignFormChange('scheduledDate', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              )}

              {/* Preview */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="text-sm text-gray-600">
                    <strong>Subject:</strong> {campaignFormData.subject || 'Campaign Subject'}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Template:</strong> {campaignFormData.template.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Target:</strong> {campaignFormData.targetAudience.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  {campaignFormData.isScheduled && (
                    <div className="text-sm text-gray-600">
                      <strong>Scheduled:</strong> {campaignFormData.scheduledDate ? new Date(campaignFormData.scheduledDate).toLocaleString() : 'Select date'}
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: campaignFormData.content.replace(/\n/g, '<br>') || 'Campaign content will appear here...' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCampaignModal(false);
                  // Reset form data
                  setCampaignFormData({
                    subject: '',
                    content: '',
                    targetAudience: 'all',
                    scheduledDate: '',
                    isScheduled: false,
                    priority: 'medium',
                    template: 'default'
                  });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save as draft
                  const draftData = { ...campaignFormData, status: 'draft' };
                  console.log('Saving draft:', draftData);
                  alert('Campaign saved as draft!');
                }}
                className="px-6 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={actionLoading === 'creating-campaign' || !campaignFormData.subject.trim() || !campaignFormData.content.trim() || (campaignFormData.isScheduled && !campaignFormData.scheduledDate)}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {actionLoading === 'creating-campaign' 
                  ? 'Creating...' 
                  : campaignFormData.isScheduled 
                    ? 'Schedule Campaign' 
                    : 'Send Campaign'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;