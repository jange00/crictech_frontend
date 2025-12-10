import { useEffect, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { authAPI } from '../api/auth';
import { storageService } from '../services/storageService';
import { socketService } from '../services/socketService';
import { toast } from 'react-toastify';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  /**
   * Normalize user object - handle both id and _id from backend
   */
  const normalizeUser = useCallback((user) => {
    if (!user) return null;
    // Backend may return 'id' but we normalize to '_id' for consistency
    if (user.id && !user._id) {
      return { ...user, _id: user.id };
    }
    return user;
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response?.success) {
        // Check if email verification is required
        if (response.emailVerificationRequired) {
          // Don't set auth state yet - user needs to verify email first
          toast.success(response.message || 'Registration successful! Please verify your email.');
          return {
            success: true,
            requiresVerification: true,
            email: response.user?.email || userData.email,
            message: response.message || 'Please verify your email before logging in.',
            user: response.user ? normalizeUser(response.user) : null,
            token: response.token || null, // Token might be provided even if verification required
          };
        }
        
        // Email verification not required or already verified
        if (response.user && response.token) {
          const normalizedUser = normalizeUser(response.user);
          storageService.setUser(normalizedUser);
          storageService.setToken(response.token);
          setUser(normalizedUser);
          setToken(response.token);
          setIsAuthenticated(true);
          
          // Connect socket
          socketService.connect(response.token);
          
          toast.success('Registration successful!');
          return { success: true, user: normalizedUser, token: response.token };
        }
      }
      
      throw new Error(response?.message || 'Registration failed');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);

  /**
   * Login user
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response?.success && response.user && response.token) {
        const normalizedUser = normalizeUser(response.user);
        storageService.setUser(normalizedUser);
        storageService.setToken(response.token);
        setUser(normalizedUser);
        setToken(response.token);
        setIsAuthenticated(true);
        
        // Connect socket
        socketService.connect(response.token);
        
        toast.success('Login successful!');
        return { success: true, user: normalizedUser, token: response.token };
      } else {
        throw new Error(response?.message || 'Login failed');
      }
    } catch (error) {
      // Check if this is an email verification error
      if (error.emailVerificationRequired) {
        // Don't show error toast - let the component handle the redirect
        return {
          success: false,
          requiresVerification: true,
          email: error.email || credentials.email,
          error: error.message || 'Please verify your email before logging in.',
        };
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updatedUser) => {
    try {
      // Normalize user object
      const normalizedUser = normalizeUser(updatedUser);
      
      // Update storage
      storageService.setUser(normalizedUser);
      
      // Update state
      setUser(normalizedUser);
      
      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  }, [normalizeUser]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      // Call logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage
      storageService.clearAuth();
      
      // Disconnect socket
      socketService.disconnect();
      
      // Reset state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
      
      toast.success('Logged out successfully');
    }
  }, []);

  /**
   * Verify current user token
   */
  const verifyAuth = useCallback(async () => {
    const storedToken = storageService.getToken();
    const storedUser = storageService.getUser();

    if (!storedToken || !storedUser) {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Verify token by fetching current user
      const response = await authAPI.getCurrentUser();
      
      if (response?.success && response.user) {
        // Update user data (in case it changed on server)
        const normalizedUser = normalizeUser(response.user);
        storageService.setUser(normalizedUser);
        setUser(normalizedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
        
        // Connect socket
        socketService.connect(storedToken);
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      
      // Check if server is offline/unreachable
      const isNetworkError = 
        !error.response || 
        error.code === 'ECONNABORTED' || 
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error') || 
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('Network request failed');
      
      if (isNetworkError) {
        // Server is offline - clear auth immediately
        console.warn('Server is offline. Clearing authentication.');
        storageService.clearAuth();
        socketService.disconnect();
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        
        // Show error message (AuthGuard will handle redirect)
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          toast.error('Server is offline. Please check your connection and try again.');
        }
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        // Token is invalid - clear auth
        storageService.clearAuth();
        socketService.disconnect();
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } else {
        // Other errors - still clear auth to be safe
        storageService.clearAuth();
        socketService.disconnect();
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);

  /**
   * Refresh token
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await authAPI.refreshToken();
      
      if (response?.success && response.token) {
        const newToken = response.token;
        storageService.setToken(newToken);
        setToken(newToken);
        
        // Reconnect socket with new token
        socketService.reconnect(newToken);
        
        return newToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout
      await logout();
      return null;
    }
  }, [logout]);

  // Verify auth on mount
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // Auto-refresh token before expiry (every 14 minutes if token expires in 15 minutes)
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, token, refreshToken]);

  // Listen to storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        verifyAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [verifyAuth]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    verifyAuth,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export { AuthContext };

