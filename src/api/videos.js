import apiClient from './client';
import { storageService } from '../services/storageService';

/**
 * Videos API endpoints
 */

export const videosAPI = {
  /**
   * Upload a video
   * @param {File} videoFile - Video file (MP4/MOV, max 500MB)
   * @param {Function} onUploadProgress - Progress callback
   * @returns {Promise} Video data (response format: { success: true, video: {...} })
   */
  uploadVideo: async (videoFile, onUploadProgress) => {
    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await apiClient.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
    // Backend returns: { success: true, video: {...} }
    return response.data;
  },

  /**
   * Get videos list with pagination
   * @param {Object} params - { page, limit, status }
   * @returns {Promise} Videos list and pagination
   */
  getVideos: async (params = {}) => {
    const response = await apiClient.get('/videos', { params });
    return response.data;
  },

  /**
   * Get video by ID
   * @param {string} videoId - Video ID
   * @returns {Promise} Video data
   */
  getVideo: async (videoId) => {
    const response = await apiClient.get(`/videos/${videoId}`);
    return response.data;
  },

  /**
   * Delete video
   * @param {string} videoId - Video ID
   * @returns {Promise} Success message
   */
  deleteVideo: async (videoId) => {
    const response = await apiClient.delete(`/videos/${videoId}`);
    return response.data;
  },

  /**
   * Get video stream URL
   * @param {string} videoId - Video ID
   * @returns {string} Video stream URL
   */
  getVideoStreamUrl: (videoId) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const API_URL = `${API_BASE_URL}/api`;
    const token = storageService.getToken();
    return `${API_URL}/videos/${videoId}/stream${token ? `?token=${token}` : ''}`;
  },
};

