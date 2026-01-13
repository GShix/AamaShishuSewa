import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, Phone, MapPin, Award, Clock, Users, 
  Globe, CheckCircle, Briefcase, Star, 
  ShieldAlert, Sun, Facebook, Instagram, Mail,
  ChevronDown, HelpCircle, ShieldCheck, Menu, X, LogIn, UserPlus 
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useAuth } from '../context/AuthContext'; // Added Auth integration

const Home = () => {
    const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Check login status
  const [language, setLanguage] = useState('ne');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  useDocumentTitle(language === 'ne' ? 'गृहपृष्ठ' : 'Home');
  
  const translations = {
    ne: {
      nav: [
        { name: 'गृहपृष्ठ', path: '/' },
        { name: 'सेवाहरू', path: '/services' },
        { name: 'प्रोफेसनल', path: '/join_us' },
        { name: 'सम्पर्क', path: '/contact' },
        { name: 'लग इन', path: '/login', type: 'auth' },
        // { name: 'दर्ता', path: '/register', type: 'auth' },
        { name: 'ड्यासबोर्ड', path: '/dashboard', type: 'private' }
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
        { name: 'Join Us', path: '/join_us' },
        { name: 'Contact', path: '/contact' },
        { name: 'Login', path: '/login', type: 'auth' },
        // { name: 'Register', path: '/register', type: 'auth' },
        { name: 'Dashboard', path: '/dashboard', type: 'private' }
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
          <div className="hidden md:flex items-center gap-8">
            {t.nav.filter(item => {
              if (item.type === 'auth') return !isAuthenticated;
              if (item.type === 'private') return isAuthenticated;
              return true;
            }).map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)} className="text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors relative group cursor-pointer">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
            
            <button onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')} className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-700 hover:bg-white transition-all">
              <Globe className="w-3.5 h-3.5 text-rose-500" /> {language === 'ne' ? 'ENGLISH' : 'नेपाली'}
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Hover Container: 'group' handles the hover state for the child div */}
            <div className="relative group"> 
              <button className="p-2 rounded-lg text-slate-600">
                <Globe className="w-5 h-5 cursor-pointer" />
              </button>
              
              {/* Removed {isLangDropdownOpen && ...} 
                Added 'hidden group-hover:block' to show/hide based on hover
              */}
              <div className="absolute right-0 pt-2 w-32 hidden group-hover:block z-50">
                <div className="bg-white border border-rose-100 rounded-xl shadow-xl py-2">
                  <button 
                    onClick={() => setLanguage('ne')} 
                    className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 cursor-pointer"
                  >
                    नेपाली
                  </button>
                  <button 
                    onClick={() => setLanguage('en')} 
                    className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-rose-50 cursor-pointer"
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-rose-600">
              {isMenuOpen ? <X size={28} className='cursor-pointer'/> : <Menu size={28} className='cursor-pointer'/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 top-20 bg-white z-40 transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : 'hidden'}`}>
          <div className="flex flex-col p-6 space-y-2 bg-rose-200">
            {t.nav.filter(item => {
              if (item.type === 'auth') return !isAuthenticated;
              if (item.type === 'private') return isAuthenticated;
              return true;
            }).map((item, i) => (
              <button key={i} onClick={() => { navigate(item.path); setIsMenuOpen(false); }} className="text-left py-4 text-lg font-bold text-slate-700 hover:text-rose-500 cursor-pointer border-b border-slate-50">
                {item.name}
              </button>
            ))}
            <button onClick={() => { navigate('/book'); setIsMenuOpen(false); }} className="mt-4 w-full py-4 bg-rose-500 text-white rounded-xl font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer">
              <Heart className="w-5 h-5 fill-white" /> {t.hero.ctaBook}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative py-8 lg:py-12 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-bold mb-6 ring-1 ring-rose-200">
              <Star className="w-4 h-4 fill-rose-600" /> #1 Professional Sutkeri Sewa
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6">
              {t.hero.title}
            </h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={() => navigate('/book')} className="cursor-pointer px-8 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-xl hover:bg-rose-600 transition-all flex items-center justify-center gap-3">
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
              <h4 className="font-black text-slate-900 text-xl mb-2">Tradition</h4>
              <p className="text-sm text-slate-500">Authentic Ayurvedic methods passed through generations.</p>
            </div>
            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
              <Award className="text-rose-400 mb-6" size={48} />
              <h4 className="font-black text-xl mb-2">Quality</h4>
              <p className="text-sm text-slate-400">Strict screening for every caregiver we send.</p>
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black mb-8 text-rose-600 leading-tight">{t.sections.mission}</h3>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 text-justify">{t.missionContent}</p>
            <div className="p-8 border-2 border-slate-50 rounded-[2rem] flex items-center gap-6">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-rose-400" />)}
               </div>
               <p className="text-sm font-bold text-slate-500">Join 50+ families who trust our expertise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONDUCT SECTION --- */}
      <section className="py-8 lg:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-black mb-4">{t.sections.conduct}</h3>
          <p className="text-slate-500 mb-12 text-lg">Our promise of dignity and professionalism.</p>
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
                  Our professionals act as support systems. They do not replace clinical advice from doctors. Always follow your medical provider's prescriptions.
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

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white pt-10 pb-10 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-rose-200 p-2 rounded-xl shadow-lg">
                <img className='h-6 w-6 object-contain' src="/assets/logo.png" alt="Logo" />
              </div>
              <span className="text-2xl font-black tracking-tight">आमा शिशु सेवा</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Nepal's premier agency for authentic postpartum wellness. We bridge traditional care with modern safety standards for mother and child.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Mail, href: "mailto:info@aamashishu.com" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
          </div>
  
          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 mb-8">Service Map</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home Base</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Care Packages</Link></li>
              <li><Link to="/join_us" className="hover:text-white transition-colors">Become a Pro</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
  
          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 mb-8">Direct Contact</h4>
            <ul className="space-y-5 text-slate-400 text-sm">
              <li className="flex gap-4 items-start">
                <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <span>New Baneshwor, Kathmandu<br/></span>
              </li>
              <li className="flex gap-4 items-center font-bold text-white">
                <Phone size={18} className="text-rose-500 shrink-0" />
                <a href="tel:+9779764651355" className="hover:text-rose-400 transition-colors">+977 9764651355</a>
              </li>
              <li className="flex gap-4 items-center">
                <Clock size={18} className="text-rose-500 shrink-0" />
                <span>Sun - Fri: 8:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
  
          {/* Call to Action */}
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <Heart size={16} className="text-rose-500 fill-rose-500" /> Need Immediate Care?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Our care coordinators are available to help you choose the best package.
            </p>
            <Link 
              to="/book" 
              className="block w-full text-center py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-colors"
            >
              BOOK AN APPOINTMENT
            </Link>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
            © {currentYear} आमा शिशु सेवा (Aama Shishu Sewa). All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] font-black text-rose-500/50 uppercase tracking-widest">
            <button className="hover:text-rose-500 transition-colors">Privacy Policy</button>
            <button className="hover:text-rose-500 transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
      {/* <footer className="bg-slate-900 text-white pt-24 pb-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-rose-200 p-2.5 rounded-xl">
                <img className='h-6 w-6 object-contain' src="./assets/logo.png" alt="Logo" />
              </div>
              <span className="text-2xl font-black tracking-tight">Aama Shishu Sewa</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">Nepal's premier agency for authentic postpartum wellness and infant safety.</p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Mail].map((Icon, i) => (
                <button key={i} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-rose-500 transition-all"><Icon size={20}/></button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-rose-500 mb-8 tracking-widest">Navigation</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/login">Account Access</Link></li>
              <li><Link to="/book" className="text-rose-400">Book Now</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-rose-500 mb-8 tracking-widest">Contact</h4>
            <ul className="space-y-6 text-slate-400 text-sm">
              <li className="flex gap-4"><MapPin size={20} className="text-rose-500"/> Lazimpat, Kathmandu</li>
              <li className="flex gap-4 text-white font-black"><Phone size={20} className="text-rose-500"/> +977 9764651355</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-rose-500 mb-8 tracking-widest">Safety</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-10 text-center">
          <p className="text-rose-500 text-[10px] font-black tracking-widest">© 2026 AAMA SHISHU SEWA | KATHMANDU, NEPAL</p>
        </div>
      </footer> */}
    </div>
  );
};

export default Home;