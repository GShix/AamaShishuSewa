// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, UserPlus, Mail, Phone, Lock, User, MapPin, AlertCircle, Loader, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [language, setLanguage] = useState('ne');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
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
      title: 'नयाँ खाता खोल्नुहोस्',
      subtitle: 'आमा शिशु सेवामा स्वागत छ',
      step1: 'व्यक्तिगत जानकारी',
      step2: 'सम्पर्क विवरण',
      step3: 'पासवर्ड सेट गर्नुहोस्',
      fullName: 'पूरा नाम',
      email: 'इमेल ठेगाना',
      phone: 'फोन नम्बर',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
      address: 'ठेगाना',
      showPassword: 'पासवर्ड देखाउनुहोस्',
      next: 'अर्को',
      back: 'पछाडि',
      registerButton: 'दर्ता गर्नुहोस्',
      registering: 'दर्ता गर्दै...',
      hasAccount: 'पहिले नै खाता छ?',
      login: 'लग इन गर्नुहोस्',
      passwordHint: 'कम्तिमा ६ अक्षर',
      phoneHint: '९८०१२३४५६७ (१० अंक)',
      errors: {
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
      title: 'Create New Account',
      subtitle: 'Welcome to Aama Sisu Seva',
      step1: 'Personal Information',
      step2: 'Contact Details',
      step3: 'Set Password',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      address: 'Address',
      showPassword: 'Show password',
      next: 'Next',
      back: 'Back',
      registerButton: 'Register',
      registering: 'Registering...',
      hasAccount: 'Already have an account?',
      login: 'Login',
      passwordHint: 'At least 6 characters',
      phoneHint: '9801234567 (10 digits)',
      errors: {
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

  const validateStep2 = () => {
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

  const validateStep3 = () => {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-br from-red-200 to-orange-400 p-4 rounded-full shadow-lg">
              {/* <Heart className="w-12 h-12 text-white" /> */}
              <img className='h-6 w-6 md:h-8 md:w-8 object-contain' src="/assets/logo.png" alt="Logo" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
            आमा शिशु सेवा
          </h1>
          <p className="text-gray-600">{t.subtitle}</p>
          <button
            onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')}
            className="mt-4 text-sm text-gray-500 hover:text-red-500 transition shadow-xl shadow-red-200/50 rounded-full px-3 py-1 border border-gray-300"
          >
            {language === 'ne' ? 'English' : 'नेपाली'}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.title}</h2>

          <div className="flex justify-between mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition ${
                    currentStep > step ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  {Object.values(errors).map((error, idx) => (
                    <p key={idx} className="text-sm text-red-700">{error}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="राम बहादुर / Ram Bahadur"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        errors.email ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t.phone}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9801234567"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t.phoneHint}</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t.address}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Kathmandu, Baneshwor"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        errors.address ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        errors.password ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t.passwordHint}</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t.confirmPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-200 focus:border-red-400'
                      }`}
                    />
                  </div>
                </div>
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2"
                  />
                  {t.showPassword}
                </label>
              </>
            )}

            <div className="flex space-x-4 pt-3">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  {t.back}
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
                >
                  {t.next}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
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

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                {t.hasAccount}{' '}
                <Link to="/login" className="font-semibold text-red-500 hover:text-red-600 transition">
                  {t.login}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-gray-600 hover:text-red-500 transition text-sm">
            ← {language === 'ne' ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

      // <div className="min-h-[85vh] flex items-center justify-center px-6 py-8">
      //   <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-rose-100/50 border border-rose-50 p-8 md:p-12">
          
      //     <div className="text-center mb-10">
      //       <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
      //         <UserPlus className="text-rose-500 w-8 h-8" />
      //       </div>
      //       <h2 className="text-3xl font-black text-slate-900">Create Account</h2>
      //       <p className="text-slate-500 mt-2">Join our community for expert mother & infant care</p>
      //     </div>

      //     <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      //       {/* Full Name */}
      //       <div className="md:col-span-2 space-y-2">
      //         <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
      //         <div className="relative group">
      //           <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
      //           <input 
      //             type="text" 
      //             required
      //             className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all outline-none font-medium"
      //             placeholder="Full Name"
      //             onChange={(e) => setFormData({...formData, name: e.target.value})}
      //           />
      //         </div>
      //       </div>

      //       {/* Email Address */}
      //       <div className="md:col-span-2 space-y-2">
      //         <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
      //         <div className="relative group">
      //           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
      //           <input 
      //             type="email" 
      //             required
      //             className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all outline-none font-medium"
      //             placeholder="name@example.com"
      //             onChange={(e) => setFormData({...formData, email: e.target.value})}
      //           />
      //         </div>
      //       </div>

      //       {/* Password */}
      //       <div className="md:col-span-2 space-y-2">
      //         <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
      //         <div className="relative group">
      //           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
      //           <input 
      //             type="password" 
      //             required
      //             className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all outline-none font-medium"
      //             placeholder="Min. 8 characters"
      //             onChange={(e) => setFormData({...formData, password: e.target.value})}
      //           />
      //         </div>
      //       </div>

      //       <div className="md:col-span-2 flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      //           <ShieldCheck className="text-green-500 w-6 h-6 mt-0.5 shrink-0" />
      //           <p className="text-[11px] text-slate-500 leading-relaxed">
      //               By registering, you agree to our <b>Terms of Service</b>. Your data is encrypted and handled according to our <b>Privacy Policy</b>.
      //           </p>
      //       </div>

      //       <button type="submit" className="md:col-span-2 w-full py-4 bg-rose-500 text-white rounded-2xl font-black shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-0.5 transition-all">
      //         Create Account
      //       </button>
      //     </form>

      //     <p className="text-center mt-8 text-slate-500 font-medium">
      //       Already have an account?{' '}
      //       <Link to="/login" className="text-rose-600 font-black hover:underline">Login</Link>
      //     </p>
      //   </div>
      // </div>