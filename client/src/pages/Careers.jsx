
// https://docs.google.com/forms/d/e/1FAIpQLSfP41sza2rZ1A7Z0ZlJTtaJg5TXdDihNAu_o18Ez-KJuMpeUA/formResponse?usp=pp_url&
// entry.820660232=1234.dambar&
// entry.108830536=1234.978&
// entry.1920513208=1234.ktm&
// entry.2019399280=1234.22&
// entry.155055816=%E0%A4%B8%E0%A5%81%E0%A4%A4%E0%A5%8D%E0%A4%95%E0%A5%87%E0%A4%B0%E0%A5%80+%E0%A4%86%E0%A4%AE%E0%A4%BE+%E0%A4%B0+%E0%A4%B6%E0%A4%BF%E0%A4%B6%E0%A5%81%E0%A4%95%E0%A5%8B+%E0%A4%AE%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%B8+(Mother+%26+Baby+Massage)&entry.155055816=%E0%A4%98%E0%A4%B0%E0%A4%95%E0%A5%8B+%E0%A4%95%E0%A4%BE%E0%A4%AE+%E0%A4%B0+%E0%A4%B8%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%B9%E0%A4%BE%E0%A4%B0+(Household+help+%26+Care)&
// entry.493569845=1+%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%B7+%E0%A4%AD%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%BE+%E0%A4%95%E0%A4%AE+(Less+than+1+year)&
// entry.545747870=%E0%A4%86%E0%A4%89%E0%A4%81%E0%A4%9B+(Yes)&
// entry.682744971=%E0%A4%B8%E0%A4%BE%E0%A4%81%E0%A4%9D+(Evening+Shift)&
// entry.275735169=1234.ktm&
// entry.426842645=%E0%A4%9B+(Yes)&
// entry.1252436318=1234.18k&
// entry.2116931088=1234.question

// import React, { useState } from 'react';
// import { Briefcase, GraduationCap, CheckCircle, Clock, MapPin, Utensils, CreditCard, DollarSign, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
// import PublicLayout from '../layout/PublicLayout';

// const Careers = () => {
//   const [submitted, setSubmitted] = useState(false);
//   const [step, setStep] = useState(1);
//   const totalSteps = 4;

//   const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSfP41sza2rZ1A7Z0ZlJTtaJg5TXdDihNAu_o18Ez-KJuMpeUA/formResponse";

//   const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
//   const prevStep = () => setStep((s) => Math.max(s - 1, 1));

//   // Progress percentage calculation
//   const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

//   return (
//     <PublicLayout>
//       <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="max-w-3xl mx-auto text-center mb-8">
//           <h1 className="text-3xl font-bold text-slate-800 mb-2">हाम्रो टोलीमा सामेल हुनुहोस्</h1>
//           <p className="text-slate-600">Join the Aama Shishu Sewa family as a caregiver.</p>
          
//           <div className="mt-4 bg-[#8BB192]/10 border-l-4 border-[#8BB192] p-3 rounded-r-lg inline-block text-left">
//             <div className="flex items-center">
//               <GraduationCap className="text-[#8BB192] mr-2" size={20} />
//               <p className="text-[#2D4F34] font-semibold">नयाँलाई तालिम सहित रोजगारीको अवसर पनि प्रदान गरिन्छ।</p>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          
//           {/* Progress Bar Component */}
//           {!submitted && (
//             <div className="relative h-2 bg-slate-100">
//               <div 
//                 className="absolute top-0 left-0 h-full bg-[#E67E7E] transition-all duration-500 ease-out"
//                 style={{ width: `${progressPercent}%` }}
//               ></div>
//               <div className="absolute top-4 left-0 w-full flex justify-around px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                 <span className={step >= 1 ? "text-[#E67E7E]" : ""}>Personal</span>
//                 <span className={step >= 2 ? "text-[#E67E7E]" : ""}>Skills</span>
//                 <span className={step >= 3 ? "text-[#E67E7E]" : ""}>Availability</span>
//                 <span className={step >= 4 ? "text-[#E67E7E]" : ""}>Final</span>
//               </div>
//             </div>
//           )}

