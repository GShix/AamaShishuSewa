// client/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, Briefcase, FileText, Bell, Settings,
  LayoutDashboard, LogOut, Menu, X, UserPlus, Plus,
  TrendingUp, Clock, CheckCircle, AlertCircle, Search,
  Filter, Edit, Trash2, Eye, Shield, Crown
} from 'lucide-react';
import { adminAPI } from '../../utils/api';

// Import management components
import BookingsManagement from '../../components/admin/BookingsManagement';
import ServicesManagement from '../../components/admin/ServicesManagement';
import PostsManagement from '../../components/admin/PostsManagement';
import JobsManagement from '../../components/admin/JobsManagement';
import AccountSettings from '../../components/admin/AccountSettings';
import UsersManagement from '../../components/admin/UsersManagement';
import EmployeesManagement from '../../components/admin/EmployeesManagement';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalEmployees: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get admin user from localStorage
    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      
      // Ensure stats has default values even if API returns partial data
      setStats({
        totalUsers: response.data.stats?.totalUsers || 0,
        totalBookings: response.data.stats?.totalBookings || 0,
        totalEmployees: response.data.stats?.totalEmployees || 0,
        pendingBookings: response.data.stats?.pendingBookings || 0
      });
      setRecentBookings(response.data.recentBookings || []);
    } catch (error) {
      // Keep default stats on error - already initialized in useState
      console.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'bookings', label: 'Appointments', icon: Calendar },
    { id: 'employees', label: 'Employees', icon: Briefcase },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'posts', label: 'Posts & Notices', icon: Bell },
    { id: 'jobs', label: 'Jobs & Careers', icon: Briefcase },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs lg:text-sm font-medium">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 lg:w-4 h-3 lg:h-4 text-green-500 mr-1" />
              <span className="text-xs lg:text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 lg:w-14 h-12 lg:h-14 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 lg:w-7 h-6 lg:h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          trend="+12% this month"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          color="bg-green-500"
          trend="+8% this month"
        />
        <StatCard
          title="Employees"
          value={stats.totalEmployees}
          icon={Briefcase}
          color="bg-purple-500"
          trend="+3 new"
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-3">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">Recent Appointments</h2>
          <button
            onClick={() => setActiveTab('bookings')}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm touch-manipulation"
          >
            View All →
          </button>
        </div>
        
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">ID</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Client</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap hidden md:table-cell">Employee</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Service</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Array.isArray(recentBookings) && recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm font-medium text-gray-900 whitespace-nowrap">
                        #{booking.booking_id || booking.id.slice(0, 8)}
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm text-gray-900 whitespace-nowrap">
                      {booking.users?.full_name || 'N/A'}
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm text-gray-900 whitespace-nowrap hidden md:table-cell">
                      {booking.employees?.full_name || 'Unassigned'}
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                      {booking.service_type}
                    </td>
                    <td className="px-3 lg:px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-xs lg:text-sm text-gray-500 whitespace-nowrap hidden sm:table-cell">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      {loading ? 'Loading bookings...' : 'No recent bookings found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <button
          onClick={() => setActiveTab('users')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group touch-manipulation"
        >
          <div className="text-left">
            <h3 className="font-bold text-base lg:text-lg">Manage Users</h3>
            <p className="text-blue-100 text-xs lg:text-sm mt-1">View and manage all users</p>
          </div>
          <Users className="w-8 lg:w-10 h-8 lg:h-10 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setActiveTab('employees')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group touch-manipulation"
        >
          <div className="text-left">
            <h3 className="font-bold text-base lg:text-lg">Add Employee</h3>
            <p className="text-purple-100 text-xs lg:text-sm mt-1">Create new employee</p>
          </div>
          <UserPlus className="w-8 lg:w-10 h-8 lg:h-10 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group touch-manipulation sm:col-span-2 lg:col-span-1"
        >
          <div className="text-left">
            <h3 className="font-bold text-base lg:text-lg">Post Notice</h3>
            <p className="text-green-100 text-xs lg:text-sm mt-1">Create announcement</p>
          </div>
          <Bell className="w-8 lg:w-10 h-8 lg:h-10 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return <UsersManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'employees':
        return <EmployeesManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'posts':
        return <PostsManagement />;
      case 'jobs':
        return <JobsManagement />;
      case 'settings':
        return <AccountSettings adminUser={adminUser} />;
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} bg-gradient-to-b from-indigo-900 to-purple-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-indigo-300">आमा शिशु सेवा</p>
              </div>
            </div>
          ) : (
            <Shield className="w-8 h-8 mx-auto" />
          )}
        </div>

        {/* Admin Info */}
        {sidebarOpen && adminUser && (
          <div className="p-4 bg-indigo-800 border-b border-indigo-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                {adminUser.role === 'superAdmin' ? (
                  <Crown className="w-6 h-6 text-purple-600" />
                ) : (
                  <Shield className="w-6 h-6 text-indigo-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{adminUser.fullName}</p>
                <p className="text-xs text-indigo-300 capitalize">{adminUser.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all touch-manipulation ${
                  isActive
                    ? 'bg-white text-indigo-900 shadow-lg'
                    : 'hover:bg-indigo-800 text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-700">
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-all text-white touch-manipulation"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Toggle Button - Desktop Only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 bg-white text-indigo-900 w-6 h-6 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-8 py-3 lg:py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex-1 lg:flex-none">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 capitalize truncate">
                {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
              </h2>
              <p className="text-xs lg:text-sm text-gray-500 mt-1 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="relative">
                <Bell className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600 cursor-pointer hover:text-indigo-600 transition" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {stats.pendingBookings}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
