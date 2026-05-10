import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Printer, Share2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import TripTabs from '../components/layout/TripTabs';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import { useTrip } from '../hooks/useItinerary';
import { useTogglePublic } from '../hooks/useNotes';
import { formatCurrency, formatDateRange, formatShortDate } from '../lib/formatters';

const ItineraryView = () => {
  const { tripId } = useParams();
  const { data: trip, isLoading } = useTrip(tripId);
  const togglePublic = useTogglePublic(tripId);

  if (isLoading || !trip) {
    return (
      <AppShell className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="glass-panel rounded-[28px] px-6 py-5 text-sm text-slate-300">Preparing trip preview...</div>
      </AppShell>
    );
  }

  const total = (trip.destinations || []).flatMap((destination) => destination.days || []).flatMap((day) => day.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0);

  return (
    <AppShell>
      <Link to={`/trip/${tripId}`} className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to itinerary
      </Link>

      <PageHeader
        eyebrow="Preview"
        title={`${trip.title} trip preview`}
        description={`${formatDateRange(trip.start_date, trip.end_date)} · Clean itinerary summary ready for sharing.`}
        actions={
          <>
            <Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
            <Button onClick={() => togglePublic.mutate()} loading={togglePublic.isPending}><Share2 className="h-4 w-4" /> {trip.is_public ? 'Copy share link' : 'Share trip'}</Button>
          </>
        }
      />

      <TripTabs tripId={tripId} active="view" />

      <Card>
        <CardContent className="p-8">
          <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-indigo-300" /> {formatDateRange(trip.start_date, trip.end_date)}</span>
            <span>{trip.destinations?.length || 0} destinations</span>
            <span>{formatCurrency(total)} total planned spend</span>
          </div>

          <div className="grid gap-8">
            {(trip.destinations || []).map((destination, destinationIndex) => (
              <div key={destination.id} className="rounded-[28px] border border-slate-700/60 bg-white/[0.02] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-indigo-500/12 text-lg font-bold text-indigo-200">{destinationIndex + 1}</div>
                  <div>
                    <div className="text-2xl font-bold text-white">{destination.city_name}</div>
                    <div className="text-sm text-slate-500">{formatDateRange(destination.arrival_date, destination.departure_date)}</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {(destination.days || []).map((day, dayIndex) => (
                    <div key={day.id} className="rounded-3xl border border-slate-700/60 bg-white/[0.03] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Day {dayIndex + 1}</div>
                          <div className="mt-2 text-lg font-bold text-white">{formatShortDate(day.date, { weekday: 'long' })}</div>
                        </div>
                        <div className="text-sm text-slate-500">{formatCurrency((day.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0))}</div>
                      </div>
                      <div className="mt-4 grid gap-3">
                        {(day.activities || []).length ? (
                          day.activities.map((activity) => (
                            <div key={activity.id} className="rounded-2xl border border-slate-700/60 bg-slate-950/50 px-4 py-3">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <div className="font-semibold text-white">{activity.title}</div>
                                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{activity.category || 'other'} {activity.start_time ? `· ${activity.start_time.slice(0, 5)}` : ''}</div>
                                </div>
                                <div className="text-sm text-slate-300">{Number(activity.cost) > 0 ? formatCurrency(activity.cost) : 'No cost'}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-700/60 bg-white/[0.02] px-4 py-6 text-center text-sm text-slate-500">
                            No activities for this day yet.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
};

export default ItineraryView;