//           {submitted ? (
//             <div className="p-16 text-center animate-in fade-in zoom-in duration-500">
//               <div className="w-20 h-20 bg-[#8BB192]/20 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <CheckCircle className="text-[#8BB192]" size={48} />
//               </div>
//               <h2 className="text-2xl font-bold text-slate-800">फारम सफलतापूर्वक प्राप्त भयो!</h2>
//               <p className="text-slate-600 mt-2 italic">हामी चाँडै तपाईंलाई सम्पर्क गर्नेछौं।</p>
//               <button 
//                 onClick={() => window.location.reload()} 
//                 className="mt-8 text-[#E67E7E] font-semibold hover:underline"
//               >
//                 अर्को फारम भर्नुहोस्
//               </button>
//             </div>
//           ) : (
//             <form 
//               action={GOOGLE_FORM_ACTION} 
//               method="POST" 
//               target="_blank" 
//               onSubmit={() => setSubmitted(true)} 
//               className="p-8 pt-12 space-y-8"
//             >
              
//               {/* STEP 1: Personal Details */}
//               {step === 1 && (
//                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
//                   <div className="flex items-center space-x-2 text-[#E67E7E] mb-4">
//                     <MapPin size={20} />
//                     <h3 className="font-bold text-lg">व्यक्तिगत विवरण (Personal Details)</h3>
//                   </div>
//                   <div className="grid grid-cols-1 gap-4">
//                     <input required placeholder="पूरा नाम (Full Name) *" name="entry.820660232" type="text" className="form-input-custom" />
//                     <input required placeholder="सम्पर्क नम्बर (Mobile Number) *" name="entry.108830536" type="tel" className="form-input-custom" />
//                     <input required placeholder="हालको ठेगाना (Current Address) *" name="entry.1920513208" type="text" className="form-input-custom" />
//                     <input required placeholder="उमेर (Age) *" name="entry.2019399280" type="number" className="form-input-custom" />
//                   </div>
//                 </div>
//               )}

//               {/* STEP 2: Experience & Skills */}
//               {step === 2 && (
//                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
//                   <div className="flex items-center space-x-2 text-[#E67E7E] mb-4">
//                     <Utensils size={20} />
//                     <h3 className="font-bold text-lg">काम र अनुभव (Skills & Experience)</h3>
//                   </div>
//                   <div className="space-y-3">
//                     <p className="text-sm font-semibold text-slate-600">सेवा छनोट गर्नुहोस्:</p>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                       {["सुत्केरी आमा र शिशुको मालिस", "घरको काम र स्याहार", "न्वारन / पण्डित सेवा", "बिरामी स्याहार", "शिशु हेरचाह"].map((service) => (
//                         <label key={service} className="flex items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
//                           <input type="checkbox" name="entry.155055816" value={service} className="mr-3 h-5 w-5 accent-[#E67E7E]" />
//                           <span className="text-slate-700 text-sm">{service}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <select name="entry.493569845" className="form-input-custom bg-white">
//                     <option disabled selected>अनुभव अवधि (Experience)</option>
//                     <option>1 वर्ष भन्दा कम</option>
//                     <option>1-3 वर्ष</option>
//                     <option>3-5 वर्ष</option>
//                     <option>5 वर्ष भन्दा माथि</option>
//                   </select>
//                 </div>
//               )}

