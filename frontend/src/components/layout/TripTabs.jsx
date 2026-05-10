import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookText, ClipboardCheck, Landmark, ListTree } from 'lucide-react';

const tabs = [
  { key: 'itinerary', label: 'Itinerary', icon: ListTree, path: (id) => `/trip/${id}` },
  { key: 'budget', label: 'Budget', icon: Landmark, path: (id) => `/trip/${id}/budget` },
  { key: 'checklist', label: 'Checklist', icon: ClipboardCheck, path: (id) => `/trip/${id}/checklist` },
  { key: 'notes', label: 'Notes', icon: BookText, path: (id) => `/trip/${id}/notes` },
  { key: 'view', label: 'Preview', icon: BookOpen, path: (id) => `/trip/${id}/view` },
];

const TripTabs = ({ tripId, active }) => (
  <div className="scrollbar-none mb-8 flex gap-3 overflow-x-auto pb-2">
    {tabs.map(({ key, label, icon: Icon, path }) => (
      <Link
        key={key}
        to={path(tripId)}
        className={[
          'inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-3 text-sm font-semibold transition',
          active === key
            ? 'border-indigo-400/30 bg-indigo-500/15 text-white shadow-glow'
            : 'border-slate-700/60 bg-white/[0.03] text-slate-300 hover:border-slate-500/40 hover:text-white',
        ].join(' ')}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    ))}
  </div>
);

export default TripTabs;
