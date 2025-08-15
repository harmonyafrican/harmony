import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, Users, Mail, Phone, MapPin, ArrowLeft, ChevronRight } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <Users className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect personal information that you voluntarily provide when you donate, volunteer, participate in our programs, or contact us. This may include your name, email address, phone number, mailing address, and payment information.'
        },
        {
          subtitle: 'Program Participation Data',
          text: 'For program participants and beneficiaries, we may collect educational background, skills assessments, progress reports, and demographic information necessary for program delivery and impact measurement.'
        },
        {
          subtitle: 'Automatically Collected Information',
          text: 'When you visit our website, we may automatically collect certain information about your device, including your IP address, browser type, operating system, and usage patterns through cookies and similar technologies.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: <Eye className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Program Delivery',
          text: 'We use your information to deliver our educational programs, provide scholarships, facilitate mentorship, and track program outcomes to ensure we are meeting our mission effectively.'
        },
        {
          subtitle: 'Communication',
          text: 'We may use your contact information to send you updates about our programs, fundraising activities, volunteer opportunities, and organizational news that align with your interests.'
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We process information as required by Rwandan law and international standards for non-profit organizations, including financial reporting and safeguarding requirements.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Program Partners',
          text: 'We may share relevant information with our trusted partners, including Live Life Freestyle (LLF), educational institutions, and other service providers who help us deliver our programs.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law, regulation, or legal process, or to protect the rights, property, and safety of our organization, participants, and the public.'
        },
        {
          subtitle: 'Third-Party Service Providers',
          text: 'We work with third-party service providers for payment processing, website hosting, and communication tools. These providers are bound by confidentiality agreements and data protection requirements.'
        }
      ]
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Security',
      icon: <Lock className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and maintain accurate records for program evaluation.'
        },
        {
          subtitle: 'International Transfers',
          text: 'Your information may be transferred to and processed in countries other than Rwanda when we use international service providers. We ensure appropriate safeguards are in place for such transfers.'
        }
      ]
    }
  ];

  const rights = [
    'Access your personal information we hold about you',
    'Request correction of inaccurate or incomplete information',
    'Request deletion of your personal information (subject to legal requirements)',
    'Object to certain types of processing',
    'Request a copy of your personal information in a portable format',
    'Withdraw consent for marketing communications at any time'
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
        {/* Header */}
        <header className="bg-white/40 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-slate-700 hover:text-amber-600 transition-colors duration-200">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Legal Document</div>
                  <div className="font-bold text-slate-800">Privacy Policy</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6">
              <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
                Privacy Policy
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Harmony Africa Foundation
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you interact with Harmony Africa Foundation.
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mt-8 inline-block">
              <p className="text-sm text-slate-600">
                <strong>Last Updated:</strong> August 8, 2025 | <strong>Effective Date:</strong> January 20, 2025
              </p>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              Table of Contents
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                    activeSection === index 
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg' 
                      : 'bg-white/40 text-slate-700 hover:bg-white/60'
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Sections */}
        <section className="container mx-auto px-6 mb-16">
          <div className="space-y-12">
            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={`bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${sectionIndex * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">{section.title}</h2>
                </div>
                
                <div className="space-y-8">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-amber-400/30 pl-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{item.subtitle}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Rights Section */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Your Rights</h2>
            </div>
            
            <p className="text-slate-600 leading-relaxed mb-8">
              Under applicable data protection laws and our commitment to transparency, you have the following rights regarding your personal information:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {rights.map((right, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                  <div className="p-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white mt-1">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700">{right}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Provisions Section */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Special Provisions</h2>
            
            <div className="space-y-8">
              <div className="border-l-4 border-blue-400/50 pl-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Children and Youth Protection</h3>
                <p className="text-slate-600 leading-relaxed">
                  We take special care when collecting and processing information about children and youth participants. We obtain appropriate consent from parents/guardians for participants under 18 years, and we implement additional safeguards to protect their privacy and wellbeing.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-400/50 pl-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Photography and Media</h3>
                <p className="text-slate-600 leading-relaxed">
                  We may take photographs or videos during our programs and events for promotional and reporting purposes. We obtain explicit consent before using any images featuring identifiable individuals, particularly children and youth.
                </p>
              </div>
              
              <div className="border-l-4 border-green-400/50 pl-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Cookies and Website Analytics</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our website uses cookies and similar technologies to improve your browsing experience and help us understand how visitors use our site. You can control cookie settings through your browser preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Questions About This Policy?</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your personal information, please don't hesitate to contact us.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Address</h3>
                  <p className="text-slate-600">Kigali, Rwanda</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-white">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Email</h3>
                  <p className="text-slate-600">info@harmonyafrica.org</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Phone</h3>
                  <p className="text-slate-600">+250 785 300 820</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-slate-500">
                Data Protection Officer: info@harmonyafrica.org
              </p>
            </div>
          </div>
        </section>

        {/* Legal Footer */}
        <section className="bg-white/40 backdrop-blur-sm py-8">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <p className="text-sm text-slate-600">
                <strong>Harmony Africa Foundation</strong> | Certificate N° 96/RGB/FDNL.P/06/2025 | 
                Registered Common-benefit Foundation under Rwandan Law
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;