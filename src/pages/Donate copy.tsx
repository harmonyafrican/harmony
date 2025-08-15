import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
import { 
  Heart,
  CreditCard,
  Users,
  BookOpen,
  Laptop,
  Lightbulb,
  Star,
  DollarSign,
  Gift,
  ArrowRight,
  Calendar,
  Shield
} from 'lucide-react';

const Donate = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(() => {
    // Check for preselected amount from navigation state or URL params
    const params = new URLSearchParams(location.search);
    const amountParam = params.get('amount');
    const stateAmount = location.state?.amount;
    return stateAmount || (amountParam ? parseInt(amountParam) : 50);
  });
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCause, setSelectedCause] = useState('general');
  const [donationType, setDonationType] = useState('one-time');
  const [paymentMethod, setPaymentMethod] = useState('mobile');

  const handleDonation = () => {
    // Use Flutter API integration for all payment methods (mobile, bank, card)
    initiateFlutterwavePayment();
  };

  const initiateFlutterwavePayment = () => {
    const donationAmount = Number(customAmount) || selectedAmount;
    const selectedCauseData = causes.find(cause => cause.id === selectedCause);
    
    // Flutter payment configuration
    const paymentData = {
      public_key: 'FLWPUBK_TEST-f63b4432908e41840cf0e0576c3fba0e-X', // Replace with your actual public key
      tx_ref: `harmony-${Date.now()}`,
      amount: donationAmount,
      currency: 'RWF',
      payment_options: paymentMethod === 'mobile' ? 'mobilemoney' : paymentMethod === 'bank' ? 'banktransfer' : 'card',
      customer: {
        email: 'donor@harmonyafrica.org', // You'll collect this from a form
        phone_number: '+250700000000', // You'll collect this from a form
        name: 'Harmony Africa Donor', // You'll collect this from a form
      },
      customizations: {
        title: 'Harmony Africa Donation',
        description: `Donation for ${selectedCauseData?.title || 'General Support'}`,
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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const donationAmounts = [25, 50, 100, 250, 500, 1000];

  const causes = [
    {
      id: 'education',
      title: 'Education Programs',
      description: 'Support digital literacy and educational initiatives',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600',
      impact: 'Fund classroom technology and learning materials'
    },
    {
      id: 'technology',
      title: 'Technology Access',
      description: 'Provide computers and internet access',
      icon: <Laptop className="w-6 h-6" />,
      color: 'from-green-400 to-green-600',
      impact: 'Equip youth with essential digital tools'
    },
    {
      id: 'innovation',
      title: 'Innovation Labs',
      description: 'Fund maker spaces and innovation hubs',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-purple-400 to-purple-600',
      impact: 'Create spaces for creativity and entrepreneurship'
    },
    {
      id: 'general',
      title: 'General Support',
      description: 'Help where it\'s needed most',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-amber-400 to-orange-500',
      impact: 'Support all our programs and initiatives'
    }
  ];

  const impactStories = [
    {
      name: 'Sarah Mukamana',
      story: 'Thanks to your donations, I completed my coding bootcamp and now work as a software developer.',
      image: 'https://i.postimg.cc/KjNm2YQt/beneficiary-1.jpg',
      achievement: 'Software Developer',
      program: 'Digital Skills Training'
    },
    {
      name: 'Jean Baptiste',
      story: 'Your support helped me start my own tech company, now employing 15 people in my community.',
      image: 'https://i.postimg.cc/W3KqH8J9/beneficiary-2.jpg',
      achievement: 'Tech Entrepreneur',
      program: 'Innovation Support'
    },
    {
      name: 'Grace Uwimana',
      story: 'Through your generosity, I gained leadership skills and now coordinate community programs.',
      image: 'https://i.postimg.cc/9XPmL3wz/beneficiary-3.jpg',
      achievement: 'Community Leader',
      program: 'Leadership Development'
    }
  ];

  const impactBreakdown = {
    25: { description: 'Provides school supplies for one student for a month', icon: '📚' },
    50: { description: 'Funds internet access for a classroom for one week', icon: '🌐' },
    100: { description: 'Sponsors a student through a coding workshop', icon: '💻' },
    250: { description: 'Equips a maker space with essential tools', icon: '🔧' },
    500: { description: 'Funds a complete digital literacy program', icon: '🎓' },
    1000: { description: 'Establishes a community technology center', icon: '🏢' }
  };

  const getImpactDescription = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    
    for (const [threshold, impact] of Object.entries(impactBreakdown).reverse()) {
      if (amount >= parseInt(threshold)) {
        return impact;
      }
    }
    
    return { description: 'Every donation makes a difference in a young person\'s life', icon: '❤️' };
  };

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
                Make a <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Difference</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                Your donation empowers African youth with education, technology, and opportunities to build a brighter future for themselves and their communities
              </p>
              
              {/* Quick Impact Stats */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  { number: '2,500+', label: 'Youth Empowered', icon: '🎓' },
                  { number: '85%', label: 'Job Placement Rate', icon: '💼' },
                  { number: '50+', label: 'Communities Served', icon: '🌍' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Donation Section */}
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Donation Form */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Choose Your Impact</h2>
                  
                  {/* Donation Type Toggle */}
                  <div className="flex bg-gray-100 rounded-2xl p-2 mb-8">
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

                  {/* Amount Selection */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Select Amount</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {donationAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount('');
                          }}
                          className={`py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                            selectedAmount === amount && !customAmount
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        placeholder="Custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-lg"
                      />
                    </div>
                  </div>

                  {/* Impact Preview */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getImpactDescription().icon}</span>
                      <h4 className="text-lg font-bold text-gray-800">Your Impact</h4>
                    </div>
                    <p className="text-gray-700">{getImpactDescription().description}</p>
                  </div>

                  {/* Cause Selection */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Choose a Cause</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {causes.map((cause) => (
                        <button
                          key={cause.id}
                          onClick={() => setSelectedCause(cause.id)}
                          className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                            selectedCause === cause.id
                              ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 scale-105'
                              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${cause.color} text-white mb-3`}>
                            {cause.icon}
                          </div>
                          <h4 className="font-bold text-gray-800 mb-2">{cause.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{cause.description}</p>
                          <p className="text-amber-600 text-sm font-medium">{cause.impact}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { id: 'mobile', label: 'Mobile Money', icon: <DollarSign className="w-5 h-5" />, description: 'MTN/Airtel Money' },
                        { id: 'bank', label: 'Bank Transfer', icon: <CreditCard className="w-5 h-5" />, description: 'Direct transfer' },
                        { id: 'card', label: 'Debit/Credit Card', icon: <CreditCard className="w-5 h-5" />, description: 'Visa, Mastercard' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex flex-col items-center gap-2 py-4 px-4 rounded-2xl font-medium transition-all duration-300 text-center ${
                            paymentMethod === method.id
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {method.icon}
                          <div className="font-bold">{method.label}</div>
                          <div className="text-xs opacity-80">{method.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Donate Button */}
                  <button 
                    onClick={handleDonation}
                    className="w-full py-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 flex items-center justify-center gap-3"
                  >
                    <Heart className="w-6 h-6" />
                    Donate ${customAmount || selectedAmount} {donationType === 'monthly' ? '/month' : ''}
                    <ArrowRight className="w-6 h-6" />
                  </button>

                  {/* Security Notice */}
                  <div className="text-center mt-6 text-gray-600 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Your donation is secure and tax-deductible</span>
                    </div>
                    <div className="text-xs bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                      <strong className="text-blue-800">Transparency Note:</strong> Donations are processed through our supporting business partner to ensure immediate funding while we establish official NGO banking. All funds are dedicated 100% to Harmony Africa programs with full financial transparency.
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Stories Sidebar */}
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Success Stories</h3>
                  <div className="space-y-6">
                    {impactStories.map((story, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                          <img
                            src={story.image}
                            alt={story.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-800">{story.name}</div>
                            <div className="text-amber-600 text-sm font-medium mb-2">{story.achievement}</div>
                            <p className="text-gray-600 text-sm leading-relaxed">"{story.story}"</p>
                            <div className="text-xs text-gray-500 mt-2">{story.program}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Ways to Help */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Other Ways to Support</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-medium text-gray-800">Volunteer</div>
                        <div className="text-gray-600 text-sm">Share your skills with our programs</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Gift className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-medium text-gray-800">Corporate Partnership</div>
                        <div className="text-gray-600 text-sm">Partner with us for greater impact</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-medium text-gray-800">Spread the Word</div>
                        <div className="text-gray-600 text-sm">Share our mission with others</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
              <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">Your Donations at Work</h2>
              <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                See how your contributions are making a real difference in communities across Africa
              </p>
              
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { number: '$2.5M+', label: 'Funds Raised', icon: '💰' },
                  { number: '95%', label: 'Goes to Programs', icon: '📊' },
                  { number: '150+', label: 'Partner Schools', icon: '🏫' },
                  { number: '25+', label: 'Countries Impacted', icon: '🌍' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{stat.icon}</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;