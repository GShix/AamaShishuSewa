import React from 'react';
import { ShieldCheck, Heart, Star, Check, ArrowRight } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useLanguage } from '../context/LanguageContext'; // Import the hook

const Services = () => {
  const { t, language } = useLanguage(); // Access translation and language

  useDocumentTitle(language === 'ne' ? 'हाम्रा सेवाहरू' : 'Services - Specialized Care');

  // Handle WhatsApp Redirection
  const handleInquiry = (serviceTitle) => {
    const phoneNumber = "9764651355";
    const message = language === 'ne' 
      ? `नमस्ते! म आमा शिशु सेवामा "${serviceTitle}" योजनाको बारेमा सोधपुछ गर्न चाहन्छु।`
      : `Namaste! I am interested in inquiring about the "${serviceTitle}" plan at Aama Shishu Sewa.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Guard clause
  if (!t || !t.services) return null;

  // Icons mapping based on service ID
  const getIcon = (id) => {
    switch (id) {
      case 'postpartum': return <ShieldCheck size={32}/>;
      case 'massage': return <Heart size={32}/>;
      case 'ritual': return <Star size={32}/>;
      default: return <Check size={32}/>;
    }
  };

  return (
    <PublicLayout>
      <div className="py-8 lg:py-12 px-6 lg:px-10 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-slate-900 mb-4">
              {t.services.title}
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.services.list.map((service) => (
              <div key={service.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center 
                  ${service.color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                    service.color === 'rose' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                  {getIcon(service.id)}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-rose-500 font-black text-lg mb-4">{service.price}</p>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">{service.description}</p>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                      <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleInquiry(service.title)}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black group-hover:bg-rose-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-200 group-hover:shadow-rose-200"
                >
                  {t.services.ctaText} <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Services;