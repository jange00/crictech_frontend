/**
 * Error handling utilities for analysis and API errors
 */

/**
 * Parse error message and return user-friendly message
 * @param {Error|string} error - Error object or error message
 * @param {Object} context - Additional context (sessionId, analysisId, etc.)
 * @returns {Object} { message, type, recoverable, suggestion }
 */
export const parseAnalysisError = (error, context = {}) => {
  const errorMessage = error?.message || error?.error || String(error || 'An unknown error occurred');
  const lowerMessage = errorMessage.toLowerCase();

  // ML Service errors
  if (lowerMessage.includes('ml service') || lowerMessage.includes('ml-service') || lowerMessage.includes('mediapipe')) {
    return {
      message: 'ML analysis service is temporarily unavailable',
      type: 'ml_service_unavailable',
      recoverable: true,
      suggestion: 'The system will use fallback analysis mode. Results may be less detailed but still useful.',
      severity: 'warning',
    };
  }

  // Video processing errors
  if (lowerMessage.includes('video processing') || lowerMessage.includes('video processing failed') || lowerMessage.includes('process video')) {
    return {
      message: 'Video processing failed',
      type: 'video_processing_error',
      recoverable: true,
      suggestion: 'Please try uploading the video again. If the issue persists, ensure the video format is MP4 or MOV.',
      severity: 'error',
    };
  }

  // Queue errors
  if (lowerMessage.includes('queue') || lowerMessage.includes('unavailable')) {
    return {
      message: 'Analysis queue is busy',
      type: 'queue_unavailable',
      recoverable: true,
      suggestion: 'The system will process your video directly. This may take a bit longer.',
      severity: 'info',
    };
  }

  // Network errors
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('connection')) {
    return {
      message: 'Network connection error',
      type: 'network_error',
      recoverable: true,
      suggestion: 'Please check your internet connection and try again.',
      severity: 'error',
    };
  }

  // Authentication errors
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('authentication') || lowerMessage.includes('token')) {
    return {
      message: 'Authentication required',
      type: 'auth_error',
      recoverable: false,
      suggestion: 'Please log in again to continue.',
      severity: 'error',
    };
  }

  // Timeout errors
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return {
      message: 'Request timed out',
      type: 'timeout_error',
      recoverable: true,
      suggestion: 'The operation is taking longer than expected. Please try again.',
      severity: 'error',
    };
  }

  // File/upload errors
  if (lowerMessage.includes('file') || lowerMessage.includes('upload') || lowerMessage.includes('size')) {
    return {
      message: 'File upload error',
      type: 'file_error',
      recoverable: true,
      suggestion: 'Please check the file size (max 500MB) and format (MP4/MOV), then try again.',
      severity: 'error',
    };
  }

  // Server errors
  if (lowerMessage.includes('server') || lowerMessage.includes('500') || lowerMessage.includes('internal')) {
    return {
      message: 'Server error occurred',
      type: 'server_error',
      recoverable: true,
      suggestion: 'Our servers are experiencing issues. Please try again in a few moments.',
      severity: 'error',
    };
  }

  // Generic error
  return {
    message: errorMessage,
    type: 'unknown_error',
    recoverable: true,
    suggestion: 'Please try again. If the problem persists, contact support.',
    severity: 'error',
  };
};

/**
 * Get error icon based on error type
 * @param {string} type - Error type
 * @returns {string} Icon name or emoji
 */
export const getErrorIcon = (type) => {
  const iconMap = {
    ml_service_unavailable: '⚠️',
    video_processing_error: '🎥',
    queue_unavailable: '⏳',
    network_error: '📡',
    auth_error: '🔒',
    timeout_error: '⏱️',
    file_error: '📁',
    server_error: '🔧',
    unknown_error: '❌',
  };
  return iconMap[type] || '❌';
};

/**
 * Format error for display
 * @param {Error|string} error - Error object or message
 * @param {Object} context - Additional context
 * @returns {string} Formatted error message
 */
export const formatError = (error, context = {}) => {
  const parsed = parseAnalysisError(error, context);
  return parsed.message;
};

/**
 * Check if error is recoverable
 * @param {Error|string} error - Error object or message
 * @returns {boolean} True if error is recoverable
 */
export const isRecoverableError = (error) => {
  const parsed = parseAnalysisError(error);
  return parsed.recoverable;
};