//               {/* STEP 3: Availability */}
//               {step === 3 && (
//                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
//                   <div className="flex items-center space-x-2 text-[#E67E7E] mb-4">
//                     <Clock size={20} />
//                     <h3 className="font-bold text-lg">समय र उपलब्धता (Availability)</h3>
//                   </div>
//                   <div className="grid grid-cols-1 gap-4">
//                     <select name="entry.545747870" className="form-input-custom bg-white">
//                       <option disabled selected>सुत्केरी खाना बनाउन आउँछ?</option>
//                       <option>आउँछ (Yes)</option>
//                       <option>आउँदैन (No)</option>
//                       <option>सिक्न चाहन्छु (Willing to learn)</option>
//                     </select>
//                     <select name="entry.682744971" className="form-input-custom bg-white">
//                       <option disabled selected>सिफ्ट (Preferred Shift)</option>
//                       <option>Morning</option>
//                       <option>Day</option>
//                       <option>Evening</option>
//                       <option>24 Hours / Live-in</option>
//                     </select>
//                     <div className="relative">
//                       <CreditCard className="absolute left-3 top-3.5 text-slate-400" size={18} />
//                       <select name="entry.275735169" className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none bg-white">
//                         <option disabled selected>नागरिकता छ? (ID Card)</option>
//                         <option>छ (Yes)</option>
//                         <option>छैन (No)</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 4: Final Details */}
//               {step === 4 && (
//                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
//                   <div className="flex items-center space-x-2 text-[#E67E7E] mb-4">
//                     <DollarSign size={20} />
//                     <h3 className="font-bold text-lg">अन्तिम विवरण (Final Details)</h3>
//                   </div>
//                   <input name="entry.426842645" placeholder="सेवा दिन सक्ने क्षेत्र (e.g., Koteshwor)" type="text" className="form-input-custom" />
//                   <input name="entry.1252436318" placeholder="अपेक्षित तलब (Expected Salary)" type="text" className="form-input-custom" />
//                   <textarea name="entry.2116931088" placeholder="थप केही प्रश्न भए यहाँ लेख्नुहोस्..." rows="3" className="form-input-custom"></textarea>
//                 </div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex justify-between items-center pt-6 border-t border-slate-100">
//                 {step > 1 ? (
//                   <button type="button" onClick={prevStep} className="flex items-center text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl transition">
//                     <ChevronLeft size={20} className="mr-1" /> Back
//                   </button>
//                 ) : <div />}

//                 {step < totalSteps ? (
//                   <button 
//                     type="button" 
//                     onClick={nextStep} 
//                     className="bg-[#E67E7E] hover:bg-[#d46b6b] text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-300 flex items-center"
//                   >
//                     Next <ChevronRight size={20} className="ml-1" />
//                   </button>
//                 ) : (
//                   <button 
//                     type="submit" 
//                     className="bg-[#8BB192] hover:bg-[#7a9d80] text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-300 flex items-center"
//                   >
//                     <Briefcase size={20} className="mr-2" /> Submit Application
//                   </button>
//                 )}
//               </div>
//             </form>
//           )}
//         </div>
//         <p className="text-center mt-8 text-slate-400 text-sm font-medium tracking-wide">
//           AAMA SHISHU SEWA • CONTACT: 9764651355
//         </p>
//       </div>

//       <style jsx>{`
//         .form-input-custom {
//           width: 100%;
//           padding: 0.85rem;
//           border: 1px solid #e2e8f0;
//           border-radius: 0.75rem;
//           outline: none;
//           transition: all 0.2s ease;
//         }
//         .form-input-custom:focus {
//           border-color: #E67E7E;
//           box-shadow: 0 0 0 3px rgba(230, 126, 126, 0.15);
//         }
//       `}</style>
//     </PublicLayout>
//   );
// };
import React, { useState } from 'react';
import { 
  GraduationCap, CheckCircle, ChevronRight, ChevronLeft, 
  Heart, Home, Flower2, UserPlus, Baby 
} from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';

const JOBS = [
  { id: "massage", title: "सुत्केरी आमा र शिशुको मालिस", eng: "Mother & Baby Massage Specialist", icon: <Heart className="text-pink-500" />, color: "bg-pink-50", desc: "नयाँ आमा र शिशुको स्वास्थ्यका लागि परम्परागत र वैज्ञानिक मालिस सेवा।" },
  { id: "household", title: "घरको काम र स्याहार", eng: "Household Help & Care", icon: <Home className="text-blue-500" />, color: "bg-blue-50", desc: "सुत्केरी अवस्थामा घरको कामकाज र आमाको पोषणमा सहयोग पुर्याउने।" },
  { id: "nwaran", title: "न्वारन / पण्डित सेवा", eng: "Nwaran / Priest Services", icon: <Flower2 className="text-orange-500" />, color: "bg-orange-50", desc: "शिशुको न्वारन र अन्य धार्मिक कार्यहरू सम्पन्न गर्ने अनुभवी पण्डित।" },
  { id: "patient", title: "बिरामी स्याहार", eng: "Patient Care", icon: <UserPlus className="text-emerald-500" />, color: "bg-emerald-50", desc: "अस्पताल पछि वा घरमा रहेका बिरामीहरूको विशेष रेखदेख र स्याहार।" },
  { id: "babycare", title: "शिशु हेरचाह", eng: "Professional Baby Care", icon: <Baby className="text-purple-500" />, color: "bg-purple-50", desc: "काममा व्यस्त आमाबुबाका लागि शिशुको सुरक्षित र प्रेमपूर्ण हेरचाह।" }
];

