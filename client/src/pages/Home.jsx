import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Award, Star, Briefcase, 
  CheckCircle, ShieldAlert, Sun,
  ChevronDown, HelpCircle, ShieldCheck
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PublicLayout from '../layout/PublicLayout';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  // 2. Get t and language directly from Context
  const { t, language } = useLanguage(); 
  
  useDocumentTitle(language === 'ne' ? 'गृहपृष्ठ' : 'Home');
  
  // 3. Fallback UI so it's not a blank screen while loading
  if (!t) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FFFBFB] text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden">
        
        {/* --- HERO SECTION --- */}
        <section className="relative py-8 lg:py-12 px-6 lg:px-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-bold mb-6 ring-1 ring-rose-200">
                <Star className="w-4 h-4 fill-rose-600" /> #1 Professional Sutkeri Sewa
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.3] mb-6">
                {t.hero.title}
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button onClick={() => navigate('/services')} className="cursor-pointer px-8 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-xl hover:bg-rose-600 transition-all flex items-center justify-center gap-3">
                  <Heart className="w-6 h-6 fill-white" /> {t.hero.ctaBook}
                </button>
                <button onClick={() => navigate('/join_us')} className="cursor-pointer px-8 py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl font-black hover:border-rose-300 transition-all flex items-center justify-center gap-3">
                  <Briefcase className="w-6 h-6" /> {t.hero.ctaJoin}
                </button>
              </div>
              
              <div className="mt-12 flex items-center gap-10">
                <div>
                  <p className="text-3xl font-black text-slate-900">{t.stats.happy.split(' ')[0]}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{t.stats.happy.split(' ').slice(1).join(' ')}</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div>
                  <p className="text-3xl font-black text-slate-900">{t.stats.pros.split(' ')[0]}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{t.stats.pros.split(' ').slice(1).join(' ')}</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-[12px] border-white">
                <img src="./assets/landing_page.png" alt="Caring Professional" className="w-full h-[450px] object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-rose-50">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="text-white w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Verified Safety</p>
                  <p className="text-xs text-slate-500">Govt. Registered Agency</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- MISSION SECTION --- */}
        <section className="py-8 lg:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-rose-50 p-10 rounded-[2.5rem] transform translate-y-8">
                <Sun className="text-rose-500 mb-6" size={48} />
                <h4 className="font-black text-slate-900 text-xl mb-2">{language === 'ne' ? 'परम्परा' : 'Tradition'}</h4>
                <p className="text-sm text-slate-500">{language === 'ne' ? 'पुस्ताौंदेखि हस्तान्तरण गरिएको मौलिक आयुर्वेदिक विधि।' : 'Authentic Ayurvedic methods passed through generations.'}</p>
              </div>
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
                <Award className="text-rose-400 mb-6" size={48} />
                <h4 className="font-black text-xl mb-2">{language === 'ne' ? 'गुणस्तर' : 'Quality'}</h4>
                <p className="text-sm text-slate-400">{language === 'ne' ? 'प्रत्येक सुसारेको लागि कडा छनौट प्रक्रिया।' : 'Strict screening for every caregiver we send.'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-black mb-8 text-rose-600 leading-tight">{t.sections.mission}</h3>
              <p className="text-xl text-slate-600 leading-relaxed mb-10 text-justify">{t.missionContent}</p>
              <div className="p-8 border-2 border-slate-50 rounded-[2rem] flex items-center gap-6">
                 <div className="flex -space-x-4">
                   {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-rose-400" />)}
                 </div>
                 <p className="text-sm font-bold text-slate-500">{language === 'ne' ? 'हाम्रो विशेषज्ञतामा विश्वास गर्ने ५०+ परिवारहरूमा सामेल हुनुहोस्।' : 'Join 50+ families who trust our expertise.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CONDUCT SECTION --- */}
        <section className="py-8 lg:py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-4xl font-black mb-4">{t.sections.conduct}</h3>
            <p className="text-slate-500 mb-12 text-lg">{language === 'ne' ? 'मर्यादा र व्यावसायिकताको हाम्रो प्रतिबद्धता।' : 'Our promise of dignity and professionalism.'}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.conductPoints.map((point, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-rose-500 transition-colors">
                    <CheckCircle className="text-rose-500 group-hover:text-white" size={28} />
                  </div>
                  <h4 className="font-black text-slate-900 mb-3">{point.title}</h4>
                  <p className="text-sm text-slate-500">{point.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 p-8 bg-rose-600 rounded-[2rem] flex flex-col items-center gap-4 text-white max-w-4xl mx-auto shadow-2xl">
                <ShieldAlert size={40} />
                <div className="text-center">
                  <p className="font-black text-lg mb-2 italic uppercase tracking-wider">Safety First</p>
                  <p className="text-sm text-rose-100 leading-relaxed">
                    {language === 'ne' 
                      ? 'हाम्रा सुसारेहरूले सहयोगीको रूपमा काम गर्छन्। उनीहरूले डाक्टरको चिकित्सा सल्लाहलाई प्रतिस्थापन गर्दैनन्। सधैं आफ्नो चिकित्सकको सल्लाह पालना गर्नुहोस्।' 
                      : 'Our professionals act as support systems. They do not replace clinical advice from doctors. Always follow your medical provider\'s prescriptions.'}
                  </p>
                </div>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="py-8 lg:py-12 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-12 justify-center">
              <HelpCircle className="text-rose-500" size={32} />
              <h3 className="text-3xl font-black text-slate-900">{t.sections.faq}</h3>
            </div>
            <div className="space-y-4">
              {t.faqs.map((faq, i) => (
                <div key={i} className="border-2 border-slate-50 rounded-2xl overflow-hidden">
                  <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-6 text-left flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50">
                    {faq.q}
                    <ChevronDown className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === i && <div className="px-6 pb-6 text-slate-500 text-sm">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default Home;