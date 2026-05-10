import React from 'react';
import { Car, Eye, Home, IndianRupee, Music, Package, ShoppingCart, Trash2, Utensils } from 'lucide-react';
import { useDeleteActivity } from '../../hooks/useItinerary';
import { formatCurrency } from '../../lib/formatters';

const categoryMeta = {
  food: { label: 'Food', icon: Utensils, tone: 'bg-orange-500/12 text-orange-200' },
  sightseeing: { label: 'Sightseeing', icon: Eye, tone: 'bg-blue-500/12 text-blue-200' },
  transport: { label: 'Transport', icon: Car, tone: 'bg-indigo-500/12 text-indigo-200' },
  accommodation: { label: 'Stay', icon: Home, tone: 'bg-emerald-500/12 text-emerald-200' },
  shopping: { label: 'Shopping', icon: ShoppingCart, tone: 'bg-pink-500/12 text-pink-200' },
  nightlife: { label: 'Nightlife', icon: Music, tone: 'bg-violet-500/12 text-violet-200' },
  other: { label: 'Other', icon: Package, tone: 'bg-slate-700/70 text-slate-200' },
};

const ActivityItem = ({ tripId, activity }) => {
  const deleteActivityMutation = useDeleteActivity(tripId);
  const meta = categoryMeta[activity.category] || categoryMeta.other;
  const Icon = meta.icon;

  const handleDelete = () => {
    if (window.confirm(`Delete activity "${activity.title}"?`)) {
      deleteActivityMutation.mutate(activity.id);
    }
  };

  return (
    <div className="group rounded-3xl border border-slate-700/60 bg-white/[0.03] p-4 transition hover:border-slate-500/40 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-950/70 text-[11px] font-semibold text-slate-300">
            <span>{activity.start_time ? activity.start_time.slice(0, 5) : 'Any'}</span>
          </div>
          <div>
            <div className="text-base font-semibold text-white">{activity.title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={['inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold', meta.tone].join(' ')}>
                <Icon className="h-3.5 w-3.5" />
                {meta.label}
              </span>
              {Number(activity.cost) > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {formatCurrency(activity.cost)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <button type="button" onClick={handleDelete} className="rounded-2xl p-3 text-slate-500 transition hover:bg-red-500/10 hover:text-red-200">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ActivityItem;
