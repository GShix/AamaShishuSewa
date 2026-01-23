import React from 'react';
import { Heart, Home, Flower2, UserPlus, Baby, ChevronRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Careers = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  useDocumentTitle(language === 'ne' ? 'क्यारियर - हाम्रो टोलीमा सामेल हुनुहोस्' : 'Careers - Join Our Professional Team');

  // Map icons to the job IDs from translations
  const iconMap = {
    massage: <Heart size={28} className="text-pink-500" />,
    household: <Home size={28} className="text-blue-500" />,
    nwaran: <Flower2 size={28} className="text-orange-500" />,
    patient: <UserPlus size={28} className="text-emerald-500" />,
    babycare: <Baby size={28} className="text-purple-500" />
  };

  const handleApply = (job) => {
    // Pass essential strings to the application page
    const jobData = { title: job.title, eng: job.eng };
    
    // Check if user is authenticated
    if (isAuthenticated) {
      // Redirect to dashboard with selected job and careers tab active
      navigate('/dashboard', { 
        state: { 
          selectedJob: jobData,
          activeTab: 'careers'
        } 
      });
    } else {
      // Redirect to login with return URL to come back to dashboard with job selection
      navigate('/login', { 
        state: { 
          returnTo: '/dashboard',
          selectedJob: jobData,
          activeTab: 'careers'
        } 
      });
    }
  };

  if (!t || !t.careers) return null;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FDFCFB] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
              {t.careers.title}
            </h1>
            <p className="text-xl text-slate-500">{t.careers.subtitle}</p>
            <div className="mt-6 inline-flex items-center bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl text-emerald-700 font-bold">
              <GraduationCap className="mr-3" /> {t.careers.trainingBadge}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.careers.jobs.map((job) => (
              <div key={job.id} className="group bg-white rounded-[2rem] p-4 sm:p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col">
                <div className={`${job.color} w-18 h-18 rounded-[2rem] flex items-center justify-center mb-8`}>
                  {iconMap[job.id]}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">{job.title}</h3>
                <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-6">{job.eng}</p>
                <p className="text-slate-500 mb-8 flex-grow">{job.desc}</p>
                <button 
                  onClick={() => handleApply(job)}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-rose-500 transition-all flex items-center justify-center cursor-pointer shadow-lg"
                >
                  {t.careers.applyBtn} <ChevronRight className="ml-2" size={20} />
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