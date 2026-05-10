import React, { useMemo, useState } from 'react';
import ActivityItem from './ActivityItem';
import AddActivityModal from './AddActivityModal';

const DayBlock = ({ tripId, day }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dayCost = useMemo(() => {
    return day.activities.reduce((sum, act) => sum + Number(act.cost || 0), 0);
  }, [day.activities]);

  const sortedActivities = useMemo(() => {
    return [...day.activities].sort((a, b) => {
      const timeA = a.start_time || '23:59';
      const timeB = b.start_time || '23:59';
      return timeA.localeCompare(timeB);
    });
  }, [day.activities]);

  // Format date nicely (e.g., "Aug 15, 2024")
  const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  return (
    <div className="mb-6 pl-4 border-l-2 border-indigo-500/30 ml-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{formattedDate}</h3>
        {dayCost > 0 && (
          <span className="text-sm text-gray-400">Day Cost: <span className="text-white">${dayCost.toFixed(2)}</span></span>
        )}
      </div>

      <div className="space-y-2">
        {sortedActivities.length === 0 ? (
          <div className="p-4 border border-dashed border-white/20 rounded-lg text-center text-gray-500 text-sm">
            No activities planned for this day.
          </div>
        ) : (
          sortedActivities.map(activity => (
            <ActivityItem key={activity.id} tripId={tripId} activity={activity} />
          ))
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 flex items-center transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Activity
      </button>

      {isModalOpen && (
        <AddActivityModal
          tripId={tripId}
          dayId={day.id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DayBlock;
