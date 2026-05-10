import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as itineraryService from '../services/itineraryService';

export const useTrip = (tripId) => {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => itineraryService.getTrip(tripId),
    enabled: !!tripId,
  });
};

export const useAddDestination = (tripId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itineraryService.addDestination,
    onSuccess: () => {
      toast.success('Destination added successfully');
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add destination');
    },
  });
};

export const useDeleteDestination = (tripId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itineraryService.deleteDestination,
    onSuccess: () => {
      toast.success('Destination removed');
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove destination');
    },
  });
};

export const useAddActivity = (tripId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itineraryService.addActivity,
    onMutate: async (newActivity) => {
      await queryClient.cancelQueries({ queryKey: ['trip', tripId] });
      const previousTrip = queryClient.getQueryData(['trip', tripId]);

      // Optimistic Update
      queryClient.setQueryData(['trip', tripId], (old) => {
        if (!old) return old;
        const newTrip = { ...old };
        
        // Find the destination and day to inject this activity
        newTrip.destinations = newTrip.destinations.map(dest => ({
          ...dest,
          days: dest.days.map(day => {
            if (day.id === newActivity.day) {
              return {
                ...day,
                activities: [...day.activities, { ...newActivity, id: crypto.randomUUID() }]
              };
            }
            return day;
          })
        }));
        return newTrip;
      });

      return { previousTrip };
    },
    onError: (err, newActivity, context) => {
      queryClient.setQueryData(['trip', tripId], context.previousTrip);
      toast.error(err.message || 'Failed to add activity');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    },
    onSuccess: () => {
      toast.success('Activity added');
    }
  });
};

export const useDeleteActivity = (tripId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itineraryService.deleteActivity,
    onMutate: async (activityId) => {
      await queryClient.cancelQueries({ queryKey: ['trip', tripId] });
      const previousTrip = queryClient.getQueryData(['trip', tripId]);

      queryClient.setQueryData(['trip', tripId], (old) => {
        if (!old) return old;
        const newTrip = { ...old };
        newTrip.destinations = newTrip.destinations.map(dest => ({
          ...dest,
          days: dest.days.map(day => ({
            ...day,
            activities: day.activities.filter(a => a.id !== activityId)
          }))
        }));
        return newTrip;
      });

      return { previousTrip };
    },
    onError: (err, activityId, context) => {
      queryClient.setQueryData(['trip', tripId], context.previousTrip);
      toast.error('Failed to delete activity');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
};
