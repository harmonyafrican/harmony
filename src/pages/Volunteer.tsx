import React, { useState, useEffect } from 'react';
import { Users, Heart, Clock, MapPin, Mail, Phone, Calendar, ArrowRight, ChevronDown, GraduationCap, Monitor, Lightbulb, Star, Globe, UserPlus, Award } from 'lucide-react';
import { volunteerApi, type VolunteerOpportunity, type VolunteerApplication, type ProgramVolunteerRole, categorizeOpportunity, getCategoryColor } from '../services/volunteerApi';

// Icon mapping for volunteer categories
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Education': return <GraduationCap className="w-6 h-6" />;
    case 'Technology': return <Monitor className="w-6 h-6" />;
    case 'Arts & Culture': return <Lightbulb className="w-6 h-6" />;
    case 'Community Development': return <Globe className="w-6 h-6" />;
    case 'Events & Programs': return <Calendar className="w-6 h-6" />;
    case 'Communications': return <Star className="w-6 h-6" />;
    default: return <UserPlus className="w-6 h-6" />;
  }
};

const VolunteerPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [programRoles, setProgramRoles] = useState<ProgramVolunteerRole[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [showProgramSpecific, setShowProgramSpecific] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use selectedOpportunity for logging (prevents unused variable warning)
  React.useEffect(() => {
    if (selectedOpportunity) {
      console.log('Selected opportunity:', selectedOpportunity.title);
    }
  }, [selectedOpportunity]);
  const [formData, setFormData] = useState<VolunteerApplication>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    skills: [],
    availability: '',
    motivation: '',
    programId: '',
    opportunityId: '',
    preferredRole: ''
  });
  
  const [skillsInput, setSkillsInput] = useState('');

  // Get unique programs for filtering
  const availablePrograms = Array.from(
    new Map(programRoles.map(role => [role.program.id, role.program])).values()
  );

  // Filter opportunities based on selected program
  const filteredProgramRoles = selectedProgramId 
    ? programRoles.filter(role => role.programId === selectedProgramId)
    : programRoles;

  // Combined opportunities for display
  const displayOpportunities = showProgramSpecific 
    ? filteredProgramRoles.map(role => ({
        id: role.id,
        title: role.title,
        description: role.description,
        requirements: role.requirements,
        timeCommitment: role.timeCommitment,
        location: role.program.location,
        contactEmail: 'volunteers@harmony-africa.org',
        isActive: true,
        spotsAvailable: role.spotsAvailable,
        category: role.category,
        skills: role.skills,
        impact: role.impact,
        color: role.color,
        programId: role.programId,
        program: role.program,
        createdAt: { _seconds: Date.now() / 1000, _nanoseconds: 0 },
        updatedAt: { _seconds: Date.now() / 1000, _nanoseconds: 0 }
      }))
    : opportunities;

  useEffect(() => {
    setIsVisible(true);
    fetchVolunteerOpportunities();
  }, []);

  const fetchVolunteerOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both general opportunities and program-specific roles
      const [opportunitiesData, programRolesData] = await Promise.all([
        volunteerApi.getVolunteerOpportunities(),
        volunteerApi.getProgramVolunteerRoles()
      ]);
      
      // Enhance general opportunities with frontend display data
      const enhancedOpportunities = opportunitiesData.map(opportunity => ({
        ...opportunity,
        category: categorizeOpportunity(opportunity.title, opportunity.description),
        color: getCategoryColor(categorizeOpportunity(opportunity.title, opportunity.description)),
        skills: [], // Will be populated from requirements for display
        impact: `${opportunity.spotsAvailable || 'Multiple'} positions available`
      }));
      
      setOpportunities(enhancedOpportunities);
      setProgramRoles(programRolesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch volunteer opportunities');
      console.error('Volunteer opportunities fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const volunteerStats = [
    { number: '250+', label: 'Active Volunteers', icon: <Users className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
    { number: '5,000+', label: 'Hours Contributed', icon: <Clock className="w-6 h-6" />, color: 'from-green-400 to-green-600' },
    { number: '15+', label: 'Volunteer Programs', icon: <Award className="w-6 h-6" />, color: 'from-purple-400 to-purple-600' },
    { number: '98%', label: 'Satisfaction Rate', icon: <Star className="w-6 h-6" />, color: 'from-amber-400 to-amber-600' }
  ];


  const benefits = [
    {
      title: 'Skill Development',
      description: 'Gain valuable experience and develop new skills while making a difference.',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Community Impact',
      description: 'See the direct positive impact of your contributions in local communities.',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-pink-400 to-rose-600'
    },
    {
      title: 'Networking',
      description: 'Connect with like-minded individuals and build meaningful relationships.',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-400 to-emerald-600'
    },
    {
      title: 'Recognition',
      description: 'Receive certificates and recognition for your volunteer contributions.',
      icon: <Award className="w-8 h-8" />,
      color: 'from-amber-400 to-orange-600'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'skillsInput') {
      setSkillsInput(value);
      // Convert comma-separated skills to array
      const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      setFormData({
        ...formData,
        skills: skillsArray
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      await volunteerApi.submitVolunteerApplication(formData);
      
      alert('Thank you for your volunteer application! We\'ll review your application and be in touch within 3-5 business days.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        skills: [],
        availability: '',
        motivation: '',
        programId: '',
        opportunityId: '',
        preferredRole: ''
      });
      setSkillsInput('');
      setSelectedOpportunity(null);
      
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      alert('Sorry, there was an error submitting your application. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading volunteer opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Failed to Load Volunteer Opportunities</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={fetchVolunteerOpportunities}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Volunteer With Us
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Join our community of dedicated volunteers and help empower Africa's youth through education, technology, and innovation.
            </p>
          </div>

          {/* Volunteer Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            {volunteerStats.map((stat, index) => (
              <div
                key={index}
                className={`transform transition-all duration-700 delay-${index * 150} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300 text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-6 shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-medium tracking-wide text-sm uppercase">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Volunteer */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Why Volunteer With Us?</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Volunteering with Harmony Africa Foundation is more than giving back—it's about growing personally while creating lasting change.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 delay-${index * 150} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${benefit.color} text-white mb-6 shadow-lg`}>
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Volunteer Opportunities</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Find the perfect opportunity to share your skills and passion with young people who need your support.
              </p>
            </div>

            {/* Program Filter Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-slate-800">Filter Opportunities:</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="opportunityType"
                        checked={showProgramSpecific}
                        onChange={() => setShowProgramSpecific(true)}
                        className="text-blue-500"
                      />
                      <span className="text-slate-700">Program-Specific Roles</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="opportunityType"
                        checked={!showProgramSpecific}
                        onChange={() => setShowProgramSpecific(false)}
                        className="text-blue-500"
                      />
                      <span className="text-slate-700">General Opportunities</span>
                    </label>
                  </div>
                </div>
                
                {showProgramSpecific && (
                  <div className="flex items-center gap-4">
                    <label className="text-slate-700 font-medium">Select Program:</label>
                    <select
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      <option value="">All Programs</option>
                      {availablePrograms.map(program => (
                        <option key={program.id} value={program.id}>
                          {program.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-20">
              {displayOpportunities.map((opportunity, index) => (
                <div
                  key={opportunity.id}
                  className={`transform transition-all duration-700 delay-${index * 100} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${opportunity.color} text-white shadow-lg`}>
                          {getCategoryIcon(opportunity.category || 'General')}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{opportunity.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${opportunity.color} text-white`}>
                              {opportunity.category}
                            </span>
                            {opportunity.program && (
                              <span className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                                📚 {opportunity.program.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6">{opportunity.description}</p>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-700">{opportunity.timeCommitment}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-700">{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-700">{opportunity.impact}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-bold text-slate-800 mb-3">Skills Needed:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(opportunity.skills || []).map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedOpportunity(opportunity);
                        // Pre-fill form with opportunity data
                        setFormData(prev => ({
                          ...prev,
                          programId: opportunity.programId || '',
                          opportunityId: opportunity.id,
                          preferredRole: opportunity.title
                        }));
                        // Scroll to form
                        document.getElementById('volunteer-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full py-3 bg-gradient-to-r ${opportunity.color} text-white font-bold rounded-full hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2`}
                    >
                      Volunteer This Program
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="volunteer-form" className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Ready to Get Started?</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 leading-relaxed">
                Fill out our volunteer application form and we'll match you with the perfect opportunity.
              </p>
            </div>

            {/* Selected Opportunity Info */}
            {selectedOpportunity && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedOpportunity.color} text-white`}>
                    {getCategoryIcon(selectedOpportunity.category || 'General')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Applying for: {selectedOpportunity.title}</h3>
                    {selectedOpportunity.program && (
                      <p className="text-slate-600">Program: {selectedOpportunity.program.title}</p>
                    )}
                    <p className="text-sm text-slate-500">Time Commitment: {selectedOpportunity.timeCommitment}</p>
                  </div>
                </div>
                <p className="text-slate-700">{selectedOpportunity.description}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOpportunity(null);
                    setFormData(prev => ({ ...prev, programId: '', opportunityId: '', preferredRole: '' }));
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear selection and apply for general volunteer opportunities
                </button>
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Availability</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    >
                      <option value="">Select your availability</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="evenings">Evenings</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>


                <div>
                  <label className="block text-slate-700 font-bold mb-2">Skills & Expertise</label>
                  <input
                    type="text"
                    name="skillsInput"
                    value={skillsInput}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    placeholder="Enter your skills separated by commas (e.g., Teaching, Programming, Event Planning)"
                  />
                </div>


                <div>
                  <label className="block text-slate-700 font-bold mb-2">Why do you want to volunteer with us?</label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                    placeholder="Share your motivation and what you hope to achieve through volunteering..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <UserPlus className="w-5 h-5" />
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Questions About Volunteering?</h3>
                <p className="text-slate-600">Our volunteer coordinator is here to help you get started.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>Kigali, Rwanda</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span>volunteer@harmonyafrica.org</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <span>+250 785 300 820</span>
                </div>
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

export default VolunteerPage;