import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Landmark, MapPinned, PieChart } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import TripTabs from '../components/layout/TripTabs';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useTrip } from '../hooks/useItinerary';
import { formatCurrency, formatDateRange, formatShortDate } from '../lib/formatters';

const categoryLabels = {
  food: 'Food',
  sightseeing: 'Sightseeing',
  transport: 'Transport',
  accommodation: 'Stay',
  shopping: 'Shopping',
  nightlife: 'Nightlife',
  other: 'Other',
};

const BudgetView = () => {
  const { tripId } = useParams();
  const { data: trip, isLoading } = useTrip(tripId);

  const budget = useMemo(() => {
    if (!trip) return null;
    const activities = (trip.destinations || []).flatMap((destination) => destination.days || []).flatMap((day) => day.activities || []);
    const total = activities.reduce((sum, activity) => sum + Number(activity.cost || 0), 0);
    const limit = Number(trip.budget_limit || 0);
    const byCategory = activities.reduce((acc, activity) => {
      const key = activity.category || 'other';
      acc[key] = (acc[key] || 0) + Number(activity.cost || 0);
      return acc;
    }, {});
    const byDay = (trip.destinations || []).flatMap((destination) =>
      (destination.days || []).map((day) => ({
        id: `${destination.id}-${day.id}`,
        date: day.date,
        destination: destination.city_name,
        total: (day.activities || []).reduce((sum, activity) => sum + Number(activity.cost || 0), 0),
      }))
    );
    return { total, limit, byCategory, byDay };
  }, [trip]);

  if (isLoading) {
    return (
      <AppShell className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="glass-panel rounded-[28px] px-6 py-5 text-sm text-slate-300">Loading the budget view...</div>
      </AppShell>
    );
  }

  if (!trip || !budget) {
    return (
      <AppShell>
        <EmptyState icon={Landmark} title="Budget not available" description="We could not load the budget data for this trip." />
      </AppShell>
    );
  }

  const maxCategory = Math.max(...Object.values(budget.byCategory), 1);

  return (
    <AppShell>
      <Link to={`/trip/${tripId}`} className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to itinerary
      </Link>

      <PageHeader
        eyebrow="Budget"
        title={`${trip.title} spend overview`}
        description={`${formatDateRange(trip.start_date, trip.end_date)} · Clean breakdown in INR across destinations, categories, and days.`}
      />

      <TripTabs tripId={tripId} active="budget" />

      <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Sidebar Left: Budget Overview */}
        <div className="flex flex-col gap-6">
          <Card className="border-indigo-500/10 bg-indigo-500/5 shadow-2xl">
            <CardContent className="p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Budget Summary</div>
              <div className="grid gap-4">
                {[
                  { label: 'Total Planned', value: formatCurrency(budget.total), icon: IndianRupee, highlight: true },
                  { label: 'Budget Limit', value: budget.limit ? formatCurrency(budget.limit) : 'Not set', icon: Landmark },
                  { label: 'Remaining', value: budget.limit ? formatCurrency(budget.limit - budget.total) : 'Track manually', icon: PieChart },
                  { label: 'Daily Avg', value: formatCurrency(budget.total / Math.max(1, budget.byDay.length)), icon: MapPinned },
                ].map(({ label, value, icon: Icon, highlight }) => {
                  const isOverBudget = label === 'Remaining' && budget.limit > 0 && budget.total > budget.limit;
                  return (
                    <div key={label} className={`rounded-2xl border ${highlight ? 'border-indigo-500/20 bg-indigo-500/10 shadow-lg shadow-indigo-950/20' : 'border-white/5 bg-white/[0.03]'} p-4 transition-all hover:bg-white/[0.05]`}>
                      <div className="flex items-center justify-between gap-3 text-slate-400 mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${highlight ? 'text-indigo-400' : 'text-slate-500'}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                        </div>
                        {isOverBudget && (
                          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-300">ALERT</span>
                        )}
                      </div>
                      <div className={`text-2xl font-black ${highlight ? 'text-white' : isOverBudget ? 'text-red-400' : 'text-slate-200'}`}>{value}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-slate-900/40">
            <CardContent className="p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Budget notes</div>
              <div className="space-y-4 text-sm leading-relaxed text-slate-400 font-medium">
                <p>All amounts are shown in INR to match the platform's focus on Indian travel planning.</p>
                <p>Costs are calculated directly from itinerary entries for real-time accuracy.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Right: Categories and Daily Breakdown */}
        <div className="flex flex-col gap-8">
          <Card className="border-white/5 bg-slate-900/20 shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="text-xl font-black text-white uppercase tracking-tight">Category Breakdown</div>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <PieChart size={20} />
                </div>
              </div>
              
              <div className="grid gap-6">
                {Object.entries(budget.byCategory).length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/5 bg-white/[0.01] px-4 py-16 text-center">
                    <p className="text-sm text-slate-600 font-medium italic">Add activity costs in the itinerary to populate this view.</p>
                  </div>
                ) : (
                  Object.entries(budget.byCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, amount]) => (
                      <div key={key} className="group">
                        <div className="mb-3 flex items-center justify-between text-sm">
                          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">{categoryLabels[key] || 'Other'}</span>
                          <span className="font-black text-indigo-400">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-800/50 border border-white/5">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 shadow-glow transition-all duration-1000" 
                            style={{ width: `${Math.max(8, (amount / maxCategory) * 100)}%` }} 
                          />
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-slate-900/20 shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="text-xl font-black text-white uppercase tracking-tight">Daily Cost Tracker</div>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Landmark size={20} />
                </div>
              </div>
              
              <div className="grid gap-4">
                {budget.byDay.map((day) => (
                  <div key={day.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-5 hover:bg-white/[0.05] transition-all">
                    <div>
                      <div className="font-black text-white text-lg leading-tight uppercase tracking-tight">{formatShortDate(day.date, { weekday: 'short' })}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{day.destination}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-green-400 text-xl">{formatCurrency(day.total)}</div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-black mt-1">daily total</div>
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

export default BudgetView;
