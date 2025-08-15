import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  Search,
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  Mail,
  Heart
} from 'lucide-react';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const quickLinks = [
    {
      icon: <Home className="w-6 h-6" />,
      title: 'Home',
      description: 'Back to our main page',
      path: '/',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Programs',
      description: 'Explore our education programs',
      path: '/programs',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'About Us',
      description: 'Learn about our mission',
      path: '/about',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Events',
      description: 'Upcoming workshops & events',
      path: '/events',
      color: 'from-amber-400 to-orange-500'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Youth Empowered', color: 'from-amber-400 to-amber-600' },
    { number: '50+', label: 'Communities Served', color: 'from-blue-400 to-blue-600' },
    { number: '25+', label: 'Programs Active', color: 'from-green-400 to-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main 404 Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Large 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl md:text-[200px] font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent leading-none">
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The page you're looking for doesn't exist, but our mission to empower Africa's youth continues everywhere else on our site.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-12 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search our site..."
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-lg shadow-lg"
                />
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Where would you like to go?</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 hover:-translate-y-2 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${link.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {link.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                      {link.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="mb-12">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                While you're here, see our impact
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium tracking-wide text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className={`mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-amber-500 mr-2" />
                <h3 className="text-2xl font-bold text-gray-800">Need Help?</h3>
              </div>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                If you were looking for something specific or think this is an error, 
                please don't hesitate to reach out to our team. We're here to help!
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;