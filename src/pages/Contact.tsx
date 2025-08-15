import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, Facebook, Twitter, Instagram, Linkedin, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { contactApi, type ContactSubmission } from '../services/contactApi';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general' as ContactSubmission['type'],
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Submit the form
      const response = await contactApi.submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        type: formData.type,
        phone: formData.phone.trim() || undefined
      });

      console.log('Contact form submitted successfully:', response);
      
      // Show success message
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general',
        phone: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Address',
      details: 'info@harmonyafrica.org',
      description: 'Send us an email anytime',
      color: 'from-blue-400 to-cyan-500',
      action: 'mailto:info@harmonyafrica.org'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Phone Number',
      details: '+250 785 300 820',
      description: 'Call us during business hours',
      color: 'from-green-400 to-emerald-500',
      action: 'tel:+250788123456'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Office Location',
      details: 'Kigali, Rutsiro, Rwanda',
      description: 'KK 616 ST, Kicukiro District',
      color: 'from-amber-400 to-orange-500',
      action: 'https://maps.google.com'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Office Hours',
      details: 'Mon - Fri: 8:00 - 17:00',
      description: 'Saturday: 9:00 - 13:00',
      color: 'from-purple-400 to-pink-500',
      action: null
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', color: 'from-blue-400 to-cyan-500' },
    { value: 'partnership', label: 'Partnership', color: 'from-green-400 to-emerald-500' },
    { value: 'volunteer', label: 'Volunteer', color: 'from-amber-400 to-orange-500' },
    { value: 'donation', label: 'Donation', color: 'from-purple-400 to-pink-500' },
    { value: 'media', label: 'Media Inquiry', color: 'from-red-400 to-rose-500' }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-6 h-6" />, name: 'Facebook', color: 'from-blue-500 to-blue-600', href: 'https://www.facebook.com/profile.php?id=61552619710279' },
    { icon: <Twitter className="w-6 h-6" />, name: 'Twitter', color: 'from-sky-400 to-sky-500', href: 'https://x.com/Harmonyafricans' },
    { icon: <Instagram className="w-6 h-6" />, name: 'Instagram', color: 'from-pink-400 to-rose-500', href: 'https://www.instagram.com/harmonyafrica/' },
    { icon: <Linkedin className="w-6 h-6" />, name: 'LinkedIn', color: 'from-blue-600 to-blue-700', href: '#' }
  ];

  const faqs = [
    {
      question: 'How can I get involved with your programs?',
      answer: 'There are many ways to get involved! You can volunteer, donate, partner with us, or apply for our programs. Contact us to learn more about opportunities that match your interests and skills.'
    },
    {
      question: 'Do you accept international volunteers?',
      answer: 'Yes! We welcome volunteers from around the world. We have both short-term and long-term volunteer opportunities available. Please reach out to discuss how you can contribute to our mission.'
    },
    {
      question: 'How can my organization partner with you?',
      answer: 'We\'re always looking for strategic partnerships. Whether you\'re a business, NGO, or educational institution, we can explore collaboration opportunities that align with our mission and your goals.'
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
        <section className="container mx-auto px-6 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Contact <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">Us</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Ready to make a difference? Get in touch with us and join our mission to empower Africa's youth
            </p>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 delay-${index * 100} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div 
                    className={`bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group h-full ${
                      info.action ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => info.action && window.open(info.action, '_blank')}
                  >
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${info.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {info.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{info.title}</h3>
                    <p className="text-lg text-slate-700 font-semibold mb-2">{info.details}</p>
                    <p className="text-slate-600 text-sm">{info.description}</p>
                    {info.action && (
                      <div className="flex items-center justify-center mt-4 text-amber-600 font-medium group-hover:text-orange-600 transition-colors duration-300">
                        <span className="mr-2">Contact</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-white/40 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Contact Form */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white mr-4 shadow-lg">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">Send us a Message</h2>
                </div>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-100/80 border border-green-200 rounded-2xl flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-green-700 font-semibold">Thank you! Your message has been sent successfully.</p>
                      <p className="text-green-600 text-sm">We'll respond to you within 24 hours during business days.</p>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 p-4 bg-red-100/80 border border-red-200 rounded-2xl flex items-center">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                    <div>
                      <p className="text-red-700 font-semibold">Error sending message</p>
                      <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-3">Type of Inquiry</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, type: type.value as ContactSubmission['type'] }));
                            if (submitError) setSubmitError(null);
                          }}
                          className={`p-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            formData.type === type.value
                              ? `bg-gradient-to-r ${type.color} text-white shadow-lg scale-105`
                              : 'bg-white/60 text-slate-700 hover:bg-white/80'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-slate-700 font-semibold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/20 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-slate-700 font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/20 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone and Subject */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-slate-700 font-semibold mb-2">
                        Phone Number <span className="text-slate-500 text-sm">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/20 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
                        placeholder="+250 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-slate-700 font-semibold mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/20 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>


                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-slate-700 font-semibold mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/20 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl text-lg shadow-2xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </div>
                    )}
                  </button>
                </form>
              </div>

              {/* Additional Information */}
              <div className="space-y-8">
                {/* Map Placeholder */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-amber-600" />
                    Visit Our Office
                  </h3>
                  <div className="bg-gradient-to-br from-amber-100/60 to-orange-100/60 rounded-xl p-6 mb-6">
                    <div className="h-48 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                        <p className="text-slate-600 font-semibold">Interactive Map</p>
                        <p className="text-slate-500 text-sm">Kigali, Rutsiro, Rwanda</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-600">
                      <Globe className="w-5 h-5 mr-3 text-amber-600" />
                      <span>KK 616 ST, Kicukiro District, Rutsiro District</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-5 h-5 mr-3 text-amber-600" />
                      <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Follow Us</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Stay connected with our latest updates, stories, and impact across our social media channels.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className={`flex items-center px-4 py-3 rounded-xl bg-gradient-to-r ${social.color} text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg`}
                      >
                        {social.icon}
                        <span className="ml-2">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Response */}
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <Clock className="w-6 h-6 mr-3" />
                    Quick Response
                  </h3>
                  <p className="leading-relaxed mb-4 opacity-90">
                    We typically respond to inquiries within 24 hours during business days. For urgent matters, please call us directly.
                  </p>
                  <button className="px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors duration-300">
                    Call Now: +250 785 300 820
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Frequently Asked <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Questions</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Find quick answers to common questions about our programs and how to get involved
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:bg-white/80 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-start">
                    <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg text-white mr-4 mt-1 flex-shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    {faq.question}
                  </h3>
                  <div className="ml-12">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-slate-600 mb-6">
                Don't see your question answered here?
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full text-lg shadow-xl hover:shadow-amber-500/25 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1">
                Contact Us Directly
              </button>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="bg-white/40 backdrop-blur-sm py-16">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-red-400 to-rose-500 rounded-3xl p-12 text-white text-center shadow-2xl">
              <Phone className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Emergency Contact</h2>
              <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
                For urgent matters requiring immediate attention, please contact our emergency hotline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+250785300820"
                  className="px-8 py-4 bg-white text-red-500 font-bold rounded-full text-lg hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Call Emergency Line
                </a>
                <a
                  href="mailto:info@harmonyafrica.org"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-full text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105"
                >
                  Emergency Email
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;