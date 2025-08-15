import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Target, 
  Users, 
  Globe, 
  Award, 
  BookOpen, 
  Lightbulb, 
  ArrowRight,
  Star,
  TrendingUp,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const navigate = useNavigate();

  // Navigation handlers
  const handleGetInvolved = () => {
    navigate('/get-involved');
  };

  const handleLearnMore = () => {
    navigate('/programs');
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTimeline(prev => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Shared data from Mission.tsx
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

  const timeline = [
    {
      year: '2023',
      title: 'Foundation Launched',
      description: 'Harmony Africa Foundation was established to empower youth through education and technology.',
      milestone: 'Initial Setup',
      color: 'from-amber-400 to-orange-500'
    },
    {
      year: '2024',
      title: 'First Community Engagement',
      description: 'Conducted our first community outreach program in Kigali, engaging local youth and families.',
      milestone: 'Community Outreach',
      color: 'from-green-400 to-emerald-500'
    },
    {
      year: '2025',
      title: 'Foundation Established',
      description: 'Harmony Africa Foundation was officially registered in Rwanda with a mission to empower youth.',
      milestone: 'Legal Registration Complete',
      color: 'from-blue-400 to-purple-500'
    },
    {
      year: '2025',
      title: 'First Programs Launch',
      description: 'Launched our inaugural educational support and digital literacy programs in Kigali.',
      milestone: 'Programs Initiated',
      color: 'from-green-400 to-emerald-500'
    },
    {
      year: '2026',
      title: 'Rural Expansion',
      description: 'Extended our reach to rural communities, establishing learning centers outside urban areas.',
      milestone: 'Geographic Growth',
      color: 'from-amber-400 to-orange-500'
    },
    {
      year: '2027',
      title: 'Innovation Labs',
      description: 'Opened our first innovation labs equipped with modern technology and maker spaces.',
      milestone: 'Infrastructure Development',
      color: 'from-pink-400 to-red-500'
    },
    {
      year: '2028',
      title: 'Regional Impact',
      description: 'Expanded programs to neighboring countries, creating a regional network of youth empowerment.',
      milestone: 'Regional Presence',
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  const team = [
    {
      name: 'Nkomeje Felecien',
      role: 'Executive Secretary',
      description: 'Dynamic leader with a passion for youth empowerment and community development.',
      image: 'https://i.postimg.cc/rsmpnSFT/Whats-App-Image-2025-08-15-at-15-45-00.jpg',
      color: 'from-blue-400 to-purple-500'
    },
    {
      name: 'Irakoze Jean Marie',
      role: 'Founder & Guardian',
      description: 'Visionary leader with a passion for education and technology, dedicated to transforming lives.',
      image: 'https://i.postimg.cc/wvwZXvp5/Whats-App-Image-2025-08-15-at-16-19-14.jpg',
      color: 'from-green-400 to-emerald-500'
    },
    {
      name: 'Jean Marie Vianney',
      role: 'Innovation Lead & Advisor',
      description: 'Tech enthusiast and strategist, driving innovation and digital transformation in youth programs.',
      image: 'https://i.postimg.cc/qRvy86nf/Screenshot-2025-06-30-at-16-16-58.png',
      color: 'from-amber-400 to-orange-500'
    }
  ];

  // Impact areas from Mission.tsx
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
      stats: '100+ youth trained',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Community Development',
      description: 'Engaging families and communities to create supportive environments for youth development.',
      stats: '15+ communities reached',
      icon: <Users className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Innovation Hubs',
      description: 'Creating spaces where young minds can explore, innovate, and develop entrepreneurial skills.',
      stats: '2+ innovation projects',
      icon: <Star className="w-6 h-6" />,
      color: 'from-pink-500 to-red-500'
    }
  ];

  const achievements = [
    { number: '100+', label: 'Youth Empowered', icon: <Users className="w-6 h-6" /> },
    { number: '15+', label: 'Communities Served', icon: <Globe className="w-6 h-6" /> },
    { number: '6+', label: 'Active Programs', icon: <BookOpen className="w-6 h-6" /> },
    { number: '100+', label: 'Mentors Trained', icon: <Award className="w-6 h-6" /> }
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
        <section className="container mx-auto px-6 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              About <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">Us</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover our journey, values, and commitment to empowering Africa's youth through transformative education and innovation
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white mr-4 shadow-lg">
                      <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Our Vision</h2>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
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
                  <div className="flex items-center text-amber-600 font-semibold group cursor-pointer">
                    <span className="mr-2">Learn more about our vision</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl text-white mr-4 shadow-lg">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Our Mission</h2>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
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
                  <div className="flex items-center text-blue-600 font-semibold group cursor-pointer">
                    <span className="mr-2">Explore our mission in action</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-4 shadow-2xl">
                  <img
                    src="https://i.postimg.cc/434sc8tX/bill-wegener-hs98-9hz-Tc-U-unsplash.jpg"
                    alt="Students working together in modern classroom"
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                  <div className="absolute inset-4 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl flex items-end">
                    <div className="text-white p-6">
                      <p className="text-lg font-semibold mb-2">Empowering Future Leaders</p>
                      <p className="text-sm opacity-90">Through education and innovation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Our Core Values</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                The principles that guide our work and define our commitment to transforming lives
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:-translate-y-4 group h-full">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey Timeline */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Our Journey</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                From our founding to today, see how we've grown and the milestones we've achieved
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
              
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative`}
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${item.color} border-4 border-white shadow-lg ${
                      activeTimeline === index ? 'scale-150' : 'scale-100'
                    } transition-transform duration-500`}></div>
                    
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <div className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 ${
                        activeTimeline === index ? 'ring-2 ring-amber-400/50 bg-white/80' : ''
                      }`}>
                        <div className="flex items-center mb-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white text-sm font-bold mr-4`}>
                            {item.year}
                          </div>
                          <span className="text-sm text-slate-500 font-medium">{item.milestone}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Our Team</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Meet the passionate individuals driving our mission forward
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${member.color} text-white mr-3`}>
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-slate-500 font-medium">{member.role}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{member.name}</h3>
                    <p className="text-slate-600 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Areas of Impact</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Through focused initiatives, we create meaningful change in key areas that matter most to youth development
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
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
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">{area.title}</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">{area.description}</p>
                      <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${area.color} text-white font-medium text-sm`}>
                        {area.stats}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Our Impact by Numbers</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300"
                >
                  <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white mb-6 shadow-lg">
                    {achievement.icon}
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-slate-600 font-medium">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-12 text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
                Be part of our journey to empower Africa's youth and create lasting change in communities across Rwanda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleGetInvolved}
                  className="px-8 py-4 bg-white text-amber-600 font-bold rounded-full text-lg hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Get Involved
                </button>
                <button 
                  onClick={handleLearnMore}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-full text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;