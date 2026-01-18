import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import PublicLayout from '../layout/PublicLayout';

const Apply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedJob = location.state?.job || { title: "General", eng: "Applicant" };
  const GOOGLE_FORM_BASE = "https://docs.google.com/forms/d/e/1FAIpQLSfP41sza2rZ1A7Z0ZlJTtaJg5TXdDihNAu_o18Ez-KJuMpeUA/viewform";

    const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Get values for WhatsApp message
    const name = formData.get('entry.820660232');
    const phone = formData.get('entry.108830536');
    const job = selectedJob.title;

    // Build pre-filled Google Form URL
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        if (value) params.append(key, value);
    }

    // Google Form pre-filled URL
    const googleFormUrl = `${GOOGLE_FORM_BASE}?${params.toString()}&submit=Submit`;

    // WhatsApp message
    const whatsappNumber = "9779764651355";
    const message = `नमस्ते, म ${name} (फोन: ${phone})। मैले ${job} को लागि आवेदन फारम भर्दै छु।`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open Google Form in new tab to submit
    window.open(googleFormUrl, '_blank');
    
    // Show success message
    setSuccess(true);
    setLoading(false);
    window.scrollTo(0, 0);

    // Optionally open WhatsApp after 2 seconds
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 2000);
    };
    if (success) {
    return (
        <PublicLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black mb-4">फारम खोलियो!</h2>
            <p className="text-slate-500 mb-8">
                कृपया नयाँ ट्याबमा Google Form भर्नुहोस् र Submit गर्नुहोस्। त्यसपछि WhatsApp मार्फत हामीलाई सम्पर्क गर्नुहोस्।
            </p>
            <div className="flex flex-col gap-3">
                <button 
                onClick={() => navigate('/careers')} 
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
                >
                Back to Careers
                </button>
            </div>
            </div>
        </div>
        </PublicLayout>
    );
    }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FDFCFB] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 font-bold mb-8 hover:text-slate-900 transition-all cursor-pointer">
            <ChevronLeft size={20} /> Back
          </button>

          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2">आवेदन फारम</h1>
            <p className="text-[#E67E7E] font-bold uppercase tracking-widest text-sm">
              Role: {selectedJob.title} ({selectedJob.eng})
            </p>
          </header>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Hidden field: Must match Google Form choice string exactly */}
            <input type="hidden" name="entry.155055816" value={`${selectedJob.title} (${selectedJob.eng})`} />

            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-10">
              
              {/* Personal Info */}
              <section className="space-y-6">
                <div className="text-xl font-bold border-b pb-4 flex items-center italic">
                   <ShieldCheck className="mr-2 text-emerald-500" /> व्यक्तिगत विवरण (Personal)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Full Name</label>
                    <input required name="entry.820660232" placeholder="पुरा नाम" className="modern-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Phone</label>
                    <input required name="entry.108830536" type="tel" placeholder="सम्पर्क नम्बर" className="modern-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Address</label>
                    <input required name="entry.1920513208" placeholder="काठमाडौंको ठेगाना" className="modern-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Age</label>
                    <input required name="entry.2019399280" type="number" placeholder="तपाईंको उमेर" className="modern-input" />
                  </div>
                </div>
              </section>

              {/* Professional Info - UPDATED VALUES TO MATCH GOOGLE FORM */}
              <section className="space-y-6">
                <div className="text-xl font-bold border-b pb-4 flex items-center italic">
                   <Send className="mr-2 text-blue-500" /> अनुभव र सीप (Skills)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Experience</label>
                    <select name="entry.493569845" className="modern-input">
                      <option value="1 वर्ष भन्दा कम (Less than 1 year)">1 वर्ष भन्दा कम</option>
                      <option value="1-3 वर्ष (1-3 years)">1-3 वर्ष</option>
                      <option value="3-5 वर्ष (3-5 years)">3-5 वर्ष</option>
                      <option value="5 वर्ष भन्दा माथि (More than 5 years)">5 वर्ष भन्दा माथि</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Cooking Skill</label>
                    <select name="entry.545747870" className="modern-input">
                      <option value="आउँछ (Yes)">आउँछ (Yes)</option>
                      <option value="आउँदैन (No)">आउँदैन (No)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Preferred Shift</label>
                    <select name="entry.682744971" className="modern-input">
                      <option value="बिहान (Morning Shift)">बिहान (Morning)</option>
                      <option value="दिउँसो (Day Shift)">दिउँसो (Day)</option>
                      <option value="साँझ (Evening Shift)">साँझ (Evening)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Citizenship / ID</label>
                    <input name="entry.275735169" placeholder="नागरिकता जानकारी" className="modern-input" />
                  </div>
                </div>
              </section>

              {/* Extra Info */}
              <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Preferred Areas</label>
                    <input name="entry.426842645" placeholder="सेवा दिन सक्ने ठाउँ" className="modern-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Expected Salary</label>
                    <input name="entry.1252436318" placeholder="अपेक्षित तलब" className="modern-input" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Message</label>
                    <textarea name="entry.2116931088" rows="3" placeholder="केहि थप कुरा..." className="modern-input"></textarea>
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-6 rounded-3xl text-white font-black text-xl shadow-xl transition-all cursor-pointer ${loading ? 'bg-slate-400 animate-pulse' : 'bg-[#E67E7E] hover:bg-[#d66d6d] hover:scale-[1.01]'}`}
              >
                {loading ? 'Processing...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
        <style>{`
        .modern-input {
          width: 100%;
          padding: 1.1rem;
          background: #F8FAFC;
          border: 2px solid #F1F5F9;
          border-radius: 1.25rem;
          outline: none;
          transition: all 0.2s ease;
          color: #334155;
          font-weight: 600;
        }
        .modern-input:focus {
          border-color: #8BB192;
          background: white;
          box-shadow: 0 0 0 4px rgba(139, 177, 146, 0.1);
        }
        `}</style>
    </PublicLayout>
  );
};

export default Apply;