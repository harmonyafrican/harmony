import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programsApi, type Program } from '../services/programsApi';
import { 
  GraduationCap, 
  Users, 
  BookOpen,
  Trophy,
  MapPin,
  Clock,
  User,
  ArrowRight,
  CheckCircle,
  Star,
  X,
  Target,
  Heart,
  DollarSign,
  Mail,
  FileText,
  Send,
  CreditCard,
  Shield,
  Share2,
  Copy,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';

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

const Programs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModalTab, setActiveModalTab] = useState('overview');
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    motivation: '',
    experience: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const handleLearnMore = (program: Program) => {
    setSelectedProgram(program);
    setActiveModalTab('overview');
  };

  const closeModal = () => {
    setSelectedProgram(null);
    setActiveModalTab('overview');
    setShowShareMenu(false);
    setCopySuccess(false);
    // Reset forms
    setApplicationForm({
      fullName: '',
      email: '',
      phone: '',
      age: '',
      motivation: '',
      experience: ''
    });
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setCustomAmount('');
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the application to your backend
    alert(`Application submitted successfully for ${selectedProgram?.title}! We will contact you within 3-5 business days.`);
    closeModal();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the contact form to your backend
    alert(`Message sent successfully! We will respond to your inquiry about ${selectedProgram?.title} within 24 hours.`);
    closeModal();
  };

  const handleProgramDonation = (amount: number) => {
    const donationAmount = amount || Number(customAmount);
    if (donationAmount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    initiateFlutterwavePayment(donationAmount);
  };

  const initiateFlutterwavePayment = (amount: number) => {
    const paymentData = {
      public_key: 'FLWPUBK_TEST-f63b4432908e41840cf0e0576c3fba0e-X',
      tx_ref: `harmony-program-${selectedProgram?.id}-${Date.now()}`,
      amount: amount,
      currency: 'USD',
      payment_options: paymentMethod === 'mobile' ? 'mobilemoney' : paymentMethod === 'bank' ? 'banktransfer' : 'card',
      customer: {
        email: 'donor@harmonyafrica.org',
        phone_number: '+250700000000',
        name: 'Harmony Africa Supporter',
      },
      customizations: {
        title: `Support ${selectedProgram?.title}`,
        description: `Donation to support ${selectedProgram?.title}`,
        logo: 'https://i.postimg.cc/15BBN2MW/harmony-logo.png',
      },
      callback: (response: FlutterwaveResponse) => {
        if (response.status === 'successful') {
          alert(`Thank you for supporting ${selectedProgram?.title}! Your donation will directly impact youth in this program.`);
          closeModal();
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

  const handleGeneralApply = () => {
    navigate('/volunteer');
  };

  const handleShare = (program: Program) => {
    setSelectedProgram(program);
    setShowShareMenu(true);
  };

  const handleCopyLink = () => {
    const programUrl = `${window.location.origin}${window.location.pathname}?program=${selectedProgram?.id}`;
    navigator.clipboard.writeText(programUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleSocialShare = (platform: string) => {
    const programUrl = `${window.location.origin}${window.location.pathname}?program=${selectedProgram?.id}`;
    const shareText = `Check out this amazing program: ${selectedProgram?.title} - ${selectedProgram?.subtitle} at Harmony Africa Foundation!`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(programUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(programUrl)}&hashtags=HarmonyAfrica,YouthEmpowerment,Rwanda`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + programUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Amazing Program at Harmony Africa Foundation')}&body=${encodeURIComponent(shareText + '\n\nLearn more: ' + programUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const closeShareMenu = () => {
    setShowShareMenu(false);
    setCopySuccess(false);
  };

  // Check for program ID in URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const programId = urlParams.get('program');
    
    if (programId) {
      const program = programs.find(p => p.id === programId);
      if (program) {
        setSelectedProgram(program);
        setActiveModalTab('overview');
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [programs]);

  const handleDownloadBrochure = () => {
    // Create a simple brochure content
    const brochureContent = `
HARMONY AFRICA FOUNDATION - PROGRAMS OVERVIEW

🎯 OUR PROGRAMS:

1. TALENT DEVELOPMENT PROGRAM
   • Duration: 6-12 months
   • Age Group: 8-25 years
   • 500+ participants, 95% success rate

2. EDUCATIONAL SUPPORT INITIATIVE  
   • Duration: Academic year
   • Age Group: 6-18 years
   • 1200+ participants, 92% success rate

3. INNOVATION & TECH LABS
   • Duration: 3-9 months
   • Age Group: 12-30 years
   • 800+ participants, 88% success rate

4. COMMUNITY ENGAGEMENT PROGRAM
   • Duration: Ongoing
   • Age Group: All ages
   • 2000+ participants, 90% success rate

📍 CONTACT US:
Email: info@harmonyafrica.org
Phone: +250 785 300 820
Location: Kigali, Rwanda

Visit our website for more information and to apply!
    `;
    
    const blob = new Blob([brochureContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Harmony-Africa-Programs-Brochure.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setIsVisible(true);
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (programs.length > 0) {
      const interval = setInterval(() => {
        setActiveProgram(prev => (prev + 1) % programs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [programs.length]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const programsData = await programsApi.getPrograms();
      setPrograms(programsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
      console.error('Programs data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for programs based on category
  const getProgramIcon = (category: string) => {
    switch (category) {
      case 'education': return <GraduationCap className="w-8 h-8" />;
      case 'healthcare': return <Heart className="w-8 h-8" />;
      case 'community_development': return <Users className="w-8 h-8" />;
      case 'environment': return <Target className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };

  const impactStats = [
    { number: '4,500+', label: 'Lives Transformed', icon: <Users className="w-6 h-6" /> },
    { number: '50+', label: 'Communities Served', icon: <MapPin className="w-6 h-6" /> },
    { number: '25+', label: 'Active Programs', icon: <BookOpen className="w-6 h-6" /> },
    { number: '95%', label: 'Success Rate', icon: <Trophy className="w-6 h-6" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Failed to Load Programs</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={fetchPrograms}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Our <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Programs</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive programs designed to empower Africa's youth through education, technology, and community engagement
            </p>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Programs */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Featured Programs</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-12">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] ${
                  activeProgram === index ? 'ring-4 ring-amber-400/30' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${program.bgColor || 'from-slate-50 to-slate-100'} p-8 md:p-12`}>
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${program.color} text-white mb-6 shadow-lg`}>
                        {getProgramIcon(program.category)}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        {program.title}
                      </h3>
                      <p className="text-xl text-gray-600 mb-6 font-medium">
                        {program.subtitle}
                      </p>
                      <p className="text-gray-700 text-lg leading-relaxed mb-8">
                        {program.description}
                      </p>

                      {/* Program Details */}
                      <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-amber-500" />
                          <span className="text-gray-700 font-medium">{program.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-amber-500" />
                          <span className="text-gray-700 font-medium">{program.ageGroup}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5 text-amber-500" />
                          <span className="text-gray-700 font-medium">{program.location}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleLearnMore(program)}
                          className={`flex-1 px-6 py-3 bg-gradient-to-r ${program.color} text-white font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
                        >
                          Learn More <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleShare(program)}
                          className="px-4 py-3 bg-white/80 border-2 border-gray-200 text-gray-600 rounded-full hover:scale-105 transition-all duration-300 hover:border-amber-400 hover:text-amber-600 flex items-center justify-center"
                          title="Share this program"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      {/* Program Features */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-6">
                        <h4 className="text-2xl font-bold text-gray-800 mb-6">Program Features</h4>
                        <ul className="space-y-3">
                          {program.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Success Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20">
                          <div className={`text-3xl font-bold bg-gradient-to-r ${program.color} bg-clip-text text-transparent mb-2`}>
                            {program.participants}
                          </div>
                          <div className="text-gray-600 font-medium">Participants</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20">
                          <div className={`text-3xl font-bold bg-gradient-to-r ${program.color} bg-clip-text text-transparent mb-2`}>
                            {program.successRate}
                          </div>
                          <div className="text-gray-600 font-medium">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Join Our Programs?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Whether you're a young person looking to develop your talents, a parent seeking educational opportunities for your child, or a community leader wanting to make a difference, we have programs designed for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGeneralApply}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Apply Now
              </button>
              <button 
                onClick={handleDownloadBrochure}
                className="px-8 py-4 bg-white/80 border-2 border-amber-400 text-amber-600 font-bold rounded-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className={`relative p-6 bg-gradient-to-r ${selectedProgram.bgColor} border-b border-gray-200`}>
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 bg-gradient-to-r ${selectedProgram.color} text-white rounded-2xl shadow-lg`}>
                  {getProgramIcon(selectedProgram.category)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{selectedProgram.title}</h2>
                  <p className="text-xl text-gray-600 mt-1">{selectedProgram.subtitle}</p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-1 bg-white/60 rounded-2xl p-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
                    { id: 'apply', label: 'Apply', icon: <User className="w-4 h-4" /> },
                    { id: 'support', label: 'Support', icon: <Heart className="w-4 h-4" /> },
                    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveModalTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        activeModalTab === tab.id
                          ? `bg-gradient-to-r ${selectedProgram.color} text-white shadow-lg`
                          : 'text-gray-600 hover:bg-white/40'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Share Button */}
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl font-medium text-gray-600 hover:bg-white/80 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Overview Tab */}
              {activeModalTab === 'overview' && (
                <div className="space-y-8">
                  {/* Program Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Program Overview</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{selectedProgram.description}</p>
                  </div>

                  {/* Program Details Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-800 mb-2">Duration</h4>
                      <p className="text-gray-600">{selectedProgram.duration}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <User className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-800 mb-2">Age Group</h4>
                      <p className="text-gray-600">{selectedProgram.ageGroup}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <Users className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-800 mb-2">Participants</h4>
                      <p className="text-gray-600">{selectedProgram.participants}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <Target className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-800 mb-2">Success Rate</h4>
                      <p className="text-gray-600">{selectedProgram.successRate}</p>
                    </div>
                  </div>

                  {/* Program Features */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">What You'll Get</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedProgram.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements & Benefits */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Requirements</h3>
                      <ul className="space-y-2">
                        {selectedProgram.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Benefits</h3>
                      <ul className="space-y-2">
                        {selectedProgram.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span className="text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-6 h-6 text-blue-500" />
                      <h3 className="text-2xl font-bold text-gray-800">Program Location</h3>
                    </div>
                    <p className="text-gray-700 text-lg">{selectedProgram.location}</p>
                  </div>
                </div>
              )}

              {/* Apply Tab */}
              {activeModalTab === 'apply' && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Apply to {selectedProgram.title}</h3>
                    <p className="text-gray-600">Take the first step towards transforming your future</p>
                  </div>
                  
                  <form onSubmit={handleApplicationSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={applicationForm.fullName}
                          onChange={(e) => setApplicationForm({...applicationForm, fullName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={applicationForm.email}
                          onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
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
                          value={applicationForm.phone}
                          onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                        <input
                          type="number"
                          required
                          min="8"
                          max="30"
                          value={applicationForm.age}
                          onChange={(e) => setApplicationForm({...applicationForm, age: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Enter your age"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join this program? *</label>
                      <textarea
                        required
                        rows={4}
                        value={applicationForm.motivation}
                        onChange={(e) => setApplicationForm({...applicationForm, motivation: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Tell us about your motivation and goals..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Experience (Optional)</label>
                      <textarea
                        rows={3}
                        value={applicationForm.experience}
                        onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Share any relevant skills, experience, or background..."
                      ></textarea>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h4 className="font-bold text-amber-800 mb-2">Application Process:</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• We'll review your application within 3-5 business days</li>
                        <li>• Selected candidates will be contacted for an interview</li>
                        <li>• Program starts on the next available intake date</li>
                      </ul>
                    </div>
                    
                    <button
                      type="submit"
                      className={`w-full py-4 bg-gradient-to-r ${selectedProgram.color} text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
                    >
                      <Send className="w-5 h-5" />
                      Submit Application
                    </button>
                  </form>
                </div>
              )}

              {/* Support Tab */}
              {activeModalTab === 'support' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Support {selectedProgram.title}</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Your donation directly funds this program, creating opportunities for youth to develop their talents and achieve their dreams.
                    </p>
                  </div>

                  {/* Donation Tiers */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-6">Choose Your Impact</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {selectedProgram.donationTiers.map((tier, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                          <div className="text-center mb-4">
                            <div className="text-3xl mb-2">{tier.icon}</div>
                            <div className={`text-2xl font-bold bg-gradient-to-r ${selectedProgram.color} bg-clip-text text-transparent mb-2`}>
                              ${tier.amount}
                            </div>
                            <p className="text-gray-600 text-sm">{tier.impact}</p>
                          </div>
                          <button 
                            onClick={() => handleProgramDonation(tier.amount)}
                            className={`w-full py-3 bg-gradient-to-r ${selectedProgram.color} text-white font-bold rounded-xl hover:scale-105 transition-all duration-300`}
                          >
                            Donate ${tier.amount}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Donation */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Custom Amount</h4>
                    <div className="space-y-4">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          min="1"
                          placeholder="Enter custom amount"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                      </div>
                      
                      {/* Payment Methods */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'mobile', label: 'Mobile Money', description: 'MTN/Airtel' },
                            { id: 'bank', label: 'Bank Transfer', description: 'Direct' },
                            { id: 'card', label: 'Credit Card', description: 'Visa/MC' }
                          ].map((method) => (
                            <button
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id)}
                              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl font-medium transition-all duration-300 text-center text-sm ${
                                paymentMethod === method.id
                                  ? `bg-gradient-to-r ${selectedProgram.color} text-white scale-105`
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <CreditCard className="w-4 h-4" />
                              <div className="font-bold">{method.label}</div>
                              <div className="text-xs opacity-80">{method.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleProgramDonation(0)}
                        className={`w-full py-4 bg-gradient-to-r ${selectedProgram.color} text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
                      >
                        <Heart className="w-5 h-5" />
                        Donate ${customAmount || 'Amount'}
                      </button>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4" />
                        <span>Secure payment processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeModalTab === 'contact' && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Have Questions About {selectedProgram.title}?</h3>
                    <p className="text-gray-600">Get in touch with our program coordinators for personalized guidance</p>
                  </div>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Enter your phone number (optional)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        placeholder="Ask us about eligibility, program details, schedule, or any other questions..."
                      ></textarea>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">We'll respond within 24 hours</p>
                          <p>You can also reach us directly at info@harmonyafrica.org or +250 785 300 820</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className={`w-full py-4 bg-gradient-to-r ${selectedProgram.color} text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Menu Modal */}
      {showShareMenu && selectedProgram && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300">
            {/* Share Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Share Program</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedProgram.title}</p>
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
                    {`${window.location.origin}${window.location.pathname}?program=${selectedProgram.id}`}
                  </div>
                  <button 
                    onClick={handleCopyLink}
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

              {/* Share Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedProgram.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedProgram.subtitle}</p>
                  <p className="text-xs text-amber-600 mt-2">Harmony Africa Foundation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;