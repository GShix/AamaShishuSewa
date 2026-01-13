// server/src/services/carePlanService.js
import OpenAI from 'openai';
import { getBookingById, createCarePlan, getCarePlan } from '../config/supabase.js';

// Initialize OpenAI (only if API key is available)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * Generate personalized care plan for postpartum mother
 * 
 * @param {string} bookingId - Booking ID
 * @param {string} language - 'ne' or 'en'
 * @returns {Object} Care plan result
 */
export const generateCarePlan = async (bookingId, language = 'ne') => {
  try {
    console.log(`🤖 Generating care plan for booking: ${bookingId}`);

    // Check if care plan already exists
    const existingPlan = await getCarePlan(bookingId);
    if (existingPlan) {
      console.log('✅ Care plan already exists');
      return {
        success: true,
        carePlan: JSON.parse(existingPlan.plan_content),
        message: 'Care plan already generated',
        isNew: false
      };
    }

    // Get booking details
    const booking = await getBookingById(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    const user = booking.users;
    const nwaranDetails = booking.nwaran_details?.[0];

    // If OpenAI is not configured, return template care plan
    if (!openai) {
      console.log('⚠️  OpenAI not configured, using template care plan');
      const templatePlan = getTemplatCarePlan(booking, nwaranDetails, language);
      
      // Save template plan
      await createCarePlan(bookingId, {
        planContent: JSON.stringify(templatePlan),
        dietRecommendations: templatePlan.nepali.dietPlan,
        mentalHealthTips: templatePlan.nepali.mentalHealth,
        culturalPractices: templatePlan.nepali.culturalPractices,
        generatedBy: 'template',
        language
      });

      return {
        success: true,
        carePlan: templatePlan,
        message: 'Care plan generated successfully (template)',
        isNew: true
      };
    }

    // Build context for AI
    const context = buildCarePlanContext(booking, user, nwaranDetails, language);

    // Generate care plan using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(language)
        },
        {
          role: "user",
          content: context
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    const carePlanText = completion.choices[0].message.content;
    let carePlanData;

    try {
      // Try to parse JSON response
      carePlanData = JSON.parse(carePlanText);
    } catch (parseError) {
      console.error('Failed to parse AI response, using cleaned version');
      // Clean and parse
      const cleaned = carePlanText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      carePlanData = JSON.parse(cleaned);
    }

    // Save to database
    await createCarePlan(bookingId, {
      planContent: JSON.stringify(carePlanData),
      dietRecommendations: carePlanData.nepali?.dietPlan || carePlanData.english?.dietPlan,
      exerciseSuggestions: carePlanData.nepali?.exerciseSuggestions || carePlanData.english?.exerciseSuggestions,
      mentalHealthTips: carePlanData.nepali?.mentalHealth || carePlanData.english?.mentalHealth,
      culturalPractices: carePlanData.nepali?.culturalPractices || carePlanData.english?.culturalPractices,
      massageSchedule: carePlanData.nepali?.massageBenefits || carePlanData.english?.massageBenefits,
      generatedBy: 'ai',
      language
    });

    console.log('✅ Care plan generated and saved');

    return {
      success: true,
      carePlan: carePlanData,
      message: 'Care plan generated successfully',
      isNew: true
    };

  } catch (error) {
    console.error('❌ Care plan generation error:', error);
    
    // Fallback to template if AI fails
    try {
      const booking = await getBookingById(bookingId);
      const nwaranDetails = booking?.nwaran_details?.[0];
      const templatePlan = getTemplatCarePlan(booking, nwaranDetails, language);
      
      await createCarePlan(bookingId, {
        planContent: JSON.stringify(templatePlan),
        dietRecommendations: templatePlan.nepali.dietPlan,
        mentalHealthTips: templatePlan.nepali.mentalHealth,
        culturalPractices: templatePlan.nepali.culturalPractices,
        generatedBy: 'template_fallback',
        language
      });

      return {
        success: true,
        carePlan: templatePlan,
        message: 'Care plan generated (fallback template)',
        isNew: true
      };
    } catch (fallbackError) {
      return {
        success: false,
        message: 'Failed to generate care plan',
        error: error.message
      };
    }
  }
};

/**
 * Generate WhatsApp notification in Nepali
 * 
 * @param {string} bookingId - Booking ID
 * @param {string} notificationType - 'new_booking', 'booking_confirmed', 'reminder'
 * @returns {Object} Notification result
 */
export const generateNotification = async (bookingId, notificationType) => {
  try {
    console.log(`📱 Generating ${notificationType} notification for booking: ${bookingId}`);

    const booking = await getBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const professional = booking.professionals;
    const client = booking.users;

    // Use template notifications if OpenAI not available
    if (!openai) {
      const templateNotif = getTemplateNotification(
        booking,
        client,
        professional,
        notificationType
      );
      return {
        success: true,
        messages: templateNotif
      };
    }

    const context = buildNotificationContext(
      booking,
      client,
      professional,
      notificationType
    );

    // Generate notification using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates professional, culturally appropriate WhatsApp notifications in Nepali for a maternal care service. Be warm, respectful, and clear."
        },
        {
          role: "user",
          content: context
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    const messageNepali = completion.choices[0].message.content.trim();

    // Generate English version
    const englishCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Translate this Nepali WhatsApp notification to English while maintaining professionalism and warmth."
        },
        {
          role: "user",
          content: messageNepali
        }
      ],
      temperature: 0.5,
      max_tokens: 300
    });

    const messageEnglish = englishCompletion.choices[0].message.content.trim();

    console.log('✅ Notification generated');

    return {
      success: true,
      messages: {
        nepali: messageNepali,
        english: messageEnglish
      }
    };

  } catch (error) {
    console.error('❌ Notification generation error:', error);
    
    // Fallback to template
    try {
      const booking = await getBookingById(bookingId);
      const professional = booking?.professionals;
      const client = booking?.users;
      
      const templateNotif = getTemplateNotification(
        booking,
        client,
        professional,
        notificationType
      );
      
      return {
        success: true,
        messages: templateNotif
      };
    } catch (fallbackError) {
      return {
        success: false,
        message: 'Failed to generate notification',
        error: error.message
      };
    }
  }
};

