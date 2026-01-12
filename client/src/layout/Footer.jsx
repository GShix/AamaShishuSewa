import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Mail, MapPin, 
  Phone, Clock, Heart 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-rose-200 p-2 rounded-xl shadow-lg">
              <img className='h-7 w-7 object-contain' src="/assets/logo.png" alt="Logo" />
            </div>
            <span className="text-2xl font-black tracking-tight">आमा शिशु सेवा</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Nepal's premier agency for authentic postpartum wellness. We bridge traditional care with modern safety standards for mother and child.
          </p>
          <div className="flex gap-4">
            {[
              { Icon: Facebook, href: "https://facebook.com" },
              { Icon: Instagram, href: "https://instagram.com" },
              { Icon: Mail, href: "mailto:info@aamashishu.com" }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:-translate-y-1 transition-all duration-300"
              >
                <social.Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 mb-8">Service Map</h4>
          <ul className="space-y-4 text-slate-400 font-bold text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home Base</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Care Packages</Link></li>
            <li><Link to="/join" className="hover:text-white transition-colors">Become a Pro</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 mb-8">Direct Contact</h4>
          <ul className="space-y-5 text-slate-400 text-sm">
            <li className="flex gap-4 items-start">
              <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <span>New Baneshwor, Kathmandu<br/></span>
            </li>
            <li className="flex gap-4 items-center font-bold text-white">
              <Phone size={18} className="text-rose-500 shrink-0" />
              <a href="tel:+9779764651355" className="hover:text-rose-400 transition-colors">+977 9764651355</a>
            </li>
            <li className="flex gap-4 items-center">
              <Clock size={18} className="text-rose-500 shrink-0" />
              <span>Sun - Fri: 8:00 AM - 7:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
          <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
            <Heart size={16} className="text-rose-500 fill-rose-500" /> Need Immediate Care?
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Our care coordinators are available to help you choose the best package.
          </p>
          <Link 
            to="/book" 
            className="block w-full text-center py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-colors"
          >
            BOOK AN APPOINTMENT
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
          © {currentYear} आमा शिशु सेवा (Aama Shishu Sewa). All rights reserved.
        </p>
        <div className="flex gap-6 text-[10px] font-black text-rose-500/50 uppercase tracking-widest">
          <button className="hover:text-rose-500 transition-colors">Privacy Policy</button>
          <button className="hover:text-rose-500 transition-colors">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;