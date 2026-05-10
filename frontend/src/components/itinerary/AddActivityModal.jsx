import React, { useState } from 'react';
import { Clock3, IndianRupee, Plus, Shapes, X } from 'lucide-react';
import { useAddActivity } from '../../hooks/useItinerary';
import Button from '../ui/Button';
import Card, { CardContent } from '../ui/Card';
import Input from '../ui/Input';

const AddActivityModal = ({ tripId, dayId, onClose }) => {
  const addMutation = useAddActivity(tripId);
  const [formData, setFormData] = useState({
    title: '',
    category: 'other',
    start_time: '',
    cost: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addMutation.mutate(
      {
        day: dayId,
        title: formData.title,
        category: formData.category,
        start_time: formData.start_time || null,
        cost: formData.cost || 0,
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-lg shadow-glow">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">Add activity</div>
              <div className="mt-1 text-sm text-slate-500">Drop a timed plan into this day and keep the itinerary moving.</div>
            </div>
            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-700/60 p-3 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Activity title" value={formData.title} onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))} placeholder="Sunset cruise" required />
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Category</label>
              <div className="relative">
                <Shapes className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  value={formData.category}
                  onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-700/60 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                >
                  <option value="food">Food</option>
                  <option value="sightseeing">Sightseeing</option>
                  <option value="transport">Transport</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="shopping">Shopping</option>
                  <option value="nightlife">Nightlife</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Start time" type="time" value={formData.start_time} onChange={(event) => setFormData((current) => ({ ...current, start_time: event.target.value }))} icon={Clock3} />
              <Input label="Estimated cost (INR)" type="number" value={formData.cost} onChange={(event) => setFormData((current) => ({ ...current, cost: event.target.value }))} icon={IndianRupee} placeholder="800" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={addMutation.isPending}>
                <Plus className="h-4 w-4" /> Add activity
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddActivityModal;
