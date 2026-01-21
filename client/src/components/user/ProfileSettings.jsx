// client/src/components/user/ProfileSettings.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Lock,
  Upload,
  Save,
  Camera,
  Edit2,
  Check,
  X
} from 'lucide-react';

const ProfileSettings = ({ language }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    dateOfBirth: user?.date_of_birth || user?.dateOfBirth || '',
    gender: user?.gender || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.user);
      setMessage({ 
        type: 'success', 
        text: language === 'ne' ? 'प्रोफाइल सफलतापूर्वक अपडेट गरियो' : 'Profile updated successfully' 
      });
      setIsEditing(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || (language === 'ne' ? 'प्रोफाइल अपडेट गर्न असफल' : 'Failed to update profile')
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ 
        type: 'error', 
        text: language === 'ne' ? 'पासवर्डहरू मेल खाँदैन' : 'Passwords do not match' 
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ 
        type: 'error', 
        text: language === 'ne' ? 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ' : 'Password must be at least 6 characters' 
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ 
        type: 'success', 
        text: language === 'ne' ? 'पासवर्ड सफलतापूर्वक परिवर्तन गरियो' : 'Password changed successfully' 
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || (language === 'ne' ? 'पासवर्ड परिवर्तन गर्न असफल' : 'Failed to change password')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In production, upload to cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update user avatar
        console.log('Avatar uploaded:', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ne' ? 'प्रोफाइल सेटिङ्हरू' : 'Profile Settings'}
        </h2>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Profile Avatar Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              {formData.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition">
              <Camera className="w-5 h-5 text-gray-700" />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                className="hidden" 
              />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formData.fullName}
            </h3>
            <p className="text-gray-500 mb-2">{user?.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {user?.role}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {language === 'ne' ? 'सक्रिय' : 'Active'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition"
              >
                <Edit2 className="w-5 h-5" />
                {language === 'ne' ? 'सम्पादन गर्नुहोस्' : 'Edit Profile'}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
                {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {language === 'ne' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
        </h3>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                {language === 'ne' ? 'पुरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                {language === 'ne' ? 'फोन नम्बर' : 'Phone Number'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                {language === 'ne' ? 'इमेल' : 'Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'ne' ? 'इमेल परिवर्तन गर्न सकिँदैन' : 'Email cannot be changed'}
              </p>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                {language === 'ne' ? 'जन्म मिति' : 'Date of Birth'}
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                {language === 'ne' ? 'लिङ्ग' : 'Gender'}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              >
                <option value="">{language === 'ne' ? 'छान्नुहोस्' : 'Select'}</option>
                <option value="male">{language === 'ne' ? 'पुरुष' : 'Male'}</option>
                <option value="female">{language === 'ne' ? 'महिला' : 'Female'}</option>
                <option value="other">{language === 'ne' ? 'अन्य' : 'Other'}</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                {language === 'ne' ? 'ठेगाना' : 'Address'}
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? (language === 'ne' ? 'सुरक्षित गर्दै...' : 'Saving...') : (language === 'ne' ? 'परिवर्तनहरू सुरक्षित गर्नुहोस्' : 'Save Changes')}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {language === 'ne' ? 'सुरक्षा सेटिङ्हरू' : 'Security Settings'}
          </h3>
          {!showPasswordChange && (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium"
            >
              <Lock className="w-4 h-4" />
              {language === 'ne' ? 'पासवर्ड परिवर्तन गर्नुहोस्' : 'Change Password'}
            </button>
          )}
        </div>

        {showPasswordChange ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ne' ? 'हालको पासवर्ड' : 'Current Password'}
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ne' ? 'नयाँ पासवर्ड' : 'New Password'}
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ne' ? 'नयाँ पासवर्ड पुष्टि गर्नुहोस्' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                {loading ? (language === 'ne' ? 'परिवर्तन गर्दै...' : 'Updating...') : (language === 'ne' ? 'पासवर्ड अपडेट गर्नुहोस्' : 'Update Password')}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-gray-500 text-sm">
            <p className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {language === 'ne' 
                ? 'तपाईंको खाता सुरक्षित पासवर्डद्वारा सुरक्षित छ' 
                : 'Your account is protected with a secure password'}
            </p>
            <p className="mt-2 text-xs">
              {language === 'ne'
                ? 'पासवर्ड कम्तिमा ६ वर्णहरू समावेश हुनुपर्दछ'
                : 'Password must contain at least 6 characters'}
            </p>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {language === 'ne' ? 'खाता जानकारी' : 'Account Information'}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">{language === 'ne' ? 'खाता स्थिति' : 'Account Status'}</span>
            <span className="font-semibold text-green-600">{language === 'ne' ? 'सक्रिय' : 'Active'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">{language === 'ne' ? 'सदस्यता' : 'Member Since'}</span>
            <span className="font-semibold text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">{language === 'ne' ? 'खाता प्रकार' : 'Account Type'}</span>
            <span className="font-semibold text-gray-900 capitalize">{user?.role || 'User'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
