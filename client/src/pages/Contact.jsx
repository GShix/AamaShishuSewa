import React from 'react';
import { Phone, Mail, MapPin, Calendar, Clock, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Info */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">We're here for you and your baby.</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Have questions? Our support team is available from 8 AM to 8 PM daily.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 grid lg:grid-cols-3 gap-8">
        {/* Contact Details Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0"><Phone /></div>
                <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Call Us</p><p className="font-bold">+977 9764651355</p></div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0"><Mail /></div>
                <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email</p><p className="font-bold">care@aamashishu.com</p></div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shrink-0"><MapPin /></div>
                <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Office</p><p className="font-bold">Lazimpat, Kathmandu</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 mb-20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Calendar className="text-rose-500" /> Book a Consultation
            </h2>
            <form className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1">PARENTS NAME</label>
                <input type="text" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder="Aayushma & Rohan" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1">CONTACT NUMBER</label>
                <input type="tel" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder="98XXXXXXXX" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1">PREFERRED START DATE</label>
                <input type="date" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1">SELECT SERVICE</label>
                <select className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500">
                  <option>Postpartum Care (Full Time)</option>
                  <option>Maternal Massage Only</option>
                  <option>Nwaran Logistics</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1">ANY SPECIFIC REQUESTS?</label>
                <textarea rows="4" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder="Tell us about your baby's age or specific care needs..."></textarea>
              </div>
              <button className="md:col-span-2 py-4 bg-rose-500 text-white rounded-xl font-bold text-lg hover:bg-rose-600 transition shadow-lg shadow-rose-100">
                Confirm Booking Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;