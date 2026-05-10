import React, { useMemo } from 'react';
import { CalendarDays, MapPin, Trash2 } from 'lucide-react';
import DayBlock from './DayBlock';
import { useDeleteDestination } from '../../hooks/useItinerary';
import Card, { CardContent } from '../ui/Card';
import { formatCurrency, formatDateRange } from '../../lib/formatters';

const DestinationCard = ({ tripId, destination, index }) => {
  const deleteMutation = useDeleteDestination(tripId);

  const destinationCost = useMemo(() => {
    return (destination.days || []).flatMap((day) => day.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0);
  }, [destination.days]);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-800/80 bg-white/[0.02] px-6 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-indigo-500/12 text-lg font-bold text-indigo-200">
              {index + 1}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-indigo-300" />
                <h3 className="text-3xl font-bold text-white">{destination.city_name}</h3>
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
                <CalendarDays className="h-4 w-4 text-indigo-300" />
                {formatDateRange(destination.arrival_date, destination.departure_date)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-3xl border border-slate-700/60 bg-white/[0.03] px-4 py-3">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Destination spend</div>
              <div className="mt-2 text-lg font-bold text-white">{formatCurrency(destinationCost)}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete ${destination.city_name} and all its activities?`)) {
                  deleteMutation.mutate(destination.id);
                }
              }}
              className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-red-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <CardContent className="grid gap-4 p-6">
        {(destination.days || []).length ? (
          destination.days.map((day) => <DayBlock key={day.id} tripId={tripId} day={day} />)
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700/60 bg-white/[0.02] px-4 py-10 text-center text-sm text-slate-500">
            No dates or activities exist for this destination yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DestinationCard;
