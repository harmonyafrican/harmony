import React, { useState, useEffect } from 'react';
import { FileText, Shield, Users, AlertTriangle, Scale, Globe, ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react';

const TermsOfServicePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <CheckCircle className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing our website, participating in our programs, or engaging with Harmony Africa Foundation in any capacity, you agree to be bound by these Terms of Service and all applicable laws and regulations.'
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any modifications constitutes acceptance of the new terms.'
        },
        {
          subtitle: 'Eligibility',
          text: 'Our services are available to individuals who can form legally binding contracts under applicable law. If you are under 18, you must have parental or guardian consent to use our services.'
        }
      ]
    },
    {
      id: 'services',
      title: 'Our Services',
      icon: <Users className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Educational Programs',
          text: 'We provide educational support, scholarships, digital literacy training, and technology access programs to empower youth across Rwanda. Program availability and eligibility requirements may vary.'
        },
        {
          subtitle: 'Mentorship and Community Support',
          text: 'Our mentorship programs connect youth with experienced mentors and community leaders. Participation requires commitment to program guidelines and respectful engagement with all participants.'
        },
        {
          subtitle: 'Innovation and Technology Initiatives',
          text: 'We offer innovation labs, coding bootcamps, and technology workshops. Access to equipment and resources is subject to availability and program requirements.'
        }
      ]
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Acceptable Use',
          text: 'You agree to use our services only for lawful purposes and in accordance with these terms. You must not use our services to harm others, violate any laws, or engage in any fraudulent activities.'
        },
        {
          subtitle: 'Program Participation',
          text: 'Program participants must attend sessions regularly, complete assigned tasks, treat others with respect, and follow all program guidelines. Failure to comply may result in program termination.'
        },
        {
          subtitle: 'Information Accuracy',
          text: 'You are responsible for providing accurate and complete information when registering for programs, applying for scholarships, or engaging with our services. False information may result in service denial.'
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <FileText className="w-5 h-5" />,
      content: [
        {
          subtitle: 'Our Content',
          text: 'All content on our website, including text, graphics, logos, images, and software, is owned by Harmony Africa Foundation or our licensors and is protected by copyright and other intellectual property laws.'
        },
        {
          subtitle: 'User-Generated Content',
          text: 'By submitting content to us (such as project submissions, testimonials, or feedback), you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and distribute such content for our charitable purposes.'
        },
        {
          subtitle: 'Permitted Use',
          text: 'You may view and download our content for personal, non-commercial use only. Any other use requires our prior written permission. You may not reproduce, distribute, or create derivative works without authorization.'
        }
      ]
    }
  ];

  const prohibitedActivities = [
    'Harassment, abuse, or discrimination against any individual',
    'Sharing false or misleading information',
    'Attempting to gain unauthorized access to our systems',
    'Using our services for commercial purposes without permission',
    'Disrupting program activities or interfering with other participants',
    'Violating any applicable local, national, or international laws',
    'Sharing personal information of other participants without consent',
    'Using our services to promote or engage in illegal activities'
  ];

  const disclaimers = [
    {
      title: 'Program Outcomes',
      text: 'While we strive to provide high-quality programs, we cannot guarantee specific outcomes such as job placement, academic success, or business development results.'
    },
    {
      title: 'Third-Party Content',
      text: 'Our website may contain links to third-party websites or resources. We are not responsible for the content, privacy policies, or practices of these external sites.'
    },
    {
      title: 'Service Availability',
      text: 'We aim to provide uninterrupted access to our services, but we cannot guarantee continuous availability due to technical issues, maintenance, or other factors beyond our control.'
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
        {/* Header */}
        <header className="bg-white/40 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-slate-700 hover:text-amber-600 transition-colors duration-200">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl text-white">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Legal Document</div>
                  <div className="font-bold text-slate-800">Terms of Service</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6">
              <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-2xl">
                Terms of Service
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Harmony Africa Foundation
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              These Terms of Service govern your use of our website, programs, and services. Please read them carefully to understand your rights and responsibilities.
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
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white">
                <FileText className="w-6 h-6" />
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
                      ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg' 
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
                  <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-white">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">{section.title}</h2>
                </div>
                
                <div className="space-y-8">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-blue-400/30 pl-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{item.subtitle}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited Activities Section */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl text-white">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Prohibited Activities</h2>
            </div>
            
            <p className="text-slate-600 leading-relaxed mb-8">
              The following activities are strictly prohibited when using our services or participating in our programs:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {prohibitedActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                  <div className="p-1 bg-gradient-to-br from-red-400 to-red-500 rounded-full text-white mt-1 flex-shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy and Data Protection */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Privacy and Data Protection</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed">
                Your privacy is important to us. Our collection, use, and protection of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.
              </p>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Key Privacy Commitments:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    We collect only information necessary for program delivery and organizational purposes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    We implement appropriate security measures to protect your personal data
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    We obtain explicit consent before using photos or videos for promotional purposes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    We comply with applicable data protection laws and regulations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimers and Limitations */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Disclaimers and Limitations</h2>
            </div>
            
            <div className="space-y-8">
              {disclaimers.map((disclaimer, index) => (
                <div key={index} className="border-l-4 border-amber-400/30 pl-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{disclaimer.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{disclaimer.text}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mt-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Limitation of Liability</h3>
              <p className="text-slate-600 leading-relaxed">
                To the maximum extent permitted by applicable law, Harmony Africa Foundation shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our services.
              </p>
            </div>
          </div>
        </section>

        {/* Termination and Enforcement */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Termination and Enforcement</h2>
            
            <div className="space-y-8">
              <div className="border-l-4 border-red-400/50 pl-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Termination Rights</h3>
                <p className="text-slate-600 leading-relaxed">
                  We reserve the right to terminate or suspend your access to our services at any time, with or without cause, and with or without notice, for conduct that we believe violates these Terms of Service or is harmful to other users or our organization.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-400/50 pl-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Effect of Termination</h3>
                <p className="text-slate-600 leading-relaxed">
                  Upon termination, your right to use our services will cease immediately. However, all provisions of these Terms of Service that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                </p>
              </div>
              
              <div className="border-l-4 border-green-400/50 pl-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Governing Law</h3>
                <p className="text-slate-600 leading-relaxed">
                  These Terms of Service are governed by and construed in accordance with the laws of Rwanda. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Rwanda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact and Support */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Questions or Concerns?</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about these Terms of Service or need support with our programs, please contact us using the information below.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Website</h3>
                  <p className="text-slate-600">www.harmonyafrica.org</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Email</h3>
                  <p className="text-slate-600">info@harmonyafrica.org</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Phone</h3>
                  <p className="text-slate-600">+250 785 300 820</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 inline-block">
                <p className="text-sm text-slate-600">
                  <strong>Business Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM (CAT)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Acknowledgment */}
        <section className="container mx-auto px-6 mb-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl text-white">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Acknowledgment</h2>
              </div>
              
              <p className="text-slate-600 leading-relaxed max-w-4xl mx-auto">
                By using our website, participating in our programs, or engaging with Harmony Africa Foundation in any way, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with these terms, please discontinue use of our services.
              </p>
              
              <div className="mt-8">
                <p className="text-sm text-slate-500">
                  Thank you for being part of our mission to empower Africa's youth through education, technology, and innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Footer */}
        <section className="bg-white/40 backdrop-blur-sm py-8">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <p className="text-sm text-slate-600 mb-2">
                <strong>Harmony Africa Foundation</strong> | Certificate N° 96/RGB/FDNL.P/06/2025
              </p>
              <p className="text-sm text-slate-600">
                Registered Common-benefit Foundation under Rwandan Law | Kigali, Rwanda
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;