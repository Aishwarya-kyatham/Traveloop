import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tripService from '../services/tripService';

const SUGGESTIONS = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop' },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format&fit=crop' },
  { name: 'Ooty', image: 'https://images.unsplash.com/photo-1623345805780-8f01f714e65f?q=80&w=600&auto=format&fit=crop' },
  { name: 'Pondicherry', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop' },
  { name: 'Ladakh', image: 'https://picsum.photos/seed/ladakh/600/400' },
  { name: 'Agra', image: 'https://picsum.photos/seed/agra/600/400' },
  { name: 'Varanasi', image: 'https://picsum.photos/seed/varanasi/600/400' },
  { name: 'Darjeeling', image: 'https://picsum.photos/seed/darjeeling/600/400' },
  { name: 'Hampi', image: 'https://picsum.photos/seed/hampi/600/400' },
  { name: 'Andaman', image: 'https://picsum.photos/seed/andaman/600/400' }
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    place: '',
    start_date: '',
    end_date: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSuggestionClick = (placeName) => {
    setFormData({ ...formData, place: placeName, title: formData.title || `Trip to ${placeName}` });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.place || !formData.start_date || !formData.end_date) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError('End date cannot be before start date.');
      return;
    }

    try {
      setLoading(true);
      const newTrip = await tripService.createTrip(formData);
      navigate(`/workspace/${newTrip.id}`);
    } catch (err) {
      setError('Failed to create trip. Please try again.');
      console.error('Error creating trip:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      {/* Form Section */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Plan a new trip</h1>
            <p className="mt-2 text-slate-500">Where do you want to go?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Trip Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Summer in Goa"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="place" className="block text-sm font-medium text-slate-700 mb-1">Select Place</label>
                <input
                  type="text"
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  placeholder="Where are you going?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-medium text-lg transition-all
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow'
                }`}
            >
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
          </form>
        </div>
      </div>

      {/* Suggestions Section (Full Width) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Suggestions for Places to Visit</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {SUGGESTIONS.map((suggestion) => (
            <div 
              key={suggestion.name}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="group relative h-40 rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-4 hover:ring-blue-500/30"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
              <img 
                src={suggestion.image} 
                alt={suggestion.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 transform-gpu"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-white font-bold text-lg tracking-wide drop-shadow-md">
                  {suggestion.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
