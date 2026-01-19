import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Verified, Star, MapPin, MessageSquare, Award } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';
import TrustBadges from '../components/common/TrustBadges';
import { useLanguage } from '../context/LanguageContext';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Mock data - In a real app, 'bio' would be an object { ne: "...", en: "..." }
  const employee = {
    name: "Sita Thapa",
    city: language === 'ne' ? "काठमाडौं" : "Kathmandu",
    fee: 1500,
    experience: language === 'ne' ? "५+ वर्ष" : "5+ Years",
    rating: 4.9,
    reviews: 42,
    bio: {
      ne: "५ वर्षभन्दा लामो समयदेखि सुत्केरी आमा र नवजात शिशुको स्याहारमा अनुभवी। म स्वास्थ्य र परम्परागत विधिको मिश्रणबाट सेवा प्रदान गर्दछु।",
      en: "Experienced in caring for postpartum mothers and newborns for over 5 years. I provide services through a blend of health and traditional methods."
    },
    image: "https://i.pravatar.cc/300?u=1"
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
                <div className="bg-white p-3 rounded-[3.5rem] shadow-2xl border border-slate-50 relative z-10">
                  <img src={employee.image} alt={employee.name} className="w-full aspect-square rounded-[3rem] object-cover shadow-inner" />
                </div>
                <div className="absolute -inset-2 bg-emerald-500/10 rounded-[4rem] blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              </div>
              
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
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
              <div className="p-8 bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{t.employeeDetail.feeLabel}</p>
                  <div className="flex items-baseline text-white">
                    <span className="text-4xl font-black text-nowrap">Rs. {employee.fee}</span>
                    <span className="text-slate-400 ml-2">/ {t.employeeDetail.perDay}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                   <button className="flex-grow sm:flex-none px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer">
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
      </div>
    </PublicLayout>
  );
};

export default EmployeeDetail;