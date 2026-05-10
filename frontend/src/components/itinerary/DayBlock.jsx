import React, { useMemo, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import AddActivityModal from './AddActivityModal';
import ActivityItem from './ActivityItem';
import Button from '../ui/Button';
import { formatCurrency, formatShortDate } from '../../lib/formatters';

const DayBlock = ({ tripId, day }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortedActivities = useMemo(() => {
    return [...(day.activities || [])].sort((a, b) => (a.start_time || '23:59').localeCompare(b.start_time || '23:59'));
  }, [day.activities]);

  const dayCost = useMemo(() => {
    return (day.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0);
  }, [day.activities]);

  return (
    <div className="rounded-[28px] border border-slate-700/60 bg-white/[0.02] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Day plan</div>
          <div className="mt-2 flex items-center gap-3 text-white">
            <CalendarDays className="h-4 w-4 text-indigo-300" />
            <span className="text-lg font-bold">{formatShortDate(day.date, { weekday: 'short' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
            {(day.activities || []).length} activities
            {dayCost > 0 ? <span className="ml-2 font-semibold text-white">{formatCurrency(dayCost)}</span> : null}
          </div>
          <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add activity
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {sortedActivities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700/60 bg-white/[0.02] px-4 py-8 text-center text-sm text-slate-500">
            No activities planned yet for this day.
          </div>
        ) : (
          sortedActivities.map((activity) => <ActivityItem key={activity.id} tripId={tripId} activity={activity} />)
        )}
      </div>

      {isModalOpen ? <AddActivityModal tripId={tripId} dayId={day.id} onClose={() => setIsModalOpen(false)} /> : null}
    </div>
  );
};

export default DayBlock;
