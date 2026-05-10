import React from 'react';
import { useDeleteActivity } from '../../hooks/useItinerary';

const ActivityItem = ({ tripId, activity }) => {
  const deleteActivityMutation = useDeleteActivity(tripId);

  const handleDelete = () => {
    deleteActivityMutation.mutate(activity.id);
  };

  return (
    <div className="flex items-center justify-between p-3 mb-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="text-blue-400 font-mono text-sm w-16">
          {activity.start_time ? activity.start_time.slice(0, 5) : 'Any'}
        </div>
        <div>
          <h4 className="text-white font-medium">{activity.title}</h4>
          {activity.cost > 0 && (
            <span className="text-xs text-green-400 font-medium">${Number(activity.cost).toFixed(2)}</span>
          )}
        </div>
      </div>
      <button 
        onClick={handleDelete}
        className="text-red-400 hover:text-red-300 p-1"
        title="Delete Activity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default ActivityItem;
