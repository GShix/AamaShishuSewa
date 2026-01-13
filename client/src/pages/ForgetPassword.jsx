// client/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Phone, Lock, ArrowLeft, CheckCircle, AlertCircle, Loader, Send } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('ne');
  const [step, setStep] = useState(1); // 1: Request Reset, 2: Verify OTP, 3: New Password
  
  const [formData, setFormData] = useState({
    identifier: '', // email or phone
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const translations = {
    ne: {
      title: 'पासवर्ड बिर्सनुभयो?',
      subtitle: 'चिन्ता नगर्नुहोस्, हामी मद्दत गर्नेछौं',
      step1: {
        title: 'आफ्नो खाता फेला पार्नुहोस्',
        description: 'आफ्नो इमेल वा फोन नम्बर प्रविष्ट गर्नुहोस्',
        identifier: 'इमेल वा फोन नम्बर',
        identifierPlaceholder: 'example@email.com or 9801234567',
        sendButton: 'OTP पठाउनुहोस्',
        sending: 'पठाउँदै...'
      },
      step2: {
        title: 'OTP प्रमाणीकरण',
        description: 'हामीले तपाईंको {method} मा 6 अंकको कोड पठाएका छौं',
        otpLabel: 'OTP कोड प्रविष्ट गर्नुहोस्',
        otpPlaceholder: '123456',
        verifyButton: 'प्रमाणित गर्नुहोस्',
        verifying: 'प्रमाणित गर्दै...',
        resendText: 'OTP प्राप्त भएन?',
        resendButton: 'पुन: पठाउनुहोस्',
        resendWait: '{seconds} सेकेन्डमा पुन: पठाउनुहोस्'
      },
      step3: {
        title: 'नयाँ पासवर्ड सेट गर्नुहोस्',
        description: 'आफ्नो नयाँ पासवर्ड छान्नुहोस्',
        newPassword: 'नयाँ पासवर्ड',
        confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
        passwordHint: 'कम्तिमा ६ अक्षर',
        showPassword: 'पासवर्ड देखाउनुहोस्',
        resetButton: 'पासवर्ड रिसेट गर्नुहोस्',
        resetting: 'रिसेट गर्दै...'
      },
      backToLogin: 'लग इन पृष्ठमा फर्कनुहोस्',
      backToHome: 'गृहपृष्ठमा फर्कनुहोस्',
      success: {
        otpSent: 'OTP सफलतापूर्वक पठाइयो!',
        passwordReset: 'पासवर्ड सफलतापूर्वक रिसेट भयो! लग इन गर्नुहोस्।'
      },
      errors: {
        required: 'कृपया सबै फिल्डहरू भर्नुहोस्',
        invalidIdentifier: 'अवैध इमेल वा फोन नम्बर',
        invalidOtp: 'OTP ६ अंकको हुनुपर्छ',
        passwordShort: 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ',
        passwordMismatch: 'पासवर्डहरू मेल खाएन',
        accountNotFound: 'खाता फेला परेन',
        otpExpired: 'OTP समय सकियो',
        otpInvalid: 'अवैध OTP',
        genericError: 'केहि गलत भयो। पुन: प्रयास गर्नुहोस्।'
      }
    },
    en: {
      title: 'Forgot Password?',
      subtitle: 'Don\'t worry, we\'ll help you',
      step1: {
        title: 'Find Your Account',
        description: 'Enter your email or phone number',
        identifier: 'Email or Phone Number',
        identifierPlaceholder: 'example@email.com or 9801234567',
        sendButton: 'Send OTP',
        sending: 'Sending...'
      },
      step2: {
        title: 'OTP Verification',
        description: 'We sent a 6-digit code to your {method}',
        otpLabel: 'Enter OTP Code',
        otpPlaceholder: '123456',
        verifyButton: 'Verify',
        verifying: 'Verifying...',
        resendText: 'Didn\'t receive OTP?',
        resendButton: 'Resend',
        resendWait: 'Resend in {seconds}s'
      },
      step3: {
        title: 'Set New Password',
        description: 'Choose your new password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        passwordHint: 'At least 6 characters',
        showPassword: 'Show password',
        resetButton: 'Reset Password',
        resetting: 'Resetting...'
      },
      backToLogin: 'Back to Login',
      backToHome: 'Back to Home',
      success: {
        otpSent: 'OTP sent successfully!',
        passwordReset: 'Password reset successfully! Please login.'
      },
      errors: {
        required: 'Please fill all fields',
        invalidIdentifier: 'Invalid email or phone number',
        invalidOtp: 'OTP must be 6 digits',
        passwordShort: 'Password must be at least 6 characters',
        passwordMismatch: 'Passwords do not match',
        accountNotFound: 'Account not found',
        otpExpired: 'OTP expired',
        otpInvalid: 'Invalid OTP',
        genericError: 'Something went wrong. Please try again.'
      }
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!formData.identifier) {
      setError(t.errors.required);
      return;
    }

    const isEmail = formData.identifier.includes('@');
    const isPhone = /^[0-9]{10}$/.test(formData.identifier);

    if (!isEmail && !isPhone) {
      setError(t.errors.invalidIdentifier);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // TODO: Replace with actual API call
      // const response = await axios.post('/api/auth/forgot-password', {
      //   identifier: formData.identifier
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(t.success.otpSent);
      setStep(2);
      startResendTimer();
      
    } catch (err) {
      setError(err.response?.data?.error || t.errors.genericError);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setError(t.errors.required);
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.otp)) {
      setError(t.errors.invalidOtp);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // TODO: Replace with actual API call
      // const response = await axios.post('/api/auth/verify-otp', {
      //   identifier: formData.identifier,
      //   otp: formData.otp
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess('');
      setStep(3);
      
    } catch (err) {
      setError(err.response?.data?.error || t.errors.otpInvalid);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setError(t.errors.required);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError(t.errors.passwordShort);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t.errors.passwordMismatch);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // TODO: Replace with actual API call
      // const response = await axios.post('/api/auth/reset-password', {
      //   identifier: formData.identifier,
      //   otp: formData.otp,
      //   newPassword: formData.newPassword
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(t.success.passwordReset);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || t.errors.genericError);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    await handleSendOTP();
  };

  const getMethodText = () => {
    const isEmail = formData.identifier.includes('@');
    return isEmail 
      ? (language === 'ne' ? 'इमेल' : 'email')
      : (language === 'ne' ? 'फोन नम्बर' : 'phone number');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-red-400 to-orange-400 p-4 rounded-full shadow-lg">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
            आमा शिशु सेवा
          </h1>
          <p className="text-gray-600">{t.subtitle}</p>
          
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')}
            className="mt-4 text-sm text-gray-500 hover:text-red-500 transition"
          >
            {language === 'ne' ? 'English' : 'नेपाली'}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h2>
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  step >= s
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-1 transition ${
                    step > s ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Request OTP */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">{t.step1.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{t.step1.description}</p>
                
                <label className="block text-gray-700 font-semibold mb-2">
                  {t.step1.identifier}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder={t.step1.identifierPlaceholder}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{t.step1.sending}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t.step1.sendButton}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">{t.step2.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t.step2.description.replace('{method}', getMethodText())}
                </p>
                
                <label className="block text-gray-700 font-semibold mb-2">
                  {t.step2.otpLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder={t.step2.otpPlaceholder}
                    maxLength="6"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none transition text-center text-2xl tracking-widest font-bold"
                  />
                </div>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{t.step2.verifying}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{t.step2.verifyButton}</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{t.step2.resendText}</p>
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0}
                  className="text-sm font-semibold text-red-500 hover:text-red-600 transition disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 
                    ? t.step2.resendWait.replace('{seconds}', resendTimer)
                    : t.step2.resendButton
                  }
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">{t.step3.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{t.step3.description}</p>
                
                <label className="block text-gray-700 font-semibold mb-2">
                  {t.step3.newPassword}
                </label>
                <div className="relative mb-4">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none transition"
                  />
                </div>
                <p className="text-xs text-gray-500 mb-4">{t.step3.passwordHint}</p>

                <label className="block text-gray-700 font-semibold mb-2">
                  {t.step3.confirmPassword}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none transition"
                  />
                </div>

                <label className="flex items-center mt-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2"
                  />
                  {t.step3.showPassword}
                </label>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{t.step3.resetting}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{t.step3.resetButton}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center pt-6 border-t border-gray-200 mt-6">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-500 transition font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backToLogin}</span>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-red-500 transition text-sm"
          >
            ← {t.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;