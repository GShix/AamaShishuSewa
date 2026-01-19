import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ChevronRight, Verified, Star, Crown, Calendar, Home, Baby, X, CheckCircle2, Clock, MessageSquare, Check } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';
import { useLanguage } from '../context/LanguageContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const LEADERBOARD_DATA = [
  { id: 1, name: "Sita Thapa", rank: 1, city: "Kathmandu", fee: 1500, rating: 4.9, jobs: 124, image: "https://i.pravatar.cc/150?u=1", category: "care", status: "open" },
  { id: 2, name: "Maya Sharma", rank: 2, city: "Lalitpur", fee: 1200, rating: 4.8, jobs: 98, image: "https://i.pravatar.cc/150?u=2", category: "care", status: "open" },
  { id: 3, name: "Rita Rai", rank: 3, city: "Bhaktapur", fee: 1300, rating: 4.7, jobs: 85, image: "https://i.pravatar.cc/150?u=3", category: "care", status: "booked" },
  { id: 4, name: "Gita BK", rank: 4, city: "Pokhara", fee: 1100, rating: 4.2, jobs: 72, image: "https://i.pravatar.cc/150?u=4", category: "housework", status: "open" },
  { id: 5, name: "Anju Gurung", rank: 5, city: "Chitwan", fee: 1000, rating: 4.5, jobs: 60, image: "https://i.pravatar.cc/150?u=5", category: "housework", status: "open" },
  { id: 6, name: "Priya Tamang", rank: 6, city: "Kathmandu", fee: 1400, rating: 3.9, jobs: 55, image: "https://i.pravatar.cc/150?u=6", category: "care", status: "open" },
  { id: 7, name: "Saraswati Oli", rank: 7, city: "Butwal", fee: 950, rating: 4.6, jobs: 50, image: "https://i.pravatar.cc/150?u=7", category: "housework", status: "booked" },
];

const SERVICE_OPTIONS = {
  care: ["Infant Care", "Baby Massage", "Postnatal Care", "Elderly Care"],
  housework: ["Full House Cleaning", "Kitchen Cleaning", "Laundry & Ironing", "Meal Preparation"]
};

const Leaderboard = () => {
  const navigate = useNavigate();
  useDocumentTitle("Find Services - Aama Shishu Sewa");
  const { t, language } = useLanguage();
  
  const [activeCategory, setActiveCategory] = useState("care");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [minRating, setMinRating] = useState(0);

  // Modal & Booking State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); 
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDate, setBookingDate] = useState("");

  const cities = useMemo(() => ["All", ...new Set(LEADERBOARD_DATA.map(i => i.city))], []);
  const ratingOptions = [0, 4.0, 4.5, 4.8];

  const filteredData = useMemo(() => {
    return LEADERBOARD_DATA.filter(item => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === "All" || item.city === selectedCity;
      const matchesRating = item.rating >= minRating;
      return matchesCategory && matchesSearch && matchesCity && matchesRating;
    });
  }, [activeCategory, searchTerm, selectedCity, minRating]);

  const top3 = filteredData.slice(0, 3);
  const podium = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;
  const others = filteredData.slice(3);

  const openBookingModal = (e, worker) => {
    e.stopPropagation();
    if (worker.status === 'booked') return;
    setSelectedWorker(worker);
    setSelectedServices([]);
    setBookingDate("");
    setBookingStep(1);
    setIsModalOpen(true);
  };

  const toggleService = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  if (!t) return null;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FDFCFB] py-6 sm:py-8 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER SECTION */}
          <header className="text-center mb-6 sm:mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                {activeCategory === 'care' ? t.leaderboard.title : 'Housework Services'}
            </h1>
            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                    <button onClick={() => setActiveCategory('care')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all cursor-pointer ${activeCategory === 'care' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}><Baby size={18} /> {language === 'ne' ? 'शिशु सेवा' : 'Child Care'}</button>
                    <button onClick={() => setActiveCategory('housework')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all cursor-pointer ${activeCategory === 'housework' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><Home size={18} /> {language === 'ne' ? 'घरको काम' : 'Housework'}</button>
                </div>
            </div>
          </header>

          {/* FILTER TOOLBAR */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder={t.leaderboard.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" />
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl w-full md:w-auto">
                <span className="text-xs font-black text-slate-400 uppercase px-3">{t.leaderboard.ratingLabel}</span>
                {ratingOptions.map(rate => (
                  <button key={rate} onClick={() => setMinRating(rate)} className={`px-2 sm:px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1 transition-all cursor-pointer ${minRating === rate ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    {rate === 0 ? (language === 'ne' ? 'सबै' : 'Any') : <>{rate}<Star size={12} className="fill-current" /></>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    selectedCity === city ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {city === "All" ? (language === 'ne' ? 'सबै सहर' : 'All Cities') : city}
                </button>
              ))}
            </div>
          </div>

          {/* PODIUM DISPLAY */}
          <div className={`relative bg-gradient-to-br ${activeCategory === 'care' ? 'from-rose-500 via-pink-500 to-orange-500' : 'from-indigo-600 via-purple-600 to-blue-500'} rounded-[3rem] p-8 mb-10 pt-20 shadow-2xl overflow-hidden`}>
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            
            {/* Celebratory Confetti & Stickers */}
            <div className="absolute top-4 left-8 text-yellow-300 opacity-80 text-4xl animate-bounce">🎉</div>
            <div className="absolute top-12 right-12 text-yellow-300 opacity-70 text-3xl animate-pulse">⭐</div>
            <div className="absolute top-8 left-[20%] text-pink-200 opacity-60 text-2xl">✨</div>
            <div className="absolute top-6 right-[25%] text-yellow-200 opacity-70 text-3xl">🌟</div>
            <div className="absolute bottom-20 left-4 text-orange-200 opacity-50 text-2xl rotate-12">🎊</div>
            <div className="absolute bottom-24 right-8 text-pink-200 opacity-60 text-2xl -rotate-12">💫</div>
            <div className="absolute top-16 left-[45%] text-yellow-300 opacity-40 text-xl">✨</div>
            <div className="absolute bottom-32 left-[15%] text-orange-200 opacity-50 text-2xl">🏆</div>
            <div className="absolute bottom-28 right-[18%] text-yellow-200 opacity-60 text-2xl">👏</div>
            
            {/* Decorative circles */}
            <div className="absolute top-10 right-20 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-16 left-16 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/10 rounded-full blur-xl"></div>
            
            <div className="relative flex justify-center items-end gap-2 md:gap-12">
              {podium.map((emp) => (
                <div key={emp.id} className={`flex flex-col items-center transition-transform hover:scale-105 ${emp.rank === 1 ? 'z-10 -translate-y-8' : ''}`}>
                  <div className="relative cursor-pointer" onClick={() => navigate(`/employee/${emp.id}`)}>
                    {emp.rank === 1 && <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400 animate-pulse" size={40} />}
                    <div className="relative">
                        <img src={emp.image} className={`rounded-full border-4 border-white shadow-xl object-cover ${emp.rank === 1 ? 'w-28 h-28 md:w-40 md:h-40' : 'w-20 h-20 md:w-28 md:h-28'}`} alt="" />
                        {/* Status Badge */}
                        <div className={`absolute bottom-0 right-0 px-2 py-1 rounded-lg text-[8px] font-black uppercase border-2 border-white shadow-sm ${emp.status === 'open' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                            {emp.status}
                        </div>
                    </div>
                  </div>
                  <h3 className="text-white font-black text-sm md:text-xl mt-4">{emp.name.split(' ')[0]}</h3>
                  <button 
                    disabled={emp.status === 'booked'}
                    onClick={(e) => openBookingModal(e, emp)} 
                    className={`mt-3 px-6 py-2 rounded-full text-[10px] md:text-xs font-black shadow-lg transition-all cursor-pointer ${emp.status === 'booked' ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-white text-slate-900 hover:scale-105'}`}
                  >
                    {emp.status === 'booked' ? 'BOOKED' : 'BOOK NOW'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LIST DISPLAY */}
          <div className="max-w-4xl mx-auto space-y-3">
            {others.map((emp) => (
              <div key={emp.id} className="bg-white p-4 rounded-[1.8rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate(`/employee/${emp.id}`)}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={emp.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${emp.status === 'open' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{emp.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{emp.city} • {emp.rating} ★ • {emp.status}</p>
                  </div>
                </div>
                <button 
                    disabled={emp.status === 'booked'}
                    onClick={(e) => openBookingModal(e, emp)} 
                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${emp.status === 'booked' ? 'bg-slate-50 text-slate-300' : activeCategory === 'care' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                >
                    {emp.status === 'booked' ? 'Unavailable' : 'Book Now'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING MODAL */}
        {isModalOpen && selectedWorker && (
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
                  <img src={selectedWorker.image} className="w-12 h-12 rounded-full border-2 border-white" alt="" />
                  <div>
                    <h3 className="font-black text-slate-900">Request {selectedWorker.name}</h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Status: {selectedWorker.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Daily Rate</p>
                  <p className="text-xl font-black text-slate-900">Rs. {selectedWorker.fee}</p>
                </div>
              </div>

              {bookingStep === 1 ? (
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Service Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Desired Services</label>
                    <div className="grid grid-cols-2 gap-2">
                        {SERVICE_OPTIONS[activeCategory].map(service => (
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
                    className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale cursor-pointer ${activeCategory === 'care' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'}`}
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
                    We have notified <strong>{selectedWorker.name}</strong> for {selectedServices.length} services on {bookingDate}. 
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

export default Leaderboard;