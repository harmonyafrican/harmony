import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  DollarSign,
  CreditCard,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Flag,
  MoreVertical,
  Download,
  Receipt,
  Heart,
  Repeat,
  Shield,
  FileText,
  Send,
  Ban,
  Gift
} from 'lucide-react';
import { donationsApi, type Donation, type DonationStats, formatCurrency, getPaymentMethodDisplay, getDonationTypeDisplay } from '../../services/donationsApi';

const DonationsManagement = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      const donationsData = await donationsApi.getAllDonations();
      setDonations(donationsData);
      calculateStats(donationsData);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const calculateStats = (donationsData: Donation[]) => {
    let completed = 0;
    let pending = 0;
    let failed = 0;
    let refunded = 0;
    let totalAmount = 0;
    let recurringDonations = 0;
    const uniqueDonors = new Set<string>();

    donationsData.forEach(donation => {
      switch (donation.paymentStatus) {
        case 'completed': 
          completed++; 
          totalAmount += donation.amount;
          break;
        case 'pending': pending++; break;
        case 'failed': failed++; break;
        case 'refunded': refunded++; break;
        default: pending++; break;
      }

      if (donation.isRecurring) {
        recurringDonations++;
      }

      if (!donation.isAnonymous) {
        uniqueDonors.add(donation.email);
      }
    });

    const recentDonations = donationsData
      .filter(d => d.paymentStatus === 'completed')
      .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
      .slice(0, 5)
      .map(d => ({
        amount: d.amount,
        donorName: d.isAnonymous ? 'Anonymous' : d.donorName,
        date: d.createdAt as string,
        isAnonymous: d.isAnonymous
      }));

    setStats({
      total: donationsData.length,
      completed,
      pending,
      failed,
      refunded,
      totalAmount,
      averageAmount: completed > 0 ? totalAmount / completed : 0,
      recurringDonations,
      totalDonors: uniqueDonors.size,
      recentDonations
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <RefreshCw className="w-4 h-4" />;
      case 'cancelled': return <Ban className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      general: <Heart className="w-4 h-4" />,
      program: <Gift className="w-4 h-4" />,
      emergency: <AlertCircle className="w-4 h-4" />,
      scholarship: <FileText className="w-4 h-4" />,
      infrastructure: <Shield className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || icons.general;
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.programTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || donation.paymentStatus === statusFilter;
    const matchesType = typeFilter === 'all' || donation.donationType === typeFilter;
    const matchesPriority = priorityFilter === 'all' || donation.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const handleStatusUpdate = async (donationId: string, newStatus: string, notes?: string) => {
    try {
      setActionLoading(donationId);
      await donationsApi.updateDonationStatus(donationId, newStatus, notes);
      
      const updatedDonations = donations.map(donation => 
        donation.id === donationId ? { ...donation, paymentStatus: newStatus as Donation['paymentStatus'], notes } : donation
      );
      
      setDonations(updatedDonations);
      calculateStats(updatedDonations);
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('Failed to update donation status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePriorityUpdate = async (donationId: string, newPriority: string) => {
    try {
      setActionLoading(donationId);
      await donationsApi.updateDonationPriority(donationId, newPriority);
      
      const updatedDonations = donations.map(donation => 
        donation.id === donationId ? { ...donation, priority: newPriority as Donation['priority'] } : donation
      );
      
      setDonations(updatedDonations);
    } catch (error) {
      console.error('Error updating donation priority:', error);
      alert('Failed to update donation priority. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefund = async (donationId: string) => {
    const reason = prompt('Please enter refund reason:');
    if (!reason) return;

    if (!confirm('Are you sure you want to refund this donation? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(donationId);
      await donationsApi.refundDonation(donationId, reason);
      const updatedDonations = donations.map(donation => 
        donation.id === donationId ? { 
          ...donation, 
          paymentStatus: 'refunded' as const, 
          refundReason: reason,
          refundDate: new Date().toISOString()
        } : donation
      );
      setDonations(updatedDonations);
      calculateStats(updatedDonations);
    } catch (error) {
      console.error('Error refunding donation:', error);
      alert('Failed to refund donation. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDonation = async (donationId: string) => {
    if (!confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(donationId);
      await donationsApi.deleteDonation(donationId);
      const updatedDonations = donations.filter(donation => donation.id !== donationId);
      setDonations(updatedDonations);
      calculateStats(updatedDonations);
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Failed to delete donation. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendReceipt = async (donationId: string) => {
    try {
      setActionLoading(donationId);
      await donationsApi.sendReceipt(donationId);
      const updatedDonations = donations.map(donation => 
        donation.id === donationId ? { ...donation, receiptSent: true } : donation
      );
      setDonations(updatedDonations);
      alert('Receipt sent successfully!');
    } catch (error) {
      console.error('Error sending receipt:', error);
      alert('Failed to send receipt. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendThankYou = async (donationId: string) => {
    try {
      setActionLoading(donationId);
      await donationsApi.sendThankYou(donationId);
      const updatedDonations = donations.map(donation => 
        donation.id === donationId ? { ...donation, thankYouSent: true } : donation
      );
      setDonations(updatedDonations);
      alert('Thank you message sent successfully!');
    } catch (error) {
      console.error('Error sending thank you:', error);
      alert('Failed to send thank you message. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openDonationModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowDonationModal(true);
  };

  const statCards = stats ? [
    {
      title: 'Total Donations',
      value: stats.total,
      icon: Gift,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Total Raised',
      value: formatCurrency(stats.totalAmount),
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      title: 'Average Donation',
      value: formatCurrency(stats.averageAmount),
      icon: TrendingUp,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-100'
    },
    {
      title: 'Unique Donors',
      value: stats.totalDonors,
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Recurring',
      value: stats.recurringDonations,
      icon: Repeat,
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
          <h1 className="text-3xl font-bold text-gray-900">Donations Management</h1>
          <p className="text-gray-600 mt-1">Manage donations, process payments, and track fundraising</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg">
            <DollarSign className="w-5 h-5" />
            <span>Manual Entry</span>
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
              placeholder="Search donations..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="program">Program</option>
              <option value="emergency">Emergency</option>
              <option value="scholarship">Scholarship</option>
              <option value="infrastructure">Infrastructure</option>
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
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Donor</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Amount & Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Type & Method</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Priority & Flags</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Date & Time</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}
                        </span>
                      </div>
                      {!donation.isAnonymous && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{donation.email}</span>
                          </div>
                          {donation.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{donation.phone}</span>
                            </div>
                          )}
                        </>
                      )}
                      {donation.programTitle && (
                        <div className="text-sm text-blue-600">{donation.programTitle}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(donation.amount, donation.currency)}
                      </div>
                      <select
                        value={donation.paymentStatus}
                        onChange={(e) => handleStatusUpdate(donation.id, e.target.value)}
                        disabled={actionLoading === donation.id}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getStatusColor(donation.paymentStatus)} disabled:opacity-50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {donation.netAmount && (
                        <div className="text-sm text-gray-500">
                          Net: {formatCurrency(donation.netAmount, donation.currency)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(donation.donationType)}
                        <span className="text-sm text-gray-900 capitalize">
                          {getDonationTypeDisplay(donation.donationType)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {getPaymentMethodDisplay(donation.paymentMethod)}
                        </span>
                      </div>
                      {donation.isRecurring && (
                        <div className="flex items-center space-x-2">
                          <Repeat className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-600">
                            {donation.recurringFrequency}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <select
                        value={donation.priority || 'medium'}
                        onChange={(e) => handlePriorityUpdate(donation.id, e.target.value)}
                        disabled={actionLoading === donation.id}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getPriorityColor(donation.priority)} disabled:opacity-50`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <div className="flex flex-wrap gap-1">
                        {donation.taxDeductible && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Tax Deductible
                          </span>
                        )}
                        {donation.receiptSent && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Receipt Sent
                          </span>
                        )}
                        {donation.thankYouSent && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Thanked
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(donation.createdAt as string).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(donation.createdAt as string).toLocaleTimeString()}
                        </span>
                      </div>
                      {donation.transactionId && (
                        <div className="text-xs text-gray-500">
                          ID: {donation.transactionId}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openDonationModal(donation)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!donation.receiptSent && donation.paymentStatus === 'completed' && (
                        <button
                          onClick={() => handleSendReceipt(donation.id)}
                          disabled={actionLoading === donation.id}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      )}
                      {!donation.thankYouSent && donation.paymentStatus === 'completed' && (
                        <button
                          onClick={() => handleSendThankYou(donation.id)}
                          disabled={actionLoading === donation.id}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {donation.paymentStatus === 'completed' && (
                        <button
                          onClick={() => handleRefund(donation.id)}
                          disabled={actionLoading === donation.id}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteDonation(donation.id)}
                        disabled={actionLoading === donation.id}
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

        {filteredDonations.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No donations received yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Donation Detail Modal */}
      {showDonationModal && selectedDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Donation Details</h2>
              <button
                onClick={() => setShowDonationModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Donor Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">
                        {selectedDonation.isAnonymous ? 'Anonymous Donor' : selectedDonation.donorName}
                      </p>
                    </div>
                    {!selectedDonation.isAnonymous && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="text-gray-900">{selectedDonation.email}</p>
                        </div>
                        {selectedDonation.phone && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <p className="text-gray-900">{selectedDonation.phone}</p>
                          </div>
                        )}
                      </>
                    )}
                    {selectedDonation.message && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedDonation.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(selectedDonation.amount, selectedDonation.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="text-gray-900">{getPaymentMethodDisplay(selectedDonation.paymentMethod)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                      <p className="text-gray-900">{selectedDonation.transactionId || 'N/A'}</p>
                    </div>
                    {selectedDonation.processingFee && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Processing Fee</label>
                        <p className="text-gray-900">{formatCurrency(selectedDonation.processingFee, selectedDonation.currency)}</p>
                      </div>
                    )}
                    {selectedDonation.netAmount && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Net Amount</label>
                        <p className="text-gray-900">{formatCurrency(selectedDonation.netAmount, selectedDonation.currency)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900">{getDonationTypeDisplay(selectedDonation.donationType)}</p>
                    </div>
                    {selectedDonation.programTitle && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Program</label>
                        <p className="text-gray-900">{selectedDonation.programTitle}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDonation.paymentStatus)}`}>
                        {getStatusIcon(selectedDonation.paymentStatus)}
                        <span className="capitalize">{selectedDonation.paymentStatus}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedDonation.priority)}`}>
                        <Flag className="w-4 h-4" />
                        <span className="capitalize">{selectedDonation.priority || 'medium'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flags & Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Flags</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedDonation.isRecurring && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          Recurring ({selectedDonation.recurringFrequency})
                        </span>
                      )}
                      {selectedDonation.taxDeductible && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          Tax Deductible
                        </span>
                      )}
                      {selectedDonation.receiptSent && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          Receipt Sent
                        </span>
                      )}
                      {selectedDonation.thankYouSent && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                          Thank You Sent
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date Received</label>
                      <p className="text-gray-900">{new Date(selectedDonation.createdAt as string).toLocaleString()}</p>
                    </div>
                    {selectedDonation.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedDonation.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Generate Receipt
              </button>
              <button className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                Send Thank You
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300">
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsManagement;