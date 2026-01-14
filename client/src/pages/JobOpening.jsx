import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Home, Flower2, UserPlus, Baby, ChevronRight } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';

const jobs = [
  {
    id: "massage",
    title: "सुत्केरी आमा र शिशुको मालिस",
    eng: "Mother & Baby Massage Specialist",
    icon: <Heart className="text-pink-500" />,
    color: "bg-pink-50",
    desc: "नयाँ आमा र शिशुको स्वास्थ्यका लागि परम्परागत र वैज्ञानिक मालिस सेवा।"
  },
  {
    id: "household",
    title: "घरको काम र स्याहार",
    eng: "Household Help & Care",
    icon: <Home className="text-blue-500" />,
    color: "bg-blue-50",
    desc: "सुत्केरी अवस्थामा घरको कामकाज र आमाको पोषणमा सहयोग पुर्याउने।"
  },
  {
    id: "nwaran",
    title: "न्वारन / पण्डित सेवा",
    eng: "Nwaran / Priest Services",
    icon: <Flower2 className="text-orange-500" />,
    color: "bg-orange-50",
    desc: "शिशुको न्वारन र अन्य धार्मिक कार्यहरू सम्पन्न गर्ने अनुभवी पण्डित।"
  },
  {
    id: "patient",
    title: "बिरामी स्याहार",
    eng: "Patient Care",
    icon: <UserPlus className="text-emerald-500" />,
    color: "bg-emerald-50",
    desc: "अस्पताल पछि वा घरमा रहेका बिरामीहरूको विशेष रेखदेख र स्याहार।"
  },
  {
    id: "babycare",
    title: "शिशु हेरचाह",
    eng: "Professional Baby Care",
    icon: <Baby className="text-purple-500" />,
    color: "bg-purple-50",
    desc: "काममा व्यस्त आमाबुबाका लागि शिशुको सुरक्षित र प्रेमपूर्ण हेरचाह।"
  }
];

const JobOpenings = () => {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="bg-slate-50 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">हाम्रो टोलीमा आबद्ध हुनुहोस्</h1>
          <p className="text-lg text-slate-600">तपाईंको अनुभव र सीप अनुसारको काम छनौट गर्नुहोस्।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
              <div className={`${job.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {job.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{job.title}</h3>
              <p className="text-xs font-semibold text-[#E67E7E] mb-3 uppercase tracking-wider">{job.eng}</p>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">{job.desc}</p>
              <button 
                onClick={() => navigate(`/apply?role=${job.id}`)}
                className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-[#E67E7E] hover:text-white transition-colors flex items-center justify-center group"
              >
                Apply Now <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default JobOpenings;