import React from 'react';
import { UserPlus, Award, Clock, Briefcase, FileText } from 'lucide-react';

const JoinPro = () => {
  return (
    <div className="py-20 px-4 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
      <div>
        <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
          Join Nepal’s Premier <span className="text-rose-500">Caregiver</span> Network.
        </h1>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          Are you a trained nurse, a traditional susare, or a massage specialist? 
          Turn your skills into a rewarding career with steady income and flexible hours.
        </p>

        <div className="space-y-8">
          {[
            { icon: <Award />, title: "Free Training", desc: "Access workshops on modern hygiene and baby safety." },
            { icon: <Briefcase />, title: "Consistent Work", desc: "We match you with families in your preferred area." },
            { icon: <Clock />, title: "Work-Life Balance", desc: "Choose your own schedule—full-time or freelance." }
          ].map((item, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">{item.title}</h4>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-rose-50">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <UserPlus className="text-rose-500" /> Apply Today
        </h3>
        <form className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-100 focus:ring-rose-500 transition" required />
            <input type="tel" placeholder="Mobile Number" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-100 focus:ring-rose-500 transition" required />
          </div>
          <select className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-100 focus:ring-rose-500 transition">
            <option>Select Primary Skill</option>
            <option>Postpartum Nurse (Susare)</option>
            <option>Massage Specialist</option>
            <option>Traditional Ritual Setup</option>
          </select>
          <input type="text" placeholder="Location in Kathmandu (e.g., Lalitpur)" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-100 focus:ring-rose-500 transition" />
          <textarea placeholder="Tell us about your previous experience..." rows="4" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-100 focus:ring-rose-500 transition"></textarea>
          
          <div className="bg-rose-50 p-4 rounded-xl flex items-center gap-3 text-rose-700 text-sm border border-rose-100">
            <FileText size={20}/>
            <span>Our team will contact you for a verification interview within 48 hours.</span>
          </div>
          
          <button className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold text-lg hover:bg-rose-600 shadow-lg shadow-rose-100 transition">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinPro;