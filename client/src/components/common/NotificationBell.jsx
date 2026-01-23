// client/src/components/common/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { userAPI } from '../../utils/api';

const NotificationBell = ({ language = 'ne' }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await userAPI.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Fetch unread count error:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getNotifications({ limit: 10 });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await userAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await userAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await userAPI.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return language === 'ne' ? 'अहिले' : 'just now';
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return language === 'ne' ? `${mins} मिनेट अघि` : `${mins}m ago`;
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return language === 'ne' ? `${hours} घण्टा अघि` : `${hours}h ago`;
    }
    const days = Math.floor(seconds / 86400);
    return language === 'ne' ? `${days} दिन अघि` : `${days}d ago`;
  };

  const t = {
    ne: {
      notifications: 'सूचनाहरू',
      markAllRead: 'सबै पढिएको चिन्ह लगाउनुहोस्',
      noNotifications: 'कुनै सूचना छैन',
      viewAll: 'सबै हेर्नुहोस्'
    },
    en: {
      notifications: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No notifications',
      viewAll: 'View all'
    }
  };

  const text = t[language] || t.en;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">{text.notifications}</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                {text.markAllRead}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>{text.noNotifications}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 inline-block">
                          {getTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex gap-1">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Navigate to notifications page
                  window.location.href = '/dashboard?tab=notifications';
                }}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium"
              >
                {text.viewAll} →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
