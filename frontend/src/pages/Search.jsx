import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Filter, MapPin, Plus, Search as SearchIcon, X } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import { destinationCatalog, travelCategories } from '../data/india';
import { formatCompactCurrency } from '../lib/formatters';
import { useTrips } from '../hooks/useItinerary';

const Search = () => {
  const navigate = useNavigate();
  const { data: trips = [] } = useTrips();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedTripId, setSelectedTripId] = useState('');

  const filtered = useMemo(() => {
    return destinationCatalog.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || 
                           item.vibe.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Discovery engine"
        title="Explore destinations and enrich your trips."
        description="Search for popular Indian cities, filter by your travel vibe, and add them directly to your existing itineraries."
      />

      <section className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-700/60 bg-white/[0.03] px-4 py-3">
                  <SearchIcon className="h-4 w-4 text-slate-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search cities like 'Goa', 'Manali' or vibes like 'friends'..."
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', ...travelCategories].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={[
                        'rounded-full px-4 py-2 text-xs font-semibold transition',
                        category === cat
                          ? 'bg-indigo-500/15 text-white'
                          : 'border border-slate-700/60 bg-white/[0.03] text-slate-400 hover:text-white',
                      ].join(' ')}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <Card key={item.name} hover className="overflow-hidden">
                  <div className="relative h-48">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/20 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">{item.category}</div>
                    <div className="absolute inset-x-4 bottom-4">
                      <div className="text-2xl font-bold text-white">{item.name}</div>
                      <div className="text-xs text-slate-300">{item.vibe}</div>
                    </div>
                  </div>
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500">Typical budget</div>
                      <div className="mt-1 text-lg font-bold text-white">{formatCompactCurrency(item.price)}</div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/create-trip')}>
                      <Plus className="h-3.5 w-3.5" /> Plan trip
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/[0.03] text-slate-500">
                  <SearchIcon className="h-8 w-8" />
                </div>
                <div className="mt-6 text-xl font-bold text-white">No destinations match your search</div>
                <p className="mt-2 text-slate-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Compass className="h-5 w-5 text-indigo-300" />
                <div className="text-lg font-bold text-white">Quick add to trip</div>
              </div>
              <p className="mt-2 text-sm text-slate-500">Select an existing trip to quickly add destinations as you browse.</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Active Trip</label>
                  <select
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700/60 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-indigo-400/60 focus:outline-none"
                  >
                    <option value="">Select a trip...</option>
                    {trips.map(trip => (
                      <option key={trip.id} value={trip.id}>{trip.title}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-slate-700/60 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-300">Tip: Browse & Add</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    Choosing a trip here will enable the "Add to Trip" button on destination cards for even faster planning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-glow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-indigo-300" />
                <div className="text-lg font-bold text-white">Advanced filters</div>
              </div>
              <div className="mt-6 space-y-5">
                {[
                  { label: 'Popularity', options: ['Trending', 'High rated', 'Rising stars'] },
                  { label: 'Budget level', options: ['Economy', 'Mid-range', 'Premium'] },
                  { label: 'Trip type', options: ['Solo', 'Family', 'Friends', 'Honeymoon'] },
                ].map((group) => (
                  <div key={group.label}>
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{group.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => (
                        <span key={opt} className="rounded-full border border-slate-700/60 bg-white/[0.02] px-3 py-1.5 text-[10px] font-bold text-slate-400">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
};

export default Search;
