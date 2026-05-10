import React, { useState } from 'react';
import { useAddDestination } from '../../hooks/useItinerary';

const AddDestinationModal = ({ tripId, onClose }) => {
  const addMutation = useAddDestination(tripId);
  const [formData, setFormData] = useState({
    city_name: '',
    arrival_date: '',
    departure_date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.city_name || !formData.arrival_date || !formData.departure_date) return;
    
    addMutation.mutate({ trip: tripId, ...formData }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <h3 className="text-xl font-bold text-white mb-6">Add Destination</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">City Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.city_name}
              onChange={e => setFormData({...formData, city_name: e.target.value})}
              placeholder="e.g. Paris"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Arrival</label>
              <input 
                required
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.arrival_date}
                onChange={e => setFormData({...formData, arrival_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Departure</label>
              <input 
                required
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.departure_date}
                onChange={e => setFormData({...formData, departure_date: e.target.value})}
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
              disabled={addMutation.isPending}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {addMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDestinationModal;
