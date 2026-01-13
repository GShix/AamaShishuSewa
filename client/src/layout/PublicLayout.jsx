import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  const [language, setLanguage] = useState('ne');

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  const translations = {
    ne: {
      nav: [
        { name: 'गृहपृष्ठ', path: '/' },
        { name: 'सेवाहरू', path: '/services' },
        { name: 'प्रोफेसनल', path: '/join_us' },
        { name: 'सम्पर्क', path: '/contact' },
        { name: 'लग इन', path: '/login', type: 'auth' },
        // { name: 'दर्ता', path: '/register', type: 'auth' },
        { name: 'ड्यासबोर्ड', path: '/dashboard', type: 'private' }
      ],
      hero: {
        title: 'आमा र शिशुको लागि पूर्ण ममता र व्यावसायिक हेरचाह',
        subtitle: 'काठमाडौं उपत्यकाका अनुभवी सुत्केरी सुसारे र मालिश विशेषज्ञहरूसँग जोडिनुहोस्।',
        ctaBook: 'सेवा लिनुहोस्',
        ctaJoin: 'टोलीमा सामेल हुनुहोस्'
      },
      stats: { happy: '५०+ सन्तुष्ट आमा', pros: '१०+ प्रमाणित सुसारे' },
      sections: { 
        mission: 'हाम्रो लक्ष्य र उद्देश्य',
        conduct: 'प्रोफेसनल आचारसंहिता',
        faq: 'धेरै सोधिने प्रश्नहरू'
      },
      missionContent: "हाम्रो मुख्य उद्देश्य नेपाली परम्परागत सुत्केरी हेरचाह र आधुनिक स्वास्थ्य मापदण्डलाई जोडेर आमा र बच्चालाई सुरक्षित र सुखी बनाउनु हो। हामी विश्वास गर्छौं कि प्रत्येक नयाँ आमालाई उचित आराम र पोषणको आवश्यकता हुन्छ।",
      conductPoints: [
        { title: "समयको पालना", desc: "हाम्रा कर्मचारीहरू सधैं तोकिएको समयमा उपस्थित हुनेछन्।" },
        { title: "गोपनीयता", desc: "तपाईंको परिवारको गोपनीयता हाम्रो उच्च प्राथमिकता हो।" },
        { title: "स्वच्छता", desc: "उच्च स्तरको व्यक्तिगत सरसफाई र मास्कको प्रयोग अनिवार्य छ।" },
        { title: "सकारात्मकता", desc: "धैर्यता र मायालु व्यवहार नै हाम्रो पहिचान हो।" }
      ],
      faqs: [
        { q: "के सुसारेहरू तालिम प्राप्त छन्?", a: "हो, हाम्रा सबै सुसारेहरूले प्राथमिक स्वास्थ्य र शिशु हेरचाहमा विशेष तालिम पाएका छन्।" },
        { q: "न्यूनतम कति दिनको लागि बुक गर्न सकिन्छ?", a: "हामी ७ दिन देखि ४५ दिन सम्मको विभिन्न प्याकेजहरू उपलब्ध गराउँछौं।" }
      ]
    },
    en: {
      nav: [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Join Us', path: '/join_us' },
        { name: 'Contact', path: '/contact' },
        { name: 'Login', path: '/login', type: 'auth' },
        // { name: 'Register', path: '/register', type: 'auth' },
        { name: 'Dashboard', path: '/dashboard', type: 'private' }
      ],
      hero: {
        title: 'Professional Care Rooted in Tradition',
        subtitle: 'Connect with verified postpartum caregivers and massage experts across Kathmandu Valley.',
        ctaBook: 'Book a Service',
        ctaJoin: 'Join our Team'
      },
      stats: { happy: '50+ Happy Mothers', pros: '10+ Certified Pros' },
      sections: { 
        mission: 'Mission & Vision',
        conduct: 'Professional Code of Conduct',
        faq: 'Frequently Asked Questions'
      },
      missionContent: "Our mission is to empower mothers by providing authentic traditional postpartum care blended with modern clinical safety. We aim to revive the culture of 'Sutkeri Sewa' while creating dignified employment.",
      conductPoints: [
        { title: "Punctuality", desc: "Our professionals value your schedule and arrive on time." },
        { title: "Confidentiality", desc: "Strict privacy protocols for your home and family life." },
        { title: "Hygiene", desc: "Sanitized equipment and medical-grade hygiene standards." },
        { title: "Positive Attitude", desc: "Empathy and kindness are at the core of our care." }
      ],
      faqs: [
        { q: "Are the caregivers background checked?", a: "Yes, we conduct rigorous police clearance and reference checks for every professional." },
        { q: "What areas do you serve?", a: "Currently, we serve all locations within Kathmandu, Lalitpur, and Bhaktapur." }
      ]
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#FFFBFB] flex flex-col">
      <Header language={language} setLanguage={setLanguage} t={t} />
      <main className="flex-grow">
        {/* --- THE FIX --- */}
        {/* We inject the current 't' and 'language' into the child page */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { t, language });
          }
          return child;
        })}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;