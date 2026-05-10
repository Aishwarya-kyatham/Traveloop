import React, { useEffect, useState } from 'react';
import { CalendarDays, IndianRupee, Type, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import tripService from '../../services/tripService';
import Button from '../ui/Button';
import Card, { CardContent } from '../ui/Card';
import Input from '../ui/Input';

const EditTripModal = ({ trip, onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: trip.title,
    start_date: trip.start_date,
    end_date: trip.end_date,
    budget_limit: trip.budget_limit ?? '',
  });

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const mutation = useMutation({
    mutationFn: (data) => tripService.updateTrip(trip.id, data),
    onSuccess: () => {
      toast.success('Trip updated');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', trip.id] });
      onClose();
    },
    onError: () => toast.error('Failed to update trip'),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      title: form.title,
      start_date: form.start_date,
      end_date: form.end_date,
      budget_limit: form.budget_limit || null,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-lg shadow-glow">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">Edit trip</div>
              <div className="mt-1 text-sm text-slate-500">Refine the trip name, dates, and budget without leaving the dashboard.</div>
            </div>
            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-700/60 p-3 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Trip title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} icon={Type} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Start date" type="date" value={form.start_date} onChange={(event) => setForm((current) => ({ ...current, start_date: event.target.value }))} icon={CalendarDays} required />
              <Input label="End date" type="date" value={form.end_date} onChange={(event) => setForm((current) => ({ ...current, end_date: event.target.value }))} icon={CalendarDays} required />
            </div>
            <Input label="Budget limit (INR)" type="number" value={form.budget_limit} onChange={(event) => setForm((current) => ({ ...current, budget_limit: event.target.value }))} icon={IndianRupee} />
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={mutation.isPending}>Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTripModal;
