import React, { useState } from 'react';
import { CalendarDays, MapPin, Plus, X } from 'lucide-react';
import { useAddDestination } from '../../hooks/useItinerary';
import Button from '../ui/Button';
import Card, { CardContent } from '../ui/Card';
import Input from '../ui/Input';

const AddDestinationModal = ({ tripId, onClose }) => {
  const addMutation = useAddDestination(tripId);
  const [formData, setFormData] = useState({
    city_name: '',
    arrival_date: '',
    departure_date: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addMutation.mutate(
      { trip: tripId, ...formData },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-lg shadow-glow">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">Add destination</div>
              <div className="mt-1 text-sm text-slate-500">Expand your itinerary timeline with the next stop.</div>
            </div>
            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-700/60 p-3 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Destination name" value={formData.city_name} onChange={(event) => setFormData((current) => ({ ...current, city_name: event.target.value }))} icon={MapPin} placeholder="Jaipur" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Arrival date" type="date" value={formData.arrival_date} onChange={(event) => setFormData((current) => ({ ...current, arrival_date: event.target.value }))} icon={CalendarDays} required />
              <Input label="Departure date" type="date" value={formData.departure_date} onChange={(event) => setFormData((current) => ({ ...current, departure_date: event.target.value }))} icon={CalendarDays} required />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={addMutation.isPending}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDestinationModal;
