// server/src/services/matchingService.js
import { 
  getAvailableProfessionals,
  getConflictingBookings,
  assignProfessionalToBooking,
  calculateDistance,
  getProfessionalById
} from '../config/supabase.js';

/**
 * AI-powered matching algorithm to find the best professional for a booking
 * 
 * Scoring Algorithm (out of 100 points):
 * - Distance: 40 points (closer is better)
 * - Rating: 30 points (higher rating is better)
 * - Experience: 20 points (more years is better)
 * - Workload: 10 points (fewer active bookings is better)
 * 
 * @param {Object} bookingData - Booking details
 * @returns {Object} Matching result with professional and alternatives
 */
export const matchProfessional = async (bookingData) => {
  try {
    const { serviceType, latitude, longitude, bookingDate } = bookingData;

    console.log(`🔍 Matching professional for ${serviceType} at (${latitude}, ${longitude})`);

    // Step 1: Get available professionals within Kathmandu Valley (15km radius)
    const availablePros = await getAvailableProfessionals(
      serviceType,
      latitude,
      longitude,
      15 // 15km radius covers entire Kathmandu Valley
    );

    if (availablePros.length === 0) {
      return {
        success: false,
        message: 'No available professionals found in your area. Please try expanding your search or contact support.',
        messageNepali: 'तपाईंको क्षेत्रमा कुनै उपलब्ध पेशेवरहरू फेला परेनन्। कृपया आफ्नो खोज विस्तार गर्नुहोस् वा समर्थनमा सम्पर्क गर्नुहोस्।'
      };
    }

    console.log(`✅ Found ${availablePros.length} available professionals`);

    // Step 2: Check for booking conflicts on the requested date
    const dateStr = new Date(bookingDate).toISOString().split('T')[0];
    const conflictChecks = await Promise.all(
      availablePros.map(async (pro) => {
        const conflicts = await getConflictingBookings(pro.id, dateStr);
        return {
          proId: pro.id,
          hasConflict: conflicts.length > 0
        };
      })
    );

    // Filter out busy professionals
    const busyProIds = new Set(
      conflictChecks
        .filter(check => check.hasConflict)
        .map(check => check.proId)
    );

    const freePros = availablePros.filter(p => !busyProIds.has(p.id));

    if (freePros.length === 0) {
      return {
        success: false,
        message: 'All professionals are booked on this date. Please choose another date or contact us for assistance.',
        messageNepali: 'यस मितिमा सबै पेशेवरहरू बुक छन्। कृपया अर्को मिति छान्नुहोस् वा सहयोगको लागि हामीलाई सम्पर्क गर्नुहोस्।',
        availableDates: getNextAvailableDates(bookingDate)
      };
    }

    console.log(`✅ ${freePros.length} professionals free on ${dateStr}`);

    // Step 3: Score each professional using AI algorithm
    const scoredPros = freePros.map(pro => {
      const distance = calculateDistance(
        latitude,
        longitude,
        pro.latitude,
        pro.longitude
      );

      // Scoring algorithm (max 100 points)
      let score = 0;
      let scoreBreakdown = {};

      // Distance score (40 points max) - Proximity is crucial
      if (distance <= 2) {
        score += 40;
        scoreBreakdown.distance = { points: 40, reason: 'Very close (< 2km)' };
      } else if (distance <= 5) {
        score += 30;
        scoreBreakdown.distance = { points: 30, reason: 'Close (2-5km)' };
      } else if (distance <= 10) {
        score += 20;
        scoreBreakdown.distance = { points: 20, reason: 'Moderate (5-10km)' };
      } else {
        score += 10;
        scoreBreakdown.distance = { points: 10, reason: 'Far (10-15km)' };
      }

      // Rating score (30 points max) - Quality of service
      const ratingScore = (pro.rating / 5) * 30;
      score += ratingScore;
      scoreBreakdown.rating = { 
        points: Math.round(ratingScore), 
        reason: `Rating: ${pro.rating}/5.0` 
      };

      // Experience score (20 points max) - Years of experience
      const expYears = pro.experience_years || 0;
      let expScore = 0;
      if (expYears >= 10) {
        expScore = 20;
        scoreBreakdown.experience = { points: 20, reason: '10+ years expert' };
      } else if (expYears >= 5) {
        expScore = 15;
        scoreBreakdown.experience = { points: 15, reason: '5-10 years experienced' };
      } else if (expYears >= 2) {
        expScore = 10;
        scoreBreakdown.experience = { points: 10, reason: '2-5 years' };
      } else {
        expScore = 5;
        scoreBreakdown.experience = { points: 5, reason: 'Less than 2 years' };
      }
      score += expScore;

      // Workload score (10 points max) - Based on total reviews as proxy
      // More reviews = more experience but potentially busier
      // Optimal balance: 20-50 reviews
      const totalReviews = pro.total_reviews || 0;
      let workloadScore = 10;
      if (totalReviews >= 50) {
        workloadScore = 8; // Very busy but experienced
        scoreBreakdown.workload = { points: 8, reason: 'Very experienced (50+ reviews)' };
      } else if (totalReviews >= 20) {
        workloadScore = 10; // Perfect balance
        scoreBreakdown.workload = { points: 10, reason: 'Optimal experience (20-50 reviews)' };
      } else if (totalReviews >= 10) {
        workloadScore = 9;
        scoreBreakdown.workload = { points: 9, reason: 'Good experience (10-20 reviews)' };
      } else {
        workloadScore = 7; // New but available
        scoreBreakdown.workload = { points: 7, reason: 'Newer professional' };
      }
      score += workloadScore;

      // Bonus points for multiple specializations (versatile)
      if (pro.specialization && pro.specialization.length > 1) {
        score += 5;
        scoreBreakdown.versatility = { points: 5, reason: 'Multiple specializations' };
      }

      return {
        ...pro,
        distance: parseFloat(distance.toFixed(2)),
        matchScore: Math.round(score),
        scoreBreakdown,
        matchReason: getMatchReason(scoreBreakdown, distance)
      };
    });

    // Step 4: Sort by score (highest first)
    scoredPros.sort((a, b) => b.matchScore - a.matchScore);

    // Get best match and alternatives
    const bestMatch = scoredPros[0];
    const alternatives = scoredPros.slice(1, 4); // Top 3 alternatives

    console.log(`✅ Best match: ${bestMatch.full_name} (Score: ${bestMatch.matchScore}/100)`);

    return {
      success: true,
      professional: bestMatch,
      alternatives,
      message: `Best match found: ${bestMatch.full_name} (${bestMatch.distance}km away)`,
      messageNepali: `उत्तम मिलान फेला पर्यो: ${bestMatch.full_name} (${bestMatch.distance}km टाढा)`,
      matchQuality: getMatchQuality(bestMatch.matchScore)
    };

  } catch (error) {
    console.error('❌ Matching error:', error);
    return {
      success: false,
      message: 'Failed to match professional. Please try again or contact support.',
      messageNepali: 'पेशेवर मिलाउन असफल। कृपया पुन: प्रयास गर्नुहोस् वा समर्थनमा सम्पर्क गर्नुहोस्।',
      error: error.message
    };
  }
};

