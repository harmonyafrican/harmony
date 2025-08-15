import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  MessageCircle,
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Archive,
  Flag,
  MoreVertical,
  Reply,
  Download,
  Star,
  FileText,
} from 'lucide-react';
import { contactApi, type ContactSubmission, type ContactStats, formatContactType } from '../../services/contactApi';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Helper function to safely convert createdAt to Date
  const convertToDate = (createdAt: string | { _seconds: number; _nanoseconds: number } | undefined): Date | null => {
    if (!createdAt) return null;
    if (typeof createdAt === 'string') return new Date(createdAt);
    if (typeof createdAt === 'object' && '_seconds' in createdAt) {
      return new Date(createdAt._seconds * 1000);
    }
    return null;
  };

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const contactsData = await contactApi.getAllContactSubmissions();
      setContacts(contactsData);
      calculateStats(contactsData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const calculateStats = (contactsData: ContactSubmission[]) => {
    let newCount = 0;
    let inProgress = 0;
    let resolved = 0;
    let archived = 0;
    let responseNeeded = 0;

    contactsData.forEach(contact => {
      switch (contact.status) {
        case 'new': newCount++; break;
        case 'in_progress': inProgress++; break;
        case 'resolved': resolved++; break;
        case 'archived': archived++; break;
        default: newCount++; break;
      }

      if (contact.responseNeeded) responseNeeded++;
    });

    setStats({
      total: contactsData.length,
      new: newCount,
      inProgress,
      resolved,
      archived,
      responseNeeded
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
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

  const getPriorityIcon = (priority: string | undefined) => {
    switch (priority) {
      case 'urgent': return <Flag className="w-4 h-4" />;
      case 'high': return <Flag className="w-4 h-4" />;
      case 'medium': return <Flag className="w-4 h-4" />;
      case 'low': return <Flag className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      general: <MessageCircle className="w-4 h-4" />,
      partnership: <Star className="w-4 h-4" />,
      volunteer: <User className="w-4 h-4" />,
      donation: <Star className="w-4 h-4" />,
      media: <FileText className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || icons.general;
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || contact.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    try {
      setActionLoading(contactId);
      await contactApi.updateContactStatus(contactId, newStatus);
      
      const updatedContacts = contacts.map(contact => 
        contact.id === contactId ? { ...contact, status: newStatus as ContactSubmission['status'] } : contact
      );
      
      setContacts(updatedContacts);
      calculateStats(updatedContacts);
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Failed to update contact status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePriorityUpdate = async (contactId: string, newPriority: string) => {
    try {
      setActionLoading(contactId);
      await contactApi.updateContactPriority(contactId, newPriority);
      
      const updatedContacts = contacts.map(contact => 
        contact.id === contactId ? { ...contact, priority: newPriority as ContactSubmission['priority'] } : contact
      );
      
      setContacts(updatedContacts);
    } catch (error) {
      console.error('Error updating contact priority:', error);
      alert('Failed to update contact priority. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(contactId);
      await contactApi.deleteContact(contactId);
      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      setContacts(updatedContacts);
      calculateStats(updatedContacts);
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openContactModal = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const statCards = stats ? [
    {
      title: 'Total Messages',
      value: stats.total,
      icon: MessageCircle,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'New',
      value: stats.new,
      icon: AlertCircle,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Response Needed',
      value: stats.responseNeeded,
      icon: Reply,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    },
    {
      title: 'Archived',
      value: stats.archived,
      icon: Archive,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100'
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
          <h1 className="text-3xl font-bold text-gray-900">Contacts & Messages</h1>
          <p className="text-gray-600 mt-1">Manage contact form submissions and customer inquiries</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
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
              placeholder="Search contacts..."
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
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="partnership">Partnership</option>
              <option value="volunteer">Volunteer</option>
              <option value="donation">Donation</option>
              <option value="media">Media</option>
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

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Contact</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Subject & Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Priority</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{contact.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{contact.subject}</h3>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(contact.type)}
                        <span className="text-sm text-gray-600">{formatContactType(contact.type)}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{contact.message}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={contact.status || 'new'}
                      onChange={(e) => handleStatusUpdate(contact.id!, e.target.value)}
                      disabled={actionLoading === contact.id}
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getStatusColor(contact.status)} disabled:opacity-50`}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={contact.priority || 'medium'}
                      onChange={(e) => handlePriorityUpdate(contact.id!, e.target.value)}
                      disabled={actionLoading === contact.id}
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getPriorityColor(contact.priority)} disabled:opacity-50`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {(() => {
                          const date = convertToDate(contact.createdAt);
                          return date ? date.toLocaleDateString() : 'Unknown';
                        })()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openContactModal(contact)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Reply className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id!)}
                        disabled={actionLoading === contact.id}
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

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No contact submissions received yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedContact.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <p className="text-gray-900">{formatContactType(selectedContact.type)}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <p className="text-gray-900">{selectedContact.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              {/* Status & Priority */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Priority</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContact.status)}`}>
                      {getStatusIcon(selectedContact.status)}
                      <span className="capitalize">{selectedContact.status || 'new'}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedContact.priority)}`}>
                      {getPriorityIcon(selectedContact.priority)}
                      <span className="capitalize">{selectedContact.priority || 'medium'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {(() => {
                      const date = convertToDate(selectedContact.createdAt);
                      return date ? date.toLocaleString() : 'Unknown';
                    })()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Reply
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300">
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;