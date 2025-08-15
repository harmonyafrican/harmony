import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Heart, Award, MapPin, ArrowRight, ChevronDown, Target, Globe, Star, FileText } from 'lucide-react';
import { impactApi, type ImpactMetric, type SuccessStory, type RegionalImpact } from '../services/impactApi';

const ImpactPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const [showAnnualReport, setShowAnnualReport] = useState(false);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [regionalImpactData, setRegionalImpactData] = useState<RegionalImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    fetchImpactData();
  }, []);

  useEffect(() => {
    if (impactMetrics.length > 0) {
      const interval = setInterval(() => {
        setActiveMetric(prev => (prev + 1) % impactMetrics.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [impactMetrics.length]);

  const fetchImpactData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [metrics, stories, regional] = await Promise.all([
        impactApi.getImpactMetrics(),
        impactApi.getSuccessStories(6),
        impactApi.getRegionalImpact()
      ]);
      
      setImpactMetrics(metrics);
      setSuccessStories(stories);
      setRegionalImpactData(regional);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch impact data');
      console.error('Impact data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleSupportMission = () => {
    navigate('/programs');
  };

  const handleViewAnnualReport = () => {
    setShowAnnualReport(true);
  };

  const closeAnnualReport = () => {
    setShowAnnualReport(false);
  };

  // Icon mapping for metrics
  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'lives_transformed': return <Heart className="w-8 h-8" />;
      case 'success_rate': return <TrendingUp className="w-8 h-8" />;
      case 'communities': return <Globe className="w-8 h-8" />;
      case 'programs': return <Award className="w-8 h-8" />;
      default: return <Target className="w-8 h-8" />;
    }
  };

  // Program impacts will be derived from success stories by program type
  const programImpacts = [
    {
      title: 'Educational Excellence',
      description: 'Breaking barriers to quality education through scholarships and technology access.',
      achievements: [
        '500+ students enrolled in quality schools',
        '92% exam pass rate among beneficiaries',
        '15 rural schools equipped with technology',
        '200+ digital literacy certificates awarded'
      ],
      image: 'https://i.postimg.cc/m2n34pCP/education-impact.jpg',
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Technology Empowerment',
      description: 'Bridging the digital divide with coding bootcamps and innovation labs.',
      achievements: [
        '300+ youth trained in coding and digital skills',
        '45 tech projects launched by participants',
        '8 innovation hubs established',
        '120+ job placements in tech sector'
      ],
      image: 'https://i.postimg.cc/76xZhvw4/tech-impact.jpg',
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Community Development',
      description: 'Strengthening families and communities through holistic support programs.',
      achievements: [
        '800+ families supported with livelihood training',
        '25 community centers established',
        '150+ local mentors trained and active',
        '95% community engagement rate'
      ],
      image: 'https://i.postimg.cc/d1xfmqjG/community-impact.jpg',
      color: 'from-green-400 to-emerald-600'
    },
    {
      title: 'Creative Arts & Innovation',
      description: 'Nurturing talents through arts, music, and creative expression programs.',
      achievements: [
        '400+ youth participated in arts programs',
        '50+ talented artists discovered and mentored',
        '12 cultural festivals organized',
        '30+ youth started creative enterprises'
      ],
      image: 'https://i.postimg.cc/MKcq3nLm/arts-impact.jpg',
      color: 'from-amber-400 to-orange-600'
    }
  ];



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading impact data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Failed to Load Impact Data</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={fetchImpactData}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Our Impact
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Measuring the real difference we make in communities across Rwanda through education, technology, and innovation.
            </p>
          </div>

          {/* Key Impact Metrics */}
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            {impactMetrics.map((metric, index) => (
              <div
                key={metric.id || index}
                className={`transform transition-all duration-700 delay-${index * 150} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } ${activeMetric === index ? 'scale-110' : 'scale-100'}`}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300 text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${metric.color} text-white mb-6 shadow-lg`}>
                    {getMetricIcon(metric.category)}
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2`}>
                    {metric.number}
                  </div>
                  <div className="text-slate-600 font-medium tracking-wide text-sm uppercase">
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Program Impacts */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Program Impact</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Each of our programs creates measurable, lasting change in the lives of young people and their communities.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              {programImpacts.map((program, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 delay-${index * 200} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:scale-105 transition-all duration-300">
                    <div className="relative h-48">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-bold text-white mb-2">{program.title}</h3>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-slate-600 leading-relaxed mb-6">{program.description}</p>
                      <div className="space-y-3">
                        {program.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} className="flex items-start gap-3">
                            <div className={`p-1 rounded-full bg-gradient-to-r ${program.color} mt-1`}>
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-slate-700 leading-relaxed">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Success Stories</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Real stories from real people whose lives have been transformed through our programs.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {successStories.slice(0, 6).map((story, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 delay-${index * 200} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 h-full">
                    <div className="flex items-center mb-6">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-amber-200"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{story.name}</h3>
                        <p className="text-slate-600">Age {story.age} • {story.location}</p>
                        <p className="text-amber-600 text-sm font-medium">{story.program}</p>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-6">{story.story}</p>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        <span className="font-bold text-slate-800">Key Achievement</span>
                      </div>
                      <p className="text-slate-700 text-sm">{story.achievement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Impact */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Regional Reach</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Our programs span across all provinces of Rwanda, creating impact in both urban and rural communities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {regionalImpactData.map((region, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 delay-${index * 150} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 h-full">
                    <div className="text-center mb-4">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${region.color} text-white mb-4 shadow-lg`}>
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{region.region}</h3>
                      <p className="text-sm text-slate-600 leading-tight">{region.description}</p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">Beneficiaries:</span>
                        <span className={`font-bold bg-gradient-to-r ${region.color} bg-clip-text text-transparent`}>
                          {region.beneficiaries}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">Programs:</span>
                        <span className={`font-bold bg-gradient-to-r ${region.color} bg-clip-text text-transparent`}>
                          {region.programs}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">Communities:</span>
                        <span className={`font-bold bg-gradient-to-r ${region.color} bg-clip-text text-transparent`}>
                          {region.communities}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-bold text-slate-800 text-sm mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {region.keyAchievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex} className="flex items-start gap-2">
                            <div className={`p-0.5 rounded-full bg-gradient-to-r ${region.color} mt-1.5 flex-shrink-0`}>
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            <span className="text-xs text-slate-700 leading-tight">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Geographic Distribution */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Geographic Distribution</h3>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  From the bustling innovation hubs of Kigali to the remote farming communities in all provinces, our impact creates a network of empowered youth across Rwanda.
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Urban Centers</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                        <div>
                          <div className="font-bold text-slate-800">Kigali City</div>
                          <div className="text-sm text-slate-600">Innovation & Tech Hub</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">485</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                        <div>
                          <div className="font-bold text-slate-800">Musanze (Northern)</div>
                          <div className="text-sm text-slate-600">Tourism & Agriculture</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">167</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                        <div>
                          <div className="font-bold text-slate-800">Huye (Southern)</div>
                          <div className="text-sm text-slate-600">Education Center</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">189</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Rural Communities</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                        <div>
                          <div className="font-bold text-slate-800">Western Province</div>
                          <div className="text-sm text-slate-600">22 Rural Communities</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">312</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                        <div>
                          <div className="font-bold text-slate-800">Eastern Province</div>
                          <div className="text-sm text-slate-600">20 Border Communities</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">298</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                        <div>
                          <div className="font-bold text-slate-800">Remote Areas</div>
                          <div className="text-sm text-slate-600">Mobile Programs</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Be Part of Our Impact</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Every contribution, no matter the size, creates ripples of positive change that transform lives and build stronger communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={handleSupportMission}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Support Our Mission
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={handleViewAnnualReport}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-amber-200 text-slate-800 font-bold rounded-full text-lg hover:bg-white transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                View Annual Report
              </button>
            </div>
          </div>
        </section>

        {/* Annual Report Modal */}
        {showAnnualReport && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="relative p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-3xl border-b border-amber-200">
                <button 
                  onClick={closeAnnualReport}
                  className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
                >
                  <ArrowRight className="w-6 h-6 text-gray-800 rotate-45" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl shadow-lg">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">2024 Annual Impact Report</h2>
                    <p className="text-xl text-gray-600 mt-1">Harmony Africa Foundation</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-12">
                {/* Executive Summary */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Executive Summary</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        In 2024, Harmony Africa Foundation expanded its reach to all 5 provinces of Rwanda, 
                        transforming lives through comprehensive education, technology, and innovation programs.
                      </p>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-800 mb-3">Key Achievements</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Reached 1,551 beneficiaries across 91 communities
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Maintained 91% success rate across all programs
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Launched 38 active programs nationwide
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            Achieved 100% provincial coverage
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-800 mb-4">Impact by Numbers</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Youth Empowered', value: '1,551', color: 'text-blue-600' },
                          { label: 'Communities', value: '91', color: 'text-green-600' },
                          { label: 'Programs', value: '38', color: 'text-purple-600' },
                          { label: 'Success Rate', value: '91%', color: 'text-amber-600' },
                          { label: 'Provinces', value: '5/5', color: 'text-red-600' },
                          { label: 'Scholarships', value: '312', color: 'text-indigo-600' }
                        ].map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-gray-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Performance */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Program Performance</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {[
                      {
                        title: 'Education Excellence',
                        beneficiaries: 578,
                        successRate: 94,
                        highlights: ['312 scholarships awarded', '15 schools equipped', '94% exam pass rate']
                      },
                      {
                        title: 'Technology Innovation',
                        beneficiaries: 423,
                        successRate: 89,
                        highlights: ['8 innovation labs', '120 job placements', '45 startups launched']
                      },
                      {
                        title: 'Community Development',
                        beneficiaries: 312,
                        successRate: 92,
                        highlights: ['25 centers established', '800 families supported', '150 mentors trained']
                      },
                      {
                        title: 'Creative Arts',
                        beneficiaries: 238,
                        successRate: 87,
                        highlights: ['50 artists mentored', '12 festivals organized', '30 enterprises started']
                      }
                    ].map((program, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-3">{program.title}</h4>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-600">Beneficiaries: <strong>{program.beneficiaries}</strong></span>
                          <span className="text-sm text-gray-600">Success: <strong>{program.successRate}%</strong></span>
                        </div>
                        <ul className="space-y-1">
                          {program.highlights.map((highlight, highlightIndex) => (
                            <li key={highlightIndex} className="flex items-center gap-2 text-sm text-gray-700">
                              <Star className="w-3 h-3 text-amber-500" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Overview */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Financial Overview</h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-3xl font-bold text-green-600 mb-2">$850K</div>
                        <div className="text-sm text-gray-600">Total Budget</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
                        <div className="text-sm text-gray-600">Program Spending</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">8%</div>
                        <div className="text-sm text-gray-600">Operations</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-amber-600 mb-2">5%</div>
                        <div className="text-sm text-gray-600">Fundraising</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Looking Forward */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">2025 Goals</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800">Growth Targets</h4>
                      <ul className="space-y-3">
                        {[
                          'Reach 2,500 beneficiaries (+61%)',
                          'Expand to 150 communities (+65%)',
                          'Launch 15 new programs (+39%)',
                          'Achieve 95% success rate (+4%)'
                        ].map((goal, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <div className="p-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800">Strategic Initiatives</h4>
                      <ul className="space-y-3">
                        {[
                          'Digital learning platform launch',
                          'Regional expansion planning',
                          'Corporate partnership program',
                          'Alumni mentorship network'
                        ].map((initiative, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <div className="p-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">{initiative}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Mission</h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Help us reach our 2025 goals and create even greater impact across Rwanda and beyond.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => {
                        closeAnnualReport();
                        handleSupportMission();
                      }}
                      className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Heart className="w-5 h-5" />
                      Support Our Programs
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        closeAnnualReport();
                        navigate('/get-involved');
                      }}
                      className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-all duration-300"
                    >
                      Get Involved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;