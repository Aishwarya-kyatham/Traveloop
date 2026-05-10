import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import userService from '../services/userService';

export const useUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: userService.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateMe,
    onSuccess: () => {
      toast.success('Profile updated!');
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
    onError: () => {
      toast.error('Failed to update profile.');
    },
  });
};
