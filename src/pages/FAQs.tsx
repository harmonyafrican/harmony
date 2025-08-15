import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Users, GraduationCap, Heart, Star, Mail, Phone, MapPin } from 'lucide-react';

const FAQsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="w-5 h-5" />, color: 'from-slate-400 to-slate-600' },
    { id: 'general', name: 'General', icon: <Users className="w-5 h-5" />, color: 'from-blue-400 to-blue-600' },
    { id: 'programs', name: 'Programs', icon: <GraduationCap className="w-5 h-5" />, color: 'from-green-400 to-green-600' },
    { id: 'volunteering', name: 'Volunteering', icon: <Heart className="w-5 h-5" />, color: 'from-pink-400 to-pink-600' },
    { id: 'donations', name: 'Donations', icon: <Star className="w-5 h-5" />, color: 'from-amber-400 to-orange-500' }
  ];

  const faqs = [
    {
      category: 'general',
      question: 'What is Harmony Africa Foundation?',
      answer: 'Harmony Africa Foundation is a Rwandan non-profit organization dedicated to empowering youth across Rwanda through education, technology, and innovation. We focus on creating opportunities for children and youth from low-income families and disadvantaged backgrounds.'
    },
    {
      category: 'general',
      question: 'When was Harmony Africa Foundation established?',
      answer: 'Harmony Africa Foundation was legally registered in 2025 with Certificate of Legal Personality N° 96/RGB/FDN/LP/06/2025 as a common-benefit foundation under Rwandan law.'
    },
    {
      category: 'general',
      question: 'What is your mission and vision?',
      answer: 'Our mission is to empower Africa\'s youth through education, technology, and innovation, nurturing their talents and fostering sustainable development. Our vision is a world where every child has the opportunity to realize their potential and contribute to the growth and prosperity of their communities.'
    },
    {
      category: 'programs',
      question: 'What programs does Harmony Africa Foundation offer?',
      answer: 'We offer four main program areas: 1) Education & Technology Access - school sponsorships and digital literacy workshops, 2) Talent Development & Innovation Labs - STEM and arts programs, 3) Community & Family Support - mentorship and family training, 4) Creative Empowerment - music and arts therapy in partnership with Live Life Freestyle.'
    },
    {
      category: 'programs',
      question: 'Who can benefit from your programs?',
      answer: 'Our programs serve children and youth (ages 6-24) from low-income or marginalized communities, families in need of socioeconomic support, and local schools seeking capacity-building in technology and arts. We particularly focus on achieving 50% female participation in all our programs.'
    },
    {
      category: 'programs',
      question: 'How do you select beneficiaries for your programs?',
      answer: 'We work with local communities, schools, and partner organizations to identify youth and families most in need. Selection criteria include economic status, educational needs, talent potential, and community recommendations. We prioritize inclusivity and equal opportunity access.'
    },
    {
      category: 'programs',
      question: 'What is the relationship with Live Life Freestyle (LLF)?',
      answer: 'Live Life Freestyle (LLF) is our strategic partner for creative arts programming. They provide event management, artist promotion, and creative arts support, including music and arts therapy, media production training, and cultural exchange programs.'
    },
    {
      category: 'volunteering',
      question: 'How can I volunteer with Harmony Africa Foundation?',
      answer: 'We offer various volunteer opportunities including education mentoring, tech instruction, community coordination, and creative arts facilitation. You can apply through our Get Involved page by filling out the volunteer application form.'
    },
    {
      category: 'volunteering',
      question: 'What time commitment is required for volunteering?',
      answer: 'Volunteer commitments vary by role: Education Mentors (4 hours/week), Tech Instructors (6 hours/week), Community Coordinators (8 hours/week), and Creative Arts Facilitators (5 hours/week). We work with volunteers to find schedules that work for everyone.'
    },
    {
      category: 'volunteering',
      question: 'Do I need specific qualifications to volunteer?',
      answer: 'While specific skills are helpful for certain roles, we welcome volunteers from all backgrounds. What matters most is your passion for youth empowerment and commitment to our mission. We provide training and support for all volunteers.'
    },
    {
      category: 'volunteering',
      question: 'Can international volunteers participate?',
      answer: 'Yes! We welcome international volunteers both for on-ground activities in Rwanda and remote support roles. International volunteers can help with online mentoring, curriculum development, fundraising, and digital marketing.'
    },
    {
      category: 'donations',
      question: 'How can I make a donation?',
      answer: 'You can donate through our website using our secure donation platform. We accept one-time and recurring donations, and you can choose to support general operations or specific program areas like education scholarships or technology access.'
    },
    {
      category: 'donations',
      question: 'Are donations tax-deductible?',
      answer: 'As a registered non-profit foundation in Rwanda, donations may be tax-deductible. For international donors, tax-deductibility depends on your country\'s tax laws. We recommend consulting with your tax advisor for specific guidance.'
    },
    {
      category: 'donations',
      question: 'How is my donation used?',
      answer: 'Donations directly fund our four core program areas: education scholarships and supplies, technology access and digital literacy training, innovation labs and creative spaces, and community support programs. We provide detailed impact reports to show how your contribution makes a difference.'
    },
    {
      category: 'donations',
      question: 'What is the minimum donation amount?',
      answer: 'There is no minimum donation amount - every contribution helps! Our suggested donation tiers start at $25 (School Supplies Supporter) and go up to $500+ (Community Development Partner), but any amount is welcomed and appreciated.'
    },
    {
      category: 'general',
      question: 'Where are you located and where do you operate?',
      answer: 'We are headquartered in Kigali, Rwanda, with our initial programs focused on Kigali City. We are expanding to other districts including Rutsiro, Karongi, and Kibuye, with plans to establish 2 regional innovation hubs by 2028.'
    },
    {
      category: 'general',
      question: 'How do you measure your impact?',
      answer: 'We track impact through multiple metrics including number of youth served, educational outcomes, technology skills acquired, family reintegration rates, and long-term career success of our beneficiaries. We publish annual impact reports with transparent financial and social impact data.'
    },
    {
      category: 'programs',
      question: 'Do you provide scholarships?',
      answer: 'Yes, we provide educational scholarships covering school fees, uniforms, learning materials, and other educational expenses for children from low-income families. Scholarships are awarded based on need, academic potential, and community recommendations.'
    },
    {
      category: 'programs',
      question: 'What technology training do you offer?',
      answer: 'We offer digital literacy workshops, coding bootcamps, web development training, and access to modern technology resources. Our innovation labs provide hands-on experience with computers, internet access, and software development tools.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
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
        <section className="container mx-auto px-6 pt-20 pb-16">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Frequently Asked <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Questions</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Find answers to common questions about our programs, volunteering opportunities, and how you can get involved.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xl text-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-12 overflow-x-auto">
            <div className="flex space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'text-slate-600 hover:bg-white/40'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">No questions found</h3>
                <p className="text-slate-500">Try adjusting your search terms or category filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-500 ${
                      openFAQ === index ? 'shadow-2xl' : 'hover:shadow-lg'
                    } transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/20 transition-all duration-300"
                    >
                      <h3 className="text-lg font-bold text-slate-800 pr-4">{faq.question}</h3>
                      <div className="flex-shrink-0">
                        {openFAQ === index ? (
                          <ChevronUp className="w-6 h-6 text-amber-500 transform transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-slate-400 transform transition-transform duration-300" />
                        )}
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-8 pb-6">
                        <div className="w-full h-px bg-gradient-to-r from-amber-200 to-orange-200 mb-4"></div>
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Still Have Questions?</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Can't find the answer you're looking for? Our team is here to help you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-white mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Email Us</h3>
                <p className="text-slate-600 mb-4">Get detailed answers via email</p>
                <p className="text-amber-600 font-medium">info@harmonyafrica.org</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Call Us</h3>
                <p className="text-slate-600 mb-4">Speak directly with our team</p>
                <p className="text-amber-600 font-medium">+250 785 300 820</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Visit Us</h3>
                <p className="text-slate-600 mb-4">Meet us in person</p>
                <p className="text-amber-600 font-medium">Kigali, Rwanda</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300">
                Contact Our Team
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQsPage;