import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, IndianRupee, MapPinned, Plus } from 'lucide-react';
import AddDestinationModal from '../components/itinerary/AddDestinationModal';
import DestinationCard from '../components/itinerary/DestinationCard';
import AppShell from '../components/layout/AppShell';
import TripTabs from '../components/layout/TripTabs';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useTrip } from '../hooks/useItinerary';
import { daysBetweenInclusive, formatCurrency, formatDateRange } from '../lib/formatters';

const TripDetails = () => {
  const { tripId } = useParams();
  const { data: trip, isLoading, isError } = useTrip(tripId);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);

  const totals = useMemo(() => {
    if (!trip) return { cost: 0, days: 0 };
    return {
      cost: (trip.destinations || []).flatMap((destination) => destination.days || []).flatMap((day) => day.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0),
      days: daysBetweenInclusive(trip.start_date, trip.end_date),
    };
  }, [trip]);

  if (isLoading) {
    return (
      <AppShell className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="glass-panel rounded-[28px] px-6 py-5 text-sm text-slate-300">Loading your itinerary...</div>
      </AppShell>
    );
  }

  if (isError || !trip) {
    return (
      <AppShell>
        <EmptyState icon={MapPinned} title="Trip not found" description="We could not find this itinerary. It may have been removed or is no longer available." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link to="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <PageHeader
        eyebrow="Trip planner"
        title={trip.title}
        description={`${formatDateRange(trip.start_date, trip.end_date)} · ${trip.destinations?.length || 0} destinations · ${totals.days} days`}
        actions={<Button onClick={() => setIsDestModalOpen(true)}><Plus className="h-4 w-4" /> Add destination</Button>}
      />

      <TripTabs tripId={tripId} active="itinerary" />

      <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Sidebar Left: Trip Pulse & Stats */}
        <div className="flex flex-col gap-6">
          <Card className="border-indigo-500/10 bg-indigo-500/5 shadow-2xl">
            <CardContent className="p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Trip Pulse</div>
              <div className="grid gap-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.05]">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                    <CalendarDays className="h-4 w-4 text-indigo-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Duration</span>
                  </div>
                  <div className="text-2xl font-black text-white">{totals.days} Days</div>
                </div>
                
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.05]">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                    <MapPinned className="h-4 w-4 text-indigo-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Destinations</span>
                  </div>
                  <div className="text-2xl font-black text-white">{trip.destinations?.length || 0}</div>
                </div>
                
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 transition-all hover:bg-indigo-500/20 shadow-lg shadow-indigo-950/20">
                  <div className="flex items-center gap-3 text-indigo-300 mb-2">
                    <IndianRupee className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Spend</span>
                  </div>
                  <div className="text-3xl font-black text-white">{formatCurrency(totals.cost)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-slate-900/40">
            <CardContent className="p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Planner flow</div>
              <p className="text-sm leading-relaxed text-slate-400 font-medium">
                Add destinations first, fill each day with activities, then refine your budget, checklist, and notes using the tabs above.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Timeline Right */}
        <div className="flex flex-col gap-8">
          {(trip.destinations || []).length === 0 ? (
            <EmptyState
              icon={MapPinned}
              title="Start your itinerary timeline"
              description="Add your first destination to generate day blocks for activities, notes, and budget tracking."
              action={<Button variant="primary" onClick={() => setIsDestModalOpen(true)}>Add first destination</Button>}
            />
          ) : (
            <div className="space-y-8">
              {trip.destinations.map((destination, index) => (
                <div key={destination.id} className="relative">
                  <DestinationCard tripId={tripId} destination={destination} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {isDestModalOpen ? <AddDestinationModal tripId={tripId} onClose={() => setIsDestModalOpen(false)} /> : null}
    </AppShell>
  );
};

export default TripDetails;
