import React from 'react';
import { ShieldCheck, FileCheck, GraduationCap, HeartPulse } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { 
      icon: <ShieldCheck className="text-blue-500" size={24} />, 
      title: "Verified ID", 
      desc: "Government ID & Citizenship checked" 
    },
    { 
      icon: <FileCheck className="text-emerald-500" size={24} />, 
      title: "Background Checked", 
      desc: "No criminal records found" 
    },
    { 
      icon: <GraduationCap className="text-purple-500" size={24} />, 
      title: "Certified Training", 
      desc: "Professional care training completed" 
    },
    { 
      icon: <HeartPulse className="text-rose-500" size={24} />, 
      title: "Health Cleared", 
      desc: "Passed recent medical screening" 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:border-blue-100">
          <div className="bg-white p-2 rounded-xl shadow-sm mr-4">
            {badge.icon}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{badge.title}</h4>
            <p className="text-[11px] text-slate-500 leading-tight">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;