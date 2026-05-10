import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as notesService from '../services/notesService';

export const useNotes = (tripId) =>
  useQuery({
    queryKey: ['notes', tripId],
    queryFn: () => notesService.getNotes(tripId),
    enabled: !!tripId,
  });

export const useAddNote = (tripId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notesService.addNote,
    onSuccess: () => {
      toast.success('Note saved');
      qc.invalidateQueries({ queryKey: ['notes', tripId] });
    },
    onError: () => toast.error('Failed to save note'),
  });
};

export const useDeleteNote = (tripId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notesService.deleteNote,
    onSuccess: () => {
      toast.success('Note deleted');
      qc.invalidateQueries({ queryKey: ['notes', tripId] });
    },
    onError: () => toast.error('Failed to delete note'),
  });
};

export const usePublicTrip = (token) =>
  useQuery({
    queryKey: ['public-trip', token],
    queryFn: () => notesService.getPublicTrip(token),
    enabled: !!token,
    retry: false,
  });

export const useTogglePublic = (tripId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notesService.togglePublic(tripId),
    onSuccess: (data) => {
      if (data.is_public) {
        navigator.clipboard?.writeText(`${window.location.origin}/share/${data.share_token}`);
        toast.success('Trip is now public! Share link copied.');
      } else {
        toast.success('Trip is now private.');
      }
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: () => toast.error('Failed to update sharing settings'),
  });
};
