import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Phone, MapPin, Award, Clock, Users, 
  Globe, CheckCircle, Briefcase, Star, 
  ShieldAlert, Sun, Facebook, Instagram, Mail,
  ChevronDown, HelpCircle, ShieldCheck, Menu, X 
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Home = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('ne');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useDocumentTitle(language === 'ne' ? 'गृहपृष्ठ' : 'Home');
  
  const translations = {
    ne: {
      nav: [
        { name: 'गृहपृष्ठ', path: '/' },
        { name: 'सेवाहरू', path: '/services' },
        { name: 'प्रोफेसनल', path: '/join' },
        { name: 'सम्पर्क', path: '/contact' }
      ],
      hero: {
        title: 'आमा र शिशुको लागि पूर्ण ममता र व्यावसायिक हेरचाह',
        subtitle: 'काठमाडौं उपत्यकाका अनुभवी सुत्केरी सुसारे र मालिश विशेषज्ञहरूसँग जोडिनुहोस्।',
        ctaBook: 'सेवा लिनुहोस्',
        ctaJoin: 'टोलीमा सामेल हुनुहोस्'
      },
      stats: { happy: '५०+ सन्तुष्ट आमा', pros: '१०+ प्रमाणित सुसारे' },
      sections: { 
        mission: 'हाम्रो लक्ष्य र उद्देश्य',
        conduct: 'प्रोफेसनल आचारसंहिता',
        faq: 'धेरै सोधिने प्रश्नहरू'
      },
      missionContent: "हाम्रो मुख्य उद्देश्य नेपाली परम्परागत सुत्केरी हेरचाह र आधुनिक स्वास्थ्य मापदण्डलाई जोडेर आमा र बच्चालाई सुरक्षित र सुखी बनाउनु हो। हामी विश्वास गर्छौं कि प्रत्येक नयाँ आमालाई उचित आराम र पोषणको आवश्यकता हुन्छ।",
      conductPoints: [
        { title: "समयको पालना", desc: "हाम्रा कर्मचारीहरू सधैं तोकिएको समयमा उपस्थित हुनेछन्।" },
        { title: "गोपनीयता", desc: "तपाईंको परिवारको गोपनीयता हाम्रो उच्च प्राथमिकता हो।" },
        { title: "स्वच्छता", desc: "उच्च स्तरको व्यक्तिगत सरसफाई र मास्कको प्रयोग अनिवार्य छ।" },
        { title: "सकारात्मकता", desc: "धैर्यता र मायालु व्यवहार नै हाम्रो पहिचान हो।" }
      ],
      faqs: [
        { q: "के सुसारेहरू तालिम प्राप्त छन्?", a: "हो, हाम्रा सबै सुसारेहरूले प्राथमिक स्वास्थ्य र शिशु हेरचाहमा विशेष तालिम पाएका छन्।" },
        { q: "न्यूनतम कति दिनको लागि बुक गर्न सकिन्छ?", a: "हामी ७ दिन देखि ४५ दिन सम्मको विभिन्न प्याकेजहरू उपलब्ध गराउँछौं।" }
      ]
    },
    en: {
      nav: [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Join as Pro', path: '/join' },
        { name: 'Contact', path: '/contact' }
      ],
      hero: {
        title: 'Professional Care Rooted in Tradition',
        subtitle: 'Connect with verified postpartum caregivers and massage experts across Kathmandu Valley.',
        ctaBook: 'Book a Service',
        ctaJoin: 'Join our Team'
      },
      stats: { happy: '50+ Happy Mothers', pros: '10+ Certified Pros' },
      sections: { 
        mission: 'Mission & Vision',
        conduct: 'Professional Code of Conduct',
        faq: 'Frequently Asked Questions'
      },
      missionContent: "Our mission is to empower mothers by providing authentic traditional postpartum care blended with modern clinical safety. We aim to revive the culture of 'Sutkeri Sewa' while creating dignified employment.",
      conductPoints: [
        { title: "Punctuality", desc: "Our professionals value your schedule and arrive on time." },
        { title: "Confidentiality", desc: "Strict privacy protocols for your home and family life." },
        { title: "Hygiene", desc: "Sanitized equipment and medical-grade hygiene standards." },
        { title: "Positive Attitude", desc: "Empathy and kindness are at the core of our care." }
      ],
      faqs: [
        { q: "Are the caregivers background checked?", a: "Yes, we conduct rigorous police clearance and reference checks for every professional." },
        { q: "What areas do you serve?", a: "Currently, we serve all locations within Kathmandu, Lalitpur, and Bhaktapur." }
      ]
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#FFFBFB] text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 group-hover:rotate-6 transition-all duration-300">
              <img className='h-6 w-6 md:h-8 md:w-8 object-contain' src="./assets/logo.png" alt="Logo" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-rose-600 leading-none">आमा शिशु सेवा</h1>
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">Aama Shishu Sewa</p>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {t.nav.map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)} className="text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors relative group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
            <button onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')} className="flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-black text-slate-700 hover:bg-white hover:shadow-sm transition-all active:scale-95">
              <Globe className="w-4 h-4 text-rose-500" /> {language === 'ne' ? 'ENGLISH' : 'नेपाली'}
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
             <button onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')} className="p-2 text-slate-600">
               <Globe className="w-5 h-5" />
             </button>
             <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
             >
               {isMenuOpen ? <X size={28}className='cursor-pointer'/> : <Menu size={28} className='cursor-pointer' />}
             </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 top-20 bg-white z-40 transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col p-6 space-y-4 bg-red-100">
            {t.nav.map((item, i) => (
              <button 
                key={i} 
                onClick={() => { navigate(item.path); setIsMenuOpen(false); }} 
                className="text-left py-4 px-2 text-xl font-bold text-slate-700 border-b border-slate-50 cursor-pointer hover:text-rose-900 active:text-rose-500"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-6">
              <button 
                onClick={() => { navigate('/book'); setIsMenuOpen(false); }}
                className="w-full py-4 bg-rose-500 text-white rounded-xl font-black shadow-lg flex items-center justify-center gap-3"
              >
                <Heart className="w-5 h-5 fill-white" /> {t.hero.ctaBook}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative py-8 lg:py-10 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-bold mb-8 ring-1 ring-rose-200">
              <Star className="w-4 h-4 fill-rose-600" /> #1 Professional Sutkeri Sewa
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] mb-4">
              {t.hero.title}
            </h2>
            <p className="text-lg text-slate-500 mb-7 leading-relaxed max-w-lg">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={() => navigate('/book')} className="px-8 py-4 cursor-pointer bg-rose-500 text-white rounded-2xl font-black shadow-2xl shadow-rose-200 hover:bg-rose-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                <Heart className="w-6 h-6 fill-white" /> {t.hero.ctaBook}
              </button>
              <button onClick={() => navigate('/join')} className="px-8 py-4 cursor-pointer bg-white border-2 border-slate-200 text-slate-800 rounded-2xl font-black hover:border-rose-300 hover:text-rose-600 transition-all flex items-center justify-center gap-3">
                <Briefcase className="w-6 h-6" /> {t.hero.ctaJoin}
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-10">
              <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{t.stats.happy.split(' ')[0]}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{t.stats.happy.split(' ').slice(1).join(' ')}</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{t.stats.pros.split(' ')[0]}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{t.stats.pros.split(' ').slice(1).join(' ')}</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-[12px] border-white">
              <img src="./assets/landing_page.png" alt="Caring Professional" className="w-full h-[500px] object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-5 border border-rose-50 animate-bounce-subtle">
              <div className="w-12 h-10 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Verified Safety</p>
                <p className="text-xs text-slate-500 font-medium">Govt. Registered Agency</p>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-rose-50 p-10 rounded-[2.5rem] transform translate-y-8">
              <Sun className="text-rose-500 mb-6" size={48} />
              <h4 className="font-black text-slate-900 text-xl mb-2">Tradition</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Authentic Ayurvedic methods passed through generations.</p>
            </div>
            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
              <Award className="text-rose-400 mb-6" size={48} />
              <h4 className="font-black text-xl mb-2">Quality</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Strict screening for every caregiver we send.</p>
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black mb-8 text-rose-600 leading-tight">{t.sections.mission}</h3>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 text-justify">{t.missionContent}</p>
            <div className="p-8 border-2 border-slate-50 rounded-[2rem] flex items-center gap-6">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-red-500" />)}
               </div>
               <p className="text-sm font-bold text-slate-500">Join 50+ families who trust our expertise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONDUCT SECTION --- */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-black mb-4">{t.sections.conduct}</h3>
          <p className="text-slate-500 mb-10 text-lg">Our promise of dignity and professionalism.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.conductPoints.map((point, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-rose-500 transition-colors">
                  <CheckCircle className="text-rose-500 group-hover:text-white transition-colors" size={28} />
                </div>
                <h4 className="font-black text-slate-900 mb-3">{point.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 p-7 bg-rose-600 rounded-[2rem] flex flex-col w- items-center gap-2 sm:gap-6 text-white text-left max-w-4xl mx-auto shadow-2xl shadow-rose-200">
             <ShieldAlert size={40} className="shrink-0" />
             <div>
               <p className="font-black text-center text-lg mb-2 italic uppercase tracking-wider">Safety First</p>
               <p className="text-sm text-rose-100 leading-relaxed">
                 Our professionals act as support systems. They do not replace clinical advice from doctors. Always follow your medical provider's prescriptions.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* --- NEW FAQ SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12 justify-center">
            <HelpCircle className="text-rose-500" size={32} />
            <h3 className="text-3xl font-black text-slate-900">{t.sections.faq}</h3>
          </div>
          <div className="space-y-4">
            {t.faqs.map((faq, i) => (
              <div key={i} className="border-2 border-slate-50 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed animate-in slide-in-from-top-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OPTIMIZED FOOTER --- */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-rose-500 p-2.5 rounded-xl shadow-lg shadow-rose-500/20"><Heart fill="white" size={24}/></div>
              <span className="text-2xl font-black tracking-tight">Aama Shishu</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Nepal's premier agency for authentic postpartum wellness and infant safety. Bridging tradition with professional standards.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Mail].map((Icon, i) => (
                <button key={i} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-rose-500 transition-all hover:scale-110">
                  <Icon size={20}/>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 mb-8">Service Map</h4>
            <ul className="space-y-5 text-slate-400 font-bold text-sm">
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer">Home Base</button></li>
              <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors cursor-pointer">Care Packages</button></li>
              <li><button onClick={() => navigate('/join')} className="hover:text-white transition-colors cursor-pointer">Become a Pro</button></li>
              <li><button onClick={() => navigate('/book')} className="bg-rose-500 text-white px-4 py-2 rounded-lg cursor-pointer">Book Appointment</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 mb-8">Direct Contact</h4>
            <ul className="space-y-6 text-slate-400 text-sm font-medium">
              <li className="flex gap-4 items-start"><MapPin size={20} className="text-rose-500 shrink-0"/> Lazimpat, Kathmandu<br/>Nepal (Near Narayanhiti)</li>
              <li className="flex gap-4 items-center font-black text-white text-lg underline decoration-rose-500 underline-offset-8"><Phone size={20} className="text-rose-500 shrink-0"/> +977 9764651355</li>
              <li className="flex gap-4 items-center"><Clock size={20} className="text-rose-500 shrink-0"/> Daily: 8:00 AM - 8:00 PM</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 mb-8">Legal Standards</h4>
            <ul className="space-y-5 text-slate-400 text-sm font-bold">
              <li><button className="hover:text-white">Caregiver Agreement</button></li>
              <li><button className="hover:text-white">Privacy & Safety</button></li>
              <li><button className="hover:text-white">Customer Rights</button></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-10 text-center">
          <p className="text-rose-500 text-[12px] uppercase tracking-[0.3em] font-black">
            © 2026 आमा शिशु सेवा (Aama Shishu Sewa) | Proudly Serving Nepal
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;