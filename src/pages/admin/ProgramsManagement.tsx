import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  BookOpen,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  Pause,
  FileText,
  MoreVertical,
  Star,
  Download,
  Upload,
  Award,
  Heart,
  XCircle,
  Activity
} from 'lucide-react';
import { programsApi, type Program, type ProgramStats } from '../../services/programsApi';

const ProgramsManagement = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stats, setStats] = useState<ProgramStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'education' as Program['category'],
    status: 'draft' as Program['status'],
    startDate: '',
    endDate: '',
    budget: 0,
    beneficiaries: 0,
    location: '',
    duration: '',
    ageGroup: '',
    features: [] as string[],
    color: '#f59e0b',
    participants: '',
    successRate: '95%',
    requirements: [] as string[],
    benefits: [] as string[],
    isActive: true,
    priority: 'medium' as Program['priority'],
    progress: 0,
    fundingGoal: 0,
    fundingRaised: 0,
    impactScore: 8,
    managedBy: '',
    images: [] as string[]
  });
  const [currentFeature, setCurrentFeature] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const programsData = await programsApi.getAllPrograms();
      setPrograms(programsData);
      calculateStats(programsData);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const calculateStats = (programsData: Program[]) => {
    let active = 0;
    let completed = 0;
    let paused = 0;
    let draft = 0;
    let totalBeneficiaries = 0;
    let totalBudget = 0;
    let totalSuccessRate = 0;

    programsData.forEach(program => {
      switch (program.status) {
        case 'active': active++; break;
        case 'completed': completed++; break;
        case 'paused': paused++; break;
        case 'draft': draft++; break;
        default: draft++; break;
      }

      totalBeneficiaries += program.beneficiaries || 0;
      
      if (typeof program.budget === 'number') {
        totalBudget += program.budget;
      } else if (program.budget?.total) {
        totalBudget += program.budget.total;
      }

      const successRate = parseFloat(program.successRate.replace('%', '')) || 0;
      totalSuccessRate += successRate;
    });

    setStats({
      total: programsData.length,
      active,
      completed,
      paused,
      draft,
      totalBeneficiaries,
      totalBudget,
      avgSuccessRate: programsData.length > 0 ? totalSuccessRate / programsData.length : 0
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'archived': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'archived': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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


  const getCategoryIcon = (category: string) => {
    const icons = {
      education: <BookOpen className="w-4 h-4" />,
      healthcare: <Heart className="w-4 h-4" />,
      community_development: <Users className="w-4 h-4" />,
      environment: <Target className="w-4 h-4" />,
      other: <Star className="w-4 h-4" />
    };
    return icons[category as keyof typeof icons] || icons.other;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getImpactScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-yellow-600 bg-yellow-100';
    if (score >= 5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const categories = ['all', 'education', 'healthcare', 'community_development', 'environment', 'other'];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || program.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || program.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleStatusUpdate = async (programId: string, newStatus: string) => {
    try {
      setActionLoading(programId);
      await programsApi.updateProgramStatus(programId, newStatus);
      
      const updatedPrograms = programs.map(program => 
        program.id === programId ? { ...program, status: newStatus as Program['status'] } : program
      );
      
      setPrograms(updatedPrograms);
      calculateStats(updatedPrograms);
    } catch (error) {
      console.error('Error updating program status:', error);
      alert('Failed to update program status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePriorityUpdate = async (programId: string, newPriority: string) => {
    try {
      setActionLoading(programId);
      await programsApi.updateProgramPriority(programId, newPriority);
      
      const updatedPrograms = programs.map(program => 
        program.id === programId ? { ...program, priority: newPriority as Program['priority'] } : program
      );
      
      setPrograms(updatedPrograms);
    } catch (error) {
      console.error('Error updating program priority:', error);
      alert('Failed to update program priority. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(programId);
      await programsApi.deleteProgram(programId);
      const updatedPrograms = programs.filter(program => program.id !== programId);
      setPrograms(updatedPrograms);
      calculateStats(updatedPrograms);
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openProgramModal = (program: Program) => {
    setSelectedProgram(program);
    setShowProgramModal(true);
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      category: 'education',
      status: 'draft',
      startDate: '',
      endDate: '',
      budget: 0,
      beneficiaries: 0,
      location: '',
      duration: '',
      ageGroup: '',
      features: [],
      color: '#f59e0b',
      participants: '',
      successRate: '95%',
      requirements: [],
      benefits: [],
      isActive: true,
      priority: 'medium',
      progress: 0,
      fundingGoal: 0,
      fundingRaised: 0,
      impactScore: 8,
      managedBy: '',
      images: []
    });
    setCurrentFeature('');
    setCurrentRequirement('');
    setCurrentBenefit('');
    setCurrentImage('');
  };

  const openCreateModal = () => {
    resetFormData();
    setShowCreateModal(true);
  };

  const openEditModal = (program: Program) => {
    const startDate = typeof program.startDate === 'string' 
      ? program.startDate.split('T')[0] 
      : new Date().toISOString().split('T')[0];
    
    const endDate = program.endDate 
      ? (typeof program.endDate === 'string' ? program.endDate.split('T')[0] : new Date().toISOString().split('T')[0])
      : '';

    setFormData({
      title: program.title || '',
      subtitle: program.subtitle || '',
      description: program.description || '',
      category: program.category || 'education',
      status: program.status || 'draft',
      startDate,
      endDate,
      budget: typeof program.budget === 'number' ? program.budget : (program.budget?.total || 0),
      beneficiaries: program.beneficiaries || 0,
      location: program.location || '',
      duration: program.duration || '',
      ageGroup: program.ageGroup || '',
      features: program.features || [],
      color: program.color || '#f59e0b',
      participants: program.participants || '',
      successRate: program.successRate || '95%',
      requirements: program.requirements || [],
      benefits: program.benefits || [],
      isActive: program.isActive !== undefined ? program.isActive : true,
      priority: program.priority || 'medium',
      progress: program.progress || 0,
      fundingGoal: program.fundingGoal || 0,
      fundingRaised: program.fundingRaised || 0,
      impactScore: program.impactScore || 8,
      managedBy: program.managedBy || '',
      images: program.images || []
    });
    setSelectedProgram(program);
    setShowEditModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addToArray = (arrayName: 'features' | 'requirements' | 'benefits' | 'images', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], value.trim()]
      }));
      if (arrayName === 'features') setCurrentFeature('');
      if (arrayName === 'requirements') setCurrentRequirement('');
      if (arrayName === 'benefits') setCurrentBenefit('');
      if (arrayName === 'images') setCurrentImage('');
    }
  };

  const removeFromArray = (arrayName: 'features' | 'requirements' | 'benefits' | 'images', index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleCreateProgram = async () => {
    try {
      setActionLoading('creating');
      
      const donationTiers = [
        { amount: 25, impact: 'Provides basic supplies for 1 beneficiary', icon: '📚' },
        { amount: 50, impact: 'Supports educational materials for a group', icon: '🎒' },
        { amount: 100, impact: 'Funds full participation for 1 month', icon: '⭐' }
      ];

      const programData = {
        ...formData,
        donationTiers,
        applicationCount: 0,
        donationCount: 0,
        totalDonations: formData.fundingRaised,
        partnerships: [],
        proposedDates: `${formData.startDate} to ${formData.endDate}`,
        dailySchedule: {}
      };

      const newProgram = await programsApi.createProgram(programData);
      
      setPrograms(prev => [newProgram, ...prev]);
      calculateStats([newProgram, ...programs]);
      setShowCreateModal(false);
      resetFormData();
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateProgram = async () => {
    if (!selectedProgram?.id) return;

    try {
      setActionLoading('updating');
      
      const programData = {
        ...formData,
        donationTiers: selectedProgram.donationTiers || [],
        applicationCount: selectedProgram.applicationCount || 0,
        donationCount: selectedProgram.donationCount || 0,
        totalDonations: formData.fundingRaised,
        partnerships: selectedProgram.partnerships || [],
        proposedDates: `${formData.startDate} to ${formData.endDate}`,
        dailySchedule: selectedProgram.dailySchedule || {}
      };

      const updatedProgram = await programsApi.updateProgram(selectedProgram.id, programData);
      
      const updatedPrograms = programs.map(program => 
        program.id === selectedProgram.id ? updatedProgram : program
      );
      
      setPrograms(updatedPrograms);
      calculateStats(updatedPrograms);
      setShowEditModal(false);
      resetFormData();
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Failed to update program. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatBudget = (budget: number | { total?: number } | undefined) => {
    if (typeof budget === 'number') {
      return `$${budget.toLocaleString()}`;
    }
    if (budget?.total) {
      return `$${budget.total.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const statCards = stats ? [
    {
      title: 'Total Programs',
      value: stats.total,
      icon: BookOpen,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Active',
      value: stats.active,
      icon: Activity,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Total Beneficiaries',
      value: stats.totalBeneficiaries.toLocaleString(),
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Total Budget',
      value: `$${stats.totalBudget.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      title: 'Avg Success Rate',
      value: `${stats.avgSuccessRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-100'
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
          <h1 className="text-3xl font-bold text-gray-900">Programs Management</h1>
          <p className="text-gray-600 mt-1">Manage programs, track progress, and monitor impact</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button 
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Program</span>
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
              placeholder="Search programs..."
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
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
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

      {/* Programs Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Program</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Category & Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Progress & Funding</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Impact & Priority</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Timeline</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPrograms.map((program) => {
                const progress = program.progress || 0;
                const fundingPercentage = program.fundingGoal ? 
                  Math.round((program.fundingRaised || 0) / program.fundingGoal * 100) : 0;
                
                return (
                  <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        {program.images && program.images[0] && (
                          <img
                            src={program.images[0]}
                            alt={program.title}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://i.postimg.cc/KjNm2YQt/default-program.jpg';
                            }}
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1">{program.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{program.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{program.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(program.category)}
                          <span className="text-sm text-gray-900 capitalize">
                            {program.category.replace('_', ' ')}
                          </span>
                        </div>
                        <select
                          value={program.status || 'draft'}
                          onChange={(e) => handleStatusUpdate(program.id, e.target.value)}
                          disabled={actionLoading === program.id}
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getStatusColor(program.status)} disabled:opacity-50`}
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-3">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium text-gray-900">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(progress)}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Funding Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Funding</span>
                            <span className="text-sm font-medium text-gray-900">{fundingPercentage}%</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            ${(program.fundingRaised || 0).toLocaleString()} / ${(program.fundingGoal || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getImpactScoreColor(program.impactScore || 0)}`}>
                            {program.impactScore}/10
                          </span>
                        </div>
                        <select
                          value={program.priority || 'medium'}
                          onChange={(e) => handlePriorityUpdate(program.id, e.target.value)}
                          disabled={actionLoading === program.id}
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-amber-400 ${getPriorityColor(program.priority)} disabled:opacity-50`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{program.beneficiaries || 0} beneficiaries</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            Start: {typeof program.startDate === 'string' 
                              ? new Date(program.startDate).toLocaleDateString()
                              : 'TBD'
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{program.duration}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Success: {program.successRate}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openProgramModal(program)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(program)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(program.id)}
                          disabled={actionLoading === program.id}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first program'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && priorityFilter === 'all') && (
              <button 
                onClick={openCreateModal}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300"
              >
                Create Program
              </button>
            )}
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      {showProgramModal && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Program Details</h2>
              <button
                onClick={() => setShowProgramModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Program Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <p className="text-gray-900">{selectedProgram.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedProgram.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-gray-900 capitalize">{selectedProgram.category.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{selectedProgram.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age Group</label>
                      <p className="text-gray-900">{selectedProgram.ageGroup}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <p className="text-gray-900">{selectedProgram.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Features & Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Benefits</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProgram.features?.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                      <ul className="text-sm text-gray-900 space-y-1">
                        {selectedProgram.benefits?.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Metrics */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProgram.status)}`}>
                        {getStatusIcon(selectedProgram.status)}
                        <span className="capitalize">{selectedProgram.status}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedProgram.priority)}`}>
                        <span className="text-xs">🏳️</span>
                        <span className="capitalize">{selectedProgram.priority}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(selectedProgram.progress || 0)}`}
                            style={{ width: `${selectedProgram.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedProgram.progress || 0}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Impact Score</label>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactScoreColor(selectedProgram.impactScore || 0)}`}>
                          {selectedProgram.impactScore}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Budget</label>
                      <p className="text-gray-900">{formatBudget(selectedProgram.budget)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Funding Goal</label>
                      <p className="text-gray-900">${(selectedProgram.fundingGoal || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Funding Raised</label>
                      <p className="text-gray-900">${(selectedProgram.fundingRaised || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Success Rate</label>
                      <p className="text-gray-900">{selectedProgram.successRate}</p>
                    </div>
                  </div>
                </div>

                {/* Impact & Participation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact & Participation</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Beneficiaries</label>
                      <p className="text-gray-900">{(selectedProgram.beneficiaries || 0).toLocaleString()} people</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Participants</label>
                      <p className="text-gray-900">{selectedProgram.participants}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Managed By</label>
                      <p className="text-gray-900">{selectedProgram.managedBy || 'Program Manager'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => {
                  // Generate and download report for this program
                  alert('Report generation feature coming soon!');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Generate Report
              </button>
              <button 
                onClick={() => {
                  setShowProgramModal(false);
                  openEditModal(selectedProgram);
                }}
                className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
              >
                Edit Program
              </button>
              <button 
                onClick={() => {
                  // Show analytics view for this program
                  alert('Analytics view feature coming soon!');
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Program Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Program</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program subtitle"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program description"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          required
                        >
                          <option value="education">Education</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="community_development">Community Development</option>
                          <option value="environment">Environment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program location"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="e.g., 6 months"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                        <input
                          type="text"
                          name="ageGroup"
                          value={formData.ageGroup}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="e.g., 10-18 years"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline & Participants */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Participants</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                      <input
                        type="text"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="e.g., 50 students"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiaries</label>
                        <input
                          type="number"
                          name="beneficiaries"
                          value={formData.beneficiaries}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Number of beneficiaries"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Success Rate</label>
                        <input
                          type="text"
                          name="successRate"
                          value={formData.successRate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="e.g., 95%"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Add a feature"
                        onKeyPress={(e) => e.key === 'Enter' && addToArray('features', currentFeature)}
                      />
                      <button
                        type="button"
                        onClick={() => addToArray('features', currentFeature)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFromArray('features', index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial & Admin Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Total budget"
                        min="0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal</label>
                        <input
                          type="number"
                          name="fundingGoal"
                          value={formData.fundingGoal}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Funding goal"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funding Raised</label>
                        <input
                          type="number"
                          name="fundingRaised"
                          value={formData.fundingRaised}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Amount raised"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                        <input
                          type="number"
                          name="progress"
                          value={formData.progress}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="0-100"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Impact Score (1-10)</label>
                        <input
                          type="number"
                          name="impactScore"
                          value={formData.impactScore}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="1-10"
                          min="1"
                          max="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                          type="color"
                          name="color"
                          value={formData.color}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Managed By</label>
                      <input
                        type="text"
                        name="managedBy"
                        value={formData.managedBy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program manager name"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-400"
                      />
                      <label className="text-sm font-medium text-gray-700">Active Program</label>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentRequirement}
                        onChange={(e) => setCurrentRequirement(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Add a requirement"
                        onKeyPress={(e) => e.key === 'Enter' && addToArray('requirements', currentRequirement)}
                      />
                      <button
                        type="button"
                        onClick={() => addToArray('requirements', currentRequirement)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-1">
                      {formData.requirements.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-900">{requirement}</span>
                          <button
                            type="button"
                            onClick={() => removeFromArray('requirements', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentBenefit}
                        onChange={(e) => setCurrentBenefit(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Add a benefit"
                        onKeyPress={(e) => e.key === 'Enter' && addToArray('benefits', currentBenefit)}
                      />
                      <button
                        type="button"
                        onClick={() => addToArray('benefits', currentBenefit)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-1">
                      {formData.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-900">{benefit}</span>
                          <button
                            type="button"
                            onClick={() => removeFromArray('benefits', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateProgram}
                disabled={actionLoading === 'creating' || !formData.title || !formData.description}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {actionLoading === 'creating' ? 'Creating...' : 'Create Program'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Program Modal */}
      {showEditModal && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Program</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {/* Same form structure as create modal */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program subtitle"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program description"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          required
                        >
                          <option value="education">Education</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="community_development">Community Development</option>
                          <option value="environment">Environment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program location"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="e.g., 6 months"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                        <input
                          type="text"
                          name="ageGroup"
                          value={formData.ageGroup}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="e.g., 10-18 years"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline & Participants - same as create modal */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Participants</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                      <input
                        type="text"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="e.g., 50 students"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiaries</label>
                        <input
                          type="number"
                          name="beneficiaries"
                          value={formData.beneficiaries}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Number of beneficiaries"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Success Rate</label>
                        <input
                          type="text"
                          name="successRate"
                          value={formData.successRate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="e.g., 95%"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features - same as create modal but condensed */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Add a feature"
                        onKeyPress={(e) => e.key === 'Enter' && addToArray('features', currentFeature)}
                      />
                      <button
                        type="button"
                        onClick={() => addToArray('features', currentFeature)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFromArray('features', index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Admin settings and other fields */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Total budget"
                        min="0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal</label>
                        <input
                          type="number"
                          name="fundingGoal"
                          value={formData.fundingGoal}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Funding goal"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funding Raised</label>
                        <input
                          type="number"
                          name="fundingRaised"
                          value={formData.fundingRaised}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Amount raised"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                        <input
                          type="number"
                          name="progress"
                          value={formData.progress}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="0-100"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Impact Score (1-10)</label>
                        <input
                          type="number"
                          name="impactScore"
                          value={formData.impactScore}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="1-10"
                          min="1"
                          max="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                          type="color"
                          name="color"
                          value={formData.color}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Managed By</label>
                      <input
                        type="text"
                        name="managedBy"
                        value={formData.managedBy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Program manager name"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-400"
                      />
                      <label className="text-sm font-medium text-gray-700">Active Program</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProgram}
                disabled={actionLoading === 'updating' || !formData.title || !formData.description}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {actionLoading === 'updating' ? 'Updating...' : 'Update Program'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsManagement;