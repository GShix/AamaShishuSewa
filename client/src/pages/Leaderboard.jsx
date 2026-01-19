import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ChevronRight, Verified, Star, Crown } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';
import { useLanguage } from '../context/LanguageContext';

const LEADERBOARD_DATA = [
  { id: 1, name: "Sita Thapa", rank: 1, city: "Kathmandu", fee: 1500, rating: 4.9, jobs: 124, image: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Maya Sharma", rank: 2, city: "Lalitpur", fee: 1200, rating: 4.8, jobs: 98, image: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Rita Rai", rank: 3, city: "Bhaktapur", fee: 1300, rating: 4.7, jobs: 85, image: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Gita BK", rank: 4, city: "Pokhara", fee: 1100, rating: 4.2, jobs: 72, image: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Anju Gurung", rank: 5, city: "Chitwan", fee: 1000, rating: 4.5, jobs: 60, image: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "Priya Tamang", rank: 6, city: "Kathmandu", fee: 1400, rating: 3.9, jobs: 55, image: "https://i.pravatar.cc/150?u=6" },
  { id: 7, name: "Saraswati Oli", rank: 7, city: "Butwal", fee: 950, rating: 4.6, jobs: 50, image: "https://i.pravatar.cc/150?u=7" },
];

const Leaderboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [minRating, setMinRating] = useState(0);

  const cities = useMemo(() => ["All", ...new Set(LEADERBOARD_DATA.map(i => i.city))], []);
  const ratingOptions = [0, 4.0, 4.5, 4.8];

  const filteredData = useMemo(() => {
    return LEADERBOARD_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === "All" || item.city === selectedCity;
      const matchesRating = item.rating >= minRating;
      return matchesSearch && matchesCity && matchesRating;
    });
  }, [searchTerm, selectedCity, minRating]);

  // Logic to handle Podium ordering (2nd, 1st, 3rd)
  const top3 = filteredData.slice(0, 3);
  const podium = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;
  const others = filteredData.slice(3);

  if (!t) return null;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FDFCFB] py-6 sm:py-8 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER SECTION - Original Title */}
          <header className="text-center mb-6 sm:mb-10">
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight max-sm:leading-14">{t.leaderboard.title}</h1>
            <p className="text-slate-500 text-lg">{t.leaderboard.subtitle}</p>
          </header>

          {/* FILTER TOOLBAR - Kept exactly as your original */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder={t.leaderboard.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl w-full md:w-auto">
                <span className="text-xs font-black text-slate-400 uppercase px-3">{t.leaderboard.ratingLabel}</span>
                {ratingOptions.map(rate => (
                  <button
                    key={rate}
                    onClick={() => setMinRating(rate)}
                    className={`px-2 sm:px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1 transition-all cursor-pointer ${
                      minRating === rate ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
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

          {/* NEW PODIUM STYLE - Based on the image */}
          {filteredData.length > 0 ? (
            <>
              <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 rounded-[3rem] p-8 mb-10 pt-20 shadow-2xl overflow-hidden">
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
                  {podium.map((emp) => {
                    const isRank1 = emp.rank === 1;
                    return (
                      <div 
                        key={emp.id}
                        onClick={() => navigate(`/employee/${emp.id}`)}
                        className={`flex flex-col items-center cursor-pointer transition-transform hover:scale-105 ${isRank1 ? 'z-10 -translate-y-8' : 'z-0'}`}
                      >
                        <div className="relative">
                          {isRank1 && <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400 drop-shadow-md" size={40} />}
                          <div className={`rounded-full p-1 border-dashed border-2 ${isRank1 ? 'border-orange-400 w-28 h-28 md:w-40 md:h-40' : 'border-white/50 w-20 h-20 md:w-28 md:h-28'}`}>
                            <img src={emp.image} alt={emp.name} className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl" />
                          </div>
                          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${isRank1 ? 'bg-orange-500 scale-125' : 'bg-emerald-500'}`}>
                            {emp.rank}
                          </div>
                        </div>
                        
                        <div className="text-center mt-6">
                           <h3 className="text-white font-black text-sm md:text-xl">{emp.name.split(' ')[0]}</h3>
                           <div className={`mt-2 px-4 py-1 rounded-full inline-flex items-center gap-1 text-white text-[10px] md:text-xs font-black shadow-lg ${isRank1 ? 'bg-orange-500' : 'bg-white/20 backdrop-blur-sm'}`}>
                              <Star size={12} className="fill-current" /> {emp.rating}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LIST DISPLAY - Kept exactly as your original logic/style */}
              <div className="max-w-4xl mx-auto space-y-3">
                {others.map((emp) => (
                  <div 
                    key={emp.id}
                    onClick={() => navigate(`/employee/${emp.id}`)}
                    className="bg-white p-4 rounded-[1.8rem] shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-xl font-black text-slate-400 text-sm">
                      #{emp.rank}
                    </div>
                    <div className="flex-grow flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <img src={emp.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                         <div>
                            <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{emp.name}</h4>
                            <div className="flex items-center gap-3">
                               <p className="text-[10px] text-slate-400 flex items-center font-bold">
                                 <MapPin size={10} className="mr-1" /> {emp.city}
                               </p>
                               <p className="text-[10px] text-yellow-500 flex items-center font-bold">
                                 <Star size={10} className="fill-current mr-1" /> {emp.rating}
                               </p>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="hidden sm:block text-right">
                          <p className="text-[10px] font-black text-slate-300 uppercase">{t.leaderboard.feeLabel}</p>
                          <p className="font-black text-slate-700 text-sm">Rs. {emp.fee}</p>
                        </div>
                        <ChevronRight className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* NO RESULTS SECTION - Kept original */
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">{t.leaderboard.noResultTitle}</h3>
              <p className="text-slate-500 mb-6">{t.leaderboard.noResultSub}</p>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCity("All"); setMinRating(0);}}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold transition-transform hover:scale-105 cursor-pointer"
              >
                {t.leaderboard.resetBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Leaderboard;