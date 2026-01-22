// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, UserPlus, Mail, Phone, Lock, User, MapPin, AlertCircle, Loader, CheckCircle, ArrowLeft, Shield, Baby, Users, Sparkles, Briefcase } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [language, setLanguage] = useState('ne');
  const [currentStep, setCurrentStep] = useState(1);
  useDocumentTitle('Register - आमा शिशु सेवा');

  const [formData, setFormData] = useState({
    role: '', // 'parent' or 'caregiver'
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    latitude: 27.7172,
    longitude: 85.3240
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const translations = {
    ne: {
      title: 'आफ्नो खाता सिर्जना गर्नुहोस्',
      subtitle: 'आमा शिशु सेवामा सामेल हुनुहोस्',
      step1: 'भूमिका चयन गर्नुहोस्',
      step2: 'व्यक्तिगत जानकारी',
      step3: 'सम्पर्क विवरण',
      step4: 'पासवर्ड सेट गर्नुहोस्',
      roleTitle: 'तपाईं कसरी सामेल हुन चाहनुहुन्छ?',
      parentRole: 'अभिभावकको रूपमा',
      parentDesc: 'हेरचाहकर्ताहरू भेट्टाउनुहोस् र बुक गर्नुहोस्',
      caregiverRole: 'हेरचाहकर्ताको रूपमा',
      caregiverDesc: 'सेवाहरू प्रदान गर्नुहोस् र कमाउनुहोस्',
      fullName: 'पूरा नाम',
      email: 'इमेल ठेगाना',
      phone: 'फोन नम्बर',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
      address: 'ठेगाना',
      showPassword: 'पासवर्ड देखाउनुहोस्',
      next: 'अर्को',
      back: 'पछाडि',
      registerButton: 'खाता सिर्जना गर्नुहोस्',
      registering: 'दर्ता गर्दै...',
      hasAccount: 'पहिले नै खाता छ?',
      login: 'लग इन गर्नुहोस्',
      passwordHint: 'कम्तिमा ६ अक्षर',
      phoneHint: '९८०१२३४५६७ (१० अंक)',
      heroTitle: 'विश्वसनीय हेरचाहमा',
      heroTitle2: 'सामेल हुनुहोस्',
      heroSubtitle: 'हजारौं परिवारहरूद्वारा विश्वास गरिएको',
      feature1: 'सुरक्षित र विश्वसनीय',
      feature2: 'प्रमाणित पेशेवरहरू',
      feature3: '२४/७ समर्थन',
      errors: {
        roleRequired: 'कृपया भूमिका चयन गर्नुहोस्',
        nameRequired: 'कृपया आफ्नो नाम प्रविष्ट गर्नुहोस्',
        emailRequired: 'कृपया इमेल प्रविष्ट गर्नुहोस्',
        emailInvalid: 'अवैध इमेल ठेगाना',
        phoneRequired: 'कृपया फोन नम्बर प्रविष्ट गर्नुहोस्',
        phoneInvalid: 'फोन नम्बर १० अंकको हुनुपर्छ',
        passwordRequired: 'कृपया पासवर्ड प्रविष्ट गर्नुहोस्',
        passwordShort: 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ',
        passwordMismatch: 'पासवर्डहरू मेल खाएन',
        addressRequired: 'कृपया ठेगाना प्रविष्ट गर्नुहोस्'
      }
    },
    en: {
      title: 'Create Your Account',
      subtitle: 'Join Aama Shishu Sewa today',
      step1: 'Choose Role',
      step2: 'Personal Info',
      step3: 'Contact Details',
      step4: 'Set Password',
      roleTitle: 'How would you like to join?',
      parentRole: 'As a Parent',
      parentDesc: 'Find and book caregivers',
      caregiverRole: 'As a Caregiver',
      caregiverDesc: 'Provide services and earn',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      address: 'Address',
      showPassword: 'Show password',
      next: 'Continue',
      back: 'Back',
      registerButton: 'Create Account',
      registering: 'Creating account...',
      hasAccount: 'Already have an account?',
      login: 'Sign In',
      passwordHint: 'At least 6 characters',
      phoneHint: '9801234567 (10 digits)',
      heroTitle: 'Join Trusted Care',
      heroTitle2: 'Community',
      heroSubtitle: 'Trusted by thousands of families',
      feature1: 'Secure & Reliable',
      feature2: 'Verified Professionals',
      feature3: '24/7 Support',
      errors: {
        roleRequired: 'Please select a role',
        nameRequired: 'Please enter your name',
        emailRequired: 'Please enter your email',
        emailInvalid: 'Invalid email address',
        phoneRequired: 'Please enter your phone number',
        phoneInvalid: 'Phone number must be 10 digits',
        passwordRequired: 'Please enter a password',
        passwordShort: 'Password must be at least 6 characters',
        passwordMismatch: 'Passwords do not match',
        addressRequired: 'Please enter your address'
      }
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.role) {
      newErrors.role = t.errors.roleRequired;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = t.errors.nameRequired;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errors.emailInvalid;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.phone.trim()) {
      newErrors.phone = t.errors.phoneRequired;
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = t.errors.phoneInvalid;
    }
    if (!formData.address.trim()) {
      newErrors.address = t.errors.addressRequired;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = t.errors.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = t.errors.passwordShort;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.errors.passwordMismatch;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep4()) return;

    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      role: formData.role
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding & Trust Building */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-red-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-400/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
        
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
                <CheckCircle className="w-5 h-5" />
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

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
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

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all ${
                    currentStep > step ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Error Alert */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  {Object.values(errors).map((error, idx) => (
                    <p key={idx} className="text-sm text-red-700">{error}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.roleTitle}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({...formData, role: 'parent'});
                      if (errors.role) setErrors({...errors, role: ''});
                    }}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      formData.role === 'parent'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        formData.role === 'parent' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <Baby className={`w-6 h-6 ${
                          formData.role === 'parent' ? 'text-red-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{t.parentRole}</h4>
                        <p className="text-sm text-gray-600">{t.parentDesc}</p>
                      </div>
                      {formData.role === 'parent' && (
                        <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({...formData, role: 'caregiver'});
                      if (errors.role) setErrors({...errors, role: ''});
                    }}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      formData.role === 'caregiver'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        formData.role === 'caregiver' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <Briefcase className={`w-6 h-6 ${
                          formData.role === 'caregiver' ? 'text-red-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{t.caregiverRole}</h4>
                        <p className="text-sm text-gray-600">{t.caregiverDesc}</p>
                      </div>
                      {formData.role === 'caregiver' && (
                        <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="राम बहादुर / Ram Bahadur"
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                        errors.fullName ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                        errors.email ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9801234567"
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                        errors.phone ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t.phoneHint}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.address}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Kathmandu, Baneshwor"
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                        errors.address ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Password */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                        errors.password ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t.passwordHint}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.confirmPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{t.showPassword}</span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4 pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  {t.back}
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-orange-600 transition-all"
                >
                  {t.next}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>{t.registering}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>{t.registerButton}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t.hasAccount}{' '}
              <Link to="/login" className="font-semibold text-red-500 hover:text-red-600 transition">
                {t.login}
              </Link>
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              <Link
                to="/admin/login"
                className="text-slate-600 hover:text-rose-500 font-medium"
              >
                
              Already have an admin account?
              </Link>
            </p>
          </div>

          {/* Back to Home - Mobile */}
          <div className="mt-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-red-500 transition">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {language === 'ne' ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
 