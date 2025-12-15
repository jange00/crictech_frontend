/**
 * Token storage utility service
 * Handles storing and retrieving authentication tokens
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const USER_ID_KEY = 'userid';
const ROLE_KEY = 'role';

export const storageService = {
  /**
   * Get stored token
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Set token
   */
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Get stored user data
   */
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Set user data
   */
  setUser: (user) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (user._id) localStorage.setItem(USER_ID_KEY, user._id);
      if (user.role) localStorage.setItem(ROLE_KEY, user.role);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(USER_ID_KEY);
      localStorage.removeItem(ROLE_KEY);
    }
  },

  /**
   * Clear all auth data
   */
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ROLE_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};


