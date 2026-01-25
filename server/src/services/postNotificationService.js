// server/src/services/postNotificationService.js
import OpenAI from 'openai';
import { supabaseAdmin } from '../config/supabase.js';

// Initialize OpenAI (only if API key is available)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * Generate AI-powered notification for new post
 * @param {Object} post - Post object with title, content, category
 * @param {string} language - 'ne' or 'en'
 * @returns {Object} Notification title and message
 */
export const generatePostNotification = async (post, language = 'ne') => {
  try {
    console.log(`🤖 Generating notification for post: ${post.title}`);

    // If OpenAI is not configured, use template
    if (!openai) {
      return getTemplateNotification(post, language);
    }

    const prompt = language === 'ne' 
      ? buildNepaliPrompt(post)
      : buildEnglishPrompt(post);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: language === 'ne'
            ? "तपाईं आमा शिशु सेवाका लागि आकर्षक र संक्षिप्त सूचना सन्देशहरू लेख्ने विशेषज्ञ हुनुहुन्छ। सधैं सम्मानपूर्ण, जानकारीमूलक र सकारात्मक हुनुहोस्।"
            : "You are an expert in writing engaging and concise notification messages for Aama Shishu Sewa (maternal care service). Always be respectful, informative, and positive."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content.trim();
    
    // Parse the response to extract title and message
    const lines = response.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^(शीर्षक|Title):\s*/, '').trim() || post.title;
    const message = lines[1]?.replace(/^(सन्देश|Message):\s*/, '').trim() || post.excerpt || post.title;

    console.log('✅ AI notification generated');

    return {
      title,
      message,
      generatedBy: 'ai'
    };

  } catch (error) {
    console.error('❌ AI notification generation failed:', error);
    return getTemplateNotification(post, language);
  }
};

/**
 * Send notification to all active users
 * @param {Object} post - Post object
 * @returns {Object} Result with count of notifications sent
 */
export const notifyAllUsersAboutPost = async (post) => {
  try {
    console.log(`📢 Sending post notifications to all users...`);

    // Get all active users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, full_name')
      .eq('status', 'active')
      .eq('role', 'user');

    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      console.log('⚠️ No active users found');
      return {
        success: true,
        count: 0,
        message: 'No users to notify'
      };
    }

    // Generate notification content with AI
    const nepaliNotif = await generatePostNotification(post, 'ne');
    const englishNotif = await generatePostNotification(post, 'en');

    // Create notifications for all users
    const notifications = users.map(user => ({
      user_id: user.id,
      type: 'new_post',
      title: nepaliNotif.title,
      message: nepaliNotif.message,
      data: {
        post_id: post.id,
        post_title: post.title,
        post_category: post.category,
        english_title: englishNotif.title,
        english_message: englishNotif.message
      },
      is_read: false,
      created_at: new Date().toISOString()
    }));

    // Insert all notifications in batch
    const { data: createdNotifications, error: notifError } = await supabaseAdmin
      .from('notifications')
      .insert(notifications)
      .select('id');

    if (notifError) throw notifError;

    console.log(`✅ Sent ${createdNotifications.length} notifications`);

    return {
      success: true,
      count: createdNotifications.length,
      message: `Notifications sent to ${createdNotifications.length} users`,
      generatedBy: nepaliNotif.generatedBy
    };

  } catch (error) {
    console.error('❌ Failed to send post notifications:', error);
    return {
      success: false,
      count: 0,
      error: error.message
    };
  }
};

/**
 * Send notification to specific users (by role or IDs)
 * @param {Object} post - Post object
 * @param {Object} options - { userIds: [], role: 'user' }
 * @returns {Object} Result
 */
