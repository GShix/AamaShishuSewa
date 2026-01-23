// client/src/components/user/ReviewModal.jsx
import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { userAPI } from '../../utils/api';

const ReviewModal = ({ booking, onClose, onSuccess, language = 'ne' }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert(language === 'ne' ? 'कृपया रेटिङ दिनुहोस्' : 'Please provide a rating');
      return;
    }

    try {
      setSubmitting(true);
      
      await userAPI.createReview({
        booking_id: booking.id,
        rating: rating,
        review_text: reviewText || null
      });

      alert(language === 'ne' 
        ? 'समीक्षा सफलतापूर्वक पेश गरियो! प्रशासकले यसलाई चाँडै स्वीकृत गर्नेछन्।'
        : 'Review submitted successfully! Admin will approve it soon.');
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Submit review error:', error);
      alert(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const t = {
    ne: {
      title: 'समीक्षा लेख्नुहोस्',
      rating: 'तपाईंको रेटिङ',
      reviewLabel: 'तपाईंको अनुभव साझा गर्नुहोस्',
      reviewPlaceholder: 'सेवा कस्तो थियो? पेशेवर कत्तिको मिलनसार थिए? (वैकल्पिक)',
      submit: 'समीक्षा पेश गर्नुहोस्',
      cancel: 'रद्द गर्नुहोस्',
      service: 'सेवा',
      date: 'मिति'
    },
    en: {
      title: 'Write a Review',
      rating: 'Your Rating',
      reviewLabel: 'Share Your Experience',
      reviewPlaceholder: 'How was the service? How professional was the staff? (Optional)',
      submit: 'Submit Review',
      cancel: 'Cancel',
      service: 'Service',
      date: 'Date'
    }
  };

  const text = t[language] || t.en;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-orange-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">{text.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Booking Info */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{text.service}:</span>
              <span className="font-semibold">{booking.service_type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{text.date}:</span>
              <span className="text-sm">
                {new Date(booking.booking_date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {text.rating} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {rating}.0
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.reviewLabel}
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={text.reviewPlaceholder}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {reviewText.length} / 1000
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              {text.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? '...' : text.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
