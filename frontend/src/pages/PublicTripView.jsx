import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { CalendarDays, Copy, Globe2, Plane } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { usePublicTrip } from '../hooks/useNotes';
import { useAuth } from '../context/AuthContext';
import { formatDateRange, formatShortDate } from '../lib/formatters';
import tripService from '../services/tripService';

const PublicTripView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useParams();
  const { isAuthenticated } = useAuth();
  const { data: trip, isLoading, error } = usePublicTrip(token);

  const cloneMutation = useMutation({
    mutationFn: () => tripService.cloneTrip(trip.id),
    onSuccess: (cloned) => {
      toast.success('Trip copied to your library!');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      navigate(`/trip/${cloned.id}`);
    },
    onError: () => toast.error('Failed to copy trip. Make sure you are logged in.'),
  });

  if (isLoading) {
    return (
      <AppShell className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="glass-panel rounded-[28px] px-6 py-5 text-sm text-slate-300">Loading shared trip...</div>
      </AppShell>
    );
  }

  if (error || !trip) {
    return (
      <AppShell>
        <EmptyState icon={Plane} title="Shared trip unavailable" description="This share link may be private, expired, or incorrect." action={<Link to="/" className="text-indigo-300">Go to Traveloop home</Link>} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mb-10 text-center">
        <div className="section-label mx-auto mb-4 w-fit"><Globe2 className="h-3.5 w-3.5" /> Shared itinerary</div>
        <h1 className="text-5xl font-extrabold text-white">{trip.title}</h1>
        <p className="mt-4 text-sm text-slate-400">{formatDateRange(trip.start_date, trip.end_date)} · {trip.destinations?.length || 0} destinations</p>
        
        {isAuthenticated ? (
          <div className="mt-8">
            <Button size="lg" onClick={() => cloneMutation.mutate()} loading={cloneMutation.isPending}>
              <Copy className="h-4 w-4" /> Copy trip to my library
            </Button>
          </div>
        ) : (
          <div className="mt-8">
            <Link to="/register">
              <Button size="lg">Sign up to copy this trip</Button>
            </Link>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6">
          {(trip.destinations || []).map((destination, destinationIndex) => (
            <Card key={destination.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-indigo-500/12 text-lg font-bold text-indigo-200">{destinationIndex + 1}</div>
                  <div>
                    <div className="text-2xl font-bold text-white">{destination.city_name}</div>
                    <div className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4 text-indigo-300" /> {formatDateRange(destination.arrival_date, destination.departure_date)}</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {(destination.days || []).map((day, dayIndex) => (
                    <div key={day.id} className="rounded-3xl border border-slate-700/60 bg-white/[0.03] p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Day {dayIndex + 1}</div>
                      <div className="mt-2 text-lg font-bold text-white">{formatShortDate(day.date, { weekday: 'long' })}</div>
                      <div className="mt-4 grid gap-3">
                        {(day.activities || []).length ? (
                          day.activities.map((activity) => (
                            <div key={activity.id} className="rounded-2xl border border-slate-700/60 bg-slate-950/60 px-4 py-3">
                              <div className="font-semibold text-white">{activity.title}</div>
                              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{activity.category || 'other'} {activity.start_time ? `· ${activity.start_time.slice(0, 5)}` : ''}</div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-700/60 bg-white/[0.02] px-4 py-6 text-center text-sm text-slate-500">
                            No activities listed for this day.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-slate-500">
          Planned with <Link to="/" className="font-semibold text-indigo-300">Traveloop</Link>
        </div>
      </div>
    </AppShell>
  );
};

export default PublicTripView;
