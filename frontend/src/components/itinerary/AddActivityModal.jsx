import React, { useState } from 'react';
import { useAddActivity } from '../../hooks/useItinerary';

const AddActivityModal = ({ tripId, dayId, onClose }) => {
  const addMutation = useAddActivity(tripId);
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    cost: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    addMutation.mutate({ 
      day: dayId, 
      title: formData.title,
      start_time: formData.start_time || null,
      cost: formData.cost || 0
    }, {
      onSuccess: () => {
        onClose();
      }
    });
    // For optimistic UI, we close immediately anyway to feel fast
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <h3 className="text-xl font-bold text-white mb-6">Add Activity</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input 
              required
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Visit Louvre Museum"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Time (Optional)</label>
              <input 
                type="time" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.start_time}
                onChange={e => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cost ($)</label>
              <input 
                type="number" 
                min="0"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.cost}
                onChange={e => setFormData({...formData, cost: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