const Careers = () => {
  const [view, setView] = useState('listings');
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  
  // Single state object for all form fields
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', age: '',
    roles: [], experience: '', cooking: '', shift: '',
    citizenship: '', area: '', salary: '', notes: ''
  });

  const totalSteps = 4;
  const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSfP41sza2rZ1A7Z0ZlJTtaJg5TXdDihNAu_o18Ez-KJuMpeUA/formResponse";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = (jobTitle) => {
    setFormData(prev => ({ ...prev, roles: [jobTitle] }));
    setView('form');
    window.scrollTo(0, 0);
  };

  const toggleRole = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role) 
        : [...prev.roles, role]
    }));
  };

  // Senior Logic: Step Validation
  const isStepValid = () => {
    if (step === 1) return formData.name && formData.phone && formData.address && formData.age;
    if (step === 2) return formData.roles.length > 0;
    if (step === 3) return formData.experience && formData.cooking && formData.shift;
    if (step === 4) return formData.citizenship && formData.area;
    return true;
  };

  const nextStep = () => {
    if (isStepValid()) {
      setStep(s => Math.min(s + 1, totalSteps));
      window.scrollTo(0, 0);
    } else {
      alert("कृपया सबै अनिवार्य क्षेत्रहरू भर्नुहोस्। (Please fill all required fields)");
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        
        {view === 'listings' ? (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
            <header className="text-center mb-16">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">हाम्रो टोलीमा आबद्ध हुनुहोस्</h1>
              <div className="bg-[#8BB192]/10 border border-[#8BB192]/20 p-4 rounded-2xl inline-flex items-center">
                <GraduationCap className="text-[#8BB192] mr-3" />
                <span className="text-[#2D4F34] font-bold italic">"नयाँलाई तालिम सहित रोजगारीको अवसर!"</span>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {JOBS.map((job) => (
                <div key={job.id} className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col">
                  <div className={`${job.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                    {React.cloneElement(job.icon, { size: 32 })}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{job.title}</h3>
                  <p className="text-xs font-bold text-[#E67E7E] mb-4 uppercase tracking-widest">{job.eng}</p>
                  <p className="text-slate-500 mb-8 flex-grow">{job.desc}</p>
                  <button onClick={() => handleApplyClick(job.title)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-[#E67E7E] transition-colors flex items-center justify-center group">
                    Apply Now <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
            <button onClick={() => setView('listings')} className="flex items-center text-slate-400 hover:text-slate-600 mb-6 font-medium">
              <ChevronLeft size={20} /> Back to Openings
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
              {/* Progress Bar */}
              {!submitted && (
                <div className="h-1.5 bg-slate-100 w-full">
                  <div className="h-full bg-[#E67E7E] transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
                </div>
              )}

              {submitted ? (
                <div className="p-16 text-center">
                  <CheckCircle className="text-[#8BB192] mx-auto mb-6" size={64} />
                  <h2 className="text-3xl font-bold text-slate-800">सफलतापूर्वक बुझाइयो!</h2>
                  <p className="text-slate-500 mt-4">हामी तपाईंलाई चाँडै 9764651355 बाट सम्पर्क गर्नेछौं।</p>
                  <button onClick={() => window.location.reload()} className="mt-10 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold">Close</button>
                </div>
              ) : (
                <form action={GOOGLE_FORM_ACTION} method="POST" target="_blank" onSubmit={() => setSubmitted(true)} className="p-10 space-y-8">
                  
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-800">व्यक्तिगत विवरण (Details)</h3>
                      <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="पूरा नाम (Full Name) *" className="form-input required" />
                      <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="सम्पर्क नम्बर (Phone) *" type="tel" className="form-input required" />
                      <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="हालको ठेगाना (Address) *" className="form-input required" />
                      <input required name="age" value={formData.age} onChange={handleInputChange} placeholder="उमेर (Age) *" type="number" className="form-input required" />
                      {/* Hidden Google Fields */}
                      <input type="hidden" name="entry.820660232" value={formData.name} />
                      <input type="hidden" name="entry.108830536" value={formData.phone} />
                      <input type="hidden" name="entry.1920513208" value={formData.address} />
                      <input type="hidden" name="entry.2019399280" value={formData.age} />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-800">काम छनौट (Roles)</h3>
                      <div className="grid gap-3">
                        {JOBS.map(job => (
                          <label key={job.id} onClick={() => toggleRole(job.title)} className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.roles.includes(job.title) ? 'border-[#E67E7E] bg-[#E67E7E]/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <div className={`w-6 h-6 rounded-md border-2 mr-4 flex items-center justify-center ${formData.roles.includes(job.title) ? 'bg-[#E67E7E] border-[#E67E7E]' : 'border-slate-300'}`}>
                              {formData.roles.includes(job.title) && <CheckCircle size={14} className="text-white" />}
                            </div>
                            <span className="text-sm font-medium">{job.title}</span>
                            <input type="hidden" name="entry.155055816" value={formData.roles.join(', ')} />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-800">अनुभव र समय</h3>
                      <select required name="experience" onChange={handleInputChange} className="form-input">
                        <option value="">अनुभव छनौट गर्नुहोस् *</option>
                        <option value="1 वर्ष भन्दा कम">1 वर्ष भन्दा कम</option>
                        <option value="1-3 वर्ष">1-3 वर्ष</option>
                        <option value="5+ वर्ष">5 वर्ष भन्दा माथि</option>
                      </select>
                      <select required name="cooking" onChange={handleInputChange} className="form-input">
                        <option value="">सुत्केरी खाना बनाउन आउँछ? *</option>
                        <option value="Yes">आउँछ (Yes)</option>
                        <option value="No">आउँदैन (No)</option>
                      </select>
                      <select required name="shift" onChange={handleInputChange} className="form-input">
                        <option value="">सिफ्ट (Shift) *</option>
                        <option value="Day">Day</option>
                        <option value="Night">Night</option>
                        <option value="24h">24 Hours / Live-in</option>
                      </select>
                      {/* Hidden Google Fields */}
                      <input type="hidden" name="entry.493569845" value={formData.experience} />
                      <input type="hidden" name="entry.545747870" value={formData.cooking} />
                      <input type="hidden" name="entry.682744971" value={formData.shift} />
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-800">अन्तिम विवरण</h3>
                      <input required name="citizenship" onChange={handleInputChange} placeholder="नागरिकता छ? (Yes/No) *" className="form-input required" />
                      <input required name="area" onChange={handleInputChange} placeholder="कुन क्षेत्रमा काम गर्न सक्नुहुन्छ? *" className="form-input required" />
                      <input name="salary" onChange={handleInputChange} placeholder="अपेक्षित तलब (Salary)" className="form-input" />
                      <textarea name="notes" onChange={handleInputChange} placeholder="थप केही भन्न चाहनुहुन्छ?" rows="3" className="form-input required" />
                      {/* Hidden Google Fields */}
                      <input type="hidden" name="entry.275735169" value={formData.citizenship} />
                      <input type="hidden" name="entry.426842645" value={formData.area} />
                      <input type="hidden" name="entry.1252436318" value={formData.salary} />
                      <input type="hidden" name="entry.2116931088" value={formData.notes} />
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                    {step > 1 ? (
                      <button type="button" onClick={() => setStep(s => s - 1)} className="text-slate-400 font-bold px-6 py-2 hover:text-slate-600 transition">Back</button>
                    ) : <div />}

                    {step < totalSteps ? (
                      <button type="button" onClick={nextStep} className="bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl shadow-lg hover:bg-[#E67E7E] transition-all">
                        Next Step
                      </button>
                    ) : (
                      <button type="submit" className="bg-[#8BB192] text-white font-bold py-4 px-10 rounded-2xl shadow-lg hover:bg-[#7a9d80] transition-all">
                        Submit Application
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 1.1rem;
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 1.25rem;
          outline: none;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .form-input:focus {
          background: white;
          border-color: #E67E7E;
          box-shadow: 0 4px 12px rgba(230, 126, 126, 0.1);
        }
      `}</style>
    </PublicLayout>
  );
};

export default Careers;