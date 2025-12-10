import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure QueryClient with proper defaults to prevent excessive requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Never retry on 429 (rate limit) - respect rate limits
        if (error?.response?.status === 429 || error?.status === 429) {
          return false;
        }
        // Don't retry on other 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 2 times for network/server errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      refetchOnReconnect: true, // Only refetch on reconnect
    },
    mutations: {
      retry: false, // Don't retry mutations
    },
  },
});

const ReactQueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

export default ReactQueryProvider;