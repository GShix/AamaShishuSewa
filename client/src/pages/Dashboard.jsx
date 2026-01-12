// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../utils/api';
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
  Mail
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('ne');

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
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-red-400 to-orange-400 p-2 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  आमा शिशु सेवा
                </h1>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-red-500 transition"
              >
                {language === 'ne' ? 'English' : 'नेपाली'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t.welcome}, {user?.fullName || user?.full_name}! 👋
          </h2>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{user?.phone}</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800">{t.myBookings}</h3>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform"
          >
            <Plus className="w-5 h-5" />
            <span>{t.newBooking}</span>
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 text-red-500 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              {t.noBookings}
            </h4>
            <p className="text-gray-500 mb-6">{t.createFirst}</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform"
            >
              {t.newBooking}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-white">
                      {t.service[booking.service_type]}
                    </h4>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
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
      </main>
    </div>
  );
};

export default Dashboard;