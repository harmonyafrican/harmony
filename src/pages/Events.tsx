import { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Tag,
  Heart,
  Share2,
  X,
  CheckCircle,
  Copy,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  User,
  CreditCard,
  Shield,
  Video,
  Upload,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';
import { eventsApi, type EventRecord, formatDate as formatApiDate, formatTime as formatApiTime } from '../services/eventsApi';

// Flutterwave TypeScript declarations for paid events
interface FlutterwaveResponse {
  status: string;
  transaction_id: string;
  tx_ref: string;
  flw_ref: string;
  amount: number;
  currency: string;
  customer: {
    id: number;
    email: string;
    phone_number: string;
    name: string;
  };
}

interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  callback: (response: FlutterwaveResponse) => void;
  onclose: () => void;
}

declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig) => void;
  }
}

const Events = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareEventId, setShareEventId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    dietary: '',
    accessibility: '',
    // TalentPulse specific fields
    talentVideo: null as File | null,
    talentDescription: '',
    socialMedia: {
      instagram: '',
      youtube: '',
      tiktok: '',
      facebook: '',
      linkedin: ''
    }
  });
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Load liked events from localStorage
    const savedLikes = localStorage.getItem('likedEvents');
    if (savedLikes) {
      setLikedEvents(JSON.parse(savedLikes));
    }
    
    // Fetch events from API
    fetchEvents();
  }, []);

  useEffect(() => {
    // Check for event ID in URL parameters after events are loaded
    if (events.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('event');
      
      if (eventId) {
        const event = events.find(e => e.id === eventId);
        if (event) {
          setSelectedEvent(event);
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, [events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventsApi.getEvents();
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Event interaction handlers
  const handleLikeEvent = (eventId: string) => {
    const newLikedEvents = likedEvents.includes(eventId)
      ? likedEvents.filter(id => id !== eventId)
      : [...likedEvents, eventId];
    
    setLikedEvents(newLikedEvents);
    localStorage.setItem('likedEvents', JSON.stringify(newLikedEvents));
  };

  const handleShareEvent = (eventId: string) => {
    setShareEventId(eventId);
    setShowShareMenu(true);
  };

  const handleCopyEventLink = () => {
    const eventUrl = `${window.location.origin}${window.location.pathname}?event=${shareEventId}`;
    navigator.clipboard.writeText(eventUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleSocialShare = (platform: string) => {
    const event = events.find(e => e.id === shareEventId);
    if (!event) return;
    
    const eventUrl = `${window.location.origin}${window.location.pathname}?event=${shareEventId}`;
    const shareText = `Join me at ${event.title} on ${formatApiDate(event.eventDate)} at ${event.location}!`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}&hashtags=HarmonyAfrica,Events,Rwanda`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + eventUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Invitation: ${event.title}`)}&body=${encodeURIComponent(shareText + '\n\nRegister here: ' + eventUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const closeShareMenu = () => {
    setShowShareMenu(false);
    setShareEventId(null);
    setCopySuccess(false);
  };

  const handleRegisterEvent = (event: EventRecord) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent?.ticketPrice || selectedEvent.ticketPrice === 0) {
      // Free event registration
      alert(`Registration successful for ${selectedEvent?.title}! You'll receive a confirmation email shortly.`);
      closeRegistrationModal();
    } else {
      // Paid event - process payment
      const amount = selectedEvent.ticketPrice;
      if (amount > 0) {
        initiateEventPayment(amount);
      }
    }
  };

  const initiateEventPayment = (amount: number) => {
    const paymentData = {
      public_key: 'FLWPUBK_TEST-f63b4432908e41840cf0e0576c3fba0e-X',
      tx_ref: `harmony-event-${selectedEvent?.id}-${Date.now()}`,
      amount: amount,
      currency: 'USD',
      payment_options: paymentMethod === 'mobile' ? 'mobilemoney' : paymentMethod === 'bank' ? 'banktransfer' : 'card',
      customer: {
        email: registrationForm.email || 'info@harmonyafrica.org',
        phone_number: registrationForm.phone || '+250700000000',
        name: registrationForm.fullName || 'Event Participant',
      },
      customizations: {
        title: `Event Registration: ${selectedEvent?.title}`,
        description: `Registration fee for ${selectedEvent?.title}`,
        logo: 'https://i.postimg.cc/Pqbgdm0n/harmony-logo.png',
      },
      callback: (response: FlutterwaveResponse) => {
        if (response.status === 'successful') {
          alert(`Payment successful! You're registered for ${selectedEvent?.title}. Confirmation details will be sent to your email.`);
          closeRegistrationModal();
        } else {
          alert('Payment was not completed. Please try again.');
        }
      },
      onclose: () => {
        console.log('Payment modal closed');
      },
    };

    if (window.FlutterwaveCheckout) {
      window.FlutterwaveCheckout(paymentData);
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.onload = () => {
        window.FlutterwaveCheckout(paymentData);
      };
      document.head.appendChild(script);
    }
  };

  const closeRegistrationModal = () => {
    setShowRegisterModal(false);
    setSelectedEvent(null);
    setRegistrationForm({
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      dietary: '',
      accessibility: '',
      talentVideo: null,
      talentDescription: '',
      socialMedia: {
        instagram: '',
        youtube: '',
        tiktok: '',
        facebook: '',
        linkedin: ''
      }
    });
  };

  const handleEventDetails = (event: EventRecord) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  // Generate categories dynamically from events
  const eventCategories = (() => {
    const categoryMap = new Map<string, number>();
    
    events.forEach(event => {
      const category = event.eventType.toLowerCase();
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const dynamicCategories = Array.from(categoryMap.entries()).map(([id, count]) => ({
      id,
      name: id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      count
    }));

    return [
      { id: 'all', name: 'All Events', count: events.length },
      ...dynamicCategories
    ];
  })();

  const filteredEvents = events.filter(event => {
    const matchesFilter = activeFilter === 'all' || event.eventType.toLowerCase() === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // For featured events, we'll use events with higher registered attendees
  const upcomingEvents = events
    .filter(event => event.isActive)
    .sort((a, b) => b.registeredAttendees - a.registeredAttendees)
    .slice(0, 3);

  const getRegistrationPercentage = (registered: number, capacity: number) => {
    if (!capacity) return 0;
    return Math.round((registered / capacity) * 100);
  };

  // Helper function to get event price display
  const getEventPrice = (event: EventRecord) => {
    if (!event.ticketPrice || event.ticketPrice === 0) return 'Free';
    return `$${event.ticketPrice}`;
  };

  // Helper function to check if event is featured (high attendance)
  const isEventFeatured = (event: EventRecord) => {
    return event.registeredAttendees > 50; // Consider featured if more than 50 registrations
  };

  // Helper function to check if event is TalentPulse
  const isTalentPulseEvent = (event: EventRecord) => {
    return event.title.toLowerCase().includes('talentpulse') || 
           event.description.toLowerCase().includes('talentpulse') ||
           event.title.toLowerCase().includes('talent pulse');
  };

  // Helper function to get event image with proper fallback
  const getEventImage = (event: EventRecord, fallbackUrl?: string) => {
    // Try multiple sources: images array (new), image field (current API), then fallback
    return event.images?.[0] || event.image || fallbackUrl || 'https://i.postimg.cc/KjNm2YQt/default-event.jpg';
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== 'https://i.postimg.cc/KjNm2YQt/default-event.jpg') {
      target.src = 'https://i.postimg.cc/KjNm2YQt/default-event.jpg';
    }
  };

  // Handle video file upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file must be smaller than 100MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }
      setRegistrationForm({...registrationForm, talentVideo: file});
    }
  };

  // Handle social media input changes
  const handleSocialMediaChange = (platform: string, value: string) => {
    setRegistrationForm({
      ...registrationForm,
      socialMedia: {
        ...registrationForm.socialMedia,
        [platform]: value
      }
    });
  };

  // Newsletter subscription handler
  const handleNewsletterSubscribe = async () => {
    if (newsletterEmail.trim()) {
      try {
        await eventsApi.subscribeToNewsletter(newsletterEmail);
        setNewsletterSubscribed(true);
        setTimeout(() => {
          setNewsletterSubscribed(false);
          setNewsletterEmail('');
        }, 3000);
      } catch (error) {
        console.error('Newsletter subscription failed:', error);
        alert('Subscription failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Upcoming <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Join us for workshops, competitions, seminars, and networking events designed to empower youth and build communities
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
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
                onClick={fetchEvents}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Events Preview */}
      {!loading && !error && (
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Events</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.filter(event => isEventFeatured(event)).map((event, index) => (
              <div
                key={event.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative h-48">
                  <img
                    src={getEventImage(event, 'https://i.postimg.cc/KjNm2YQt/default-event.jpg')}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{formatApiDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <button 
                    onClick={() => handleEventDetails(event)}
                    className="w-full px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Search and Filter Section */}
      {!loading && !error && (
      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {eventCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeFilter === category.id
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

      {/* Events Grid */}
      {!loading && !error && (
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-[1.02] transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="md:flex">
                  <div className="md:w-1/3 relative">
                    <img
                      src={getEventImage(event, 'https://i.postimg.cc/KjNm2YQt/default-event.jpg')}
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        event.isActive 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {isEventFeatured(event) && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-amber-400 text-white text-xs font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md capitalize">
                        {event.eventType.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-3" />
                        <span className="text-sm">{formatApiDate(event.eventDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-3" />
                        <span className="text-sm">{formatApiTime(event.eventDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-3" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-3" />
                        <span className="text-sm">
                          {event.registeredAttendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''} registered
                        </span>
                      </div>
                    </div>
                    
                    {/* Registration Progress */}
                    {event.maxAttendees && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Registration</span>
                        <span className="text-sm font-medium text-gray-800">
                          {getRegistrationPercentage(event.registeredAttendees, event.maxAttendees)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
                          style={{ width: `${getRegistrationPercentage(event.registeredAttendees, event.maxAttendees)}%` }}
                        ></div>
                      </div>
                    </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">{getEventPrice(event)}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleLikeEvent(event.id)}
                          className={`p-2 transition-colors ${
                            likedEvents.includes(event.id) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                          title={likedEvents.includes(event.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart className={`w-5 h-5 ${likedEvents.includes(event.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => handleShareEvent(event.id)}
                          className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                          title="Share event"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => event.isActive ? handleRegisterEvent(event) : handleEventDetails(event)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300"
                        >
                          {event.isActive ? 'Register' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Newsletter Signup */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl border border-white/20">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Never Miss an Event</h2>
            <p className="text-xl text-gray-600 mb-8">
              Subscribe to our newsletter to get notified about upcoming events, workshops, and opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-6 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <button 
                onClick={handleNewsletterSubscribe}
                disabled={newsletterSubscribed}
                className={`px-8 py-3 font-bold rounded-lg hover:scale-105 transition-all duration-300 ${
                  newsletterSubscribed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                }`}
              >
                {newsletterSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && !showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="relative">
              <img
                src={getEventImage(selectedEvent, 'https://i.postimg.cc/KjNm2YQt/default-event.jpg')}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-t-3xl"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-3xl"></div>
              <button 
                onClick={closeEventDetails}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-3">
                  {[selectedEvent.eventType].map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                <p className="text-white/90 text-lg">{selectedEvent.description}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="font-medium text-gray-800">{formatApiDate(selectedEvent.eventDate)}</div>
                        <div className="text-sm text-gray-600">{formatApiTime(selectedEvent.eventDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="font-medium text-gray-800">{selectedEvent.location}</div>
                        <div className="text-sm text-gray-600">{selectedEvent.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="font-medium text-gray-800">{selectedEvent.registeredAttendees}/{selectedEvent.maxAttendees || 'Unlimited'} registered</div>
                        <div className="text-sm text-gray-600">{getRegistrationPercentage(selectedEvent.registeredAttendees, selectedEvent.maxAttendees || 100)}% full</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="font-medium text-gray-800">Registration Fee</div>
                        <div className="text-xl font-bold text-amber-600">{selectedEvent.ticketPrice ? `$${selectedEvent.ticketPrice}` : 'Free'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Event Highlights</h3>
                  <ul className="space-y-3">
                    {selectedEvent.description.split('.').filter(sentence => sentence.trim()).slice(0, 3).map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Registration Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Registration Progress</span>
                  <span className="text-sm font-medium text-gray-800">
                    {selectedEvent.registeredAttendees}/{selectedEvent.maxAttendees || 'Unlimited'} ({getRegistrationPercentage(selectedEvent.registeredAttendees, selectedEvent.maxAttendees || 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getRegistrationPercentage(selectedEvent.registeredAttendees, selectedEvent.maxAttendees || 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => handleRegisterEvent(selectedEvent)}
                  className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  {!selectedEvent.ticketPrice ? 'Register Free' : `Register for $${selectedEvent.ticketPrice}`}
                </button>
                <button 
                  onClick={() => handleShareEvent(selectedEvent.id)}
                  className="px-8 py-4 bg-white border-2 border-amber-400 text-amber-600 font-bold rounded-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Registration Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Register for Event</h3>
                  <p className="text-gray-600 mt-1">{selectedEvent.title}</p>
                </div>
                <button 
                  onClick={closeRegistrationModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <div className="p-6">
              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.fullName}
                      onChange={(e) => setRegistrationForm({...registrationForm, fullName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={registrationForm.email}
                      onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={registrationForm.phone}
                      onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization (Optional)</label>
                    <input
                      type="text"
                      value={registrationForm.organization}
                      onChange={(e) => setRegistrationForm({...registrationForm, organization: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      placeholder="Your organization/company"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Requirements</label>
                  <input
                    type="text"
                    value={registrationForm.dietary}
                    onChange={(e) => setRegistrationForm({...registrationForm, dietary: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Any dietary restrictions or preferences"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accessibility Needs</label>
                  <input
                    type="text"
                    value={registrationForm.accessibility}
                    onChange={(e) => setRegistrationForm({...registrationForm, accessibility: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Any accessibility accommodations needed"
                  />
                </div>

                {/* TalentPulse Specific Fields */}
                {isTalentPulseEvent(selectedEvent) && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Video className="w-5 h-5 text-amber-500" />
                      TalentPulse Requirements
                    </h4>
                    
                    {/* Talent Video Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Talent Video <span className="text-red-500">*</span>
                        <span className="text-gray-500 text-xs ml-1">(Max 100MB, MP4/MOV/AVI formats)</span>
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-amber-400 transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="video-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                            >
                              <span>Upload your talent video</span>
                              <input
                                id="video-upload"
                                name="video-upload"
                                type="file"
                                accept="video/*"
                                required={isTalentPulseEvent(selectedEvent)}
                                className="sr-only"
                                onChange={handleVideoUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                          {registrationForm.talentVideo && (
                            <div className="mt-2 text-sm text-green-600 flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>{registrationForm.talentVideo.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Talent Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe Your Talent <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required={isTalentPulseEvent(selectedEvent)}
                        value={registrationForm.talentDescription}
                        onChange={(e) => setRegistrationForm({...registrationForm, talentDescription: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Tell us about your talent, what makes you unique, and what you'll be showcasing in your video..."
                      />
                    </div>

                    {/* Social Media Links */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Social Media Profiles <span className="text-gray-500 text-sm">(Optional)</span>
                      </label>
                      <div className="space-y-3">
                        {/* Instagram */}
                        <div className="flex items-center gap-3">
                          <Instagram className="w-5 h-5 text-pink-500 flex-shrink-0" />
                          <input
                            type="url"
                            value={registrationForm.socialMedia.instagram}
                            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            placeholder="https://instagram.com/yourusername"
                          />
                        </div>

                        {/* YouTube */}
                        <div className="flex items-center gap-3">
                          <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <input
                            type="url"
                            value={registrationForm.socialMedia.youtube}
                            onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            placeholder="https://youtube.com/channel/yourchannelid"
                          />
                        </div>

                        {/* TikTok */}
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex-shrink-0 bg-black text-white rounded-sm flex items-center justify-center text-xs font-bold">
                            T
                          </div>
                          <input
                            type="url"
                            value={registrationForm.socialMedia.tiktok}
                            onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            placeholder="https://tiktok.com/@yourusername"
                          />
                        </div>

                        {/* Facebook */}
                        <div className="flex items-center gap-3">
                          <Facebook className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <input
                            type="url"
                            value={registrationForm.socialMedia.facebook}
                            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            placeholder="https://facebook.com/yourusername"
                          />
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center gap-3">
                          <Linkedin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <input
                            type="url"
                            value={registrationForm.socialMedia.linkedin}
                            onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            placeholder="https://linkedin.com/in/yourusername"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Adding your social media profiles helps us promote your talent and connect you with opportunities.
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Method for Paid Events */}
                {selectedEvent.ticketPrice && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'mobile', label: 'Mobile Money', description: 'MTN/Airtel' },
                        { id: 'bank', label: 'Bank Transfer', description: 'Direct' },
                        { id: 'card', label: 'Credit Card', description: 'Visa/MC' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center text-sm ${
                            paymentMethod === method.id
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <div className="font-bold">{method.label}</div>
                          <div className="text-xs opacity-80">{method.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Event Summary */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h4 className="font-bold text-amber-800 mb-3">Registration Summary</h4>
                  <div className="space-y-2 text-sm text-amber-700">
                    <div className="flex justify-between">
                      <span>Event:</span>
                      <span className="font-medium">{selectedEvent.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{formatApiDate(selectedEvent.eventDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{formatApiTime(selectedEvent.eventDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{selectedEvent.location}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t border-amber-300 pt-2 mt-2">
                      <span>Registration Fee:</span>
                      <span>{selectedEvent.ticketPrice ? `$${selectedEvent.ticketPrice}` : 'Free'}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  {!selectedEvent.ticketPrice ? (
                    <>
                      <User className="w-5 h-5" />
                      Complete Registration
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay $${selectedEvent.ticketPrice} & Register
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Your information is secure and will not be shared</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Share Menu Modal */}
      {showShareMenu && shareEventId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300">
            {/* Share Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Share Event</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {events.find(e => e.id === shareEventId)?.title}
                  </p>
                </div>
                <button 
                  onClick={closeShareMenu}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="p-6 space-y-6">
              {/* Copy Link */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Direct Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate">
                    {`${window.location.origin}${window.location.pathname}?event=${shareEventId}`}
                  </div>
                  <button 
                    onClick={handleCopyEventLink}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      copySuccess 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200'
                    }`}
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Media Sharing */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Share on Social Media</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleSocialShare('facebook')}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-300"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700">Facebook</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSocialShare('twitter')}
                    className="flex items-center gap-3 px-4 py-3 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-all duration-300"
                  >
                    <Twitter className="w-5 h-5 text-sky-600" />
                    <span className="font-medium text-sky-700">Twitter</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSocialShare('whatsapp')}
                    className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-700">WhatsApp</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSocialShare('email')}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;