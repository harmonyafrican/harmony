import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Monitor, Lightbulb, Users, ChevronDown, Star, BookOpen, Heart, TrendingUp, ArrowRight, Camera, Play, MapPin, Phone, Mail } from 'lucide-react';
import { galleryApi, type GalleryItem } from '../services/galleryApi';

const HarmonyAfricaHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeObjective, setActiveObjective] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const navigate = useNavigate();

  // Navigation handlers
  const handleExplorePrograms = () => {
    navigate('/programs');
  };

  const handleGetInvolved = () => {
    navigate('/get-involved');
  };

  const handleViewGallery = () => {
    navigate('/gallery');
  };

  const handleDonateNow = () => {
    navigate('/donate');
  };

  const handleVolunteer = () => {
    navigate('/volunteer');
  };

  const handlePartnerWithUs = () => {
    navigate('/get-involved');
  };

  // Fetch gallery items
  const fetchGalleryItems = async () => {
    try {
      setLoadingGallery(true);
      const items = await galleryApi.getGalleryItems();
      // Filter only active items and limit to 6 for the hero section
      const activeItems = items.filter(item => item.isActive).slice(0, 6);
      setGalleryItems(activeItems);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      // Keep static fallback if API fails
      setGalleryItems([]);
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    fetchGalleryItems();
    const interval = setInterval(() => {
      setActiveObjective(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: '100+', label: 'YOUTH EMPOWERED', color: 'from-amber-400 to-amber-600' },
    { number: '15+', label: 'COMMUNITIES SERVED', color: 'from-blue-400 to-blue-600' },
    { number: '10+', label: 'PROGRAMS ACTIVE', color: 'from-green-400 to-green-600' }
  ];

  const pillars = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Education',
      description: 'Scholarships and learning opportunities',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: 'Technology',
      description: 'Digital literacy and coding programs',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Creative labs and talent development',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'Family support and mentorship',
      color: 'from-green-400 to-emerald-500'
    }
  ];

  const objectives = [
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Talent Development',
      description: 'Identify, nurture, and showcase the unique talents of children and youth across diverse fields including arts, technology, and leadership.',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Educational Support',
      description: 'Provide scholarships, learning materials, digital literacy programs, and access to technological resources for underserved communities.',
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Engagement',
      description: 'Mobilize parents, local leaders, and youth mentors to foster a supportive environment for growth and development.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Sustainable Development',
      description: 'Drive initiatives that enable long-term economic and social benefits for communities, including entrepreneurship and vocational training.',
      color: 'from-pink-400 to-red-500'
    }
  ];

  const whoWeServe = [
    {
      title: 'Primary & Secondary Students',
      description: 'Supporting academic excellence and providing essential learning resources',
      stats: '100+ Students',
      image: 'https://i.postimg.cc/m2n34pCP/primary-students.jpg',
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Youth (16-30)',
      description: 'Empowering with digital skills, entrepreneurship, and job opportunities',
      stats: '50+ Youth',
      image: 'https://i.postimg.cc/NjNpZt4w/1745576230543.jpg',
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Rural Communities',
      description: 'Bridging the digital divide in remote areas across Rwanda',
      stats: '15+ Communities',
      image: 'https://i.postimg.cc/mgKfKKBh/theory-of-digital-divide.jpg',
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Women & Girls',
      description: 'Breaking barriers and creating opportunities in STEM fields',
      stats: '20+ Beneficiaries',
      image: 'https://i.postimg.cc/fWvskHjg/29735334417-6c62b1187a-c.jpg',
      color: 'from-pink-400 to-pink-600'
    }
  ];

  // Static fallback gallery for when API is unavailable or during loading
  const fallbackGallery = [
    {
      type: 'image' as const,
      src: 'https://i.postimg.cc/br1jRTKd/jaron-mobley-bi-O8-ZY7-Byqo-unsplash.jpg',
      title: 'workshop session',
      description: 'Youth learning coding skills in a workshop',
      id: 'fallback-1'
    },
    {
      type: 'image' as const,
      src: 'https://i.postimg.cc/VLyfbS3d/dwayne-joe-rn-Kh5l328-Ns-unsplash.jpg',
      title: 'Arts & Crafts',
      description: 'Creative arts session with children',
      id: 'fallback-2'
    },
    {
      type: 'video' as const,
      src: 'https://youtu.be/Lt8lsgkqcnc?si=qsKOGVClx_hNYmed',
      videoUrl: 'https://youtu.be/Lt8lsgkqcnc?si=qsKOGVClx_hNYmed',
      thumbnail: 'https://i.postimg.cc/SxNwXkNn/Screenshot-2025-08-07-at-21-01-07.png',
      title: 'Empowering Youth',
      description: 'Empowering Rwanda s Youth: A Day of Talent and Joy in Rutsiro',
      id: 'fallback-3'
    },
    {
      type: 'video' as const,
      src: 'https://youtu.be/5_XYnlrtM8A?si=TycCUNk9unwUdgQW',
      videoUrl: 'https://youtu.be/5_XYnlrtM8A?si=TycCUNk9unwUdgQW',
      thumbnail: 'https://i.postimg.cc/dtMCtV69/Screenshot-2025-08-07-at-21-01-15.png',
      title: 'Performances at Rutsiro Open Day',
      description: 'Exciting Performances at the Rutsiro District Open Day!',
      id: 'fallback-4'
    },
    {
      type: 'image' as const,
      src: 'https://i.postimg.cc/Z5Wz7Jk1/22-540x360.jpg',
      title: 'Innovation Lab',
      description: 'Modern learning spaces equipped with technology',
      id: 'fallback-5'
    },
    {
      type: 'image' as const,
      src: 'https://i.postimg.cc/NjNpZt4w/1745576230543.jpg',
      title: 'Youth Empowerment',
      description: 'Empowering youth through mentorship and skills training',
      id: 'fallback-6'
    }
  ];

  // Use dynamic gallery items if available, otherwise fallback to static
  const displayGallery = galleryItems.length > 0 ? galleryItems : fallbackGallery;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full">
        {/* Hero Section */}
        <section className="w-full">
          {/* Hero Content and Image */}
          <div className="relative w-full max-w-none px-6 pt-20 pb-16">
            {/* Hero Image */}
            <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden mb-12 group">
              {/* Background Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-3xl"></div>
              <img
                src="https://i.postimg.cc/m2n34pCP/michael-ali-w-Gfht4p-Lnng-unsplash.jpg"
                alt="African children learning with laptops in classroom"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {/* Hero Text Overlay */}
              <div className={`absolute inset-0 flex flex-col justify-center items-center text-center text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-block mb-4">
                  <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
                    Harmony
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight drop-shadow-2xl">
                  Africa Foundation
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
                  Empowering Africa's talented youths through education, technology, and innovation
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={handleExplorePrograms}
                    className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Explore Our Programs
                  </button>
                  <button 
                    onClick={handleGetInvolved}
                    className="px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-full text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105"
                  >
                    Get Involved
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 -mt-20 relative z-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 delay-${index * 200} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                    <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-slate-600 font-medium tracking-wide text-sm">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Four Pillars */}
            <div className="grid md:grid-cols-4 gap-6 mb-20">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className={`transform transition-all duration-700 delay-${index * 100} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${pillar.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white/40 backdrop-blur-sm py-20 w-full">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">About Us</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Harmony Africa Foundation is a Rwandan non-profit organization dedicated to empowering youth across Rwanda by leveraging education, technology, and innovation.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-2 shadow-2xl">
                  <img
                    src="https://i.postimg.cc/JnnwXjCg/Screenshot-2025-08-07-at-21-01-07.png"
                    alt="Students collaborating with technology"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white mr-4">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Our Vision</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    A world where every child has the opportunity to realize their potential and contribute to the growth and prosperity of their communities.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl text-white mr-4">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Our Mission</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    To empower Africa's youth through education, technology, and innovation, nurturing their talents and fostering sustainable development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Objectives */}
        <section className="py-20 w-full">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Core Objectives</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {objectives.map((objective, index) => (
                <div
                  key={index}
                  className={`bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                    activeObjective === index ? 'ring-2 ring-amber-400/50 bg-white/80' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${objective.color} text-white flex-shrink-0 shadow-lg`}>
                      {objective.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{objective.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{objective.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Serve Section */}
        <section className="bg-white/40 backdrop-blur-sm py-20 w-full">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Who We Serve</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Our programs reach diverse communities across Rwanda, empowering individuals at every stage of their educational and professional journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whoWeServe.map((group, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 delay-${index * 100} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 group">
                    <div className="relative h-48">
                      <img
                        src={group.image}
                        alt={group.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white font-bold text-sm bg-gradient-to-r ${group.color}`}>
                        {group.stats}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{group.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{group.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Impact in Action - Gallery Section */}
        <section className="py-20 w-full">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Our Impact in Action</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                See how we're making a difference in the lives of African youth through education, technology, and innovation.
              </p>
            </div>

            {/* Gallery Grid */}
            {loadingGallery ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20">
                    <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {displayGallery.map((item, index) => (
                  <div
                    key={galleryItems.length > 0 ? item.id || index : index}
                    className={`transform transition-all duration-700 delay-${index * 50} ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  >
                    <div 
                      className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer"
                      onClick={() => {
                        if (item.type === 'video') {
                          const videoUrl = item.videoUrl || (item as any).src;
                          if (videoUrl) {
                            window.open(videoUrl, '_blank');
                          }
                        }
                      }}
                    >
                      <div className="relative h-64">
                        {item.type === 'video' ? (
                          <>
                            <img
                              src={item.src || (item as any).thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                                <Play className="w-8 h-8 text-white" fill="currentColor" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={item.src}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                                <Camera className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-200">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gallery CTA */}
            <div className="text-center">
              <button 
                onClick={handleViewGallery}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300"
              >
                <Camera className="w-5 h-5" />
                View Full Gallery
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Join Our Mission Section */}
        <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 w-full">
          <div className="w-full max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Join Our Mission</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Together, we can create lasting change in communities across Africa. There are many ways to get involved and make a difference.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Donate */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 group">
                <div className="inline-flex p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Donate</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Your financial support directly funds scholarships, technology access, and educational programs for youth across Africa.
                </p>
                <button 
                  onClick={handleDonateNow}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300"
                >
                  Donate Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Volunteer */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 group">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Volunteer</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Share your skills and expertise by mentoring youth, teaching workshops, or supporting our programs as a volunteer.
                </p>
                <button 
                  onClick={handleVolunteer}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300"
                >
                  Get Involved
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Partner */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 group">
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Partner</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Join us as a corporate partner or institutional collaborator to amplify our impact and reach more communities.
                </p>
                <button 
                  onClick={handlePartnerWithUs}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300"
                >
                  Partner With Us
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to Make a Difference?</h3>
                <p className="text-slate-600">Contact us to learn more about how you can contribute to our mission.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <span>Kigali, Rwanda</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <span>info@harmonyafrica.org</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <span>+250 785 300 820</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Status */}
        <section className="bg-white/40 backdrop-blur-sm py-16 w-full">
          <div className="w-full max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Legal Status</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-white mb-4">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Certificate</h3>
                <p className="text-slate-600">N° 96/RGB/FDNL.P/06/2025</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Type</h3>
                <p className="text-slate-600">Common-benefit Foundation</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Jurisdiction</h3>
                <p className="text-slate-600">Registered in Rwanda under Rwandan law</p>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default HarmonyAfricaHero;