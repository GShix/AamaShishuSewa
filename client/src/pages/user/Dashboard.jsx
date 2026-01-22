// client/src/pages/user/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, servicesAPI, jobsAPI } from '../../utils/api';
import ProfileSettings from '../../components/user/ProfileSettings';
import UserMobileBottomNav from '../../components/common/UserMobileBottomNav';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  LogOut, 
  Plus,
  CheckCircle,
  XCircle,
  Loader,
  Heart,
  Phone,
  Mail,
  LayoutDashboard,
  FileText,
  Settings,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  Package,
  DollarSign,
  Home,
  Briefcase,
  Bell,
  Search,
  Globe,
  ChevronDown
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('ne');
  
  // Careers section state
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    resume_url: '',
    phone: '',
    email: ''
  });

  const translations = {
    ne: {
      welcome: 'स्वागत छ',
      myBookings: 'मेरो बुकिङहरू',
      newBooking: 'नयाँ बुकिङ',
      logout: 'लग आउट',
      noBookings: 'तपाईंसँग अहिलेसम्म कुनै बुकिङ छैन',
      createFirst: 'आफ्नो पहिलो बुकिङ सिर्जना गर्नुहोस्',
      status: {
        pending: 'पेन्डिङ',
        confirmed: 'पुष्टि भएको',
        in_progress: 'प्रगतिमा',
        completed: 'पूरा भएको',
        cancelled: 'रद्द गरिएको'
      },
      service: {
        postpartum: 'सुत्केरी हेरचाह',
        massage: 'मालिश',
        nwaran: 'नवरान'
      },
      professional: 'पेशेवर',
      date: 'मिति',
      duration: 'अवधि',
      days: 'दिन',
      address: 'ठेगाना',
      contact: 'सम्पर्क',
      viewDetails: 'विवरण हेर्नुहोस्',
      cancelBooking: 'बुकिङ रद्द गर्नुहोस्'
    },
    en: {
      welcome: 'Welcome',
      myBookings: 'My Bookings',
      newBooking: 'New Booking',
      logout: 'Logout',
      noBookings: 'You have no bookings yet',
      createFirst: 'Create your first booking',
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        in_progress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled'
      },
      service: {
        postpartum: 'Postpartum Care',
        massage: 'Massage',
        nwaran: 'Nwaran Ceremony'
      },
      professional: 'Professional',
      date: 'Date',
      duration: 'Duration',
      days: 'days',
      address: 'Address',
      contact: 'Contact',
      viewDetails: 'View Details',
      cancelBooking: 'Cancel Booking'
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
    fetchServices();
    fetchJobs();
    fetchMyApplications();
  }, [isAuthenticated, navigate]);

  // Initialize application data when user is loaded
  useEffect(() => {
    if (user) {
      setApplicationData(prev => ({
        ...prev,
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getMyBookings();
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getOpenJobs({ status: 'open' });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await userAPI.getMyApplications();
      setMyApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBookService = (service) => {
    navigate('/book', { state: { selectedService: service } });
  };

  const menuItems = [
    { id: 'dashboard', label: language === 'ne' ? 'ड्यासबोर्ड' : 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: language === 'ne' ? 'सेवा बुकिङहरू' : 'Service Bookings', icon: Calendar },
    { id: 'appointments', label: language === 'ne' ? 'ग्राहक अपोइन्टमेन्ट' : 'Customer Appointment', icon: Clock },
    { id: 'services', label: language === 'ne' ? 'सेवाहरू' : 'Services', icon: Package },
    { id: 'careers', label: language === 'ne' ? 'रोजगारी' : 'Careers', icon: Briefcase },
    { id: 'feeds', label: language === 'ne' ? 'समाचार' : 'Feeds', icon: FileText },
    { id: 'profile', label: language === 'ne' ? 'प्रोफाइल' : 'Profile', icon: User },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      in_progress: Loader,
      completed: CheckCircle,
      cancelled: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status));
    const completedBookings = bookings.filter(b => b.status === 'completed');

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={language === 'ne' ? 'कुल बुकिङहरू' : 'Total Bookings'}
            value={bookings.length}
            icon={Calendar}
            color="bg-blue-500"
          />
          <StatCard
            title={language === 'ne' ? 'सक्रिय बुकिङहरू' : 'Active Bookings'}
            value={activeBookings.length}
            icon={Clock}
            color="bg-green-500"
          />
          <StatCard
            title={language === 'ne' ? 'पूरा भएको' : 'Completed'}
            value={completedBookings.length}
            icon={CheckCircle}
            color="bg-purple-500"
          />
          <StatCard
            title={language === 'ne' ? 'उपलब्ध सेवाहरू' : 'Available Services'}
            value={services.length}
            icon={Package}
            color="bg-orange-500"
          />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'ne' ? 'हालका बुकिङहरू' : 'Recent Bookings'}
            </h2>
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-rose-600 hover:text-rose-700 font-medium text-sm"
            >
              {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'} →
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'ne' ? 'तपाईंसँग अहिलेसम्म कुनै बुकिङ छैन' : 'No bookings yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        {language === 'ne' ? 'सेवा' : 'Service'}
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        {language === 'ne' ? 'मिति' : 'Date'}
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap hidden sm:table-cell">
                        {language === 'ne' ? 'अवधि' : 'Duration'}
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        {language === 'ne' ? 'स्थिति' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-3 lg:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {t.service[booking.service_type]}
                        </td>
                        <td className="px-3 lg:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(booking.booking_date)}
                        </td>
                        <td className="px-3 lg:px-6 py-4 text-sm text-gray-500 whitespace-nowrap hidden sm:table-cell">
                          {booking.duration_days} {t.days}
                        </td>
                        <td className="px-3 lg:px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(booking.status)}`}>
                            {t.status[booking.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <button
            onClick={() => navigate('/book-appointment')}
            className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group touch-manipulation"
          >
            <div className="text-left">
              <h3 className="font-bold text-base lg:text-lg">
                {language === 'ne' ? 'अपोइन्टमेन्ट बुक गर्नुहोस्' : 'Book Appointment'}
              </h3>
              <p className="text-rose-100 text-xs lg:text-sm mt-1">
                {language === 'ne' ? 'नयाँ अपोइन्टमेन्ट' : 'Schedule new'}
              </p>
            </div>
            <Plus className="w-8 lg:w-10 h-8 lg:h-10 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group touch-manipulation"
          >
            <div className="text-left">
              <h3 className="font-bold text-base lg:text-lg">
                {language === 'ne' ? 'सेवा बुकिङहरू' : 'Service Bookings'}
              </h3>
              <p className="text-blue-100 text-xs lg:text-sm mt-1">
                {language === 'ne' ? 'सेवा बुकिङ हेर्नुहोस्' : 'View bookings'}
              </p>
            </div>
            <Calendar className="w-8 lg:w-10 h-8 lg:h-10 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group touch-manipulation"
          >
            <div className="text-left">
              <h3 className="font-bold text-base lg:text-lg">
                {language === 'ne' ? 'ग्राहक अपोइन्टमेन्ट' : 'Appointments'}
              </h3>
              <p className="text-teal-100 text-xs lg:text-sm mt-1">
                {language === 'ne' ? 'अपोइन्टमेन्ट हेर्नुहोस्' : 'View appointments'}
              </p>
            </div>
            <Clock className="w-8 lg:w-10 h-8 lg:h-10 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group touch-manipulation"
          >
            <div className="text-left">
              <h3 className="font-bold text-base lg:text-lg">
                {language === 'ne' ? 'मेरो प्रोफाइल' : 'My Profile'}
              </h3>
              <p className="text-purple-100 text-xs lg:text-sm mt-1">
                {language === 'ne' ? 'प्रोफाइल अपडेट' : 'Update profile'}
              </p>
            </div>
            <User className="w-8 lg:w-10 h-8 lg:h-10 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          {language === 'ne' ? 'उपलब्ध सेवाहरू' : 'Available Services'}
        </h2>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 lg:p-12 text-center">
          <Package className="w-12 lg:w-16 h-12 lg:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'ne' ? 'कुनै सेवा उपलब्ध छैन' : 'No services available'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
            >
              {service.image_url && (
                <div className="h-40 lg:h-48 overflow-hidden">
                  <img 
                    src={service.image_url} 
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                  {language === 'ne' ? service.name_ne : service.name}
                </h3>
                <p className="text-gray-600 text-xs lg:text-sm mb-4 line-clamp-3">
                  {language === 'ne' ? service.description_ne : service.description}
                </p>

                {service.base_price && (
                  <div className="flex items-center text-rose-600 font-bold mb-4">
                    <DollarSign className="w-4 lg:w-5 h-4 lg:h-5 mr-1" />
                    <span className="text-lg lg:text-xl">NPR {service.base_price}</span>
                    {service.price_unit && (
                      <span className="text-xs lg:text-sm text-gray-500 ml-1">/ {service.price_unit}</span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleBookService(service)}
                  className="w-full py-2.5 lg:py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm lg:text-base font-bold rounded-lg lg:rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 touch-manipulation"
                >
                  <Plus className="w-4 lg:w-5 h-4 lg:h-5" />
                  {language === 'ne' ? 'बुक गर्नुहोस्' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          {language === 'ne' ? 'सेवा बुकिङहरू' : 'Service Bookings'}
        </h2>
        <button
          onClick={() => setActiveTab('services')}
          className="flex items-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm lg:text-base font-bold rounded-lg lg:rounded-xl shadow-md hover:shadow-lg transition touch-manipulation"
        >
          <Plus className="w-4 lg:w-5 h-4 lg:h-5" />
          <span>{language === 'ne' ? 'नयाँ बुकिङ' : 'New Booking'}</span>
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg p-8 lg:p-12 text-center">
          <Calendar className="w-16 lg:w-20 h-16 lg:h-20 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
            {t.noBookings}
          </h4>
          <p className="text-sm lg:text-base text-gray-500 mb-6">{t.createFirst}</p>
          <button
            onClick={() => setActiveTab('services')}
            className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm lg:text-base font-bold rounded-lg lg:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform touch-manipulation"
          >
            {language === 'ne' ? 'सेवा ब्राउज गर्नुहोस्' : 'Browse Services'}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-white">
                    {t.service[booking.service_type]}
                  </h4>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border bg-white ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span>{t.status[booking.status]}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t.date}</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(booking.booking_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t.duration}</p>
                    <p className="font-semibold text-gray-800">
                      {booking.duration_days} {t.days}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{t.address}</p>
                    <p className="font-semibold text-gray-800 line-clamp-2">
                      {booking.client_address}
                    </p>
                  </div>
                </div>

                {booking.professionals && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">{t.professional}</p>
                      <p className="font-semibold text-gray-800">
                        {booking.professionals.full_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.professionals.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 flex space-x-2">
                <button
                  onClick={() => navigate(`/booking/${booking.id}`)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition text-sm"
                >
                  {t.viewDetails}
                </button>
                {booking.status === 'pending' && (
                  <button
                    className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition text-sm"
                  >
                    {t.cancelBooking}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          {language === 'ne' ? 'ग्राहक अपोइन्टमेन्टहरू' : 'Customer Appointments'}
        </h2>
        <button
          onClick={() => navigate('/book-appointment')}
          className="flex items-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm lg:text-base font-bold rounded-lg lg:rounded-xl shadow-md hover:shadow-lg transition touch-manipulation"
        >
          <Plus className="w-4 lg:w-5 h-4 lg:h-5" />
          <span>{language === 'ne' ? 'नयाँ अपोइन्टमेन्ट' : 'New Appointment'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg p-8 lg:p-12 text-center">
        <Clock className="w-16 lg:w-20 h-16 lg:h-20 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
          {language === 'ne' ? 'कुनै अपोइन्टमेन्ट छैन' : 'No Appointments Yet'}
        </h4>
        <p className="text-sm lg:text-base text-gray-500 mb-6">
          {language === 'ne' 
            ? 'परामर्श र स्वास्थ्य जाँचका लागि अपोइन्टमेन्ट बुक गर्नुहोस्' 
            : 'Book appointments for consultations and health checkups'}
        </p>
        <button
          onClick={() => navigate('/book-appointment')}
          className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm lg:text-base font-bold rounded-lg lg:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform touch-manipulation"
        >
          {language === 'ne' ? 'अपोइन्टमेन्ट बुक गर्नुहोस्' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <ProfileSettings language={language} />
  );

  const renderFeeds = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {language === 'ne' ? 'छिट्टै आउँदैछ' : 'Coming Soon'}
          </h3>
          <p className="text-gray-500">
            {language === 'ne' 
              ? 'प्रशासकद्वारा पोस्ट गरिएका समाचार र अपडेटहरू यहाँ देखिनेछन्' 
              : 'News and updates posted by admin will appear here'}
          </p>
        </div>
      </div>
    </div>
  );

  const handleJobApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      setApplying(true);
      await userAPI.applyForJob(selectedJob.id, applicationData);
      alert(language === 'ne' ? 'आवेदन सफलतापूर्वक पेश गरियो!' : 'Application submitted successfully!');
      setSelectedJob(null);
      fetchMyApplications();
      setApplicationData({ cover_letter: '', resume_url: '', phone: user?.phone || '', email: user?.email || '' });
    } catch (error) {
      console.error('Error applying for job:', error);
      alert(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const hasApplied = (jobId) => {
    return myApplications.some(app => app.job_id === jobId);
  };

  const renderCareers = () => {
    return (
      <div className="space-y-6">
        {/* My Applications */}
        {myApplications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ne' ? 'मेरो आवेदनहरू' : 'My Applications'}
            </h3>
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div key={app.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{app.job_title}</h4>
                    <p className="text-sm text-gray-500">
                      {language === 'ne' ? 'आवेदन दिइएको: ' : 'Applied: '}
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Open Jobs */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ne' ? 'खुला रोजगारी' : 'Open Positions'}
          </h3>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'ne' ? 'हाल कुनै खुला रोजगारी छैन' : 'No open positions at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.department}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {job.employment_type.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary_range}
                      </div>
                    )}
                    {job.deadline && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Clock className="w-4 h-4" />
                        Apply by: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-2 mb-4">{job.description}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                    >
                      {language === 'ne' ? 'विवरण हेर्नुहोस्' : 'View Details'}
                    </button>
                    {hasApplied(job.id) ? (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg cursor-not-allowed"
                      >
                        {language === 'ne' ? 'आवेदन दिइएको छ' : 'Applied'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition"
                      >
                        {language === 'ne' ? 'आवेदन दिनुहोस्' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Detail & Application Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Job Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{language === 'ne' ? 'विवरण' : 'Description'}</h4>
                  <p className="text-gray-700">{selectedJob.description}</p>
                </div>

                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{language === 'ne' ? 'आवश्यकता' : 'Requirements'}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{language === 'ne' ? 'जिम्मेवारी' : 'Responsibilities'}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedJob.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!hasApplied(selectedJob.id) && (
                  <form onSubmit={handleJobApply} className="space-y-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900">{language === 'ne' ? 'आवेदन फारम' : 'Application Form'}</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ne' ? 'फोन' : 'Phone'} *
                        </label>
                        <input
                          type="tel"
                          value={applicationData.phone}
                          onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ne' ? 'इमेल' : 'Email'} *
                        </label>
                        <input
                          type="email"
                          value={applicationData.email}
                          onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ne' ? 'रेज्युमे लिंक' : 'Resume Link (Google Drive, Dropbox, etc.)'} *
                      </label>
                      <input
                        type="url"
                        value={applicationData.resume_url}
                        onChange={(e) => setApplicationData({...applicationData, resume_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://drive.google.com/..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'ne' ? 'कभर लेटर' : 'Cover Letter'} *
                      </label>
                      <textarea
                        value={applicationData.cover_letter}
                        onChange={(e) => setApplicationData({...applicationData, cover_letter: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="5"
                        placeholder={language === 'ne' ? 'किन तपाईं यस स्थितिको लागि उपयुक्त हुनुहुन्छ भनी बताउनुहोस्...' : 'Tell us why you are a good fit for this position...'}
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        disabled={applying}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 font-medium disabled:opacity-50"
                      >
                        {applying ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            {language === 'ne' ? 'पेश गर्दै...' : 'Submitting...'}
                          </span>
                        ) : (
                          language === 'ne' ? 'आवेदन पेश गर्नुहोस्' : 'Submit Application'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'bookings':
        return renderBookings();
      case 'appointments':
        return renderAppointments();
      case 'services':
        return renderServices();
      case 'careers':
        return renderCareers();
      case 'feeds':
        return renderFeeds();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'} bg-white border-r border-gray-200 transition-all duration-300 fixed left-0 top-0 bottom-0 z-50 flex flex-col lg:flex`}>
        {/* Logo Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          {(sidebarOpen || mobileMenuOpen) ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-200 rounded-xl flex items-center justify-center shadow-lg">
                {/* <Heart className="w-6 h-6 text-white fill-white" /> */}
                <img className='h-8 w-8 md:h-10 md:w-10 object-contain' src="/logo.png" alt="Logo" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {language === 'ne' ? 'आमा शिशु सेवा' : 'Aama Shishu'}
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  {language === 'ne' ? 'उपयोगकर्ता पोर्टल' : 'User Portal'}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              {/* <Heart className="w-6 h-6 text-white fill-white" /> */}
              <img className='h-8 w-8 md:h-10 md:w-10 object-contain' src="/logo.png" alt="Logo" />
            </div>
          )}
        </div>

        {/* User Profile Section */}
        {(sidebarOpen || mobileMenuOpen) && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user?.fullName?.charAt(0).toUpperCase() || user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm">
                  {user?.fullName || user?.full_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group touch-manipulation ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!sidebarOpen && !mobileMenuOpen ? item.label : ''}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-rose-500'} transition-colors`} />
                {(sidebarOpen || mobileMenuOpen) && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => {
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all touch-manipulation ${!sidebarOpen && !mobileMenuOpen && 'justify-center'}`}
            title={!sidebarOpen && !mobileMenuOpen ? (language === 'ne' ? 'होमपेज' : 'Go to Homepage') : ''}
          >
            <Home className="w-5 h-5" />
            {(sidebarOpen || mobileMenuOpen) && <span className="text-sm font-semibold">{language === 'ne' ? 'होमपेज जानुहोस्' : 'Return to Home'}</span>}
          </button>
          
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all touch-manipulation ${!sidebarOpen && !mobileMenuOpen && 'justify-center'}`}
            title={!sidebarOpen && !mobileMenuOpen ? (language === 'ne' ? 'लगआउट' : 'Logout') : ''}
          >
            <LogOut className="w-5 h-5" />
            {(sidebarOpen || mobileMenuOpen) && <span className="text-sm font-medium">{language === 'ne' ? 'लगआउट' : 'Logout'}</span>}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex w-full items-center justify-center px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${
        sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
      }`}>
        {/* Top Header Bar */}
        <header className="h-16 lg:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Desktop/Mobile Title */}
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs lg:text-sm text-gray-500 truncate hidden sm:block">
                {language === 'ne' ? 'स्वागत छ' : 'Welcome back'}, {user?.fullName || user?.full_name}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')}
              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium text-gray-700 transition touch-manipulation"
            >
              <Globe className="w-3 lg:w-4 h-3 lg:h-4" />
              <span className="hidden sm:inline">{language === 'ne' ? 'EN' : 'ने'}</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg lg:rounded-xl transition touch-manipulation">
              <Bell className="w-4 lg:w-5 h-4 lg:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <button
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm lg:text-base font-bold shadow-md cursor-pointer hover:shadow-lg transition touch-manipulation"
              title="View Profile"
            >
              {user?.fullName?.charAt(0).toUpperCase() || user?.full_name?.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-12 h-12 text-rose-500 animate-spin" />
            </div>
          ) : (
            renderContent()
          )}
        </main>

        {/* Footer - Hide on mobile, show on desktop */}
        <footer className="hidden lg:block bg-white border-t border-gray-200 py-3 lg:py-4 px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs lg:text-sm text-gray-500">
            <p className="text-center sm:text-left">© 2026 {language === 'ne' ? 'आमा शिशु सेवा' : 'Aama Shishu Sewa'}. {language === 'ne' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}</p>
            <div className="flex items-center gap-3 lg:gap-4">
              <a href="/contact" className="hover:text-gray-900 transition touch-manipulation">{language === 'ne' ? 'सहयोग' : 'Help'}</a>
              <a href="/services" className="hover:text-gray-900 transition touch-manipulation">{language === 'ne' ? 'सेवाहरू' : 'Services'}</a>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <UserMobileBottomNav 
          t={{ nav: menuItems }} 
          language={language}
          onLogout={handleLogout}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default Dashboard;