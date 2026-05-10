import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, MapPin, Plus, X } from 'lucide-react';
import { useAddDestination } from '../../hooks/useItinerary';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AddDestinationModal = ({ tripId, onClose }) => {
  const addMutation = useAddDestination(tripId);
  const [formData, setFormData] = useState({
    city_name: '',
    arrival_date: '',
    departure_date: '',
  });

  // Lock background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addMutation.mutate(
      { trip: tripId, ...formData },
      { onSuccess: () => onClose() }
    );
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          zIndex: 9998,
        }}
      />

      {/* Modal centering wrapper */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {/* Modal card */}
        <div
          style={{
            width: '100%',
            maxWidth: '32rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(226, 232, 240, 1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ padding: '32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <div className="text-2xl font-bold text-slate-900">Add destination</div>
                <div className="mt-1 text-sm text-slate-500">
                  Expand your itinerary timeline with the next stop.
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 p-3 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Destination name"
                value={formData.city_name}
                onChange={(e) => setFormData((p) => ({ ...p, city_name: e.target.value }))}
                icon={MapPin}
                placeholder="Jaipur"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Arrival date"
                  type="date"
                  value={formData.arrival_date}
                  onChange={(e) => setFormData((p) => ({ ...p, arrival_date: e.target.value }))}
                  icon={CalendarDays}
                  required
                />
                <Input
                  label="Departure date"
                  type="date"
                  value={formData.departure_date}
                  onChange={(e) => setFormData((p) => ({ ...p, departure_date: e.target.value }))}
                  icon={CalendarDays}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" loading={addMutation.isPending}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AddDestinationModal;
