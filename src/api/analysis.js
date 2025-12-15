import apiClient from './client';

/**
 * Analysis API endpoints
 */

export const analysisAPI = {
  /**
   * Start analysis for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise} Analysis data
   */
  startAnalysis: async (sessionId) => {
    const response = await apiClient.post(`/analysis/${sessionId}/start`);
    return response.data;
  },

  /**
   * Get analysis by ID
   * @param {string} analysisId - Analysis ID
   * @returns {Promise} Analysis data
   */
  getAnalysis: async (analysisId) => {
    const response = await apiClient.get(`/analysis/${analysisId}`);
    return response.data;
  },

  /**
   * Get analyses list with pagination
   * @param {Object} params - { page, limit, status }
   * @returns {Promise} Analyses list and pagination
   */
  getAnalyses: async (params = {}) => {
    const response = await apiClient.get('/analysis', { params });
    return response.data;
  },

  /**
   * Get analysis feedback
   * @param {string} analysisId - Analysis ID
   * @returns {Promise} Feedback data
   */
  getFeedback: async (analysisId) => {
    const response = await apiClient.get(`/analysis/${analysisId}/feedback`);
    return response.data;
  },
};


