import { useQuery } from '@tanstack/react-query';
import { progressAPI } from '../api/progress';

/**
 * Hook for managing progress data
 * @returns {Object} Progress queries and methods
 */
export const useProgress = () => {
  // Query for sessions
  const useSessions = (options = {}) => {
    const { page = 1, limit = 10, sessionType, bowlingType, startDate, endDate } = options;
    return useQuery({
      queryKey: ['progress-sessions', { page, limit, sessionType, bowlingType, startDate, endDate }],
      queryFn: () =>
        progressAPI.getSessions({
          page,
          limit,
          sessionType,
          bowlingType,
          startDate,
          endDate,
        }),
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes cache
      select: (response) => {
        if (response?.success) {
          return {
            sessions: response.sessions || [],
            pagination: response.pagination || {},
          };
        }
        return { sessions: [], pagination: {} };
      },
    });
  };

  // Query for metrics
  const useMetrics = (period = 'month') => {
    return useQuery({
      queryKey: ['progress-metrics', period],
      queryFn: () => progressAPI.getMetrics(period),
      staleTime: 3 * 60 * 1000, // 3 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes cache
      select: (response) => {
        if (response?.success) {
          return {
            metrics: response.metrics || {},
            period: response.period || period,
          };
        }
        return { metrics: {}, period };
      },
    });
  };

  // Query for charts
  const useCharts = (metricType, period) => {
    return useQuery({
      queryKey: ['progress-charts', metricType, period],
      queryFn: () => progressAPI.getCharts(metricType, period),
      enabled: !!metricType,
      staleTime: 3 * 60 * 1000, // 3 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes cache
      select: (response) => {
        if (response?.success) {
          return {
            chartData: response.chartData || [],
            metricType: response.metricType || metricType,
            period: response.period || period,
          };
        }
        return { chartData: [], metricType, period };
      },
    });
  };

  // Query for insights
  const useInsights = (period) => {
    return useQuery({
      queryKey: ['progress-insights', period],
      queryFn: () => progressAPI.getInsights(period),
      staleTime: 5 * 60 * 1000, // 5 minutes (insights don't change frequently)
      gcTime: 15 * 60 * 1000, // 15 minutes cache
      select: (response) => {
        if (response?.success) {
          return {
            insights: response.insights || {},
            period: response.period || period,
          };
        }
        return { insights: {}, period };
      },
    });
  };

  return {
    useSessions,
    useMetrics,
    useCharts,
    useInsights,
  };
};

