import apiClient from './client';

/**
 * Authentication API endpoints
 */

export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - { email, password, name?, username?, preferredHand? }
   * @returns {Promise} User data and token
   */
  register: async (userData) => {
    // Normalize email: lowercase and trim
    const normalizedData = {
      ...userData,
      email: userData.email.toLowerCase().trim(),
      name: userData.name?.trim() || '',
      username: userData.username?.trim() || '',
    };
    
    const response = await apiClient.post('/auth/register', normalizedData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} User data and token
   * @throws {Error} If login fails, error may have emailVerificationRequired property
   */
  login: async (credentials) => {
    try {
      // Normalize email: lowercase and trim
      const normalizedCredentials = {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
      };
      
      const response = await apiClient.post('/auth/login', normalizedCredentials);
      return response.data;
    } catch (error) {
      // Check if this is an email verification error
      if (error.response?.status === 403 && error.details?.emailVerificationRequired) {
        // Re-throw with email verification details
        const verificationError = new Error(error.message || 'Please verify your email before logging in.');
        verificationError.emailVerificationRequired = true;
        verificationError.email = error.details.email || credentials.email.toLowerCase().trim();
        verificationError.status = 403;
        throw verificationError;
      }
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise} Success message
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current user
   * @returns {Promise} User data
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Optional refresh token (uses cookie if not provided)
   * @returns {Promise} New access token
   */
  refreshToken: async (refreshToken) => {
    const requestBody = refreshToken ? { refreshToken } : {};
    const response = await apiClient.post('/auth/refresh-token', requestBody);
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - { name?, username?, preferredHand?, profilePicture? }
   * @returns {Promise} Updated user data
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },

  /**
   * Verify email with code
   * @param {Object} data - { email, code }
   * @returns {Promise} User data and token
   */
  verifyEmail: async (data) => {
    const response = await apiClient.post('/auth/verify-email', data);
    return response.data;
  },

  /**
   * Resend verification email
   * @param {Object} data - { email }
   * @returns {Promise} Success message
   */
  resendVerification: async (data) => {
    const response = await apiClient.post('/auth/resend-verification', data);
    return response.data;
  },

  /**
   * Get OAuth URLs
   * @returns {Promise} OAuth URLs object
   */
  getOAuthUrls: async () => {
    const response = await apiClient.get('/auth/oauth/urls');
    return response.data;
  },

  /**
   * Initiate Google OAuth login (redirects to Google)
   */
  googleLogin: () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },

  /**
   * Initiate Facebook OAuth login (redirects to Facebook)
   */
  facebookLogin: () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    window.location.href = `${API_BASE_URL}/api/auth/facebook`;
  },
};

