import apiClient from './client';

/**
 * Progress API endpoints
 */

export const progressAPI = {
  /**
   * Get progress sessions with filters
   * @param {Object} params - { page, limit, sessionType, bowlingType, startDate, endDate }
   * @returns {Promise} Sessions list and pagination
   */
  getSessions: async (params = {}) => {
    const response = await apiClient.get('/progress/sessions', { params });
    return response.data;
  },

  /**
   * Get progress metrics
   * @param {string} period - 'week' | 'month' | 'quarter' | 'year'
   * @returns {Promise} Metrics data
   */
  getMetrics: async (period = 'month') => {
    const response = await apiClient.get('/progress/metrics', {
      params: { period },
    });
    return response.data;
  },

  /**
   * Get progress charts data
   * @param {string} metricType - Metric type (e.g., 'bowlingSpeed')
   * @param {string} period - Period (optional)
   * @returns {Promise} Chart data
   */
  getCharts: async (metricType, period) => {
    const params = { metricType };
    if (period) params.period = period;
    const response = await apiClient.get('/progress/charts', { params });
    return response.data;
  },

  /**
   * Get progress insights
   * @param {string} period - Period (optional)
   * @returns {Promise} Insights data
   */
  getInsights: async (period) => {
    const params = period ? { period } : {};
    const response = await apiClient.get('/progress/insights', { params });
    return response.data;
  },
};