/**
 * Generate Nwaran ceremony suggestions based on astrology
 * 
 * @param {Object} nwaranDetails - Baby birth details
 * @returns {Object} Nwaran suggestions
 */
export const generateNwaranSuggestions = async (nwaranDetails) => {
  try {
    console.log('🕉️ Generating Nwaran suggestions');

    const { baby_birth_date, baby_birth_time, baby_gender, parents_gotra } = nwaranDetails;

    // Use template if OpenAI not available
    if (!openai) {
      const templateSuggestions = getTemplateNwaranSuggestions(nwaranDetails);
      return {
        success: true,
        suggestions: templateSuggestions,
        message: 'Nwaran suggestions generated (template)'
      };
    }

    const context = `
You are a Hindu priest and astrologer expert in Nwaran (नामकरण) ceremonies.

Baby Details:
- Birth Date: ${baby_birth_date}
- Birth Time: ${baby_birth_time || 'Not provided'}
- Gender: ${baby_gender}
- Parents' Gotra: ${parents_gotra || 'Not provided'}

Generate:
1. 5 auspicious name suggestions based on common naming traditions
2. General recommendations for the ceremony
3. Auspicious muhurat suggestions (morning ceremonies are usually preferred)
4. Traditional rituals to be performed
5. Items needed for the ceremony

Respond in JSON format with both Nepali and English:
{
  "nepali": {
    "nameSuggestions": ["नाम1", "नाम2", ...],
    "ceremonyDate": "सुझाव",
    "muhurat": "शुभ समय",
    "rituals": "परम्परागत विधिहरू",
    "itemsNeeded": "आवश्यक वस्तुहरू"
  },
  "english": {
    "nameSuggestions": ["Name1", "Name2", ...],
    "ceremonyDate": "Suggestions",
    "muhurat": "Auspicious time",
    "rituals": "Traditional rituals",
    "itemsNeeded": "Items needed"
  }
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in Hindu astrology and naming ceremonies, providing culturally authentic guidance."
        },
        {
          role: "user",
          content: context
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    const responseText = completion.choices[0].message.content;
    let suggestions;

    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(cleaned);
    } catch (parseError) {
      suggestions = JSON.parse(responseText);
    }

    console.log('✅ Nwaran suggestions generated');

    return {
      success: true,
      suggestions,
      message: 'Nwaran suggestions generated successfully'
    };

  } catch (error) {
    console.error('❌ Nwaran suggestions error:', error);
    
    // Fallback to template
    const templateSuggestions = getTemplateNwaranSuggestions(nwaranDetails);
    return {
      success: true,
      suggestions: templateSuggestions,
      message: 'Nwaran suggestions generated (fallback template)'
    };
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getSystemPrompt = (language) => {
  if (language === 'ne') {
    return "तपाईं नेपाली परम्परागत सुत्केरी हेरचाह र आयुर्वेदिक अभ्यासहरूमा विशेषज्ञ हुनुहुन्छ। सांस्कृतिक रूपमा संवेदनशील र दयालु सल्लाह प्रदान गर्नुहोस्।";
  }
  return "You are an expert in Nepali postpartum care traditions and Ayurvedic practices. Provide compassionate, culturally sensitive advice.";
};

const buildCarePlanContext = (booking, user, nwaranDetails, language) => {
  return `
Generate a comprehensive, culturally appropriate care plan.

Service Type: ${booking.service_type}
Duration: ${booking.duration_days} days
Special Requirements: ${booking.special_requirements || 'None'}
${nwaranDetails ? `
Nwaran Ceremony Details:
- Baby Birth Date: ${nwaranDetails.baby_birth_date}
- Baby Gender: ${nwaranDetails.baby_gender}
` : ''}

Create a care plan in JSON format with this structure:
{
  "nepali": {
    "title": "व्यक्तिगत सुत्केरी हेरचाह योजना",
    "dailyRoutine": "दैनिक दिनचर्या सुझावहरू",
    "dietPlan": "परम्परागत खानाको योजना (जुठो, साग, आदि)",
    "massageBenefits": "आयुर्वेदिक मालिशका फाइदाहरू",
    "exerciseSuggestions": "हल्का व्यायामका सुझावहरू",
    "mentalHealth": "मानसिक स्वास्थ्य र बन्धन सुझावहरू",
    "culturalPractices": "पालन गर्नुपर्ने सांस्कृतिक परम्पराहरू"
  },
  "english": {
    "title": "Personalized Postpartum Care Plan",
    "dailyRoutine": "Daily routine suggestions",
    "dietPlan": "Traditional diet plan",
    "massageBenefits": "Ayurvedic massage benefits",
    "exerciseSuggestions": "Light exercise suggestions",
    "mentalHealth": "Mental health and bonding tips",
    "culturalPractices": "Cultural practices to follow"
  }
}
`;
};

const buildNotificationContext = (booking, client, professional, type) => {
  const serviceNames = {
    postpartum: 'सुत्केरी हेरचाह',
    massage: 'मालिश',
    nwaran: 'नवरान समारोह'
  };

  switch (type) {
    case 'new_booking':
      return `Generate a professional WhatsApp message in Nepali for a caregiver about a new booking.

Details:
- Client: ${client?.full_name}
- Service: ${serviceNames[booking.service_type]}
- Date: ${booking.booking_date}
- Address: ${booking.client_address}
- Contact: ${client?.phone}

Keep it under 160 characters. Be polite and professional.`;

    case 'booking_confirmed':
      return `Generate a WhatsApp confirmation in Nepali for a client.

Details:
- Professional: ${professional?.full_name}
- Service: ${serviceNames[booking.service_type]}
- Date: ${booking.booking_date}
- Contact: ${professional?.phone}

Include reassurance and next steps.`;

    case 'reminder':
      return `Generate a friendly reminder in Nepali for tomorrow's appointment.

Details:
- Service: ${serviceNames[booking.service_type]}
- Professional: ${professional?.full_name}

Keep it warm and remind about any preparations.`;

    default:
      return '';
  }
};

// ============================================================================
// TEMPLATE FUNCTIONS (Fallbacks when OpenAI is not available)
// ============================================================================

const getTemplatCarePlan = (booking, nwaranDetails, language) => {
  return {
    nepali: {
      title: "व्यक्तिगत सुत्केरी हेरचाह योजना",
      dailyRoutine: "सुत्केरी अवधिमा पर्याप्त आराम गर्नुहोस्। दिनको ६-८ घण्टा निद्रा र २-३ घण्टाको आराम आवश्यक छ। हल्का घरायसी काम मात्र गर्नुहोस्।",
      dietPlan: "परम्परागत जुठो (घ्यू, मसला, आदि), पौष्टिक साग, दाल, भात र दुध उत्पादनहरू खानुहोस्। चिसो र बासी खाना नखानुहोस्। न्यानो पानी मात्र पिउनुहोस्।",
      massageBenefits: "दैनिक तेल मालिशले शरीरको दुखाइ कम गर्छ, रक्त संचार सुधार गर्छ र आराम दिन्छ। तातो तेलले मालिश गर्दा शरीर बलियो हुन्छ।",
      exerciseSuggestions: "पहिलो हप्ता पूर्ण आराम गर्नुहोस्। दोस्रो हप्ताबाट हल्का हिड्न सुरु गर्नुहोस्। तेस्रो हप्ताबाट योग सुरु गर्न सक्नुहुन्छ।",
      mentalHealth: "परिवारसँग समय बिताउनुहोस्। शिशुसँग बन्धन बनाउनुहोस्। आफ्नो भावना साझा गर्नुहोस्। तनाव भएमा सल्लाह लिनुहोस्।",
      culturalPractices: "नुहाउने पानी तातो राख्नुहोस्। चिसो हावाबाट बच्नुहोस्। छैटौं दिनमा छैठी पूजा गर्नुहोस्। नवौं दिनमा नौकर्म संस्कार गर्नुहोस्।"
    },
    english: {
      title: "Personalized Postpartum Care Plan",
      dailyRoutine: "Get adequate rest during postpartum period. 6-8 hours of sleep and 2-3 hours of rest daily are essential. Do only light household work.",
      dietPlan: "Eat traditional jutho (ghee, spices), nutritious vegetables, lentils, rice and dairy products. Avoid cold and stale food. Drink only warm water.",
      massageBenefits: "Daily oil massage reduces body pain, improves blood circulation and provides relaxation. Massage with warm oil strengthens the body.",
      exerciseSuggestions: "Complete rest for the first week. Start light walking from second week. Can begin yoga from third week onwards.",
      mentalHealth: "Spend time with family. Bond with your baby. Share your feelings. Seek counseling if stressed.",
      culturalPractices: "Keep bathing water warm. Avoid cold air. Perform Chhaithi puja on 6th day. Perform Naukarm sanskar on 9th day."
    }
  };
};

const getTemplateNotification = (booking, client, professional, type) => {
  const notifications = {
    new_booking: {
      nepali: `नमस्ते ${professional?.full_name}, तपाईंलाई नयाँ ${booking.service_type} सेवाको अनुरोध आएको छ। मिति: ${booking.booking_date}। ग्राहक: ${client?.full_name}, फोन: ${client?.phone}। कृपया शीघ्र पुष्टि गर्नुहोस्। - आमा शिशु सेवा`,
      english: `Hello ${professional?.full_name}, you have a new ${booking.service_type} service request. Date: ${booking.booking_date}. Client: ${client?.full_name}, Phone: ${client?.phone}. Please confirm soon. - Aama Sisu Seva`
    },
    booking_confirmed: {
      nepali: `नमस्ते ${client?.full_name}, तपाईंको बुकिङ पुष्टि भयो। पेशेवर: ${professional?.full_name}, फोन: ${professional?.phone}। मिति: ${booking.booking_date}। हामी चाँडै सम्पर्कमा हुनेछौं। - आमा शिशु सेवा`,
      english: `Hello ${client?.full_name}, your booking is confirmed. Professional: ${professional?.full_name}, Phone: ${professional?.phone}. Date: ${booking.booking_date}. We will be in touch soon. - Aama Sisu Seva`
    },
    reminder: {
      nepali: `नमस्ते, भोलि तपाईंको ${booking.service_type} सेवाको समय हो। पेशेवर ${professional?.full_name} बिहान आउनुहुनेछ। कृपया तयार रहनुहोस्। - आमा शिशु सेवा`,
      english: `Hello, your ${booking.service_type} service is scheduled for tomorrow. Professional ${professional?.full_name} will arrive in the morning. Please be ready. - Aama Sisu Seva`
    }
  };

  return notifications[type] || notifications.new_booking;
};

const getTemplateNwaranSuggestions = (details) => {
  const maleNames = ['अर्जुन', 'विक्रम', 'राज', 'आदित्य', 'दिव्यांश'];
  const femaleNames = ['आस्था', 'अनिका', 'सारा', 'दिया', 'प्रिया'];
  const names = details.baby_gender === 'male' ? maleNames : femaleNames;

  return {
    nepali: {
      nameSuggestions: names,
      ceremonyDate: "जन्मको ९ औं दिनमा नवरान गर्ने परम्परा छ",
      muhurat: "बिहान ६ बजेदेखि ८ बजेको बीचमा शुभ हुन्छ",
      rituals: "पूजा गर्ने, पुरोहित बोलाउने, नाम राख्ने, आशीर्वाद लिने",
      itemsNeeded: "पूजाका सामग्री, फूल, फल, मिठाई, दक्षिणा"
    },
    english: {
      nameSuggestions: names,
      ceremonyDate: "Traditionally performed on the 9th day after birth",
      muhurat: "Auspicious between 6 AM to 8 AM",
      rituals: "Perform puja, invite priest, name the baby, receive blessings",
      itemsNeeded: "Puja items, flowers, fruits, sweets, dakshina"
    }
  };
};

export default {
  generateCarePlan,
  generateNotification,
  generateNwaranSuggestions
};