// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, LogIn, Mail, Lock, AlertCircle, Loader, ArrowLeft, Shield, Users, Baby, Sparkles } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Login = () => {
  useDocumentTitle('Login - आमा शिशु सेवा');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error: authError } = useAuth();
  const [language, setLanguage] = useState('ne');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const translations = {
    ne: {
      title: 'स्वागत छ फिर्ता',
      subtitle: 'आफ्नो यात्रा जारी राख्नुहोस्',
      email: 'इमेल ठेगाना',
      password: 'पासवर्ड',
      showPassword: 'पासवर्ड देखाउनुहोस्',
      loginButton: 'लग इन गर्नुहोस्',
      noAccount: 'खाता छैन?',
      register: 'दर्ता गर्नुहोस्',
      forgotPassword: 'पासवर्ड बिर्सनुभयो?',
      loggingIn: 'लग इन गर्दै...',
      heroTitle: 'आमा र शिशुको',
      heroTitle2: 'हेरचाहमा विश्वास',
      heroSubtitle: 'पेशेवर स्वास्थ्य सेवा प्रदायकहरूसँग जोडिनुहोस्',
      feature1: 'प्रमाणित पेशेवरहरू',
      feature2: '२४/७ समर्थन',
      feature3: 'सुरक्षित प्लेटफर्म',
      errors: {
        required: 'कृपया सबै फिल्डहरू भर्नुहोस्',
        invalid: 'अवैध इमेल ठेगाना'
      }
    },
    en: {
      title: 'Welcome Back',
      subtitle: 'Continue your journey with us',
      email: 'Email Address',
      password: 'Password',
      showPassword: 'Show password',
      loginButton: 'Sign In',
      noAccount: 'Don\'t have an account?',
      register: 'Create Account',
      forgotPassword: 'Forgot password?',
      loggingIn: 'Signing in...',
      heroTitle: 'Trusted Care for',
      heroTitle2: 'Mothers & Infants',
      heroSubtitle: 'Connect with certified healthcare professionals',
      feature1: 'Verified Professionals',
      feature2: '24/7 Support',
      feature3: 'Secure Platform',
      errors: {
        required: 'Please fill all fields',
        invalid: 'Invalid email address'
      }
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLocalError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setLocalError(t.errors.required);
      return false;
    }

    const isEmail = formData.email.includes('@');

    if (!isEmail) {
      setLocalError(t.errors.invalid);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // Check if there's a return URL with job selection from location state
        const returnTo = location.state?.returnTo || '/dashboard';
        const selectedJob = location.state?.selectedJob;
        const activeTab = location.state?.activeTab;
        
        if (selectedJob && activeTab) {
          navigate(returnTo, {
            state: {
              selectedJob,
              activeTab
            }
          });
        } else {
          navigate(returnTo);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding & Trust Building */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-500 via-red-400 to-orange-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <img className='h-8 w-8 object-contain' src="/logo.png" alt="Logo" />
            </div>
            <span className="text-white text-2xl font-bold">आमा शिशु सेवा</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              {t.heroTitle}<br />{t.heroTitle2}
            </h1>
            <p className="text-xl text-white/90">{t.heroSubtitle}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg">{t.feature1}</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-lg">{t.feature2}</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg">{t.feature3}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/70 text-sm">
          © 2024 Aama Shishu Sewa. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center justify-center space-y-3 mb-4">
              <div className="bg-rose-200 p-4 rounded-full shadow-lg">
                <img className='h-12 w-12 object-contain' src="/logo.png" alt="Logo" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                आमा शिशु सेवा
              </span>
            </Link>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'ne' ? 'English' : 'नेपाली'}
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          {/* Error Alert */}
          {(localError || authError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                {localError || (typeof authError === 'string' ? authError : authError?.message || 'An error occurred')}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-600">{t.showPassword}</span>
              </label>
              <Link
                to="/forgot_password"
                className="text-sm font-medium text-red-500 hover:text-red-600 transition"
              >
                {t.forgotPassword}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{t.loggingIn}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{t.loginButton}</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t.noAccount}{' '}
              <Link
                to="/register"
                className="font-semibold text-red-500 hover:text-red-600 transition"
              >
                {t.register}
              </Link>
            </p>
          </div>

          {/* Back to Home - Mobile */}
          <div className="mt-8 text-center lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-red-500 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {language === 'ne' ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;