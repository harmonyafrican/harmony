import { useState, useEffect } from 'react';
import { 
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  Search,
  ArrowRight,
  TrendingUp,
  X,
  Bookmark,
  Send,
  CheckCircle,
  Facebook,
  Twitter
} from 'lucide-react';
import { blogApi, type BlogPost, formatDate as formatApiDate } from '../services/blogApi';

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showFullPost, setShowFullPost] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [sharePost, setSharePost] = useState<BlogPost | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{[key: string]: Array<{
    id: number;
    text: string;
    author: string;
    date: string;
    avatar: string;
  }>}>({});
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    // Load bookmarked posts from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedPosts');
    if (savedBookmarks) {
      setBookmarkedPosts(JSON.parse(savedBookmarks));
    }
    // Load liked posts from localStorage
    const savedLikes = localStorage.getItem('likedPosts');
    if (savedLikes) {
      setLikedPosts(JSON.parse(savedLikes));
    }
    
    // Fetch blog posts from API
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    // Check URL parameters for shared posts after posts are loaded
    if (blogPosts.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      if (postId) {
        const post = blogPosts.find(p => p.id === postId);
        if (post) {
          setSelectedPost(post);
          setShowFullPost(true);
        }
      }
    }
  }, [blogPosts]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const posts = await blogApi.getBlogPosts();
      setBlogPosts(posts);
      setError(null);
    } catch (err) {
      setError('Failed to load blog posts. Please try again later.');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate categories dynamically from blog posts
  const categories = (() => {
    const categoryMap = new Map<string, number>();
    
    blogPosts.forEach(post => {
      const category = post.category.toLowerCase();
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const dynamicCategories = Array.from(categoryMap.entries()).map(([id, count]) => ({
      id,
      name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      count
    }));

    return [
      { id: 'all', name: 'All Posts', count: blogPosts.length },
      ...dynamicCategories
    ];
  })();


  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category.toLowerCase() === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // For now, we'll use high view counts as "featured" and high like counts as "trending"
  const featuredPosts = blogPosts
    .filter(post => post.views > 1000)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);
  
  const trendingPosts = blogPosts
    .filter(post => post.likes > 70)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4);

  // Helper function to calculate read time from content
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Bookmark functionality
  const handleBookmarkPost = (postId: string) => {
    const newBookmarked = bookmarkedPosts.includes(postId)
      ? bookmarkedPosts.filter(id => id !== postId)
      : [...bookmarkedPosts, postId];
    
    setBookmarkedPosts(newBookmarked);
    localStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarked));
  };

  // Like functionality
  const handleLikePost = (postId: string) => {
    const newLiked = likedPosts.includes(postId)
      ? likedPosts.filter(id => id !== postId)
      : [...likedPosts, postId];
    
    setLikedPosts(newLiked);
    localStorage.setItem('likedPosts', JSON.stringify(newLiked));
  };

  // Read more functionality
  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    setShowFullPost(true);
  };

  // Share functionality
  const handleShare = (post: BlogPost) => {
    setSharePost(post);
    setShowShareMenu(true);
  };

  const handleSocialShare = (platform: string) => {
    if (!sharePost) return;
    
    const postUrl = `${window.location.origin}${window.location.pathname}?post=${sharePost.id}`;
    const shareText = `Check out this inspiring blog post: ${sharePost.title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${postUrl}`)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${postUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        alert('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
    setShowShareMenu(false);
  };

  // Subscribe functionality
  const handleSubscribe = async () => {
    if (email.trim()) {
      try {
        await blogApi.subscribeToNewsletter(email);
        setSubscribed(true);
        setTimeout(() => {
          setSubscribed(false);
          setEmail('');
        }, 3000);
      } catch (error) {
        console.error('Subscription failed:', error);
        alert('Subscription failed. Please try again.');
      }
    }
  };

  // Tag filter functionality
  const handleTagFilter = (tag: string) => {
    setSearchTerm(tag);
    setActiveCategory('all');
  };

  // Comment functionality
  const handleAddComment = (postId: string) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        author: 'Reader',
        date: new Date().toISOString(),
        avatar: 'https://i.postimg.cc/KjNm2YQt/default-avatar.jpg'
      };
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      
      setNewComment('');
    }
  };

  // Trending post click
  const handleTrendingPostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setShowFullPost(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Our <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Stories of transformation, insights on education, technology trends, and updates from the heart of Africa's youth empowerment movement
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
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
                onClick={fetchBlogPosts}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Posts */}
      {!loading && !error && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Featured Stories</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
            </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <div
                key={post.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative h-48">
                  <img
                    src={post.featuredImage || 'https://i.postimg.cc/KjNm2YQt/default-blog.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                    {trendingPosts.some(tp => tp.id === post.id) && (
                      <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.postimg.cc/KjNm2YQt/default-avatar.jpg"
                        alt={post.author}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{post.author}</div>
                        <div className="text-xs text-gray-500">{formatApiDate(post.publishedAt)}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{calculateReadTime(post.content)} min read</div>
                  </div>
                  
                  <button 
                    onClick={() => handleReadMore(post)}
                    className="w-full px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* Search and Filter */}
      {!loading && !error && (
      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Main Content Grid */}
      {!loading && !error && (
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Blog Posts */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {filteredPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-[1.02] transition-all duration-300 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 relative">
                        <img
                          src={post.featuredImage || 'https://i.postimg.cc/KjNm2YQt/default-blog.jpg'}
                          alt={post.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        {trendingPosts.some(tp => tp.id === post.id) && (
                          <div className="absolute top-4 right-4">
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-md capitalize">
                            {post.category.replace('-', ' ')}
                          </span>
                          {post.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h2 
                          onClick={() => handleReadMore(post)}
                          className="text-2xl font-bold text-gray-800 mb-3 hover:text-amber-600 transition-colors cursor-pointer"
                        >
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src="https://i.postimg.cc/KjNm2YQt/default-avatar.jpg"
                              alt={post.author}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-800">{post.author}</div>
                              <div className="text-sm text-gray-500">{post.category}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatApiDate(post.publishedAt)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {calculateReadTime(post.content)} min
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </div>
                            <button 
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                                likedPosts.includes(post.id) ? 'text-red-500' : ''
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                              {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                            </button>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleBookmarkPost(post.id)}
                              className={`p-2 hover:text-amber-500 transition-colors ${
                                bookmarkedPosts.includes(post.id) ? 'text-amber-500' : 'text-gray-400'
                              }`}
                            >
                              {bookmarkedPosts.includes(post.id) ? 
                                <Bookmark className="w-4 h-4 fill-current" /> : 
                                <BookmarkPlus className="w-4 h-4" />
                              }
                            </button>
                            <button 
                              onClick={() => handleShare(post)}
                              className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleReadMore(post)}
                              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300 flex items-center gap-1"
                            >
                              Read More
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Trending Posts */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {trendingPosts.map((post) => (
                    <div 
                      key={post.id} 
                      onClick={() => handleTrendingPostClick(post)}
                      className="flex gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer"
                    >
                      <img
                        src={post.featuredImage || 'https://i.postimg.cc/KjNm2YQt/default-blog.jpg'}
                        alt={post.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800 line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{formatApiDate(post.publishedAt)}</span>
                          <span>•</span>
                          <span>{calculateReadTime(post.content)} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Stay Updated</h3>
                <p className="text-gray-600 mb-6">
                  Get the latest stories and updates delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <button 
                    onClick={handleSubscribe}
                    disabled={subscribed}
                    className={`w-full px-4 py-2 font-medium rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 ${
                      subscribed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                    }`}
                  >
                    {subscribed ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Subscribed!
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Education', 'Technology', 'Success Stories', 'Innovation', 'Community', 'Leadership', 'Digital Learning', 'Youth', 'Entrepreneurship'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-amber-100 hover:text-amber-700 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Full Post Modal */}
      {showFullPost && selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 pr-8">{selectedPost.title}</h2>
              <button 
                onClick={() => setShowFullPost(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <img
                src={selectedPost.featuredImage || 'https://i.postimg.cc/KjNm2YQt/default-blog.jpg'}
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.postimg.cc/KjNm2YQt/default-avatar.jpg"
                    alt={selectedPost.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-800">{selectedPost.author}</div>
                    <div className="text-gray-600">{selectedPost.category}</div>
                    <div className="text-sm text-gray-500">{formatApiDate(selectedPost.publishedAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleBookmarkPost(selectedPost.id)}
                    className={`p-2 hover:text-amber-500 transition-colors ${
                      bookmarkedPosts.includes(selectedPost.id) ? 'text-amber-500' : 'text-gray-400'
                    }`}
                  >
                    {bookmarkedPosts.includes(selectedPost.id) ? 
                      <Bookmark className="w-5 h-5 fill-current" /> : 
                      <BookmarkPlus className="w-5 h-5" />
                    }
                  </button>
                  <button 
                    onClick={() => handleShare(selectedPost)}
                    className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleLikePost(selectedPost.id)}
                    className={`p-2 hover:text-red-500 transition-colors flex items-center gap-1 ${
                      likedPosts.includes(selectedPost.id) ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts.includes(selectedPost.id) ? 'fill-current' : ''}`} />
                    <span>{selectedPost.likes + (likedPosts.includes(selectedPost.id) ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    onClick={() => {
                      handleTagFilter(tag);
                      setShowFullPost(false);
                    }}
                    className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-md cursor-pointer hover:bg-amber-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="prose max-w-none mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">{selectedPost.excerpt}</p>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-4">{selectedPost.content}</p>
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="mb-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p className="mb-4">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({selectedPost.comments + (comments[selectedPost.id]?.length || 0)})
                </h3>
                
                {/* Add Comment */}
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    disabled={!newComment.trim()}
                    className="mt-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </div>
                
                {/* Comments List */}
                <div className="space-y-4">
                  {comments[selectedPost.id]?.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">{comment.author}</span>
                          <span className="text-sm text-gray-500">{formatApiDate(comment.date)}</span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Menu Modal */}
      {showShareMenu && sharePost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Share Post</h3>
              <button 
                onClick={() => setShowShareMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">{sharePost.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{sharePost.excerpt}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </button>
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center gap-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={() => handleSocialShare('email')}
                className="flex items-center gap-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                Email
              </button>
              <button
                onClick={() => handleSocialShare('copy')}
                className="flex items-center gap-2 p-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors col-span-2"
              >
                <ArrowRight className="w-5 h-5" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;