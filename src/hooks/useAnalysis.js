import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analysisAPI } from '../api/analysis';
import { toast } from 'react-toastify';
import { parseAnalysisError, getErrorIcon } from '../utils/errorHandler';

/**
 * Hook for managing analysis
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.status - Filter by status
 * @returns {Object} Analysis data and mutations
 */
export const useAnalysis = (options = {}) => {
  const queryClient = useQueryClient();
  const { page = 1, limit = 10, status } = options;

  // Query for analyses list
  const {
    data: analysesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['analyses', { page, limit, status }],
    queryFn: () => analysisAPI.getAnalyses({ page, limit, status }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    select: (response) => {
      if (response?.success) {
        return {
          analyses: response.analyses || [],
          pagination: response.pagination || {},
        };
      }
      return { analyses: [], pagination: {} };
    },
  });

  // Query for single analysis
  const useSingleAnalysis = (analysisId) => {
    return useQuery({
      queryKey: ['analysis', analysisId],
      queryFn: () => analysisAPI.getAnalysis(analysisId),
      enabled: !!analysisId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes cache
      select: (response) => (response?.success ? response.analysis : null),
    });
  };

  // Query for analysis feedback
  const useFeedback = (analysisId) => {
    return useQuery({
      queryKey: ['analysis-feedback', analysisId],
      queryFn: () => analysisAPI.getFeedback(analysisId),
      enabled: !!analysisId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes cache
      select: (response) => (response?.success ? response.feedback : null),
    });
  };

  // Start analysis mutation
  const startAnalysisMutation = useMutation({
    mutationFn: (sessionId) => analysisAPI.startAnalysis(sessionId),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message || 'Analysis started successfully');
        // Invalidate analyses list
        queryClient.invalidateQueries({ queryKey: ['analyses'] });
      }
    },
    onError: (error) => {
      const errorInfo = parseAnalysisError(error);
      
      // Show appropriate toast based on error severity
      if (errorInfo.severity === 'warning') {
        toast.warning(`${getErrorIcon(errorInfo.type)} ${errorInfo.message}`, {
          autoClose: 6000,
        });
      } else {
        toast.error(`${getErrorIcon(errorInfo.type)} ${errorInfo.message}`, {
          autoClose: 6000,
        });
      }
      
      // Show suggestion if available
      if (errorInfo.suggestion) {
        setTimeout(() => {
          toast.info(`💡 ${errorInfo.suggestion}`, {
            autoClose: 8000,
          });
        }, 1000);
      }
    },
  });

  return {
    analyses: analysesData?.analyses || [],
    pagination: analysesData?.pagination || {},
    isLoading,
    error,
    refetch,
    startAnalysis: startAnalysisMutation.mutate,
    startAnalysisAsync: startAnalysisMutation.mutateAsync,
    isStarting: startAnalysisMutation.isPending,
    useSingleAnalysis,
    useFeedback,
  };
};

