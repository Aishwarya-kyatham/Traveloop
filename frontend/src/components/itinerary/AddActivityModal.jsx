import React, { useState } from 'react';
import { ChevronDown, Clock3, IndianRupee, Plus, Shapes, X } from 'lucide-react';
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

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Normalize time: Django TimeField is happiest with HH:MM:SS
    let startTime = formData.start_time;
    if (startTime && startTime.length === 5) {
      startTime = `${startTime}:00`;
    }

    addMutation.mutate(
      {
        day: dayId,
        title: formData.title.trim(),
        category: formData.category,
        start_time: startTime || null,
        cost: parseFloat(formData.cost) || 0,
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Visual Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Card */}
      <Card className="relative z-10 w-full max-w-lg max-h-[95vh] overflow-y-auto border-slate-700/50 bg-slate-900 shadow-2xl">
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
            <div className="grid gap-5 sm:grid-cols-[1fr_0.8fr]">
              <Input label="Activity title" value={formData.title} onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))} placeholder="Sunset cruise" required />
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Category</label>
                <div className="relative">
                  <Shapes className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <select
                    value={formData.category}
                    onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))}
                    className="w-full appearance-none rounded-2xl border border-slate-700/60 bg-slate-900/40 py-3 pl-11 pr-10 text-sm text-white focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                  >
                    <option value="food" className="bg-slate-900">Food</option>
                    <option value="sightseeing" className="bg-slate-900">Sightseeing</option>
                    <option value="transport" className="bg-slate-900">Transport</option>
                    <option value="accommodation" className="bg-slate-900">Accommodation</option>
                    <option value="shopping" className="bg-slate-900">Shopping</option>
                    <option value="nightlife" className="bg-slate-900">Nightlife</option>
                    <option value="other" className="bg-slate-900">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                    <ChevronDown className="h-4 w-4" /> 
                  </div>
                </div>
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
