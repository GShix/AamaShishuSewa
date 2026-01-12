import React from 'react';
import { ShieldCheck, Heart, Star, Check, ArrowRight } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';

const Services = ({ t }) => {
  const serviceList = [
    {
      id: 'postpartum',
      title: "Postpartum Care (Susare)",
      price: "Custom Pricing",
      description: "Traditional 24/7 care for mother and newborn by experienced caregivers.",
      features: ["Traditional nutritional meal prep", "Baby bathing & hygiene", "Lactation support", "Vital sign monitoring"],
      color: "blue"
    },
    {
      id: 'massage',
      title: "Traditional Massage",
      price: "Custom Pricing",
      description: "Ayurvedic oil massage focused on physical recovery and stress relief.",
      features: ["Siddha oil application", "Ubtan herbal scrub", "Baby massage training", "Joint pain relief"],
      color: "rose"
    },
    {
      id: 'ritual',
      title: "Nwaran Management",
      price: "Custom Pricing",
      description: "Complete logistical support for the 11th-day naming ceremony.",
      features: ["Pundit coordination", "Pooja material sourcing", "Venue setup & decor", "Guest management"],
      color: "orange"
    }
  ];

  // Function to handle WhatsApp Redirection
  const handleInquiry = (serviceTitle) => {
    const phoneNumber = "9764651355";
    const message = `Namaste! I am interested in inquiring about the "${serviceTitle}" plan at Aama Shishu Sewa. Please provide more details.`;
    
    // Encode the message for a URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <PublicLayout>
      <div className="py-8 lg:py-12 px-6 lg:px-10 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-slate-900 mb-4">
              {t?.title || "Our Specialized Services"}
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              {t?.subtitle || "We bridge the gap between ancient Nepali wisdom and modern medical safety."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {serviceList.map((service) => (
              <div key={service.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center 
                  ${service.color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                    service.color === 'rose' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                  {service.color === 'blue' ? <ShieldCheck size={32}/> : service.color === 'rose' ? <Heart size={32}/> : <Star size={32}/>}
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
                  Inquire Details <ArrowRight size={18} />
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