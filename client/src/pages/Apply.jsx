import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useLanguage } from '../context/LanguageContext';

const Apply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useDocumentTitle(language === 'ne' ? 'आवेदन दिनुहोस्' : 'Apply for Job');

  const selectedJob = location.state?.job || { title: "General", eng: "Applicant" };
  const GOOGLE_FORM_BASE = "https://docs.google.com/forms/d/e/1FAIpQLSfP41sza2rZ1A7Z0ZlJTtaJg5TXdDihNAu_o18Ez-KJuMpeUA/viewform";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('entry.820660232');
    const phone = formData.get('entry.108830536');
    const job = selectedJob.title;

    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (value) params.append(key, value);
    }

    const googleFormUrl = `${GOOGLE_FORM_BASE}?${params.toString()}&submit=Submit`;
    const whatsappNumber = "9779764651355";
    
    // Translatable WhatsApp Message
    const message = language === 'ne' 
      ? `नमस्ते, म ${name} (फोन: ${phone})। मैले ${job} को लागि आवेदन फारम भर्दै छु।`
      : `Namaste, I am ${name} (Phone: ${phone}). I am applying for the position of ${selectedJob.eng}.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(googleFormUrl, '_blank');
    setSuccess(true);
    setLoading(false);
    window.scrollTo(0, 0);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 2000);
  };

  if (!t || !t.apply) return null;

  if (success) {
    return (
      <PublicLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black mb-4">{t.apply.successTitle}</h2>
            <p className="text-slate-500 mb-8">{t.apply.successMsg}</p>
            <button onClick={() => navigate('/careers')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">
              {t.apply.backBtn}
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FDFCFB] py-8 sm:py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 font-bold mb-6 hover:text-slate-900 transition-all cursor-pointer">
            <ChevronLeft size={20} /> {t.apply.back}
          </button>

          <header className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-2">{t.apply.formTitle}</h1>
            <p className="text-rose-500 font-bold uppercase tracking-widest text-sm">
              {t.apply.roleLabel}: {selectedJob.title} ({selectedJob.eng})
            </p>
          </header>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <input type="hidden" name="entry.155055816" value={`${selectedJob.title} (${selectedJob.eng})`} />

            <div className="bg-white rounded-[2rem] p-4 sm:p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
              
              <section className="space-y-4">
                <div className="text-xl font-bold border-b pb-4 flex items-center italic">
                   <ShieldCheck className="mr-2 text-emerald-500" /> {t.apply.personalSec}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.apply.labelName}</label>
                    <input required name="entry.820660232" placeholder={t.apply.phName} className="modern-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.apply.labelPhone}</label>
                    <input required name="entry.108830536" type="tel" placeholder={t.apply.phPhone} className="modern-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.apply.labelAddress}</label>
                    <input required name="entry.1920513208" placeholder={t.apply.phAddress} className="modern-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.apply.labelAge}</label>
                    <input required name="entry.2019399280" type="number" placeholder={t.apply.phAge} className="modern-input" />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="text-xl font-bold border-b pb-4 flex items-center italic">
                   <Send className="mr-2 text-blue-500" /> {t.apply.skillsSec}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.apply.labelExp}</label>
                    <select name="entry.493569845" className="modern-input">
                      {t.apply.expOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.apply.labelCook}</label>
                    <select name="entry.545747870" className="modern-input">
                      {t.apply.cookOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.apply.labelShift}</label>
                    <select name="entry.682744971" className="modern-input">
                      {t.apply.shiftOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">{t.apply.labelId}</label>
                    <input name="entry.275735169" placeholder={t.apply.phId} className="modern-input" />
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-3xl text-white font-black text-xl shadow-xl transition-all cursor-pointer ${loading ? 'bg-slate-400 animate-pulse' : 'bg-rose-500 hover:bg-rose-600 hover:scale-[1.01]'}`}
              >
                {loading ? t.apply.processing : t.apply.submitBtn}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`.modern-input { width: 100%; padding: 1.1rem; background: #F8FAFC; border: 2px solid #F1F5F9; border-radius: 1.25rem; outline: none; transition: all 0.2s ease; color: #334155; font-weight: 600; } .modern-input:focus { border-color: #8BB192; background: white; box-shadow: 0 0 0 4px rgba(139, 177, 146, 0.1); }`}</style>
    </PublicLayout>
  );
};

export default Apply;