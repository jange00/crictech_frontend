import apiClient from './client';

/**
 * Settings API endpoints
 */

export const settingsAPI = {
  /**
   * Get user settings
   * @returns {Promise} Settings data
   */
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  /**
   * Update user settings
   * @param {Object} settings - { preferences?, privacy?, notifications? }
   * @returns {Promise} Updated settings
   */
  updateSettings: async (settings) => {
    const response = await apiClient.put('/settings', settings);
    return response.data;
  },
};

