import { io } from 'socket.io-client';
import { storageService } from './storageService';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
  }

  /**
   * Connect to socket server
   * @param {string} token - JWT token for authentication
   */
  connect(token) {
    const authToken = token || storageService.getToken();
    
    // If already connected with same token, don't reconnect
    if (this.socket?.connected && this.socket.auth?.token === authToken) {
      return;
    }

    // Disconnect existing connection if token changed
    if (this.socket && this.socket.auth?.token !== authToken) {
      this.disconnect();
    }

    // If already connecting/connected, wait
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: authToken,
      },
      withCredentials: true, // Important for cookies
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    this.setupEventHandlers();
  }

  /**
   * Setup socket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Socket connected:', this.socket.id);
      // Wait a bit to ensure socket is fully ready before emitting
      setTimeout(() => {
        if (this.socket?.connected) {
          this.emit('subscribe-notifications');
        }
      }, 100);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      
      // Handle authentication errors
      if (error.message === 'Authentication failed' || error.message === 'Invalid token') {
        console.error('Socket authentication failed. Token may be invalid.');
        // Don't auto-reconnect on auth errors - let the app handle token refresh
        this.socket.disconnect();
      }
    });

    // Re-register all custom event handlers
    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.socket.on(event, handler);
      });
    });
  }

  /**
   * Emit event to server
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Event not emitted:', event);
    }
  }

  /**
   * Subscribe to server event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   * @returns {Function} Unsubscribe function
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);

    if (this.socket) {
      this.socket.on(event, handler);
    }

    // Return unsubscribe function
    return () => {
      this.off(event, handler);
    };
  }

  /**
   * Unsubscribe from server event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function (optional)
   */
  off(event, handler) {
    if (handler) {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
      if (this.socket) {
        this.socket.off(event, handler);
      }
    } else {
      // Remove all handlers for this event
      this.eventHandlers.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  /**
   * Join a room
   * @param {string} roomId - Room ID (e.g., video session ID)
   */
  joinRoom(roomId) {
    this.emit('join-room', { roomId });
  }

  /**
   * Request analysis for a session
   * @param {string} sessionId - Session ID
   */
  requestAnalysis(sessionId) {
    this.emit('request-analysis', { sessionId });
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventHandlers.clear();
    }
  }

  /**
   * Reconnect with new token (useful after token refresh)
   * @param {string} token - New JWT token
   */
  reconnect(token) {
    this.disconnect();
    this.connect(token);
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return this.isConnected && this.socket?.connected;
  }
}

// Export singleton instance
export const socketService = new SocketService();

