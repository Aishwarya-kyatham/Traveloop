import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPinned, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import EditTripModal from '../components/trip/EditTripModal';
import { useTrips } from '../hooks/useItinerary';
import { formatCurrency, formatDateRange, getTripStatus } from '../lib/formatters';
import tripService from '../services/tripService';

const filters = ['All', 'upcoming', 'active', 'completed'];

const MyTrips = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: trips = [], isLoading } = useTrips();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editingTrip, setEditingTrip] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: tripService.deleteTrip,
    onSuccess: () => {
      toast.success('Trip deleted');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setConfirmDeleteId(null);
    },
    onError: () => toast.error('Failed to delete trip'),
  });

  const filtered = useMemo(() => {
    return trips.filter((trip) => {
      const status = getTripStatus(trip);
      const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' ? true : status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [trips, search, filter]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Trip library"
        title="Every trip in one consistent workspace."
        description="Search, reopen, edit, and manage all your active and completed travel plans from one place."
        actions={<Button onClick={() => navigate('/create-trip')}><Plus className="h-4 w-4" /> New Trip</Button>}
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  filter === item
                    ? 'bg-indigo-500/15 text-white'
                    : 'border border-slate-700/60 bg-white/[0.03] text-slate-400 hover:text-white',
                ].join(' ')}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-700/60 bg-white/[0.03] px-4 py-3 lg:min-w-[320px]">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search trips"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="glass-panel h-56 animate-pulse rounded-[28px]" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="No trips found"
          description={search ? `No trips match "${search}" right now.` : 'Create your first trip to start building itineraries, budgets, notes, and checklists.'}
          action={!search ? <Button onClick={() => navigate('/create-trip')}>Create trip</Button> : null}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((trip) => {
            const totalCost = trip.destinations?.flatMap((destination) => destination.days || []).flatMap((day) => day.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0) || 0;
            const status = getTripStatus(trip);

            return (
              <Card key={trip.id} hover>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="rounded-full bg-indigo-500/12 px-3 py-1 text-xs font-semibold capitalize text-indigo-200">{status}</div>
                      <h2 className="mt-4 text-2xl font-bold text-white">{trip.title}</h2>
                    </div>
                    <button type="button" onClick={() => setEditingTrip(trip)} className="rounded-2xl border border-slate-700/60 bg-white/[0.03] p-3 text-slate-300 transition hover:text-white">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="flex items-center gap-3 text-sm text-slate-400"><CalendarDays className="h-4 w-4 text-indigo-300" /> {formatDateRange(trip.start_date, trip.end_date)}</div>
                    <div className="flex items-center gap-3 text-sm text-slate-400"><MapPinned className="h-4 w-4 text-indigo-300" /> {trip.destinations?.length || 0} destinations added</div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Current spend</div>
                      <div className="mt-2 font-bold text-white">{formatCurrency(totalCost)}</div>
                    </div>
                    {confirmDeleteId === trip.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(trip.id)}>Delete</Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => navigate(`/trip/${trip.id}`)}>Open</Button>
                        <button type="button" onClick={() => setConfirmDeleteId(trip.id)} className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-red-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {editingTrip ? <EditTripModal trip={editingTrip} onClose={() => setEditingTrip(null)} /> : null}
    </AppShell>
  );
};

export default MyTrips;
