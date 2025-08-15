import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Users,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserCheck,
  MoreVertical,
  Star,
  Download,
  Award,
  MessageSquare,
  UserPlus,
  Shield
} from 'lucide-react';
import { volunteerApi, type VolunteerApplication, type VolunteerStats } from '../../services/volunteerApi';

const VolunteersManagement = () => {
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [skillsFilter, setSkillsFilter] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerApplication | null>(null);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showCreateOpportunityModal, setShowCreateOpportunityModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [opportunityFormData, setOpportunityFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    timeCommitment: '',
    location: '',
    contactEmail: '',
    category: 'general',
    skills: '',
    spotsAvailable: 10,
    isActive: true,
    impact: ''
  });

  // Helper function to safely convert createdAt to Date
  const convertToDate = (createdAt: string | { _seconds: number; _nanoseconds: number } | undefined): Date | null => {
    if (!createdAt) return null;
    if (typeof createdAt === 'string') return new Date(createdAt);
    if (typeof createdAt === 'object' && '_seconds' in createdAt) {
      return new Date(createdAt._seconds * 1000);
    }
    return null;
  };

  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true);
      const volunteersData = await volunteerApi.getAllVolunteerApplications();
      setVolunteers(volunteersData);
      calculateStats(volunteersData);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const calculateStats = (volunteersData: VolunteerApplication[]) => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let contacted = 0;
    const allSkills = new Set<string>();

    volunteersData.forEach(volunteer => {
      switch (volunteer.status) {
        case 'pending': pending++; break;
        case 'approved': approved++; break;
        case 'rejected': rejected++; break;
        case 'contacted': contacted++; break;
        default: pending++; break;
      }

      volunteer.skills?.forEach(skill => allSkills.add(skill));
    });

    setStats({
      total: volunteersData.length,
      pending,
      approved,
      rejected,
      contacted,
      activeOpportunities: 12, // Mock data - would come from API
      totalSkills: allSkills.size
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'contacted': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'contacted': return <MessageSquare className="w-4 h-4" />;
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


  const getBackgroundCheckColor = (status: string | undefined) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'not_required': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBackgroundCheckIcon = (status: string | undefined) => {
    switch (status) {
      case 'completed': return <Shield className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'not_required': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Get unique skills from all volunteers
  const allSkills = Array.from(new Set(volunteers.flatMap(v => v.skills || [])));

  const filteredVolunteers = volunteers.filter(volunteer => {
    const fullName = `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.phone.includes(searchTerm) ||
                         volunteer.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || volunteer.priority === priorityFilter;
    const matchesSkills = skillsFilter === 'all' || volunteer.skills?.includes(skillsFilter);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSkills;
  });

  const handleStatusUpdate = async (volunteerId: string, newStatus: string) => {
    try {
      setActionLoading(volunteerId);
      await volunteerApi.updateVolunteerStatus(volunteerId, newStatus);
      
      const updatedVolunteers = volunteers.map(volunteer => 
        volunteer.id === volunteerId ? { ...volunteer, status: newStatus as VolunteerApplication['status'] } : volunteer
      );
      
      setVolunteers(updatedVolunteers);
      calculateStats(updatedVolunteers);
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      alert('Failed to update volunteer status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePriorityUpdate = async (volunteerId: string, newPriority: string) => {
    try {
      setActionLoading(volunteerId);
      await volunteerApi.updateVolunteerPriority(volunteerId, newPriority);
      
      const updatedVolunteers = volunteers.map(volunteer => 
        volunteer.id === volunteerId ? { ...volunteer, priority: newPriority as VolunteerApplication['priority'] } : volunteer
      );
      
      setVolunteers(updatedVolunteers);
    } catch (error) {
      console.error('Error updating volunteer priority:', error);
      alert('Failed to update volunteer priority. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteVolunteer = async (volunteerId: string) => {
    if (!confirm('Are you sure you want to delete this volunteer application? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(volunteerId);
      await volunteerApi.deleteVolunteerApplication(volunteerId);
      const updatedVolunteers = volunteers.filter(volunteer => volunteer.id !== volunteerId);
      setVolunteers(updatedVolunteers);
      calculateStats(updatedVolunteers);
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Failed to delete volunteer application. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openVolunteerModal = (volunteer: VolunteerApplication) => {
    setSelectedVolunteer(volunteer);
    setShowVolunteerModal(true);
  };

  const handleCreateOpportunity = async () => {
    try {
      // Validate required fields
      if (!opportunityFormData.title.trim() || !opportunityFormData.description.trim() || !opportunityFormData.contactEmail.trim()) {
        alert('Please fill in all required fields (Title, Description, Contact Email)');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(opportunityFormData.contactEmail)) {
        alert('Please enter a valid email address');
        return;
      }

      setActionLoading('creating-opportunity');

      // Transform form data to match API format
      const opportunityData = {
        title: opportunityFormData.title.trim(),
        description: opportunityFormData.description.trim(),
        requirements: opportunityFormData.requirements.trim().split('\n').filter(req => req.trim()),
        timeCommitment: opportunityFormData.timeCommitment.trim(),
        location: opportunityFormData.location.trim(),
        contactEmail: opportunityFormData.contactEmail.trim(),
        isActive: opportunityFormData.isActive,
        spotsAvailable: opportunityFormData.spotsAvailable,
        category: opportunityFormData.category,
        skills: opportunityFormData.skills.trim().split(',').map(skill => skill.trim()).filter(skill => skill),
        impact: opportunityFormData.impact.trim() || `Make a difference through ${opportunityFormData.title.toLowerCase()}`
      };

      await volunteerApi.createVolunteerOpportunity(opportunityData);
      
      // Reset form and close modal
      setOpportunityFormData({
        title: '',
        description: '',
        requirements: '',
        timeCommitment: '',
        location: '',
        contactEmail: '',
        category: 'general',
        skills: '',
        spotsAvailable: 10,
        isActive: true,
        impact: ''
      });
      
      setShowCreateOpportunityModal(false);
      alert('Volunteer opportunity created successfully!');
      
      // Could refresh opportunities list here if we had one displayed
      
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert('Failed to create volunteer opportunity. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpportunityFormChange = (field: string, value: string | number | boolean) => {
    setOpportunityFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-yellow-600 bg-yellow-100';
    if (score >= 5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const statCards = stats ? [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle2,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Contacted',
      value: stats.contacted,
      icon: MessageSquare,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100'
    },
    {
      title: 'Active Opportunities',
      value: stats.activeOpportunities,
      icon: Award,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Unique Skills',
      value: stats.totalSkills,
      icon: Star,
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
          <h1 className="text-3xl font-bold text-gray-900">Volunteers Management</h1>
          <p className="text-gray-600 mt-1">Manage volunteer applications and opportunities</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowCreateOpportunityModal(true)}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Opportunity</span>
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
              placeholder="Search volunteers..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="contacted">Contacted</option>
              <option value="rejected">Rejected</option>
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
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Skills</option>
              {allSkills.slice(0, 10).map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Volunteer</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Contact & Skills</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Priority & Score</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Background Check</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Date Applied</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {volunteer.firstName} {volunteer.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{volunteer.address}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Age: {new Date().getFullYear() - new Date(volunteer.dateOfBirth).getFullYear()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{volunteer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{volunteer.phone}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {volunteer.skills?.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {volunteer.skills && volunteer.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{volunteer.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={volunteer.status || 'pending'}
                      onChange={(e) => handleStatusUpdate(volunteer.id!, e.target.value)}
                      disabled={actionLoading === volunteer.id}
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getStatusColor(volunteer.status)} disabled:opacity-50`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <select
                        value={volunteer.priority || 'medium'}
                        onChange={(e) => handlePriorityUpdate(volunteer.id!, e.target.value)}
                        disabled={actionLoading === volunteer.id}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getPriorityColor(volunteer.priority)} disabled:opacity-50`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(volunteer.score || 0)}`}>
                          {volunteer.score}/10
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getBackgroundCheckColor(volunteer.backgroundCheck)}`}>
                      {getBackgroundCheckIcon(volunteer.backgroundCheck)}
                      <span className="capitalize">{volunteer.backgroundCheck?.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {volunteer.createdAt 
                          ? (() => {
                              const date = convertToDate(volunteer.createdAt);
                              return date ? date.toLocaleDateString() : 'Unknown';
                            })()
                          : 'Unknown'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openVolunteerModal(volunteer)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVolunteer(volunteer.id!)}
                        disabled={actionLoading === volunteer.id}
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

        {filteredVolunteers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || skillsFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No volunteer applications received yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Volunteer Detail Modal */}
      {showVolunteerModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Volunteer Application Details</h2>
              <button
                onClick={() => setShowVolunteerModal(false)}
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
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{selectedVolunteer.firstName} {selectedVolunteer.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedVolunteer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedVolunteer.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="text-gray-900">{new Date(selectedVolunteer.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-gray-900">{selectedVolunteer.address}</p>
                    </div>
                  </div>
                </div>

                {/* Skills & Availability */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Availability</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedVolunteer.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Availability</label>
                      <p className="text-gray-900">{selectedVolunteer.availability}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivation</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedVolunteer.motivation}</p>
                    </div>
                    {selectedVolunteer.preferredRole && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Role</label>
                        <p className="text-gray-900">{selectedVolunteer.preferredRole}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Assessment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Assessment</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedVolunteer.status)}`}>
                          {getStatusIcon(selectedVolunteer.status)}
                          <span className="capitalize">{selectedVolunteer.status || 'pending'}</span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedVolunteer.priority)}`}>
                          <span className="text-xs">🏳️</span>
                          <span className="capitalize">{selectedVolunteer.priority || 'medium'}</span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-amber-500" />
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(selectedVolunteer.score || 0)}`}>
                            {selectedVolunteer.score}/10
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Check</label>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getBackgroundCheckColor(selectedVolunteer.backgroundCheck)}`}>
                          {getBackgroundCheckIcon(selectedVolunteer.backgroundCheck)}
                          <span className="capitalize">{selectedVolunteer.backgroundCheck?.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                    {selectedVolunteer.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedVolunteer.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Applied: {(() => {
                        const date = convertToDate(selectedVolunteer.createdAt);
                        return date ? date.toLocaleString() : 'Unknown';
                      })()}</span>
                    </div>
                    {selectedVolunteer.interviewDate && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Interview: {new Date(selectedVolunteer.interviewDate).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => {
                  // Schedule interview functionality
                  alert('Interview scheduling feature coming soon!');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Schedule Interview
              </button>
              <button 
                onClick={async () => {
                  if (selectedVolunteer?.id) {
                    await handleStatusUpdate(selectedVolunteer.id, 'approved');
                    setShowVolunteerModal(false);
                  }
                }}
                className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
              >
                Approve Application
              </button>
              <button 
                onClick={() => {
                  // Contact volunteer functionality
                  if (selectedVolunteer?.email) {
                    window.open(`mailto:${selectedVolunteer.email}?subject=Harmony Africa Volunteer Application&body=Dear ${selectedVolunteer.firstName} ${selectedVolunteer.lastName},%0A%0AThank you for your interest in volunteering with Harmony Africa.`);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300"
              >
                Contact Volunteer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Opportunity Modal */}
      {showCreateOpportunityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Volunteer Opportunity</h2>
              <button
                onClick={() => setShowCreateOpportunityModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opportunity Title *
                  </label>
                  <input
                    type="text"
                    value={opportunityFormData.title}
                    onChange={(e) => handleOpportunityFormChange('title', e.target.value)}
                    placeholder="e.g., Youth Mentor for Education Program"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select 
                    value={opportunityFormData.category}
                    onChange={(e) => handleOpportunityFormChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="education">Education</option>
                    <option value="technology">Technology</option>
                    <option value="arts_culture">Arts & Culture</option>
                    <option value="community_development">Community Development</option>
                    <option value="events_programs">Events & Programs</option>
                    <option value="communications">Communications</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={opportunityFormData.description}
                  onChange={(e) => handleOpportunityFormChange('description', e.target.value)}
                  placeholder="Describe the volunteer opportunity, responsibilities, and what volunteers will be doing..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={opportunityFormData.location}
                    onChange={(e) => handleOpportunityFormChange('location', e.target.value)}
                    placeholder="e.g., Nairobi, Kenya"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Commitment
                  </label>
                  <input
                    type="text"
                    value={opportunityFormData.timeCommitment}
                    onChange={(e) => handleOpportunityFormChange('timeCommitment', e.target.value)}
                    placeholder="e.g., 4-6 hours per week"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={opportunityFormData.contactEmail}
                    onChange={(e) => handleOpportunityFormChange('contactEmail', e.target.value)}
                    placeholder="coordinator@harmonyafrica.org"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spots Available
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={opportunityFormData.spotsAvailable}
                    onChange={(e) => handleOpportunityFormChange('spotsAvailable', parseInt(e.target.value) || 1)}
                    placeholder="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements (one per line)
                </label>
                <textarea
                  rows={4}
                  value={opportunityFormData.requirements}
                  onChange={(e) => handleOpportunityFormChange('requirements', e.target.value)}
                  placeholder="Experience in education or relevant field&#10;Strong communication skills&#10;Commitment to program duration&#10;Available during program hours"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Gained (comma-separated)
                </label>
                <input
                  type="text"
                  value={opportunityFormData.skills}
                  onChange={(e) => handleOpportunityFormChange('skills', e.target.value)}
                  placeholder="Teaching, Mentoring, Leadership, Communication"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateOpportunityModal(false);
                  // Reset form data
                  setOpportunityFormData({
                    title: '',
                    description: '',
                    requirements: '',
                    timeCommitment: '',
                    location: '',
                    contactEmail: '',
                    category: 'general',
                    skills: '',
                    spotsAvailable: 10,
                    isActive: true,
                    impact: ''
                  });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOpportunity}
                disabled={actionLoading === 'creating-opportunity' || !opportunityFormData.title.trim() || !opportunityFormData.description.trim() || !opportunityFormData.contactEmail.trim()}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {actionLoading === 'creating-opportunity' ? 'Creating...' : 'Create Opportunity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteersManagement;