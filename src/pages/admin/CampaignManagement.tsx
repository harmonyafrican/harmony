import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Play,
  Pause,
  Copy,
  MoreVertical,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mail
} from 'lucide-react';
import { campaignApi, type Campaign, type CampaignStats } from '../../services/campaignApi';

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const campaignsData = await campaignApi.getAllCampaigns();
      setCampaigns(campaignsData);
      calculateStats(campaignsData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Fall back to empty array if API fails
      setCampaigns([]);
      setStats({
        totalCampaigns: 0,
        draftCampaigns: 0,
        scheduledCampaigns: 0,
        sentCampaigns: 0,
        avgOpenRate: 0,
        avgClickRate: 0,
        totalRecipients: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const calculateStats = (campaignsData: Campaign[]) => {
    const totalCampaigns = campaignsData.length;
    const draftCampaigns = campaignsData.filter(c => c.status === 'draft').length;
    const scheduledCampaigns = campaignsData.filter(c => c.status === 'scheduled').length;
    const sentCampaigns = campaignsData.filter(c => c.status === 'sent').length;
    
    const sentCampaignsWithStats = campaignsData.filter(c => c.status === 'sent' && c.openRate);
    const avgOpenRate = sentCampaignsWithStats.length > 0 
      ? sentCampaignsWithStats.reduce((sum, c) => sum + (c.openRate || 0), 0) / sentCampaignsWithStats.length
      : 0;
    const avgClickRate = sentCampaignsWithStats.length > 0 
      ? sentCampaignsWithStats.reduce((sum, c) => sum + (c.clickRate || 0), 0) / sentCampaignsWithStats.length
      : 0;
    
    const totalRecipients = campaignsData.reduce((sum, c) => sum + (c.recipientCount || 0), 0);

    setStats({
      totalCampaigns,
      draftCampaigns,
      scheduledCampaigns,
      sentCampaigns,
      avgOpenRate,
      avgClickRate,
      totalRecipients
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'sent': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'sent': return <CheckCircle2 className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.template.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || campaign.priority === priorityFilter;
    const matchesTemplate = templateFilter === 'all' || campaign.template === templateFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTemplate;
  });

  const handleSendCampaign = async (campaignId: string) => {
    try {
      setActionLoading(campaignId);
      await campaignApi.sendCampaign(campaignId);
      
      // Refresh campaigns to get updated data
      await fetchCampaigns();
      
      alert('Campaign sent successfully!');
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(campaignId);
      await campaignApi.deleteCampaign(campaignId);
      
      // Refresh campaigns to get updated data
      await fetchCampaigns();
      
      alert('Campaign deleted successfully!');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openCampaignModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignModal(true);
  };

  const statCards = stats ? [
    {
      title: 'Total Campaigns',
      value: stats.totalCampaigns,
      icon: Mail,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Sent Campaigns',
      value: stats.sentCampaigns,
      icon: Send,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Scheduled',
      value: stats.scheduledCampaigns,
      icon: Calendar,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Avg Open Rate',
      value: `${stats.avgOpenRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-100'
    },
    {
      title: 'Avg Click Rate',
      value: `${stats.avgClickRate.toFixed(1)}%`,
      icon: Users,
      color: 'from-pink-400 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100'
    },
    {
      title: 'Total Recipients',
      value: stats.totalRecipients.toLocaleString(),
      icon: Users,
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100'
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
          <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-600 mt-1">Manage email campaigns and track performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/newsletter'}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Plus className="w-5 h-5" />
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

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
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
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Templates</option>
              <option value="default">Default</option>
              <option value="announcement">Announcement</option>
              <option value="impact_report">Impact Report</option>
              <option value="fundraising">Fundraising</option>
              <option value="event_invitation">Event Invitation</option>
              <option value="volunteer_recruitment">Volunteer Recruitment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Campaign</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status & Priority</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Performance</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Recipients</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        {campaign.subject}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {campaign.template.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {campaign.targetAudience.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="capitalize">{campaign.status}</span>
                      </span>
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(campaign.priority)}`}>
                          {campaign.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {campaign.status === 'sent' && campaign.openRate !== undefined ? (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          Open: {campaign.openRate}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Click: {campaign.clickRate}%
                        </div>
                        <div className="text-xs text-gray-500">
                          Delivered: {campaign.deliveredCount}/{campaign.recipientCount}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {campaign.recipientCount?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Created: {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                      {campaign.sentAt && (
                        <div className="text-sm text-gray-600">
                          Sent: {new Date(campaign.sentAt).toLocaleDateString()}
                        </div>
                      )}
                      {campaign.scheduledDate && campaign.status === 'scheduled' && (
                        <div className="text-sm text-blue-600">
                          Scheduled: {new Date(campaign.scheduledDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openCampaignModal(campaign)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {campaign.status === 'draft' && (
                        <button 
                          onClick={() => handleSendCampaign(campaign.id)}
                          disabled={actionLoading === campaign.id}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button 
                        className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        disabled={actionLoading === campaign.id}
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

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || templateFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first campaign to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Campaign Detail Modal */}
      {showCampaignModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Campaign Details</h2>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Campaign Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subject</label>
                      <p className="text-gray-900">{selectedCampaign.subject}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Template</label>
                      <p className="text-gray-900 capitalize">{selectedCampaign.template.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                      <p className="text-gray-900 capitalize">{selectedCampaign.targetAudience.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCampaign.status)}`}>
                        {getStatusIcon(selectedCampaign.status)}
                        <span className="capitalize">{selectedCampaign.status}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedCampaign.priority)}`}>
                        {selectedCampaign.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {selectedCampaign.status === 'sent' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Open Rate:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedCampaign.openRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Click Rate:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedCampaign.clickRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Recipients:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedCampaign.recipientCount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Delivered:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedCampaign.deliveredCount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Campaign Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedCampaign.content }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              {selectedCampaign.status === 'draft' && (
                <button 
                  onClick={() => {
                    handleSendCampaign(selectedCampaign.id);
                    setShowCampaignModal(false);
                  }}
                  className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Send Now
                </button>
              )}
              <button className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors">
                Duplicate Campaign
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300">
                Edit Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagement;