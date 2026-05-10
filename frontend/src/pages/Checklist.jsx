import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Send, Square } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import TripTabs from '../components/layout/TripTabs';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useChecklist, useAddItem, useDeleteItem, useToggleItem } from '../hooks/useChecklist';
import { useTrip } from '../hooks/useItinerary';

const categories = ['all', 'clothing', 'documents', 'electronics', 'medications', 'toiletries', 'other'];

const Checklist = () => {
  const { tripId } = useParams();
  const { data: trip } = useTrip(tripId);
  const { data: items = [], isLoading } = useChecklist(tripId);
  const addMutation = useAddItem(tripId);
  const toggleMutation = useToggleItem(tripId);
  const deleteMutation = useDeleteItem(tripId);
  const [category, setCategory] = useState('all');
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState('other');

  const filteredItems = useMemo(() => {
    return category === 'all' ? items : items.filter((item) => item.category === category);
  }, [items, category]);

  const completed = items.filter((item) => item.is_checked).length;
  const progress = items.length ? Math.round((completed / items.length) * 100) : 0;

  const handleAdd = (event) => {
    event.preventDefault();
    if (!newLabel.trim()) return;
    addMutation.mutate({ trip: tripId, label: newLabel.trim(), category: newCategory }, { onSuccess: () => setNewLabel('') });
  };

  return (
    <AppShell>
      <Link to={`/trip/${tripId}`} className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to itinerary
      </Link>

      <PageHeader
        eyebrow="Checklist"
        title={`${trip?.title || 'Trip'} packing checklist`}
        description="Track essentials, prep documents, and keep every traveller aligned with a cleaner checklist workflow."
      />

      <TripTabs tripId={tripId} active="checklist" />

      <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Sidebar Left: Progress & Add Item */}
        <div className="flex flex-col gap-6">
          <Card className="border-indigo-500/10 bg-indigo-500/5 shadow-2xl">
            <CardContent className="p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Packing Progress</div>
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <div className="text-3xl font-black text-white leading-none mb-1">{completed} / {items.length}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Items Packed</div>
                </div>
                <div className="text-3xl font-black text-indigo-300">{progress}%</div>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-800/50 border border-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 shadow-glow transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-slate-900/40">
            <CardContent className="p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">Quick add</div>
              <form onSubmit={handleAdd} className="space-y-4">
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold capitalize text-white focus:border-indigo-500/50 focus:outline-none transition-all"
                >
                  {categories.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <textarea
                  rows="3"
                  value={newLabel}
                  onChange={(event) => setNewLabel(event.target.value)}
                  placeholder="Essential items..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none transition-all"
                />
                <Button type="submit" variant="primary" className="w-full font-black uppercase tracking-widest text-[10px] py-4" loading={addMutation.isPending}>
                  <Send className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Right: Filters and List */}
        <div className="flex flex-col gap-6">
          <Card className="border-white/5 bg-slate-900/20 shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8 flex flex-wrap gap-2.5">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={[
                      'rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all',
                      category === item
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                        : 'border border-white/5 bg-white/[0.03] text-slate-500 hover:text-white hover:bg-white/10',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid gap-3">
                  {[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-3xl bg-white/[0.03]" />)}
                </div>
              ) : filteredItems.length === 0 ? (
                <EmptyState icon={CheckSquare} title="No items found" description="Adjust your filters or add new items to your list." />
              ) : (
                <div className="grid gap-3">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="group flex items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5 hover:bg-white/[0.05] transition-all">
                      <button type="button" onClick={() => toggleMutation.mutate({ id: item.id, is_checked: !item.is_checked })} className="transition-transform active:scale-90">
                        {item.is_checked ? <CheckSquare className="h-6 w-6 text-indigo-500" /> : <Square className="h-6 w-6 text-slate-700 hover:text-indigo-500/50 transition-colors" />}
                      </button>
                      <div className={['flex-1 text-sm font-bold uppercase tracking-wide', item.is_checked ? 'text-slate-600 line-through opacity-50' : 'text-slate-200'].join(' ')}>{item.label}</div>
                      <button type="button" onClick={() => deleteMutation.mutate(item.id)} className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 hover:text-red-500 transition-colors">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
};

export default Checklist;