/**
 * Auto-assign professional to a booking
 * 
 * @param {string} bookingId - Booking ID
 * @returns {Object} Assignment result
 */
export const autoAssignProfessional = async (bookingId) => {
  try {
    console.log(`🤖 Auto-assigning professional to booking: ${bookingId}`);

    // Import here to avoid circular dependency
    const { getBookingById } = await import('../config/supabase.js');
    
    // Get booking details
    const booking = await getBookingById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.employee_id) {
      return {
        success: false,
        message: 'Booking already has a professional assigned',
        messageNepali: 'बुकिङमा पहिले नै पेशेवर नियुक्त गरिएको छ'
      };
    }

    // Find best match
    const matchResult = await matchProfessional({
      serviceType: booking.service_type,
      latitude: booking.latitude,
      longitude: booking.longitude,
      bookingDate: booking.booking_date
    });

    if (!matchResult.success) {
      return matchResult;
    }

    // Assign professional to booking
    const updatedBooking = await assignProfessionalToBooking(
      bookingId,
      matchResult.professional.id
    );

    if (!updatedBooking) {
      throw new Error('Failed to assign professional');
    }

    console.log(`✅ Professional assigned successfully`);

    return {
      success: true,
      booking: updatedBooking,
      professional: matchResult.professional,
      message: `Professional ${matchResult.professional.full_name} assigned successfully`,
      messageNepali: `पेशेवर ${matchResult.professional.full_name} सफलतापूर्वक नियुक्त गरियो`,
      matchScore: matchResult.professional.matchScore,
      matchQuality: matchResult.matchQuality
    };

  } catch (error) {
    console.error('❌ Auto-assign error:', error);
    return {
      success: false,
      message: 'Failed to auto-assign professional. Please try manual assignment.',
      messageNepali: 'पेशेवर स्वचालित रूपमा नियुक्त गर्न असफल। कृपया म्यानुअल नियुक्ति प्रयास गर्नुहोस्।',
      error: error.message
    };
  }
};

/**
 * Manual professional assignment (for admin)
 * 
 * @param {string} bookingId - Booking ID
 * @param {string} professionalId - Professional ID
 * @returns {Object} Assignment result
 */