export const notifySpecificUsers = async (post, options = {}) => {
  try {
    const { userIds, role } = options;

    let query = supabaseAdmin
      .from('users')
      .select('id, full_name')
      .eq('status', 'active');

    if (userIds && userIds.length > 0) {
      query = query.in('id', userIds);
    } else if (role) {
      query = query.eq('role', role);
    }

    const { data: users, error: usersError } = await query;
    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      return {
        success: true,
        count: 0,
        message: 'No users found'
      };
    }

    const nepaliNotif = await generatePostNotification(post, 'ne');
    const englishNotif = await generatePostNotification(post, 'en');

    const notifications = users.map(user => ({
      user_id: user.id,
      type: 'new_post',
      title: nepaliNotif.title,
      message: nepaliNotif.message,
      data: {
        post_id: post.id,
        post_title: post.title,
        post_category: post.category,
        english_title: englishNotif.title,
        english_message: englishNotif.message
      },
      is_read: false,
      created_at: new Date().toISOString()
    }));

    const { data: createdNotifications, error: notifError } = await supabaseAdmin
      .from('notifications')
      .insert(notifications)
      .select('id');

    if (notifError) throw notifError;

    return {
      success: true,
      count: createdNotifications.length,
      message: `Notifications sent to ${createdNotifications.length} users`
    };

  } catch (error) {
    console.error('❌ Failed to send notifications:', error);
    return {
      success: false,
      count: 0,
      error: error.message
    };
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const buildNepaliPrompt = (post) => {
  const categoryNames = {
    news: 'समाचार',
    health: 'स्वास्थ्य',
    tips: 'सुझाव',
    announcement: 'घोषणा',
    update: 'अपडेट'
  };

  return `आमा शिशु सेवामा नयाँ पोस्ट प्रकाशित भएको छ:

शीर्षक: ${post.title}
विवरण: ${post.excerpt || post.content.substring(0, 150)}
वर्ग: ${categoryNames[post.category] || post.category}

यो जानकारी प्रयोगकर्ताहरूलाई सूचित गर्न एउटा आकर्षक र संक्षिप्त सूचना सन्देश लेख्नुहोस्। यो ढाँचामा लेख्नुहोस्:
शीर्षक: [छोटो र आकर्षक शीर्षक]
सन्देश: [१-२ वाक्यमा मुख्य जानकारी]

नोट: 📢 emoji प्रयोग गर्नुहोस्, सकारात्मक र स्वागत योग्य भाषा राख्नुहोस्।`;
};

const buildEnglishPrompt = (post) => {
  return `A new post has been published on Aama Shishu Sewa:

Title: ${post.title}
Description: ${post.excerpt || post.content.substring(0, 150)}
Category: ${post.category}

Write an engaging and concise notification message to inform users. Use this format:
Title: [Short and catchy title]
Message: [Main information in 1-2 sentences]

Note: Use 📢 emoji, keep language positive and welcoming.`;
};

const getTemplateNotification = (post, language = 'ne') => {
  const templates = {
    ne: {
      news: {
        title: '📢 नयाँ समाचार',
        message: `आमा शिशु सेवामा नयाँ जानकारी: ${post.title.substring(0, 60)}...`
      },
      health: {
        title: '💚 स्वास्थ्य सुझाव',
        message: `स्वास्थ्य सम्बन्धी महत्वपूर्ण जानकारी: ${post.title.substring(0, 50)}...`
      },
      tips: {
        title: '💡 उपयोगी सुझाव',
        message: `तपाईंको लागि नयाँ सुझाव: ${post.title.substring(0, 60)}...`
      },
      announcement: {
        title: '📣 महत्वपूर्ण घोषणा',
        message: `कृपया ध्यान दिनुहोस्: ${post.title.substring(0, 60)}...`
      },
      update: {
        title: '🔔 नयाँ अपडेट',
        message: `आमा शिशु सेवामा नयाँ अपडेट: ${post.title.substring(0, 50)}...`
      }
    },
    en: {
      news: {
        title: '📢 New Update',
        message: `New post on Aama Shishu Sewa: ${post.title.substring(0, 60)}...`
      },
      health: {
        title: '💚 Health Tips',
        message: `Important health information: ${post.title.substring(0, 60)}...`
      },
      tips: {
        title: '💡 Useful Tips',
        message: `New tip for you: ${post.title.substring(0, 60)}...`
      },
      announcement: {
        title: '📣 Important Announcement',
        message: `Please note: ${post.title.substring(0, 60)}...`
      },
      update: {
        title: '🔔 New Update',
        message: `New update on Aama Shishu Sewa: ${post.title.substring(0, 60)}...`
      }
    }
  };

  const category = post.category || 'news';
  const template = templates[language][category] || templates[language].news;

  return {
    title: template.title,
    message: template.message,
    generatedBy: 'template'
  };
};

export default {
  generatePostNotification,
  notifyAllUsersAboutPost,
  notifySpecificUsers
};
