import React from 'react';
import { ShieldCheck, Heart, Star, Check, ArrowRight } from 'lucide-react';

const Services = ({ onBookClick }) => {
  const serviceList = [
    {
      id: 'postpartum',
      title: "Postpartum Care (Susare)",
      price: "Rs. 15,000 / week",
      description: "Traditional 24/7 care for mother and newborn by experienced caregivers.",
      features: ["Traditional nutritional meal prep", "Baby bathing & hygiene", "Lactation support", "Vital sign monitoring"],
      color: "blue"
    },
    {
      id: 'massage',
      title: "Traditional Massage",
      price: "Rs. 2,500 / session",
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

  return (
    <div className="py-20 px-4 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Specialized Services</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            We bridge the gap between ancient Nepali wisdom and modern medical safety.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {serviceList.map((service) => (
            <div key={service.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all group">
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center 
                ${service.color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                  service.color === 'rose' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'}`}>
                {service.color === 'blue' ? <ShieldCheck size={32}/> : service.color === 'rose' ? <Heart size={32}/> : <Star size={32}/>}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{service.title}</h3>
              <p className="text-rose-500 font-bold text-lg mb-4">{service.price}</p>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">{service.description}</p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check size={18} className="text-green-500 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onBookClick(service.id)}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold group-hover:bg-rose-500 transition-colors flex items-center justify-center gap-2"
              >
                Inquire Details <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;