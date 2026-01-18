/**
 * TEST DATA FOR CAREERS FORM
 * Copy these objects into browser console to auto-fill the form
 */

// TEST CASE 1: Experienced Massage Specialist
const testCase1 = {
  name: 'सीता देवी कार्की',
  phone: '9841234567',
  address: 'कोटेश्वर, काठमाडौं',
  age: '28',
  roles: ['सुत्केरी आमा र शिशुको मालिस'],
  experience: '3-5 वर्ष',
  cooking: 'Yes',
  shift: 'Day',
  citizenship: 'Yes',
  area: 'Koteshwor, Balkhu, Thapathali',
  salary: '25000',
  notes: 'म यो काममा अनुभवी छु र राम्रो सेवा दिन सक्छु।'
};

// TEST CASE 2: Multi-role Worker
const testCase2 = {
  name: 'गीता श्रेष्ठ',
  phone: '9851987654',
  address: 'बौद्ध, काठमाडौं',
  age: '32',
  roles: ['घरको काम र स्याहार', 'बिरामी स्याहार', 'शिशु हेरचाह'],
  experience: '5+ वर्ष',
  cooking: 'Yes',
  shift: '24h',
  citizenship: 'Yes',
  area: 'Bouddha, Jorpati, Sankhu',
  salary: '30000',
  notes: 'घर जस्तै माया गर्छु। 24 घण्टा उपलब्ध छु।'
};

// TEST CASE 3: Beginner/Trainee
const testCase3 = {
  name: 'माया तामाङ',
  phone: '9823456789',
  address: 'कलंकी, काठमाडौं',
  age: '22',
  roles: ['शिशु हेरचाह'],
  experience: '1 वर्ष भन्दा कम',
  cooking: 'No',
  shift: 'Day',
  citizenship: 'Yes',
  area: 'Kalimati, Soaltee Mode, Kalanki',
  salary: '15000',
  notes: 'सिक्न चाहान्छु। तालिम लिन तयार छु।'
};

// TEST CASE 4: Nwaran Specialist
const testCase4 = {
  name: 'पण्डित रामप्रसाद उपाध्याय',
  phone: '9845123456',
  address: 'पशुपति, काठमाडौं',
  age: '45',
  roles: ['न्वारन / पण्डित सेवा'],
  experience: '5+ वर्ष',
  cooking: 'No',
  shift: 'Evening',
  citizenship: 'Yes',
  area: 'All over Kathmandu Valley',
  salary: '5000 per ceremony',
  notes: 'सम्पूर्ण धार्मिक विधि अनुसार न्वारन गराउँछु।'
};

// TEST CASE 5: Night Shift Baby Care
const testCase5 = {
  name: 'सरिता गुरुङ',
  phone: '9867891234',
  address: 'चाबहिल, काठमाडौं',
  age: '35',
  roles: ['शिशु हेरचाह', 'सुत्केरी आमा र शिशुको मालिस'],
  experience: '1-3 वर्ष',
  cooking: 'Yes',
  shift: 'Night',
  citizenship: 'Yes',
  area: 'Chabahil, Boudha, Airport Area',
  salary: '22000',
  notes: 'राती शिशु हेरचाहमा अनुभवी। आमालाई आराम गर्न दिन्छु।'
};

/**
 * HOW TO USE IN BROWSER CONSOLE:
 * 
 * 1. Open the Careers page
 * 2. Click "Apply Now" on any job
 * 3. Open Browser Console (F12)
 * 4. Copy and paste this entire file
 * 5. Then run: fillForm(testCase1) or fillForm(testCase2) etc.
 */

function fillForm(data) {
  // Fill text inputs
  const inputs = {
    name: document.querySelector('input[name="name"]'),
    phone: document.querySelector('input[name="phone"]'),
    address: document.querySelector('input[name="address"]'),
    age: document.querySelector('input[name="age"]'),
    citizenship: document.querySelector('input[name="citizenship"]'),
    area: document.querySelector('input[name="area"]'),
    salary: document.querySelector('input[name="salary"]'),
    notes: document.querySelector('textarea[name="notes"]')
  };

  Object.keys(inputs).forEach(key => {
    if (inputs[key] && data[key]) {
      inputs[key].value = data[key];
      inputs[key].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[key].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Fill select dropdowns
  const selects = {
    experience: document.querySelector('select[name="experience"]'),
    cooking: document.querySelector('select[name="cooking"]'),
    shift: document.querySelector('select[name="shift"]')
  };

  Object.keys(selects).forEach(key => {
    if (selects[key] && data[key]) {
      selects[key].value = data[key];
      selects[key].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  console.log('✅ Form filled with:', data.name);
  console.log('📋 Roles selected:', data.roles);
  console.log('⚠️ Note: Roles need to be clicked manually in Step 2');
}

// Export for reference
console.log('📝 Available test cases:');
console.log('- testCase1: Experienced Massage Specialist');
console.log('- testCase2: Multi-role Worker');
console.log('- testCase3: Beginner/Trainee');
console.log('- testCase4: Nwaran Specialist');
console.log('- testCase5: Night Shift Baby Care');
console.log('\nUsage: fillForm(testCase1)');
