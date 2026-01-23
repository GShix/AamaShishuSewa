// client/src/components/common/ServiceReviews.jsx
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { userAPI } from '../../utils/api';

const ServiceReviews = ({ serviceId, language = 'ne' }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [serviceId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getReviews({ 
        service_id: serviceId,
        limit: 10,
        status: 'approved'
      });
      
      setReviews(response.data.reviews || []);
      
      // Calculate stats
      const total = response.data.reviews?.length || 0;
      if (total > 0) {
        const sum = response.data.reviews.reduce((acc, r) => acc + parseFloat(r.rating), 0);
        const avg = sum / total;
        
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        response.data.reviews.forEach(r => {
          const rating = Math.floor(parseFloat(r.rating));
          dist[rating] = (dist[rating] || 0) + 1;
        });

        setStats({
          avgRating: avg,
          totalReviews: total,
          distribution: dist
        });
      }
    } catch (error) {
      console.error('Fetch reviews error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, size = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getProgressBarWidth = (count) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const t = {
    ne: {
      reviews: 'समीक्षाहरू',
      noReviews: 'अहिलेसम्म कुनै समीक्षा छैन',
      beFirst: 'पहिलो समीक्षा लेख्नुहोस्!',
      basedOn: 'आधारमा',
      ratings: 'रेटिङहरू',
      verified: 'प्रमाणित खरीद',
      helpful: 'सहयोगी',
      response: 'प्रतिक्रिया'
    },
    en: {
      reviews: 'Reviews',
      noReviews: 'No reviews yet',
      beFirst: 'Be the first to review!',
      basedOn: 'Based on',
      ratings: 'ratings',
      verified: 'Verified Booking',
      helpful: 'Helpful',
      response: 'Response'
    }
  };

  const text = t[language] || t.en;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Average Rating */}
          <div className="text-center sm:border-r sm:border-yellow-200 sm:pr-6">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {stats.avgRating.toFixed(1)}
            </div>
            {renderStars(Math.round(stats.avgRating), 'lg')}
            <div className="text-sm text-gray-600 mt-2">
              {text.basedOn} {stats.totalReviews} {text.ratings}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {rating} ⭐
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${getProgressBarWidth(stats.distribution[rating])}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {stats.distribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">{text.reviews}</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">{text.noReviews}</p>
            <p className="text-gray-400 text-sm mt-1">{text.beFirst}</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white font-bold">
                    {review.users?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.users?.full_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Badge */}
                {review.is_verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                    ✓ {text.verified}
                  </span>
                )}
              </div>

              {/* Review Text */}
              {review.review_text && (
                <p className="text-gray-700 leading-relaxed mb-3">
                  {review.review_text}
                </p>
              )}

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Admin/Employee Response */}
              {review.response_text && (
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        {text.response}:
                      </p>
                      <p className="text-sm text-blue-800">
                        {review.response_text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Helpful Button */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                <button className="text-sm text-gray-600 hover:text-rose-600 flex items-center gap-1 transition">
                  <ThumbsUp className="w-4 h-4" />
                  {text.helpful} ({review.helpful_count || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceReviews;
