import React from 'react';
import { Heart, Home, Flower2, UserPlus, Baby, ChevronRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';

const JOBS = [
  { id: "massage", title: "सुत्केरी आमा र शिशुको मालिस", eng: "Mother & Baby Massage", icon: <Heart size={32} className="text-pink-500" />, color: "bg-pink-50", desc: "नयाँ आमा र शिशुको स्वास्थ्यका लागि परम्परागत र वैज्ञानिक मालिस सेवा।" },
  { id: "household", title: "घरको काम र स्याहार", eng: "Household help & Care", icon: <Home size={32} className="text-blue-500" />, color: "bg-blue-50", desc: "सुत्केरी अवस्थामा घरको कामकाज र आमाको पोषणमा सहयोग पुर्याउने।" },
  { id: "nwaran", title: "न्वारन / पण्डित सेवा", eng: "Nwaran / Priest Services", icon: <Flower2 size={32} className="text-orange-500" />, color: "bg-orange-50", desc: "शिशुको न्वारन र अन्य धार्मिक कार्यहरू सम्पन्न गर्ने अनुभवी पण्डित।" },
  { id: "patient", title: "बिरामी स्याहार", eng: "Patient Care", icon: <UserPlus size={32} className="text-emerald-500" />, color: "bg-emerald-50", desc: "अस्पताल पछि वा घरमा रहेका बिरामीहरूको विशेष रेखदेख र स्याहार।" },
  { id: "babycare", title: "शिशु हेचाह", eng: "Professional Baby Care", icon: <Baby size={32} className="text-purple-500" />, color: "bg-purple-50", desc: "काममा व्यस्त आमाबुबाका लागि शिशुको सुरक्षित र प्रेमपूर्ण हेरचाह।" }
];

const Careers = () => {
  const navigate = useNavigate();

  const handleApply = (job) => {
    // Only pass strings/numbers to navigate state to avoid cloning errors
    const jobData = { title: job.title, eng: job.eng };
    navigate('/careers/apply', { state: { job: jobData } });
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FDFCFB] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-20">
            <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Careers</h1>
            <p className="text-xl text-slate-500">हाम्रो व्यावसायिक टोलीमा समावेश हुनुहोस्।</p>
            <div className="mt-8 inline-flex items-center bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl text-emerald-700 font-bold">
              <GraduationCap className="mr-3" /> तालिमको सुबिधा उपलब्ध छ
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {JOBS.map((job) => (
              <div key={job.id} className="group bg-white rounded-[3rem] p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col">
                <div className={`${job.color} w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8`}>{job.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">{job.title}</h3>
                <p className="text-xs font-black text-[#E67E7E] uppercase tracking-widest mb-6">{job.eng}</p>
                <p className="text-slate-500 mb-10 flex-grow">{job.desc}</p>
                <button 
                  onClick={() => handleApply(job)}
                  className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-[#E67E7E] transition-all flex items-center justify-center cursor-pointer shadow-lg"
                >
                  Apply Now <ChevronRight className="ml-2" size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Careers;