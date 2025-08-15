import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Image,
  Video,
  Calendar,
  MapPin,
  Users,
  Camera,
  CheckCircle,
  XCircle,
  Star,
  Download,
  Upload,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Heart,
  Play,
  FileImage,
  HardDrive
} from 'lucide-react';
import { galleryApi, type GalleryItem, type GalleryStats, formatDate as formatApiDate } from '../../services/galleryApi';

interface ExtendedGalleryStats extends GalleryStats {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  featuredItems: number;
  totalViews: number;
  totalLikes: number;
}

const GalleryManagement = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<ExtendedGalleryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Form state for create/edit
  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
    src: '',
    videoUrl: '',
    title: '',
    description: '',
    category: 'community' as 'education' | 'technology' | 'arts' | 'community' | 'events' | 'other',
    date: '',
    location: '',
    participants: '',
    tags: [] as string[],
    photographer: '',
    isActive: true
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchGalleryItems = useCallback(async () => {
    try {
      setLoading(true);
      const itemsData = await galleryApi.getAllGalleryItems();
      setItems(itemsData);
      calculateStats(itemsData);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  const calculateStats = (itemsData: GalleryItem[]) => {
    let totalPhotos = 0;
    let totalVideos = 0;
    let activeItems = 0;
    let inactiveItems = 0;
    let featuredItems = 0;
    let totalViews = 0;
    let totalLikes = 0;

    itemsData.forEach(item => {
      if (item.type === 'image') totalPhotos++;
      if (item.type === 'video') totalVideos++;
      
      if (item.status === 'active' || item.isActive) activeItems++;
      else inactiveItems++;
      
      if (item.status === 'featured') featuredItems++;
      
      totalViews += item.views || 0;
      totalLikes += item.likes || 0;
    });

    setStats({
      totalItems: itemsData.length,
      totalPhotos,
      totalVideos,
      totalEvents: new Set(itemsData.map(item => item.location)).size,
      totalMemories: itemsData.length,
      activeItems,
      inactiveItems,
      featuredItems,
      totalViews,
      totalLikes
    });
  };

  const getStatusColor = (status: string | undefined, isActive: boolean) => {
    if (status === 'featured') return 'text-yellow-600 bg-yellow-100';
    if (status === 'active' || isActive) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status: string | undefined, isActive: boolean) => {
    if (status === 'featured') return <Star className="w-4 h-4" />;
    if (status === 'active' || isActive) return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getStatusText = (status: string | undefined, isActive: boolean) => {
    if (status === 'featured') return 'Featured';
    if (status === 'active' || isActive) return 'Active';
    return 'Inactive';
  };

  const getTypeIcon = (type: string) => {
    return type === 'video' ? <Video className="w-4 h-4" /> : <Image className="w-4 h-4" />;
  };

  // Get unique categories from items
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        matchesStatus = item.status === 'active' || item.isActive;
      } else if (statusFilter === 'inactive') {
        matchesStatus = item.status === 'inactive' || (!item.isActive && item.status !== 'featured');
      } else if (statusFilter === 'featured') {
        matchesStatus = item.status === 'featured';
      }
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this gallery item? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(itemId);
      await galleryApi.deleteGalleryItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
      calculateStats(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      setActionLoading(itemId);
      await galleryApi.toggleGalleryItemStatus(itemId, !currentStatus);
      
      const updatedItems = items.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              isActive: !currentStatus, 
              status: (!currentStatus ? 'active' : 'inactive') as GalleryItem['status'] 
            }
          : item
      );
      
      setItems(updatedItems);
      calculateStats(updatedItems);
    } catch (error) {
      console.error('Error toggling item status:', error);
      alert('Failed to update item status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'image',
      src: '',
      videoUrl: '',
      title: '',
      description: '',
      category: 'community',
      date: '',
      location: '',
      participants: '',
      tags: [],
      photographer: '',
      isActive: true
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'participants') {
      // Allow only numbers for participants
      const numValue = value === '' ? '' : value;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const tag = target.value.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const itemData = {
        ...formData,
        participants: formData.participants ? parseInt(formData.participants) : 0
      };
      
      // Call the real API to create the gallery item
      const newItem = await galleryApi.createGalleryItem(itemData);
      
      // Update local state with the new item from server
      setItems(prev => [newItem, ...prev]);
      calculateStats([newItem, ...items]);
      setShowCreateModal(false);
      resetForm();
      alert('Gallery item created successfully!');
      
    } catch (error) {
      console.error('Error creating gallery item:', error);
      alert('Failed to create gallery item. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      type: item.type,
      src: item.src,
      videoUrl: item.videoUrl || '',
      title: item.title,
      description: item.description,
      category: item.category,
      date: typeof item.date === 'string' ? item.date : new Date(item.date._seconds * 1000).toISOString().split('T')[0],
      location: item.location,
      participants: item.participants.toString(),
      tags: item.tags || [],
      photographer: item.photographer || '',
      isActive: item.isActive
    });
    setShowEditModal(true);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    setFormLoading(true);
    
    try {
      const updateData = {
        ...formData,
        participants: formData.participants ? parseInt(formData.participants) : 0
      };
      
      // Call the real API to update the gallery item
      const updatedItem = await galleryApi.updateGalleryItem(selectedItem.id, updateData);
      
      // Update local state with the updated item from server
      const updatedItems = items.map(item => 
        item.id === selectedItem.id ? updatedItem : item
      );
      
      setItems(updatedItems);
      calculateStats(updatedItems);
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      alert('Gallery item updated successfully!');
      
    } catch (error) {
      console.error('Error updating gallery item:', error);
      alert('Failed to update gallery item. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const statCards = stats ? [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: FileImage,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Photos',
      value: stats.totalPhotos,
      icon: Image,
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Videos',
      value: stats.totalVideos,
      icon: Video,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Active',
      value: stats.activeItems,
      icon: CheckCircle,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: TrendingUp,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-100'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
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
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage photos, videos, and media content</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Media</span>
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
              placeholder="Search gallery items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Items Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Media</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Details</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Category & Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Engagement</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const status = getStatusText(item.status, item.isActive);
                const isActive = item.status === 'active' || item.isActive;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://i.postimg.cc/KjNm2YQt/default-gallery.jpg';
                            }}
                          />
                          {item.type === 'video' && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <HardDrive className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{item.fileSize}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{item.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{item.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Camera className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{item.uploadedBy}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <span className="text-sm text-gray-900 capitalize">{item.type}</span>
                        </div>
                        <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status, item.isActive)}`}>
                        {getStatusIcon(item.status, item.isActive)}
                        <span>{status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{item.views || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{item.likes || 0} likes</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {typeof item.date === 'string' 
                            ? new Date(item.date).toLocaleDateString()
                            : formatApiDate(item.date)
                          }
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewItem(item)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Item"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item.id, isActive)}
                          disabled={actionLoading === item.id}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                            isActive 
                              ? 'text-gray-600 hover:text-orange-600 hover:bg-orange-50' 
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={isActive ? 'Deactivate' : 'Activate'}
                        >
                          {isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={actionLoading === item.id}
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery items found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by uploading your first media item'
              }
            </p>
            {(!searchTerm && typeFilter === 'all' && categoryFilter === 'all' && statusFilter === 'all') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300"
              >
                Upload Media
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Gallery Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload Media</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Media Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Media Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="community">Community</option>
                    <option value="education">Education</option>
                    <option value="technology">Technology</option>
                    <option value="arts">Arts</option>
                    <option value="events">Events</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Title */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Enter media title"
                  />
                </div>

                {/* Media URL */}
                <div className="md:col-span-2">
                  <label htmlFor="src" className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'video' ? 'Thumbnail Image URL *' : 'Image URL *'}
                  </label>
                  <input
                    type="url"
                    id="src"
                    name="src"
                    value={formData.src}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder={formData.type === 'video' ? 'https://example.com/thumbnail.jpg' : 'https://example.com/image.jpg'}
                  />
                </div>

                {/* Video URL - Only for videos */}
                {formData.type === 'video' && (
                  <div className="md:col-span-2">
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL *
                    </label>
                    <input
                      type="url"
                      id="videoUrl"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      required={formData.type === 'video'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=... or direct video URL"
                    />
                  </div>
                )}

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Participants */}
                <div>
                  <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
                    Participants
                  </label>
                  <input
                    type="number"
                    id="participants"
                    name="participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Number of participants"
                  />
                </div>

                {/* Photographer */}
                <div>
                  <label htmlFor="photographer" className="block text-sm font-medium text-gray-700 mb-2">
                    Photographer/Videographer
                  </label>
                  <input
                    type="text"
                    id="photographer"
                    name="photographer"
                    value={formData.photographer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Credit for the media"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Type a tag and press Enter or comma"
                    onKeyDown={handleTagInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-amber-600 hover:text-amber-800"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Describe the media content"
                  />
                </div>

                {/* Active Status */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-amber-600 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active (visible to public)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {formLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    'Upload Media'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Gallery Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Media</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                  resetForm();
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Media Type */}
                <div>
                  <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Media Type *
                  </label>
                  <select
                    id="edit-type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="community">Community</option>
                    <option value="education">Education</option>
                    <option value="technology">Technology</option>
                    <option value="arts">Arts</option>
                    <option value="events">Events</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Title */}
                <div className="md:col-span-2">
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Media URL */}
                <div className="md:col-span-2">
                  <label htmlFor="edit-src" className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'video' ? 'Thumbnail Image URL *' : 'Image URL *'}
                  </label>
                  <input
                    type="url"
                    id="edit-src"
                    name="src"
                    value={formData.src}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Video URL - Only for videos */}
                {formData.type === 'video' && (
                  <div className="md:col-span-2">
                    <label htmlFor="edit-videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL *
                    </label>
                    <input
                      type="url"
                      id="edit-videoUrl"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      required={formData.type === 'video'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Location */}
                <div>
                  <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="edit-location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="edit-date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Participants */}
                <div>
                  <label htmlFor="edit-participants" className="block text-sm font-medium text-gray-700 mb-2">
                    Participants
                  </label>
                  <input
                    type="number"
                    id="edit-participants"
                    name="participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Photographer */}
                <div>
                  <label htmlFor="edit-photographer" className="block text-sm font-medium text-gray-700 mb-2">
                    Photographer/Videographer
                  </label>
                  <input
                    type="text"
                    id="edit-photographer"
                    name="photographer"
                    value={formData.photographer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Type a tag and press Enter or comma"
                    onKeyDown={handleTagInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-amber-600 hover:text-amber-800"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>

                {/* Active Status */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-amber-600 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active (visible to public)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {formLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Update Media'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Gallery Item Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">View Media</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedItem(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Media Header */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center space-x-3 mb-2">
                  {selectedItem.type === 'video' ? (
                    <Video className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Image className="w-6 h-6 text-green-600" />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900">{selectedItem.title}</h1>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{typeof selectedItem.date === 'string' 
                      ? new Date(selectedItem.date).toLocaleDateString()
                      : formatApiDate(selectedItem.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedItem.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{selectedItem.participants} participants</span>
                  </div>
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <span className="capitalize">{selectedItem.category}</span>
                  </span>
                </div>
              </div>

              {/* Media Display */}
              <div className="rounded-lg overflow-hidden bg-gray-100">
                {selectedItem.type === 'video' ? (
                  <div className="relative">
                    <img
                      src={selectedItem.src}
                      alt={selectedItem.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://i.postimg.cc/KjNm2YQt/default-media.jpg';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                    {selectedItem.videoUrl && (
                      <div className="mt-3">
                        <a
                          href={selectedItem.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>Watch Video</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://i.postimg.cc/KjNm2YQt/default-media.jpg';
                    }}
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedItem.description}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics and Credit */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedItem.views || 0}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedItem.likes || 0}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedItem.isActive ? 'Active' : 'Inactive'}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 capitalize">{selectedItem.type}</div>
                  <div className="text-sm text-gray-600">Media Type</div>
                </div>
              </div>

              {/* Photographer Credit */}
              {selectedItem.photographer && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      Credit: <span className="font-medium">{selectedItem.photographer}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditItem(selectedItem);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Media
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedItem(null);
                }}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;