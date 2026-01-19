import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Verified, Star, MapPin, MessageSquare, Award, X, CheckCircle2, Calendar, Check } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';
import TrustBadges from '../components/common/TrustBadges';
import { useLanguage } from '../context/LanguageContext';

const SERVICE_OPTIONS = {
  care: ["Infant Care", "Baby Massage", "Postnatal Care", "Elderly Care"],
  housework: ["Full House Cleaning", "Kitchen Cleaning", "Laundry & Ironing", "Meal Preparation"]
};

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Modal & Booking State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDate, setBookingDate] = useState("");

  // Mock data - In a real app, 'bio' would be an object { ne: "...", en: "..." }
  const employee = {
    name: "Sita Thapa",
    city: language === 'ne' ? "काठमाडौं" : "Kathmandu",
    fee: 1500,
    experience: language === 'ne' ? "५+ वर्ष" : "5+ Years",
    rating: 4.9,
    reviews: 42,
    category: "care",
    status: "open",
    bio: {
      ne: "५ वर्षभन्दा लामो समयदेखि सुत्केरी आमा र नवजात शिशुको स्याहारमा अनुभवी। म स्वास्थ्य र परम्परागत विधिको मिश्रणबाट सेवा प्रदान गर्दछु।",
      en: "Experienced in caring for postpartum mothers and newborns for over 5 years. I provide services through a blend of health and traditional methods."
    },
    image: "https://i.pravatar.cc/300?u=1"
  };

  const toggleService = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const openBookingModal = () => {
    setSelectedServices([]);
    setBookingDate("");
    setBookingStep(1);
    setIsModalOpen(true);
  };

  if (!t || !t.employeeDetail) return null;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FDFCFB] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 font-bold mb-8 hover:text-slate-900 transition-all cursor-pointer">
            <ChevronLeft size={20} /> {t.employeeDetail.backBtn}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Sidebar: Image and Stats */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="bg-white p-3 rounded-4xl shadow-2xl border border-slate-50 relative z-10">
                  <img src={employee.image} alt={employee.name} className="w-full aspect-square rounded-4xl object-cover shadow-inner"  />
                </div>
                <div className="absolute -inset-2 bg-emerald-500/10 rounded-[4rem] blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              </div>
              
              <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm text-center">
                 <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl mb-3">
                    <Award size={24} />
                 </div>
                 <h4 className="font-black text-slate-800 tracking-tight">{t.employeeDetail.topPerformer}</h4>
                 <p className="text-xs text-slate-400 font-bold uppercase mt-1">{t.employeeDetail.thisMonth}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight">{employee.name}</h1>
                  <Verified className="text-blue-500 fill-blue-50" size={32} />
                </div>
                <div className="flex items-center gap-6 text-slate-400 font-bold">
                  <span className="flex items-center"><MapPin size={18} className="mr-1" /> {employee.city}</span>
                  <span className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full text-sm">
                    <Star size={16} className="mr-1 fill-current" /> {employee.rating}
                  </span>
                </div>
              </section>

              {/* Trust Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <span className="w-8 h-[2px] bg-emerald-500 mr-3"></span>
                  {t.employeeDetail.trustTitle}
                </h3>
                <TrustBadges />
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <span className="w-8 h-[2px] bg-emerald-500 mr-3"></span>
                  {t.employeeDetail.aboutPrefix} {employee.name.split(' ')[0]}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                    {language === 'ne' ? employee.bio.ne : employee.bio.en}
                </p>
              </section>

              {/* Price and Action */}
              <div className="p-8 bg-slate-900 rounded-4xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{t.employeeDetail.feeLabel}</p>
                  <div className="flex items-baseline text-white">
                    <span className="text-4xl font-black text-nowrap">Rs. {employee.fee}</span>
                    <span className="text-slate-400 ml-2">/ {t.employeeDetail.perDay}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                   <button onClick={openBookingModal} className="flex-grow sm:flex-none px-4 sm:px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-nowrap">
                     {t.employeeDetail.bookBtn}
                   </button>
                   <button className="p-5 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all cursor-pointer">
                      <MessageSquare size={24} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING MODAL */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <img src={employee.image} className="w-12 h-12 rounded-full border-2 border-white" alt="" />
                  <div>
                    <h3 className="font-black text-slate-900">Request {employee.name}</h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Status: {employee.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Daily Rate</p>
                  <p className="text-xl font-black text-slate-900">Rs. {employee.fee}</p>
                </div>
              </div>

              {bookingStep === 1 ? (
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Service Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Desired Services</label>
                    <div className="grid grid-cols-2 gap-2">
                        {SERVICE_OPTIONS[employee.category].map(service => (
                            <button 
                                key={service}
                                onClick={() => toggleService(service)}
                                className={`p-3 rounded-2xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${selectedServices.includes(service) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                            >
                                {service}
                                {selectedServices.includes(service) && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Booking Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="date" 
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20" 
                        />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Additional Notes</label>
                    <textarea placeholder="e.g. Please bring specific cleaning tools or infant items." className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-medium text-sm h-24 resize-none" />
                  </div>

                  <button 
                    disabled={!bookingDate || selectedServices.length === 0}
                    onClick={() => setBookingStep(2)}
                    className="w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale cursor-pointer bg-emerald-500 shadow-emerald-200"
                  >
                    Send Booking Request
                  </button>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Request Received!</h2>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    We have notified <strong>{employee.name}</strong> for {selectedServices.length} services on {bookingDate}. 
                    You will be notified once they accept.
                  </p>
                  <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black mt-8 cursor-pointer">Got it!</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default EmployeeDetail;