import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { toast } from 'react-toastify';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');

      if (error) {
        toast.error(`OAuth authentication failed: ${error}`);
        navigate('/login?error=oauth_failed');
        return;
      }

      if (token) {
        try {
          // Import auth API and storage service
          const { authAPI } = await import('../../api/auth');
          const { storageService } = await import('../../services/storageService');
          
          // Store token
          storageService.setToken(token);
          
          // Get user data
          const userResponse = await authAPI.getCurrentUser();
          
          if (userResponse?.success && userResponse.user) {
            // Update auth context by storing user
            storageService.setUser(userResponse.user);
            
            // Connect socket with new token
            const { socketService } = await import('../../services/socketService');
            socketService.connect(token);
            
            toast.success(`Successfully logged in with ${provider || 'OAuth'}`);
            navigate('/dashboard');
          } else {
            throw new Error('Failed to get user data');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast.error('Failed to complete OAuth login. Please try again.');
          navigate('/login');
        }
      } else {
        toast.error('OAuth authentication failed. No token received.');
        navigate('/login?error=oauth_failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
        <p className="text-slate-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
