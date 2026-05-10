import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Clock3, IndianRupee, Plus, Shapes, X } from 'lucide-react';
import { useAddActivity } from '../../hooks/useItinerary';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AddActivityModal = ({ tripId, dayId, onClose }) => {
  const addMutation = useAddActivity(tripId);
  const [formData, setFormData] = useState({
    title: '',
    category: 'other',
    start_time: '',
    cost: '',
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
    let startTime = formData.start_time;
    if (startTime && startTime.length === 5) startTime = `${startTime}:00`;
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

  // Use createPortal to render at document.body, escaping any
  // parent stacking contexts, transforms, or overflow clipping.
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
                <div className="text-2xl font-bold text-slate-900">Add activity</div>
                <div className="mt-1 text-sm text-slate-500">
                  Drop a timed plan into this day and keep the itinerary moving.
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
              <div className="grid gap-5 sm:grid-cols-[1fr_0.8fr]">
                <Input
                  label="Activity title"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Sunset cruise"
                  required
                />
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
                  <div className="relative">
                    <Shapes className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="food">Food</option>
                      <option value="sightseeing">Sightseeing</option>
                      <option value="transport">Transport</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="shopping">Shopping</option>
                      <option value="nightlife">Nightlife</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Start time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))}
                  icon={Clock3}
                />
                <Input
                  label="Estimated cost (INR)"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData((p) => ({ ...p, cost: e.target.value }))}
                  icon={IndianRupee}
                  placeholder="800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" loading={addMutation.isPending}>
                  <Plus className="h-4 w-4" /> Add activity
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

export default AddActivityModal;
