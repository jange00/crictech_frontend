import { useEffect, useRef, useState } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from '../auth/useAuth';

/**
 * Hook for managing socket connection and events
 * @param {Object} options - Configuration options
 * @param {Function} options.onUploadProgress - Handler for upload-progress events
 * @param {Function} options.onAnalysisProgress - Handler for analysis-progress events
 * @param {Function} options.onAnalysisComplete - Handler for analysis-complete events
 * @param {Function} options.onNotification - Handler for notification events
 * @param {Function} options.onError - Handler for error events
 * @returns {Object} Socket connection status and methods
 */
export const useSocket = (options = {}) => {
  const { isAuthenticated, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef([]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      socketService.disconnect();
      setIsConnected(false);
      return;
    }

    // Connect socket
    socketService.connect(token);

    // Update connection status
    const updateStatus = () => {
      setIsConnected(socketService.getConnectionStatus());
    };
    updateStatus();

    // Setup event handlers
    const unsubscribers = [];

    if (options.onUploadProgress) {
      const unsubscribe = socketService.on('upload-progress', options.onUploadProgress);
      unsubscribers.push(() => socketService.off('upload-progress', options.onUploadProgress));
    }

    if (options.onAnalysisProgress) {
      const unsubscribe = socketService.on('analysis-progress', options.onAnalysisProgress);
      unsubscribers.push(() => socketService.off('analysis-progress', options.onAnalysisProgress));
    }

    if (options.onAnalysisComplete) {
      const unsubscribe = socketService.on('analysis-complete', options.onAnalysisComplete);
      unsubscribers.push(() => socketService.off('analysis-complete', options.onAnalysisComplete));
    }

    if (options.onNotification) {
      const unsubscribe = socketService.on('notification', options.onNotification);
      unsubscribers.push(() => socketService.off('notification', options.onNotification));
    }

    if (options.onError) {
      const unsubscribe = socketService.on('error', options.onError);
      unsubscribers.push(() => socketService.off('error', options.onError));
    }

    // Listen to connection status changes
    const connectHandler = () => {
      setIsConnected(true);
    };
    const disconnectHandler = () => {
      setIsConnected(false);
    };

    socketService.on('connect', connectHandler);
    socketService.on('disconnect', disconnectHandler);
    unsubscribers.push(() => {
      socketService.off('connect', connectHandler);
      socketService.off('disconnect', disconnectHandler);
    });

    handlersRef.current = unsubscribers;

    // Cleanup on unmount or auth change
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [isAuthenticated, token]);

  return {
    isConnected,
    socket: socketService,
    joinRoom: (room) => socketService.joinRoom(room),
    requestAnalysis: (sessionId) => socketService.requestAnalysis(sessionId),
    emit: (event, data) => socketService.emit(event, data),
    on: (event, handler) => socketService.on(event, handler),
    off: (event, handler) => socketService.off(event, handler),
  };
};

