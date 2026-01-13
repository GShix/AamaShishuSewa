// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogIn, Phone, Lock, AlertCircle, Loader } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
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
      title: 'लग इन गर्नुहोस्',
      subtitle: 'आफ्नो खातामा पहुँच गर्नुहोस्',
      email: 'इमेल',
      password: 'पासवर्ड',
      showPassword: 'पासवर्ड देखाउनुहोस्',
      loginButton: 'लग इन गर्नुहोस्',
      noAccount: 'खाता छैन?',
      register: 'दर्ता गर्नुहोस्',
      forgotPassword: 'पासवर्ड बिर्सनुभयो?',
      loggingIn: 'लग इन गर्दै...',
      errors: {
        required: 'कृपया सबै फिल्डहरू भर्नुहोस्',
        invalid: 'अवैध इमेल वा फोन नम्बर'
      }
    },
    en: {
      title: 'Login',
      subtitle: 'Access your account',
      email: 'Email',
      password: 'Password',
      showPassword: 'Show password',
      loginButton: 'Login',
      noAccount: 'Don\'t have an account?',
      register: 'Register',
      forgotPassword: 'Forgot password?',
      loggingIn: 'Logging in...',
      errors: {
        required: 'Please fill all fields',
        invalid: 'Invalid email'
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
    const isPhone = /^[0-9]{10}$/.test(formData.email);

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
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-red-200 to-orange-400 p-4 rounded-full shadow-lg">
              {/* <Heart className="w-12 h-12 text-white" /> */}
              <img className='h-6 w-6 md:h-8 md:w-8 object-contain' src="/assets/logo.png" alt="Logo" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
            आमा शिशु सेवा
          </h1>
          <p className="text-gray-600 text-sm">{t.subtitle}</p>
          <button
            onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')}
            className="mt-2 text-sm text-gray-500 cursor-pointer hover:text-red-500 transition shadow-xl shadow-red-200/50 rounded-full px-3 py-1 border border-gray-300"
          >
            {language === 'ne' ? 'English' : 'नेपाली'}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t.title}</h2>

          {(localError || authError) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{localError || authError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t.email}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com or 9801234567"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none transition"
                />
              </div>
              <label className="flex items-center mt-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                {t.showPassword}
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
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

            <div className="text-center">
              <Link
                to="/forgot_password"
                className="text-sm text-gray-600 hover:text-red-500 transition"
              >
                {t.forgotPassword}
              </Link>
            </div>

            <div className="text-center pt-2 border-t border-gray-200">
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
          </div>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-red-500 transition text-sm"
          >
            ← {language === 'ne' ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;