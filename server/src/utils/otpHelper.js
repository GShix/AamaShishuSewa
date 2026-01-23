// server/src/utils/otpHelper.js
import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Store OTP in database with expiration (10 minutes)
 */
export const storeOTP = async (identifier, otp, type = 'registration') => {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete any existing OTPs for this identifier and type
    await supabaseAdmin
      .from('otp_verifications')
      .delete()
      .eq('identifier', identifier)
      .eq('type', type);

    // Insert new OTP
    const { data, error } = await supabaseAdmin
      .from('otp_verifications')
      .insert({
        identifier,
        otp,
        type,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        verified: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Store OTP error:', error);
    throw new Error('Failed to store OTP');
  }
};

/**
 * Verify OTP for a given identifier
 */
export const verifyOTP = async (identifier, otp, type = 'registration') => {
  try {
    // Find the OTP record
    const { data: otpRecord, error } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('identifier', identifier)
      .eq('type', type)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !otpRecord) {
      return {
        success: false,
        error: 'Invalid or expired OTP'
      };
    }

    // Check if OTP has expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      await deleteOTP(identifier, type);
      return {
        success: false,
        error: 'OTP has expired. Please request a new one.'
      };
    }

    // Check max attempts (5 attempts allowed)
    if (otpRecord.attempts >= 5) {
      await deleteOTP(identifier, type);
      return {
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a new OTP.'
      };
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await supabaseAdmin
        .from('otp_verifications')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      const remainingAttempts = 5 - (otpRecord.attempts + 1);
      return {
        success: false,
        error: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
      };
    }

    // Mark OTP as verified
    await supabaseAdmin
      .from('otp_verifications')
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq('id', otpRecord.id);

    return {
      success: true,
      message: 'OTP verified successfully'
    };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error: 'Failed to verify OTP'
    };
  }
};

/**
 * Delete OTP after verification or expiration
 */
export const deleteOTP = async (identifier, type = 'registration') => {
  try {
    await supabaseAdmin
      .from('otp_verifications')
      .delete()
      .eq('identifier', identifier)
      .eq('type', type);
  } catch (error) {
    console.error('Delete OTP error:', error);
  }
};

/**
 * Resend OTP (checks rate limiting - max 3 requests per 30 minutes)
 */
export const canResendOTP = async (identifier, type = 'registration') => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const { data, error } = await supabaseAdmin
      .from('otp_verifications')
      .select('id, created_at')
      .eq('identifier', identifier)
      .eq('type', type)
      .gte('created_at', thirtyMinutesAgo.toISOString());

    if (error) throw error;

    const requestCount = data?.length || 0;

    if (requestCount >= 3) {
      return {
        canResend: false,
        error: 'Too many OTP requests. Please try again later.'
      };
    }

    return {
      canResend: true,
      remainingRequests: 3 - requestCount
    };
  } catch (error) {
    console.error('Check resend OTP error:', error);
    return {
      canResend: false,
      error: 'Failed to check resend eligibility'
    };
  }
};

/**
 * Clean up expired OTPs (can be called periodically)
 */
export const cleanupExpiredOTPs = async () => {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabaseAdmin
      .from('otp_verifications')
      .delete()
      .lt('expires_at', now);

    if (error) throw error;
    console.log('✅ Expired OTPs cleaned up');
  } catch (error) {
    console.error('Cleanup expired OTPs error:', error);
  }
};

export default {
  generateOTP,
  storeOTP,
  verifyOTP,
  deleteOTP,
  canResendOTP,
  cleanupExpiredOTPs
};
