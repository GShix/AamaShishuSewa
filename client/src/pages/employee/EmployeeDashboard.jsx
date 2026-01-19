import React, { useState } from 'react';
import { 
  User, Settings, Star, DollarSign, Power, Trash2, 
  CheckCircle, XCircle, Clock, MapPin, ListChecks, 
  ChevronRight, Bell, LogOut 
} from 'lucide-react';
import PublicLayout from '../../layout/PublicLayout';

const EmployeeDashboard = () => {
  // Mock Worker Data - This will come from your Backend next week
  const [workerData, setWorkerData] = useState({
    name: "Sita Thapa",
    status: "available", // 'available' or 'booked' or 'offline'
    dailyRate: 1500,
    rating: 4.9,
    totalEarnings: 45200,
    jobsCompleted: 124,
    services: ["Infant Care", "Baby Massage", "Postnatal Care"],
    city: "Kathmandu",
    image: "https://i.pravatar.cc/150?u=1"
  });

  const [activeTab, setActiveTab] = useState('overview');

  // Logic for toggling availability
  const toggleStatus = () => {
    setWorkerData(prev => ({
      ...prev, 
      status: prev.status === 'available' ? 'offline' : 'available'
    }));
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT SIDEBAR - Navigation & Profile Summary */}
            <aside className="lg:w-1/3 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center">
                <div className="relative inline-block">
                  <img src={workerData.image} className="w-32 h-32 rounded-full border-4 border-emerald-50 object-cover" alt="" />
                  <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${workerData.status === 'available' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
                <h2 className="mt-4 text-2xl font-black text-slate-900">{workerData.name}</h2>
                <p className="text-slate-400 font-bold flex items-center justify-center gap-1">
                  <MapPin size={14}/> {workerData.city}
                </p>

                <div className="mt-6 flex justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Rating</p>
                    <p className="font-black text-slate-800 flex items-center gap-1">{workerData.rating} <Star size={12} className="fill-yellow-400 text-yellow-400"/></p>
                  </div>
                  <div className="border-x border-slate-200 px-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Jobs</p>
                    <p className="font-black text-slate-800">{workerData.jobsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Earned</p>
                    <p className="font-black text-emerald-600">Rs.{workerData.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  onClick={toggleStatus}
                  className={`w-full mt-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${workerData.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}
                >
                  <Power size={18}/> {workerData.status === 'available' ? 'Currently Online' : 'Currently Offline'}
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 space-y-1">
                {['Overview', 'Requests', 'Services', 'Reviews', 'Settings'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`w-full text-left px-6 py-4 rounded-xl font-bold flex items-center justify-between transition-all ${activeTab === tab.toLowerCase() ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {tab}
                    <ChevronRight size={16} />
                  </button>
                ))}
              </nav>
            </aside>

            {/* RIGHT MAIN CONTENT */}
            <main className="lg:w-2/3">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <label className="block text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Set Daily Charge</label>
                      <div className="flex items-center gap-4">
                        <div className="flex-grow bg-slate-50 p-4 rounded-2xl flex items-center gap-2">
                          <DollarSign className="text-emerald-500" size={20} />
                          <input 
                            type="number" 
                            value={workerData.dailyRate} 
                            onChange={(e) => setWorkerData({...workerData, dailyRate: e.target.value})}
                            className="bg-transparent font-black text-xl outline-none w-full" 
                          />
                        </div>
                        <button className="bg-emerald-500 text-white p-4 rounded-2xl font-bold">Update</button>
                      </div>
                    </div>

                    <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-lg flex flex-col justify-center">
                      <p className="text-xs font-bold opacity-80 uppercase tracking-widest">New Requests</p>
                      <div className="flex items-center justify-between mt-2">
                        <h3 className="text-4xl font-black">04</h3>
                        <Bell className="animate-bounce" />
                      </div>
                    </div>
                  </div>

                  {/* Active Services Section */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">My Services</h3>
                        <ListChecks className="text-slate-300" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {workerData.services.map(s => (
                        <div key={s} className="px-5 py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-bold flex items-center gap-2 border border-emerald-100">
                          <CheckCircle size={16} /> {s}
                        </div>
                      ))}
                      <button className="px-5 py-3 bg-slate-50 text-slate-400 rounded-2xl font-bold border border-dashed border-slate-200 hover:bg-slate-100">+ Add New</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                  <h3 className="text-xl font-black text-slate-900">Account Security</h3>
                  
                  <div className="space-y-4">
                    <button className="w-full text-left p-4 rounded-2xl border border-slate-100 font-bold flex items-center gap-4 hover:bg-slate-50 transition-all">
                      <User size={20} className="text-slate-400" /> Change Profile Picture
                    </button>
                    <button className="w-full text-left p-4 rounded-2xl border border-slate-100 font-bold flex items-center gap-4 hover:bg-slate-50 transition-all">
                      <Settings size={20} className="text-slate-400" /> Edit Basic Information
                    </button>
                    
                    <div className="pt-8 mt-8 border-t border-slate-100">
                      <h4 className="text-red-500 font-black mb-4 uppercase text-xs tracking-widest">Danger Zone</h4>
                      <button className="w-full text-left p-4 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center gap-4 hover:bg-red-100 transition-all">
                        <Trash2 size={20} /> Delete My Account Forever
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews/Requests sections would go here similarly */}
            </main>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default EmployeeDashboard;