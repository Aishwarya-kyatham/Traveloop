import React, { useMemo } from 'react';
import DayBlock from './DayBlock';
import { useDeleteDestination } from '../../hooks/useItinerary';

const DestinationCard = ({ tripId, destination }) => {
  const deleteMutation = useDeleteDestination(tripId);

  const destCost = useMemo(() => {
    return destination.days.flatMap(d => d.activities).reduce((sum, act) => sum + Number(act.cost || 0), 0);
  }, [destination.days]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${destination.city_name}? All days and activities will be lost.`)) {
      deleteMutation.mutate(destination.id);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{destination.city_name}</h2>
          <p className="text-gray-400 text-sm">
            {new Date(destination.arrival_date).toLocaleDateString()} - {new Date(destination.departure_date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Est. Cost</p>
            <p className="text-lg font-bold text-green-400">${destCost.toFixed(2)}</p>
          </div>
          <button 
            onClick={handleDelete}
            className="text-red-400/70 hover:text-red-400 transition-colors p-2"
            title="Delete Destination"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {destination.days.map(day => (
          <DayBlock key={day.id} tripId={tripId} day={day} />
        ))}
        {destination.days.length === 0 && (
          <p className="text-gray-500 text-sm italic">Dates are invalid, no days generated.</p>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
