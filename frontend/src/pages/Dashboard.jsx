import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Filter, MapPinned, Plane, Plus, Search, Sparkles, Users } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { destinationCatalog, travelCategories } from '../data/india';
import { useTrips } from '../hooks/useItinerary';
import { formatCompactCurrency, formatCurrency, formatDateRange, getTripStatus } from '../lib/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: trips = [], isLoading, error } = useTrips();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => trip.title.toLowerCase().includes(search.toLowerCase()));
  }, [trips, search]);

  const featuredDestinations = useMemo(() => {
    if (selectedCategory === 'All') return destinationCatalog.slice(0, 6);
    return destinationCatalog.filter((item) => item.category === selectedCategory).slice(0, 6);
  }, [selectedCategory]);

  const upcomingTrips = filteredTrips.filter((trip) => getTripStatus(trip) !== 'completed').slice(0, 3);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Explore dashboard"
        title={`Namaste${user?.first_name ? `, ${user.first_name}` : ''}. Ready to plan the next trip?`}
        description="Discover Indian destinations, track your active plans, and jump back into shared itineraries without losing context."
        actions={<Button onClick={() => navigate('/create-trip')}><Plus className="h-4 w-4" /> Plan Trip</Button>}
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardContent className="relative min-h-[320px] p-0">
            <img
              src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1600&auto=format&fit=crop"
              alt="India travel banner"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f1a] via-[#0b0f1a]/75 to-[#0b0f1a]/35" />
            <div className="relative flex h-full flex-col justify-between p-8">
              <div>
                <div className="section-label mb-4"><Sparkles className="h-3.5 w-3.5" /> India-first planning</div>
                <h2 className="max-w-2xl text-4xl font-extrabold text-white">From Goa weekends to Ladakh circuits, plan every detail in one premium workflow.</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">Keep itinerary, budget, checklist, and notes synced for group trips, family holidays, and college getaways.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="glass-panel rounded-3xl p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Avg. trip budget</div>
                  <div className="mt-2 text-xl font-bold text-white">{formatCompactCurrency(24500)}</div>
                </div>
                <div className="glass-panel rounded-3xl p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Popular format</div>
                  <div className="mt-2 text-xl font-bold text-white">Friends + family</div>
                </div>
                <div className="glass-panel rounded-3xl p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Best for</div>
                  <div className="mt-2 text-xl font-bold text-white">Budget-conscious travel</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3 rounded-3xl border border-slate-700/60 bg-white/[0.03] px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your trips or plans"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', ...travelCategories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={[
                    'rounded-full px-3 py-2 text-xs font-semibold transition',
                    selectedCategory === category
                      ? 'bg-indigo-500/15 text-white'
                      : 'border border-slate-700/60 bg-white/[0.03] text-slate-400 hover:text-white',
                  ].join(' ')}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-3">
              {[
                { label: 'Open trips', value: filteredTrips.length || 0 },
                { label: 'Destinations tracked', value: filteredTrips.reduce((total, trip) => total + (trip.destinations?.length || 0), 0) },
                { label: 'Shared travellers', value: 'Crew-ready' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-3xl border border-slate-700/60 bg-white/[0.03] px-4 py-4">
                  <span className="text-sm text-slate-400">{stat.label}</span>
                  <span className="text-lg font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Top Indian destinations</h2>
            <p className="mt-2 text-sm text-slate-500">Curated for the way Indian travellers search, compare, and budget.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredDestinations.map((destination) => (
            <Card key={destination.name} hover className="overflow-hidden">
              <div className="relative h-52">
                <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/25 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">{destination.category}</div>
                <div className="absolute inset-x-5 bottom-5">
                  <div className="text-2xl font-bold text-white">{destination.name}</div>
                  <div className="text-sm text-slate-300">{destination.blurb}</div>
                </div>
              </div>
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Starter budget</div>
                  <div className="mt-2 text-lg font-bold text-white">{formatCompactCurrency(destination.price)}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/create-trip')}>Plan trip</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Your trips</h2>
            <p className="mt-2 text-sm text-slate-500">A clean overview of active plans, upcoming getaways, and budget-aware itineraries.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="glass-panel h-56 animate-pulse rounded-[28px]" />)}
          </div>
        ) : error ? (
          <EmptyState icon={MapPinned} title="Trips could not be loaded" description="We hit a snag while fetching your plans. Please refresh and try again." />
        ) : upcomingTrips.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No trips yet"
            description="Create your first itinerary to unlock budget tracking, checklists, notes, and a shared trip view."
            action={<Button onClick={() => navigate('/create-trip')}>Create your first trip</Button>}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingTrips.map((trip) => {
              const totalCost = trip.destinations?.flatMap((destination) => destination.days || []).flatMap((day) => day.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0) || 0;
              return (
                <Card key={trip.id} hover className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="rounded-full bg-indigo-500/12 px-3 py-1 text-xs font-semibold text-indigo-200">{getTripStatus(trip)}</div>
                        <h3 className="mt-4 text-2xl font-bold text-white">{trip.title}</h3>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] text-indigo-200">
                        <Plane className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3">
                      <div className="flex items-center gap-3 text-sm text-slate-400"><CalendarDays className="h-4 w-4 text-indigo-300" /> {formatDateRange(trip.start_date, trip.end_date)}</div>
                      <div className="flex items-center gap-3 text-sm text-slate-400"><MapPinned className="h-4 w-4 text-indigo-300" /> {trip.destinations?.length || 0} destinations added</div>
                      <div className="flex items-center gap-3 text-sm text-slate-400"><Users className="h-4 w-4 text-indigo-300" /> Group-friendly planning layout</div>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
                      <div>
                        <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Current spend</div>
                        <div className="mt-2 font-bold text-white">{formatCurrency(totalCost)}</div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => navigate(`/trip/${trip.id}`)}>Open trip</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Button
        className="fixed bottom-6 right-6 z-40 rounded-full px-6"
        size="lg"
        onClick={() => navigate('/create-trip')}
      >
        <Plus className="h-4 w-4" /> Plan Trip
      </Button>
    </AppShell>
  );
};

export default Dashboard;
