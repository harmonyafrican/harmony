import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Star, ArrowRight, Mail, Phone, MapPin, Calendar, Clock, Target, Lightbulb, BookOpen, DollarSign, Building, Shield } from 'lucide-react';
import { volunteerApi, type VolunteerOpportunity } from '../services/volunteerApi';
import { programsApi, type Program } from '../services/programsApi';
import { eventsApi, type EventRecord } from '../services/eventsApi';

// Flutterwave TypeScript declarations
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

const GetInvolvedPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('volunteer');
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(0);
  const [customDonationAmount, setCustomDonationAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Navigation handlers
  const handleVolunteerApplication = () => {
    navigate('/volunteer');
  };

  const handleViewPrograms = () => {
    navigate('/programs');
  };

  const handleDonateNow = (amount: number) => {
    setSelectedDonationAmount(amount);
    setCustomDonationAmount('');
    initiateFlutterwavePayment(amount);
  };

  const handleProceedToPayment = () => {
    const donationAmount = Number(customDonationAmount) || selectedDonationAmount;
    if (donationAmount > 0) {
      initiateFlutterwavePayment(donationAmount);
    } else {
      alert('Please enter a valid donation amount');
    }
  };

  const initiateFlutterwavePayment = (amount: number) => {
    const selectedTier = donationTiers.find(tier => parseInt(tier.amount.replace('$', '')) === amount);
    
    // Flutter payment configuration
    const paymentData = {
      public_key: 'FLWPUBK_TEST-f63b4432908e41840cf0e0576c3fba0e-X', // Replace with your actual public key
      tx_ref: `harmony-${Date.now()}`,
      amount: amount,
      currency: 'USD',
      payment_options: paymentMethod === 'mobile' ? 'mobilemoney' : paymentMethod === 'bank' ? 'banktransfer' : 'card',
      customer: {
        email: 'donor@harmonyafrica.org', // You'll collect this from a form
        phone_number: '+250700000000', // You'll collect this from a form
        name: 'Harmony Africa Donor', // You'll collect this from a form
      },
      customizations: {
        title: 'Harmony Africa Donation',
        description: `Donation: ${selectedTier?.title || 'General Support'}`,
        logo: 'https://i.postimg.cc/15BBN2MW/harmony-logo.png',
      },
      callback: (response: FlutterwaveResponse) => {
        console.log('Payment response:', response);
        if (response.status === 'successful') {
          // Handle successful payment
          alert('Thank you for your donation! You will receive a confirmation email shortly.');
        } else {
          // Handle failed payment
          alert('Payment was not completed. Please try again.');
        }
      },
      onclose: () => {
        console.log('Payment modal closed');
      },
    };

    // Load Flutterwave script and initiate payment
    if (window.FlutterwaveCheckout) {
      window.FlutterwaveCheckout(paymentData);
    } else {
      // Load Flutterwave script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.onload = () => {
        window.FlutterwaveCheckout(paymentData);
      };
      document.head.appendChild(script);
    }
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  // Fetch data from APIs
  const fetchInvolvementData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data from all APIs
      const [volunteersData, programsData, eventsData] = await Promise.all([
        volunteerApi.getVolunteerOpportunities(),
        programsApi.getPrograms(),
        eventsApi.getEvents()
      ]);
      
      // Take first 4 volunteer opportunities for overview
      setVolunteerOpportunities(volunteersData.slice(0, 4));
      setPrograms(programsData);
      
      // Filter for upcoming events
      const now = new Date();
      const upcoming = eventsData.filter(event => {
        const eventDate = typeof event.eventDate === 'string' 
          ? new Date(event.eventDate) 
          : new Date(event.eventDate._seconds * 1000);
        return eventDate > now && event.isActive;
      }).slice(0, 3);
      
      setUpcomingEvents(upcoming);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch involvement data');
      console.error('Get Involved data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    fetchInvolvementData();
  }, []);

  // Helper function to get category icon for volunteer opportunities
  const getCategoryIcon = (title: string) => {
    if (title.toLowerCase().includes('education') || title.toLowerCase().includes('tutor') || title.toLowerCase().includes('mentor')) {
      return <BookOpen className="w-6 h-6" />;
    }
    if (title.toLowerCase().includes('tech') || title.toLowerCase().includes('innovation') || title.toLowerCase().includes('digital')) {
      return <Lightbulb className="w-6 h-6" />;
    }
    if (title.toLowerCase().includes('community') || title.toLowerCase().includes('outreach') || title.toLowerCase().includes('coordinator')) {
      return <Users className="w-6 h-6" />;
    }
    if (title.toLowerCase().includes('arts') || title.toLowerCase().includes('creative') || title.toLowerCase().includes('talent')) {
      return <Heart className="w-6 h-6" />;
    }
    return <Star className="w-6 h-6" />;
  };

  // Helper function to get category color for volunteer opportunities
  const getCategoryColor = (title: string) => {
    if (title.toLowerCase().includes('education') || title.toLowerCase().includes('tutor') || title.toLowerCase().includes('mentor')) {
      return 'from-blue-400 to-blue-600';
    }
    if (title.toLowerCase().includes('tech') || title.toLowerCase().includes('innovation') || title.toLowerCase().includes('digital')) {
      return 'from-purple-400 to-purple-600';
    }
    if (title.toLowerCase().includes('community') || title.toLowerCase().includes('outreach') || title.toLowerCase().includes('coordinator')) {
      return 'from-green-400 to-green-600';
    }
    if (title.toLowerCase().includes('arts') || title.toLowerCase().includes('creative') || title.toLowerCase().includes('talent')) {
      return 'from-pink-400 to-pink-600';
    }
    return 'from-gray-400 to-gray-600';
  };

  // Transform volunteer opportunities for display
  const displayVolunteerOpportunities = volunteerOpportunities.map(opportunity => ({
    title: opportunity.title,
    description: opportunity.description,
    commitment: opportunity.timeCommitment,
    skills: opportunity.requirements.slice(0, 2).join(', '), // Show first 2 requirements as skills
    color: getCategoryColor(opportunity.title),
    icon: getCategoryIcon(opportunity.title)
  }));

  // Generate donation tiers based on real program data
  const donationTiers = programs.length > 0 ? programs.slice(0, 4).map((program, index) => {
    const tierAmounts = [25, 100, 250, 500];
    const tierImpacts = ['1 participant', '5 participants', '15 participants', '50 participants'];
    const amount = tierAmounts[index] || 100;
    
    return {
      amount: `$${amount}`,
      title: `${program.title} Supporter`,
      description: program.description.length > 80 
        ? program.description.substring(0, 80) + '...' 
        : program.description,
      impact: `${tierImpacts[index]} in ${program.title}`,
      color: program.color || 'from-blue-400 to-purple-500',
      programId: program.id
    };
  }) : [
    {
      amount: '$25',
      title: 'Education Supporter',
      description: 'Support educational initiatives for youth development',
      impact: '1 student supported',
      color: 'from-amber-400 to-orange-500',
      programId: undefined
    },
    {
      amount: '$100',
      title: 'Innovation Champion',
      description: 'Fund technology and innovation programs',
      impact: '5 students empowered',
      color: 'from-blue-400 to-purple-500',
      programId: undefined
    },
    {
      amount: '$250',
      title: 'Community Builder',
      description: 'Support community development initiatives',
      impact: '15 youth reached',
      color: 'from-green-400 to-emerald-500',
      programId: undefined
    },
    {
      amount: '$500',
      title: 'Program Partner',
      description: 'Fund comprehensive youth development programs',
      impact: '50 community members',
      color: 'from-purple-400 to-pink-500',
      programId: undefined
    }
  ];

  // Enhanced partnership types with real program integration
  const partnershipTypes = [
    {
      title: 'Corporate Sponsorship',
      description: `Partner with us for CSR initiatives and community impact. Support our ${programs.length} active programs`,
      benefits: ['Brand visibility', 'Employee engagement', 'Tax benefits', 'Impact reporting'],
      icon: <Building className="w-8 h-8" />,
      color: 'from-blue-400 to-blue-600',
      programs: programs.filter(p => p.category === 'community_development' || p.category === 'education').length
    },
    {
      title: 'Educational Institutions',
      description: `Collaborate on curriculum development and student exchanges across our educational programs`,
      benefits: ['Research opportunities', 'Student projects', 'Knowledge sharing', 'Capacity building'],
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-green-400 to-green-600',
      programs: programs.filter(p => p.category === 'education').length
    },
    {
      title: 'Tech Companies',
      description: `Provide technology, mentorship, and innovation support for our tech-focused initiatives`,
      benefits: ['Talent pipeline', 'Innovation labs', 'Tech donations', 'Mentorship programs'],
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'from-purple-400 to-purple-600',
      programs: programs.filter(p => p.category === 'other' || p.title.toLowerCase().includes('tech')).length
    }
  ];

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading involvement opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Failed to Load</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={fetchInvolvementData}
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
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Get <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Involved</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Join us in empowering Africa's youth through education, technology, and innovation. Together, we can create lasting change.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
              <div className="flex space-x-2">
                {[
                  { id: 'volunteer', label: 'Volunteer', icon: <Users className="w-5 h-5" /> },
                  { id: 'donate', label: 'Donate', icon: <Heart className="w-5 h-5" /> },
                  { id: 'partner', label: 'Partner', icon: <Star className="w-5 h-5" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-white/40'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Volunteer Section */}
        {activeTab === 'volunteer' && (
          <section className="container mx-auto px-6 pb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Volunteer Opportunities</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Share your skills, time, and passion to directly impact the lives of African youth
              </p>
              
              {/* Volunteer Impact Stats */}
              <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold text-amber-600">{volunteerOpportunities.length}+</div>
                  <div className="text-sm text-slate-600">Active Opportunities</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{programs.length}</div>
                  <div className="text-sm text-slate-600">Programs to Support</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {volunteerOpportunities.reduce((total, opp) => total + (opp.spotsAvailable || 0), 0)}+
                  </div>
                  <div className="text-sm text-slate-600">Volunteer Spots Available</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {displayVolunteerOpportunities.map((opportunity, index) => (
                <div
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 group transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${opportunity.color} text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {opportunity.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{opportunity.title}</h3>
                      <p className="text-slate-600 mb-4">{opportunity.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600">{opportunity.commitment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600">{opportunity.skills}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Volunteer Application */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Ready to Volunteer?</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <select className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option>Select Area of Interest</option>
                  {volunteerOpportunities.slice(0, 6).map((opportunity, index) => (
                    <option key={index} value={opportunity.title}>
                      {opportunity.title}
                    </option>
                  ))}
                  <option>Other - Please specify in message</option>
                </select>
                <textarea
                  placeholder="Tell us about your skills and why you want to volunteer..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                ></textarea>
                <button 
                  onClick={handleVolunteerApplication}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Donation Section */}
        {activeTab === 'donate' && (
          <section className="container mx-auto px-6 pb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Make a Donation</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Your contribution directly funds education, technology access, and innovation programs for African youth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {donationTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 text-center transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`text-3xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                    {tier.amount}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{tier.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{tier.description}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
                    <Target className="w-4 h-4" />
                    <span>{tier.impact}</span>
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleDonateNow(parseInt(tier.amount.replace('$', '')))}
                      className={`w-full py-3 bg-gradient-to-r ${tier.color} text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                    >
                      <Heart className="w-4 h-4" />
                      Donate {tier.amount}
                    </button>
                    {tier.programId && (
                      <button 
                        onClick={handleViewPrograms}
                        className="w-full py-2 text-sm text-slate-600 hover:text-slate-800 underline"
                      >
                        Learn more about this program
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Donation Form */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Custom Donation</h3>
              <div className="space-y-4">
                {/* Donation Type Toggle */}
                <div className="flex bg-gray-100 rounded-2xl p-2 mb-4">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                      donationType === 'one-time'
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                      donationType === 'monthly'
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Monthly
                    </span>
                  </button>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">Donation Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customDonationAmount}
                      onChange={(e) => {
                        setCustomDonationAmount(e.target.value);
                        setSelectedDonationAmount(0);
                      }}
                      className="w-full pl-10 px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'mobile', label: 'Mobile Money', description: 'MTN/Airtel' },
                      { id: 'bank', label: 'Bank Transfer', description: 'Direct' },
                      { id: 'card', label: 'Card', description: 'Visa/MC' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center text-sm ${
                          paymentMethod === method.id
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white scale-105'
                            : 'bg-white/50 text-gray-700 hover:bg-white/70'
                        }`}
                      >
                        <div className="font-bold">{method.label}</div>
                        <div className="text-xs opacity-80">{method.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleProceedToPayment}
                  className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Donate ${customDonationAmount || 'Amount'} {donationType === 'monthly' ? '/month' : ''}
                </button>

                {/* Security Notice */}
                <div className="text-center mt-4 text-gray-600 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Your donation is secure and tax-deductible</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Partnership Section */}
        {activeTab === 'partner' && (
          <section className="container mx-auto px-6 pb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Partnership Opportunities</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Join us as a strategic partner to amplify our impact and create sustainable change across Africa
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {partnershipTypes.map((partnership, index) => (
                <div
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${partnership.color} text-white mb-4 shadow-lg`}>
                      {partnership.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{partnership.title}</h3>
                    <p className="text-slate-600">{partnership.description}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 mb-2">Partnership Benefits:</h4>
                    {partnership.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Partnership Contact Form */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Partner With Us</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Organization Name"
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    placeholder="Contact Person"
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <select className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400">
                    <option>Partnership Type</option>
                    <option>Corporate Sponsorship</option>
                    <option>Educational Institution</option>
                    <option>Technology Company</option>
                    <option>Government Agency</option>
                    <option>NGO/Non-profit</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <textarea
                    placeholder="Tell us about your organization and partnership interests..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  ></textarea>
                  <button 
                    onClick={handleContactUs}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    Submit Partnership Inquiry
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <section className="bg-white/20 backdrop-blur-sm py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-800 mb-6">Upcoming Events</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Join us at our upcoming events and see our impact in action
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {upcomingEvents.map((event, index) => {
                  const eventDate = typeof event.eventDate === 'string' 
                    ? new Date(event.eventDate) 
                    : new Date(event.eventDate._seconds * 1000);
                  
                  return (
                    <div
                      key={event.id}
                      className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-6 h-6 text-amber-500" />
                        <span className="text-sm text-slate-600 font-medium">
                          {eventDate.toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-3">{event.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        {event.description.length > 100 
                          ? event.description.substring(0, 100) + '...' 
                          : event.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <button 
                        onClick={() => navigate('/events')}
                        className="w-full py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:scale-105 transition-all duration-300 text-sm"
                      >
                        Learn More
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <button 
                  onClick={() => navigate('/events')}
                  className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
                >
                  View All Events
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Contact us to learn more about how you can contribute to our mission
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Visit Us</h3>
                <p className="text-slate-600">Kigali, Rwanda</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-white mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Email Us</h3>
                <p className="text-slate-600">info@harmonyafrica.org</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Call Us</h3>
                <p className="text-slate-600">+250 785 300 820</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GetInvolvedPage;