export const TRANSLATIONS = {
  ne: {
    nav: [
      { name: 'गृहपृष्ठ', path: '/' },
      { name: 'सेवाहरू', path: '/services' },
      // { name: 'नेतृत्व फलक', path: '/leaderboard' },
      { name: 'सम्पर्क', path: '/contact' },
      { name: 'क्यारियर्स', path: '/careers' },
      { name: 'लगइन', path: '/login', type: 'auth' },
      // {name: 'रजिस्टर', path: '/register', type: 'auth'},
      { name: 'ड्यासबोर्ड', path: '/dashboard', type: 'private' }
    ],
    footer: {
      about: "नेपालको अग्रणी सुत्केरी हेरचाह एजेन्सी। हामी आमा र बच्चाको लागि परम्परागत हेरचाह र आधुनिक सुरक्षा मापदण्डहरू बीच पुलको काम गर्छौं।",
      quickLinks: "सेवा मेप",
      contact: "सम्पर्क",
      immediate: "तत्काल सेवा चाहिन्छ?",
      cta: "अपोइन्टमेन्ट बुक गर्नुहोस्"
    },
    hero: {
      title: 'आमा र शिशुको लागि पूर्ण ममता र व्यावसायिक हेरचाह',
      subtitle: 'काठमाडौं उपत्यकाका अनुभवी सुत्केरी सुसारे र मालिश विशेषज्ञहरूसँग जोडिनुहोस्।',
      ctaBook: 'सेवा लिनुहोस्',
      ctaJoin: 'टोलीमा सामेल हुनुहोस्'
    },
    stats: { happy: '१५०+ सन्तुष्ट आमा', pros: '३०+ प्रमाणित सुसारे' },
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
    ],
    leaderboard: {
      title: "हाम्रा शीर्ष विशेषज्ञहरू",
      subtitle: "तपाईंको सहरका उत्कृष्ट सेवाप्रदायकहरू छनौट गर्नुहोस्।",
      searchPlaceholder: "खोज्नुहोस् (नाम वा सहर)...",
      ratingLabel: "रेटिङ",
      locationLabel: "स्थान",
      feeLabel: "शुल्क",
      noResultTitle: "नतिजा भेटिएन",
      noResultSub: "कृपया फिल्टरहरू परिवर्तन गरेर पुन: प्रयास गर्नुहोस्।",
      resetBtn: "फिल्टरहरू रिसेट गर्नुहोस्"
    },
    services: {
      title: "हाम्रा विशिष्ट सेवाहरू",
      subtitle: "हामी प्राचीन नेपाली ज्ञान र आधुनिक चिकित्सा सुरक्षा बीचको दूरीलाई कम गर्छौं।",
      ctaText: "थप विवरण बुझ्नुहोस्",
      list: [
        {
          id: 'postpartum',
          title: "सुत्केरी हेरचाह (सुसारे)",
          price: "अनुकूल मूल्य",
          description: "अनुभवी सुसारेहरूद्वारा आमा र नवजात शिशुको लागि परम्परागत २४/७ हेरचाह।",
          features: ["परम्परागत पोषणयुक्त खाना", "शिशु स्नान र सरसफाई", "स्तनपान सहयोग", "स्वास्थ्य अवस्थाको निगरानी"],
          color: "blue"
        },
        {
          id: 'massage',
          title: "परम्परागत मालिश",
          price: "अनुकूल मूल्य",
          description: "शारीरिक रिकभरी र तनावमुक्त हुनको लागि आयुर्वेदिक तेल मालिश।",
          features: ["सिद्ध तेलको प्रयोग", "हर्बल उब्टन स्क्रब", "शिशु मालिश तालिम", "जोर्नीको दुखाइमा राहत"],
          color: "rose"
        },
        {
          id: 'ritual',
          title: "न्वारन व्यवस्थापन",
          price: "अनुकूल मूल्य",
          description: "११ औं दिनको न्वारन समारोहको लागि पूर्ण बन्दोबस्त।",
          features: ["पण्डित समन्वय", "पूजा सामग्री व्यवस्थापन", "कार्यक्रम स्थल र सजावट", "पाहुना व्यवस्थापन"],
          color: "orange"
        }
      ]
    },
    contact: {
      heroTitle: "हामी तपाईं र तपाईंको बच्चाको लागि यहाँ छौं।",
      heroSubtitle: "केहि प्रश्नहरू छन्? हाम्रो टोली दैनिक बिहान ८ देखि बेलुका ८ बजेसम्म उपलब्ध छ।",
      callLabel: "हामीलाई कल गर्नुहोस्",
      emailLabel: "इमेल",
      officeLabel: "कार्यालय",
      location: "नयाँ बानेश्वर, काठमाडौं",
      formTitle: "परामर्श बुक गर्नुहोस्",
      labelName: "अभिभावकको नाम",
      placeholderName: "आयुष्मा र रोहन",
      labelPhone: "सम्पर्क नम्बर",
      labelDate: "सुरुवात मिति",
      labelService: "सेवा छनौट गर्नुहोस्",
      serviceOptions: ["सुत्केरी हेरचाह (पूर्ण समय)", "आमा मालिश मात्र", "न्वारन व्यवस्थापन"],
      labelRequest: "कुनै विशेष अनुरोध?",
      placeholderRequest: "हामीलाई बच्चाको उमेर वा विशिष्ट हेरचाह आवश्यकताहरू बारे बताउनुहोस्...",
      submitBtn: "बुकिङ अनुरोध पठाउनुहोस्"
    },
    careers: {
      title: "क्यारियर",
      subtitle: "हाम्रो व्यावसायिक टोलीमा समावेश हुनुहोस्।",
      trainingBadge: "तालिमको सुबिधा उपलब्ध छ",
      applyBtn: "अहिले आवेदन दिनुहोस्",
      jobs: [
        { id: "massage", title: "सुत्केरी आमा र शिशुको मालिस", eng: "Mother & Baby Massage", color: "bg-pink-50", desc: "नयाँ आमा र शिशुको स्वास्थ्यका लागि परम्परागत र वैज्ञानिक मालिस सेवा।" },
        { id: "household", title: "घरको काम र स्याहार", eng: "Household help & Care", color: "bg-blue-50", desc: "सुत्केरी अवस्थामा घरको कामकाज र आमाको पोषणमा सहयोग पुर्याउने।" },
        { id: "nwaran", title: "न्वारन / पण्डित सेवा", eng: "Nwaran / Priest Services", color: "bg-orange-50", desc: "शिशुको न्वारन र अन्य धार्मिक कार्यहरू सम्पन्न गर्ने अनुभवी पण्डित।" },
        { id: "patient", title: "बिरामी स्याहार", eng: "Patient Care", color: "bg-emerald-50", desc: "अस्पताल पछि वा घरमा रहेका बिरामीहरूको विशेष रेखदेख र स्याहार।" },
        { id: "babycare", title: "शिशु हेरचाह", eng: "Professional Baby Care", color: "bg-purple-50", desc: "काममा व्यस्त आमाबुबाका लागि शिशुको सुरक्षित र प्रेमपूर्ण हेरचाह।" }
      ]
    },
    apply: {
      back: "पछाडि",
      formTitle: "आवेदन फारम",
      roleLabel: "भूमिका",
      personalSec: "व्यक्तिगत विवरण",
      skillsSec: "अनुभव र सीप",
      labelName: "पुरा नाम", phName: "पुरा नाम",
      labelPhone: "फोन", phPhone: "सम्पर्क नम्बर",
      labelAddress: "ठेगाना", phAddress: "काठमाडौंको ठेगाना",
      labelAge: "उमेर", phAge: "तपाईंको उमेर",
      labelExp: "अनुभव",
      expOptions: [
        {label: "१ वर्ष भन्दा कम", val: "1 वर्ष भन्दा कम (Less than 1 year)"},
        {label: "१-३ वर्ष", val: "1-3 वर्ष (1-3 years)"},
        {label: "३-५ वर्ष", val: "3-5 वर्ष (3-5 years)"},
        {label: "५ वर्ष भन्दा माथि", val: "5 वर्ष भन्दा माथि (More than 5 years)"}
      ],
      labelCook: "खाना पकाउने सीप",
      cookOptions: [{label: "आउँछ", val: "आउँछ (Yes)"}, {label: "आउँदैन", val: "आउँदैन (No)"}],
      labelShift: "रुचाएको समय",
      shiftOptions: [
        {label: "बिहान", val: "बिहान (Morning Shift)"},
        {label: "दिउँसो", val: "दिउँसो (Day Shift)"},
        {label: "साँझ", val: "साँझ (Evening Shift)"}
      ],
      labelId: "नागरिकता / परिचयपत्र", phId: "नागरिकता जानकारी",
      submitBtn: "आवेदन बुझाउनुहोस्",
      processing: "प्रक्रियामा छ...",
      successTitle: "फारम खोलियो!",
      successMsg: "कृपया नयाँ ट्याबमा Google Form भर्नुहोस् र Submit गर्नुहोस्। त्यसपछि WhatsApp मार्फत हामीलाई सम्पर्क गर्नुहोस्।",
      backBtn: "क्यारियरमा फर्कनुहोस्"
    },
    employeeDetail: {
      backBtn: "लिडरबोर्डमा फर्कनुहोस्",
      topPerformer: "उत्कृष्ट कर्मचारी",
      thisMonth: "यस महिनाको",
      trustTitle: "प्रमाणीकरण र सुरक्षा",
      aboutPrefix: "को बारेमा",
      feeLabel: "कुल सेवा शुल्क",
      perDay: "प्रति दिन",
      bookBtn: "अहिले बुक गर्नुहोस्"
    },
  },
  en: {
    nav: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      // { name: 'Leaderboard', path: '/leaderboard' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Login', path: '/login', type: 'auth' },
      // {name: 'Register', path: '/register', type: 'auth'},
      { name: 'Dashboard', path: '/dashboard', type: 'private' }
    ],
    footer: {
      about: "Nepal's premier agency for authentic postpartum wellness. We bridge traditional care with modern safety standards.",
      quickLinks: "Service Map",
      contact: "Direct Contact",
      immediate: "Need Immediate Care?",
      cta: "BOOK AN APPOINTMENT"
    },
    hero: {
      title: 'Professional Care Rooted in Tradition',
      subtitle: 'Connect with verified postpartum caregivers and massage experts across Kathmandu Valley.',
      ctaBook: 'Book a Service',
      ctaJoin: 'Join our Team'
    },
    stats: { happy: '150+ Happy Mothers', pros: '30+ Certified Pros' },
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
    ],
    leaderboard: {
      title: "Our Top Professionals",
      subtitle: "Choose the best service providers in your city.",
      searchPlaceholder: "Search (name or city)...",
      ratingLabel: "Rating",
      locationLabel: "Location",
      feeLabel: "Fee",
      noResultTitle: "No Results Found",
      noResultSub: "Please try changing your filters.",
      resetBtn: "Reset All Filters"
    },
    services: {
      title: "Our Specialized Services",
      subtitle: "We bridge the gap between ancient Nepali wisdom and modern medical safety.",
      ctaText: "Inquire Details",
      list: [
        {
          id: 'postpartum',
          title: "Postpartum Care (Susare)",
          price: "Custom Pricing",
          description: "Traditional 24/7 care for mother and newborn by experienced caregivers.",
          features: ["Traditional nutritional meal prep", "Baby bathing & hygiene", "Lactation support", "Vital sign monitoring"],
          color: "blue"
        },
        {
          id: 'massage',
          title: "Traditional Massage",
          price: "Custom Pricing",
          description: "Ayurvedic oil massage focused on physical recovery and stress relief.",
          features: ["Siddha oil application", "Ubtan herbal scrub", "Baby massage training", "Joint pain relief"],
          color: "rose"
        },
        {
          id: 'ritual',
          title: "Nwaran Management",
          price: "Custom Pricing",
          description: "Complete logistical support for the 11th-day naming ceremony.",
          features: ["Pundit coordination", "Pooja material sourcing", "Venue setup & decor", "Guest management"],
          color: "orange"
        }
      ]
    },
    contact: {
      heroTitle: "We're here for you and your baby.",
      heroSubtitle: "Have questions? Our support team is available from 8 AM to 8 PM daily.",
      callLabel: "Call Us",
      emailLabel: "Email",
      officeLabel: "Office",
      location: "New Baneshwor, Kathmandu",
      formTitle: "Book a Consultation",
      labelName: "PARENTS NAME",
      placeholderName: "Aayushma & Rohan",
      labelPhone: "CONTACT NUMBER",
      labelDate: "PREFERRED START DATE",
      labelService: "SELECT SERVICE",
      serviceOptions: ["Postpartum Care (Full Time)", "Maternal Massage Only", "Nwaran Logistics"],
      labelRequest: "ANY SPECIFIC REQUESTS?",
      placeholderRequest: "Tell us about your baby's age or specific care needs...",
      submitBtn: "Confirm Booking Request"
    },
    careers: {
      title: "Careers",
      subtitle: "Join our professional team and make a difference.",
      trainingBadge: "Training facilities available",
      applyBtn: "Apply Now",
      jobs: [
        { id: "massage", title: "Mother & Baby Massage", eng: "Mother & Baby Massage", color: "bg-pink-50", desc: "Traditional and scientific massage services for the health of new mothers and infants." },
        { id: "household", title: "Household Help & Care", eng: "Household help & Care", color: "bg-blue-50", desc: "Assisting with household chores and mother's nutrition during the postpartum period." },
        { id: "nwaran", title: "Nwaran / Priest Services", eng: "Nwaran / Priest Services", color: "bg-orange-50", desc: "Experienced priests to perform baby naming ceremonies and other rituals." },
        { id: "patient", title: "Patient Care", eng: "Patient Care", color: "bg-emerald-50", desc: "Specialized care and supervision for patients at home or post-hospitalization." },
        { id: "babycare", title: "Professional Baby Care", eng: "Professional Baby Care", color: "bg-purple-50", desc: "Safe and loving childcare for busy parents." }
      ]
    },
    apply: {
      back: "Back",
      formTitle: "Application Form",
      roleLabel: "Role",
      personalSec: "Personal Details",
      skillsSec: "Skills & Experience",
      labelName: "Full Name", phName: "Your full name",
      labelPhone: "Phone", phPhone: "Contact number",
      labelAddress: "Address", phAddress: "Kathmandu address",
      labelAge: "Age", phAge: "Your age",
      labelExp: "Experience",
      expOptions: [
        {label: "Less than 1 year", val: "1 वर्ष भन्दा कम (Less than 1 year)"},
        {label: "1-3 years", val: "1-3 वर्ष (1-3 years)"},
        {label: "3-5 years", val: "3-5 वर्ष (3-5 years)"},
        {label: "More than 5 years", val: "5 वर्ष भन्दा माथि (More than 5 years)"}
      ],
      labelCook: "Cooking Skill",
      cookOptions: [{label: "Yes", val: "आउँछ (Yes)"}, {label: "No", val: "आउँदैन (No)"}],
      labelShift: "Preferred Shift",
      shiftOptions: [
        {label: "Morning", val: "बिहान (Morning Shift)"},
        {label: "Day", val: "दिउँसो (Day Shift)"},
        {label: "Evening", val: "साँझ (Evening Shift)"}
      ],
      labelId: "Citizenship / ID", phId: "ID information",
      submitBtn: "Submit Application",
      processing: "Processing...",
      successTitle: "Form Opened!",
      successMsg: "Please fill out and submit the Google Form in the new tab. Then contact us via WhatsApp.",
      backBtn: "Back to Careers"
    },
    employeeDetail: {
      backBtn: "Back to Leaderboard",
      topPerformer: "Top Performer",
      thisMonth: "This Month",
      trustTitle: "Verification & Safety",
      aboutPrefix: "About",
      feeLabel: "Total Service Fee",
      perDay: "per day",
      bookBtn: "Book Now"
    }
  }
};