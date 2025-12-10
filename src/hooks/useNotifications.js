import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsAPI } from '../api/notifications';
import { toast } from 'react-toastify';

/**
 * Hook for managing notifications
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @returns {Object} Notifications data and mutations
 */
export const useNotifications = (options = {}) => {
  const queryClient = useQueryClient();
  const { page = 1, limit = 20 } = options;

  // Query for notifications
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications', { page, limit }],
    queryFn: () => notificationsAPI.getNotifications({ page, limit }),
    select: (response) => {
      if (response?.success) {
        return {
          notifications: response.notifications || [],
          unreadCount: response.unreadCount || 0,
          pagination: response.pagination || {},
        };
      }
      return { notifications: [], unreadCount: 0, pagination: {} };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - data is fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every 60 seconds (reduced from 30)
    refetchIntervalInBackground: false, // Don't refetch when tab is in background
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => notificationsAPI.markAsRead(notificationId),
    onSuccess: (data) => {
      if (data?.success) {
        // Invalidate notifications to refetch
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsAPI.markAllAsRead(),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('All notifications marked as read');
        // Invalidate notifications to refetch
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark all notifications as read');
    },
  });

  return {
    notifications: notificationsData?.notifications || [],
    unreadCount: notificationsData?.unreadCount || 0,
    pagination: notificationsData?.pagination || {},
    isLoading,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAsReadAsync: markAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadAsync: markAllAsReadMutation.mutateAsync,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
};

