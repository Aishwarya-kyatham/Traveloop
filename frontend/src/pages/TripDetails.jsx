import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrip } from '../hooks/useItinerary';
import DestinationCard from '../components/itinerary/DestinationCard';
import AddDestinationModal from '../components/itinerary/AddDestinationModal';

const TripDetails = () => {
  const { tripId } = useParams();
  const { data: trip, isLoading, isError } = useTrip(tripId);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);

  const totalCost = useMemo(() => {
    if (!trip || !trip.destinations) return 0;
    return trip.destinations
      .flatMap(d => d.days)
      .flatMap(d => d.activities)
      .reduce((sum, act) => sum + Number(act.cost || 0), 0);
  }, [trip]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-white mb-4">Trip not found</h2>
        <Link to="/dashboard" className="text-indigo-400 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white mb-2 inline-flex items-center">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{trip.title}</h1>
            <p className="text-gray-400 mt-2">
              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Total Trip Cost</p>
            <p className="text-3xl font-bold text-green-400">${totalCost.toFixed(2)}</p>
            {trip.budget_limit && (
              <p className="text-xs text-gray-500 mt-1">Budget: ${Number(trip.budget_limit).toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Destinations Timeline */}
        <div className="space-y-6 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-indigo-500/20 -z-10"></div>
          
          {trip.destinations.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-12 text-center">
              <p className="text-gray-400 mb-4">Your itinerary is empty.</p>
              <button 
                onClick={() => setIsDestModalOpen(true)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
              >
                Start Planning
              </button>
            </div>
          ) : (
            trip.destinations.map((dest) => (
              <DestinationCard key={dest.id} tripId={tripId} destination={dest} />
            ))
          )}
        </div>

        {/* Bottom Actions */}
        {trip.destinations.length > 0 && (
          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsDestModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Next Destination
            </button>
          </div>
        )}

      </div>

      {isDestModalOpen && (
        <AddDestinationModal tripId={tripId} onClose={() => setIsDestModalOpen(false)} />
      )}
    </div>
  );
};

export default TripDetails;