export const manualAssignProfessional = async (bookingId, professionalId) => {
  try {
    console.log(`👤 Manual assignment: Booking ${bookingId} → Professional ${professionalId}`);

    // Check if professional exists and is available
    const professional = await getProfessionalById(professionalId);
    
    if (!professional) {
      return {
        success: false,
        message: 'Professional not found',
        messageNepali: 'पेशेवर फेला परेन'
      };
    }

    if (professional.verification_status !== 'verified') {
      return {
        success: false,
        message: 'Professional is not verified',
        messageNepali: 'पेशेवर प्रमाणित छैन'
      };
    }

    if (professional.availability_status !== 'available') {
      return {
        success: false,
        message: 'Professional is not available',
        messageNepali: 'पेशेवर उपलब्ध छैन'
      };
    }

    // Assign professional
    const updatedBooking = await assignProfessionalToBooking(bookingId, professionalId);

    if (!updatedBooking) {
      throw new Error('Failed to assign professional');
    }

    console.log(`✅ Manual assignment successful`);

    return {
      success: true,
      booking: updatedBooking,
      professional,
      message: `Professional ${professional.full_name} assigned successfully`,
      messageNepali: `पेशेवर ${professional.full_name} सफलतापूर्वक नियुक्त गरियो`
    };

  } catch (error) {
    console.error('❌ Manual assign error:', error);
    return {
      success: false,
      message: 'Failed to assign professional',
      messageNepali: 'पेशेवर नियुक्त गर्न असफल',
      error: error.message
    };
  }
};

/**
 * Get match reason in human-readable format
 */
const getMatchReason = (scoreBreakdown, distance) => {
  const reasons = [];
  
  if (distance <= 3) {
    reasons.push('Very close to your location');
  }
  
  if (scoreBreakdown.rating && scoreBreakdown.rating.points >= 25) {
    reasons.push('Highly rated professional');
  }
  
  if (scoreBreakdown.experience && scoreBreakdown.experience.points >= 15) {
    reasons.push('Experienced professional');
  }
  
  if (scoreBreakdown.versatility) {
    reasons.push('Offers multiple services');
  }
  
  return reasons.join(' • ');
};

/**
 * Get match quality description
 */
const getMatchQuality = (score) => {
  if (score >= 85) {
    return {
      quality: 'excellent',
      label: 'Excellent Match',
      labelNepali: 'उत्कृष्ट मिलान',
      color: 'green'
    };
  } else if (score >= 70) {
    return {
      quality: 'very_good',
      label: 'Very Good Match',
      labelNepali: 'धेरै राम्रो मिलान',
      color: 'blue'
    };
  } else if (score >= 55) {
    return {
      quality: 'good',
      label: 'Good Match',
      labelNepali: 'राम्रो मिलान',
      color: 'yellow'
    };
  } else {
    return {
      quality: 'fair',
      label: 'Fair Match',
      labelNepali: 'उचित मिलान',
      color: 'orange'
    };
  }
};

/**
 * Get next available dates (helper function)
 */
const getNextAvailableDates = (currentDate) => {
  const dates = [];
  const date = new Date(currentDate);
  
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + i);
    dates.push(nextDate.toISOString().split('T')[0]);
  }
  
  return dates;
};

/**
 * Get professionals by service type (for search/filter)
 */
export const searchProfessionals = async (filters = {}) => {
  try {
    const {
      serviceType,
      latitude,
      longitude,
      maxDistance = 15,
      minRating = 0,
      minExperience = 0
    } = filters;

    let professionals = await getAvailableProfessionals(
      serviceType,
      latitude || 27.7172, // Default Kathmandu
      longitude || 85.3240,
      maxDistance
    );

    // Apply additional filters
    professionals = professionals.filter(pro => {
      if (minRating && pro.rating < minRating) return false;
      if (minExperience && pro.experience_years < minExperience) return false;
      return true;
    });

    // Add distance to each professional
    professionals = professionals.map(pro => ({
      ...pro,
      distance: calculateDistance(
        latitude || 27.7172,
        longitude || 85.3240,
        pro.latitude,
        pro.longitude
      ).toFixed(2)
    }));

    // Sort by rating then distance
    professionals.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.distance - b.distance;
    });

    return {
      success: true,
      professionals,
      count: professionals.length
    };

  } catch (error) {
    console.error('Search professionals error:', error);
    return {
      success: false,
      professionals: [],
      count: 0,
      error: error.message
    };
  }
};

export default {
  matchProfessional,
  autoAssignProfessional,
  manualAssignProfessional,
  searchProfessionals
};