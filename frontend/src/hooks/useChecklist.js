import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as checklistService from '../services/checklistService';

export const useChecklist = (tripId) =>
  useQuery({
    queryKey: ['checklist', tripId],
    queryFn: () => checklistService.getChecklist(tripId),
    enabled: !!tripId,
  });

export const useAddItem = (tripId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: checklistService.addItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklist', tripId] }),
    onError: () => toast.error('Failed to add item'),
  });
};

export const useToggleItem = (tripId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: checklistService.toggleItem,
    // Optimistic toggle
    onMutate: async ({ id, is_checked }) => {
      await qc.cancelQueries({ queryKey: ['checklist', tripId] });
      const prev = qc.getQueryData(['checklist', tripId]);
      qc.setQueryData(['checklist', tripId], (old) =>
        old?.map((item) => (item.id === id ? { ...item, is_checked } : item))
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(['checklist', tripId], ctx.prev);
      toast.error('Failed to update item');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['checklist', tripId] }),
  });
};

export const useDeleteItem = (tripId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: checklistService.deleteItem,
    onSuccess: () => {
      toast.success('Item removed');
      qc.invalidateQueries({ queryKey: ['checklist', tripId] });
    },
    onError: () => toast.error('Failed to remove item'),
  });
};
