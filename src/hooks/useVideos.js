import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { videosAPI } from '../api/videos';
import { toast } from 'react-toastify';

/**
 * Hook for managing videos
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.status - Filter by status
 * @returns {Object} Videos data and mutations
 */
export const useVideos = (options = {}) => {
  const queryClient = useQueryClient();
  const { page = 1, limit = 10, status } = options;

  // Query for videos list
  const {
    data: videosData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['videos', { page, limit, status }],
    queryFn: () => videosAPI.getVideos({ page, limit, status }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    select: (response) => {
      if (response?.success) {
        return {
          videos: response.videos || [],
          pagination: response.pagination || {},
        };
      }
      return { videos: [], pagination: {} };
    },
  });

  // Query for single video
  const useVideo = (videoId) => {
    return useQuery({
      queryKey: ['video', videoId],
      queryFn: () => videosAPI.getVideo(videoId),
      enabled: !!videoId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes cache
      select: (response) => (response?.success ? response.video : null),
    });
  };

  // Upload video mutation
  const uploadMutation = useMutation({
    mutationFn: ({ videoFile, onUploadProgress }) => {
      return videosAPI.uploadVideo(videoFile, onUploadProgress);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Video uploaded successfully');
        // Invalidate videos list to refetch
        queryClient.invalidateQueries({ queryKey: ['videos'] });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload video');
    },
  });

  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: (videoId) => videosAPI.deleteVideo(videoId),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Video deleted successfully');
        // Invalidate videos list
        queryClient.invalidateQueries({ queryKey: ['videos'] });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete video');
    },
  });

  return {
    videos: videosData?.videos || [],
    pagination: videosData?.pagination || {},
    isLoading,
    error,
    refetch,
    uploadVideo: uploadMutation.mutate,
    uploadVideoAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteVideo: deleteMutation.mutate,
    deleteVideoAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    useVideo,
  };
};

