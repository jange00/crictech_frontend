import apiClient from './client';

/**
 * Notifications API endpoints
 */

export const notificationsAPI = {
  /**
   * Get notifications with pagination
   * @param {Object} params - { page, limit }
   * @returns {Promise} Notifications list, unread count, and pagination
   */
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Updated notification
   */
  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Success message
   */
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },
};


