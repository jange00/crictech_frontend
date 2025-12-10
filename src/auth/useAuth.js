import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Hook to access authentication context
 * @returns {Object} Auth context value with user, token, loading, isAuthenticated, and auth methods
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
