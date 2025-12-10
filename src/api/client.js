import axios from 'axios';
import { storageService } from '../services/storageService';
import { toast } from 'react-toastify';

// Base URL - handle both cases: with or without /api suffix
let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
// Remove trailing /api if present to avoid double /api/api/
if (API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
}
const API_URL = `${API_BASE_URL}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for httpOnly cookies (refresh token)
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = storageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Handle success response format
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.message || 'Request failed'));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle 429 Rate Limit - Don't retry, just reject
    if (status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000; // Default 60 seconds
      
      // Log warning but don't show toast for every 429
      console.warn(`Rate limit exceeded. Wait ${waitTime / 1000} seconds before retrying.`);
      
      const rateLimitError = new Error('Rate limit exceeded. Please wait before making more requests.');
      rateLimitError.status = 429;
      rateLimitError.retryAfter = waitTime;
      return Promise.reject(rateLimitError);
    }

    // Handle 401 Unauthorized - Try to refresh token
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.token) {
          const newToken = refreshResponse.data.token;
          storageService.setToken(newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        // Clear auth and redirect to login
        storageService.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other error statuses
    // Error format: { success: false, message: string, details?: any }
    const errorMessage = data?.message || error.message || 'An error occurred';
    const errorDetails = data?.details;
    
    // Create error object with details
    const apiError = new Error(errorMessage);
    apiError.response = error.response;
    apiError.status = status;
    apiError.details = errorDetails;
    
    switch (status) {
      case 400:
        // Validation errors - show field-specific errors if available
        if (errorDetails && typeof errorDetails === 'object') {
          const fieldErrors = Object.entries(errorDetails)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
          toast.error(fieldErrors || errorMessage);
        } else {
          toast.error(errorMessage);
        }
        break;
      case 403:
        // Check if this is an email verification error
        if (errorDetails?.emailVerificationRequired) {
          // Don't show toast for email verification - let the component handle it
          // The error will be thrown with details for the component to handle
          apiError.emailVerificationRequired = true;
          apiError.email = errorDetails.email || null;
        } else {
          toast.error(errorMessage || 'You do not have permission to perform this action');
        }
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 422:
        // Validation errors
        if (errorDetails && typeof errorDetails === 'object') {
          const fieldErrors = Object.entries(errorDetails)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
          toast.error(fieldErrors || errorMessage);
        } else {
          toast.error(errorMessage);
        }
        break;
      case 429:
        // Rate limit error - don't show toast for every request, just log
        console.warn('Rate limit exceeded. Please wait before making more requests.');
        // Don't show toast for 429 to avoid spam
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(errorMessage);
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;

