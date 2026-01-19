import React from 'react';
import { Phone, Mail, MapPin, Calendar } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useLanguage } from '../context/LanguageContext'; // Import hook

const Contact = () => {
  const { t, language } = useLanguage();

  useDocumentTitle(language === 'ne' ? 'सम्पर्क गर्नुहोस्' : "Contact Us - We're Here to Help");

  // Guard clause
  if (!t || !t.contact) return null;

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        <div className="bg-slate-900 text-white py-10 px-4 text-center mb-4">
          <h1 className="text-4xl font-bold mb-4">{t.contact.heroTitle}</h1>
          <p className="text-slate-400 max-w-xl mx-auto">{t.contact.heroSubtitle}</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 -mt-10 grid lg:grid-cols-3 gap-8">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0"><Phone /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.contact.callLabel}</p>
                    <p className="font-bold">+977 9764651355</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0"><Mail /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.contact.emailLabel}</p>
                    <p className="font-bold">care@aamashishu.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shrink-0"><MapPin /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.contact.officeLabel}</p>
                    <p className="font-bold">{t.contact.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 mb-20">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Calendar className="text-rose-500" /> {t.contact.formTitle}
              </h2>
              <form className="grid md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">{t.contact.labelName}</label>
                  <input type="text" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder={t.contact.placeholderName} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">{t.contact.labelPhone}</label>
                  <input type="tel" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder="98XXXXXXXX" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">{t.contact.labelDate}</label>
                  <input type="date" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">{t.contact.labelService}</label>
                  <select className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500">
                    {t.contact.serviceOptions.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">{t.contact.labelRequest}</label>
                  <textarea rows="4" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder={t.contact.placeholderRequest}></textarea>
                </div>
                <button type="submit" className="md:col-span-2 py-4 bg-rose-500 text-white rounded-xl font-bold text-lg hover:bg-rose-600 transition shadow-lg shadow-rose-100 cursor-pointer">
                  {t.contact.submitBtn}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;