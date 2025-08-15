import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart,
  Star,
  Users,
  Target,
  Globe,
  Lightbulb,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Eye,
  Compass
} from 'lucide-react';

const Mission = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeValue, setActiveValue] = useState(0);
  const navigate = useNavigate();

  const handleSupportMission = () => {
    navigate('/donate');
  };

  const handleGetInvolved = () => {
    navigate('/get-involved');
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveValue(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const coreValues = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Compassion',
      description: 'We approach every youth with empathy and understanding, recognizing their unique potential and challenges.',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Inclusion',
      description: 'We ensure that every child, regardless of background, has access to opportunities for growth and development.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      description: 'We embrace creative solutions and cutting-edge approaches to solve educational and social challenges.',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Excellence',
      description: 'We strive for the highest standards in all our programs and maintain quality in everything we do.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Sustainability',
      description: 'We build programs and partnerships that create lasting impact for communities across Africa.',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and accountability in all our relationships and operations.',
      color: 'from-slate-400 to-gray-500'
    }
  ];

  const impactAreas = [
    {
      title: 'Educational Excellence',
      description: 'Providing scholarships, learning materials, and access to quality education for underserved youth.',
      stats: '1000+ students supported',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Digital Literacy',
      description: 'Bridging the digital divide through technology training and computer access programs.',
      stats: '500+ youth trained',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Community Development',
      description: 'Engaging families and communities to create supportive environments for youth development.',
      stats: '50+ communities reached',
      icon: <Users className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Innovation Hubs',
      description: 'Creating spaces where young minds can explore, innovate, and develop entrepreneurial skills.',
      stats: '25+ innovation projects',
      icon: <Star className="w-6 h-6" />,
      color: 'from-pink-500 to-red-500'
    }
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Foundation Launched',
      description: 'Harmony Africa Foundation was established to empower youth through education and technology.',
      milestone: 'Foundation Established'
    },
    {
      year: '2025',
      title: 'Foundation Established',
      description: 'Harmony Africa Foundation was officially registered in Rwanda with a mission to empower youth.',
      milestone: 'Legal Registration Complete'
    },
    {
      year: '2025',
      title: 'First Programs Launch',
      description: 'Launched our inaugural educational support and digital literacy programs in Kigali.',
      milestone: 'Programs Initiated'
    },
    {
      year: '2026',
      title: 'Rural Expansion',
      description: 'Extended our reach to rural communities, establishing learning centers outside urban areas.',
      milestone: 'Geographic Growth'
    },
    {
      year: '2027',
      title: 'Innovation Labs',
      description: 'Opened our first innovation labs equipped with modern technology and maker spaces.',
      milestone: 'Infrastructure Development'
    },
    {
      year: '2028',
      title: 'Regional Impact',
      description: 'Expanded programs to neighboring countries, creating a regional network of youth empowerment.',
      milestone: 'Regional Presence'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Our <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Mission</span> & Vision
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover the driving force behind Harmony Africa Foundation and our commitment to empowering Africa's youth
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Mission Card */}
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 h-full">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white mr-6">
                      <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    To empower Africa's youth through education, technology, and innovation, nurturing their talents and fostering sustainable development in communities across Rwanda and beyond.
                  </p>
                  <div className="space-y-3">
                    {[
                      'Provide quality education and learning opportunities',
                      'Bridge the digital divide through technology access',
                      'Foster innovation and entrepreneurial thinking',
                      'Build strong, supportive communities'
                    ].map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-600">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vision Card */}
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 h-full">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-white mr-6">
                      <Eye className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    A world where every child has the opportunity to realize their potential and contribute to the growth and prosperity of their communities, creating a brighter future for Africa.
                  </p>
                  <div className="space-y-3">
                    {[
                      'Every youth has access to quality education',
                      'Technology empowers communities across Africa',
                      'Innovation drives sustainable development',
                      'Strong partnerships create lasting impact'
                    ].map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-600">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-white/40 backdrop-blur-sm py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Core Values</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                These fundamental principles guide everything we do and shape how we serve communities across Africa
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                    activeValue === index ? 'ring-2 ring-amber-400/50 bg-white/90 scale-105' : ''
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} text-white mb-4 shadow-lg`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Areas Section */}
        <div className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Areas of Impact</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Through focused initiatives, we create meaningful change in key areas that matter most to youth development
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {impactAreas.map((area, index) => (
                <div
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 group ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${area.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {area.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{area.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{area.description}</p>
                      <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${area.color} text-white font-medium text-sm`}>
                        {area.stats}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="bg-white/40 backdrop-blur-sm py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Journey</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                From humble beginnings to regional impact - here's our story of growth and transformation
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>

              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-16 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                          {item.year}
                        </span>
                        <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium rounded-full">
                          {item.milestone}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white mb-6">
                <Compass className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Join Our Mission</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Together, we can create a future where every young person in Africa has the opportunity to thrive and contribute to their community's prosperity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleSupportMission}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300"
                >
                  <Heart className="w-5 h-5" />
                  Support Our Mission
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleGetInvolved}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-amber-400 text-amber-600 font-bold rounded-full text-lg hover:bg-amber-50 transition-all duration-300"
                >
                  <Users className="w-5 h-5" />
                  Get Involved
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;