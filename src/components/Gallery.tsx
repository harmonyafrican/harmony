import { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Play, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Award,
  Heart,
  BookOpen,
  Monitor,
  Palette,
  Loader2
} from 'lucide-react';
import { galleryApi, type GalleryItem, type GalleryStats, formatDate as formatApiDate } from '../services/galleryApi';

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryStats, setGalleryStats] = useState<GalleryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<string[]>([]);

  useEffect(() => {
    setIsVisible(true);
    // Load liked items from localStorage
    const savedLikes = localStorage.getItem('likedGalleryItems');
    if (savedLikes) {
      setLikedItems(JSON.parse(savedLikes));
    }
    
    // Fetch gallery data from API
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const [itemsData, statsData] = await Promise.all([
        galleryApi.getGalleryItems(),
        galleryApi.getGalleryStats()
      ]);
      
      setGalleryItems(itemsData);
      setGalleryStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to load gallery items. Please try again later.');
      console.error('Error fetching gallery data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle image error loading
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== 'https://i.postimg.cc/KjNm2YQt/default-gallery.jpg') {
      target.src = 'https://i.postimg.cc/KjNm2YQt/default-gallery.jpg';
    }
  };

  // Handle like functionality
  const handleLikeItem = (itemId: string) => {
    const newLikedItems = likedItems.includes(itemId)
      ? likedItems.filter(id => id !== itemId)
      : [...likedItems, itemId];
    
    setLikedItems(newLikedItems);
    localStorage.setItem('likedGalleryItems', JSON.stringify(newLikedItems));
    
    // Optionally call API to update like count
    galleryApi.likeGalleryItem(itemId).catch(console.error);
  };

  // Generate categories dynamically from gallery items
  const categories = (() => {
    const categoryMap = new Map<string, number>();
    
    galleryItems.forEach(item => {
      const category = item.category.toLowerCase();
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const dynamicCategories = Array.from(categoryMap.entries()).map(([id, count]) => {
      const iconMap = {
        education: <BookOpen className="w-5 h-5" />,
        technology: <Monitor className="w-5 h-5" />,
        arts: <Palette className="w-5 h-5" />,
        community: <Users className="w-5 h-5" />,
        events: <Award className="w-5 h-5" />,
        other: <ImageIcon className="w-5 h-5" />
      };
      
      return {
        id,
        name: id === 'arts' ? 'Arts & Culture' : id.charAt(0).toUpperCase() + id.slice(1),
        icon: iconMap[id as keyof typeof iconMap] || iconMap.other,
        count
      };
    });

    return [
      { id: 'all', name: 'All', icon: <ImageIcon className="w-5 h-5" />, count: galleryItems.length },
      ...dynamicCategories
    ];
  })();

  // Filter items by category
  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openModal = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredItems[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredItems[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Our <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Capturing moments of transformation, learning, and community impact across our programs
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchGalleryData}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      {!loading && !error && galleryStats && (
        <div className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                  {galleryStats.totalPhotos}+
                </div>
                <div className="text-gray-600 font-medium">Photos</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {galleryStats.totalVideos}+
                </div>
                <div className="text-gray-600 font-medium">Videos</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                  {galleryStats.totalEvents}+
                </div>
                <div className="text-gray-600 font-medium">Events</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent mb-2">
                  {galleryStats.totalMemories}+
                </div>
                <div className="text-gray-600 font-medium">Memories</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {!loading && !error && (
        <div className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-sm border ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-lg'
                      : 'bg-white/80 text-gray-700 border-white/20 hover:bg-white/90 hover:scale-105'
                  }`}
                >
                  {category.icon}
                  <span>{category.name} ({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && !error && (
        <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`group relative rounded-2xl overflow-hidden shadow-xl bg-white/80 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => openModal(item, index)}
              >
                <div className="relative h-64 overflow-hidden">
                  {item.type === 'video' ? (
                    <div className="relative h-full">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-amber-500 ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={handleImageError}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Like button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeItem(item.id);
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                      likedItems.includes(item.id)
                        ? 'bg-red-500/90 text-white'
                        : 'bg-white/90 text-red-500 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatApiDate(item.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{item.participants}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl mx-auto">
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-96 md:h-[600px]">
                {selectedImage.type === 'video' ? (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Play className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Video Player Placeholder</p>
                      <p className="text-sm text-gray-400 mt-2">Click to play video</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {selectedImage.title}
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  {selectedImage.description}
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Calendar className="w-6 h-6 text-amber-500 mb-2" />
                    <div className="font-medium text-gray-800">Date</div>
                    <div className="text-gray-600">
                      {formatApiDate(selectedImage.date)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-amber-500 mb-2" />
                    <div className="font-medium text-gray-800">Location</div>
                    <div className="text-gray-600">{selectedImage.location}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="w-6 h-6 text-amber-500 mb-2" />
                    <div className="font-medium text-gray-800">Participants</div>
                    <div className="text-gray-600">{selectedImage.participants}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;