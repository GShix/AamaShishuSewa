import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, User, 
  ChevronRight, ChevronLeft, CheckCircle, 
  ShieldCheck, Star, Heart 
} from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';

const BookService = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    duration: '',
    date: '',
    location: '',
    name: '',
    phone: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <PublicLayout>
      <div className="flex items-center justify-center py-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Stepper */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= num ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > num ? <CheckCircle size={20} /> : num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded ${step > num ? 'bg-rose-500' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Booking Form */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-rose-50">
              
              {/* STEP 1: SERVICE SELECTION */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold mb-6 text-slate-800">What service do you need?</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'postpartum', title: 'Postpartum Care (Susare)', icon: <ShieldCheck className="text-blue-500" /> },
                      { id: 'massage', title: 'Maternal & Baby Massage', icon: <Heart className="text-rose-500" /> },
                      { id: 'ritual', title: 'Nwaran / Ritual Setup', icon: <Star className="text-orange-500" /> }
                    ].map((item) => (
                      <label key={item.id} className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.service === item.id ? 'border-rose-500 bg-rose-50' : 'border-slate-100 hover:border-rose-200'
                      }`}>
                        <input 
                          type="radio" 
                          name="service" 
                          className="hidden" 
                          onChange={() => setFormData({...formData, service: item.id})}
                        />
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4">{item.icon}</div>
                        <span className="font-bold text-slate-700">{item.title}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    disabled={!formData.service}
                    onClick={nextStep}
                    className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {/* STEP 2: LOGISTICS */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold mb-6 text-slate-800">When & Where?</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-2"><Calendar size={16}/> Preferred Start Date</label>
                      <input type="date" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-2"><MapPin size={16}/> Service Location</label>
                      <input type="text" placeholder="House No, Area (e.g., Baneshwor)" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={prevStep} className="py-4 border border-slate-200 rounded-xl font-bold text-slate-600 flex items-center justify-center gap-2"><ChevronLeft size={20}/> Back</button>
                      <button onClick={nextStep} className="py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">Next Step <ChevronRight size={20}/></button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONTACT & CONFIRM */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold mb-6 text-slate-800">Final Details</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-2"><User size={16}/> Full Name</label>
                      <input type="text" placeholder="Enter your name" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-2"><Clock size={16}/> Contact Number</label>
                      <input type="tel" placeholder="98XXXXXXXX" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500" />
                    </div>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm italic">
                      By confirming, our care coordinator will call you to finalize the schedule and caregiver assignment.
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={prevStep} className="py-4 border border-slate-200 rounded-xl font-bold text-slate-600">Back</button>
                      <button className="py-4 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-100">Confirm Booking</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 text-white rounded-[2rem] p-8 sticky top-24">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Booking Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-semibold capitalize">{formData.service || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Consultation:</span>
                    <span className="font-semibold text-green-400">FREE</span>
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl mb-6">
                  <p className="text-xs text-slate-400 mb-1 font-bold tracking-widest uppercase">Support</p>
                  <p className="text-sm">+977 9764651355</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed text-center">
                  All our professionals are background checked and verified for safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>

  );
};

export default BookService;