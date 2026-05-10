import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookText, Send, Trash2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import TripTabs from '../components/layout/TripTabs';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useTrip } from '../hooks/useItinerary';
import { useAddNote, useDeleteNote, useNotes } from '../hooks/useNotes';

const formatRelative = (value) => {
  const date = new Date(value);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TripNotes = () => {
  const { tripId } = useParams();
  const { data: trip } = useTrip(tripId);
  const { data: notes = [], isLoading } = useNotes(tripId);
  const addMutation = useAddNote(tripId);
  const deleteMutation = useDeleteNote(tripId);
  const [content, setContent] = useState('');

  const handleAdd = (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    addMutation.mutate({ trip: tripId, content: content.trim() }, { onSuccess: () => setContent('') });
  };

  return (
    <AppShell>
      <Link to={`/trip/${tripId}`} className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to itinerary
      </Link>

      <PageHeader
        eyebrow="Notes"
        title={`${trip?.title || 'Trip'} notes`}
        description="Keep references, ideas, reminders, and shared context in one tidy timeline."
      />

      <TripTabs tripId={tripId} active="notes" />

      <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Sidebar Left: Info & Add Note */}
        <div className="flex flex-col gap-6">
          <Card className="border-indigo-500/10 bg-indigo-500/5 shadow-2xl">
            <CardContent className="p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Quick Note</div>
              <form onSubmit={handleAdd} className="space-y-4">
                <textarea
                  rows="8"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Notes, reminders..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none transition-all"
                />
                <Button type="submit" variant="primary" className="w-full font-black uppercase tracking-widest text-[10px] py-4" loading={addMutation.isPending}>
                  <Send className="h-4 w-4 mr-2" /> Save Note
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-slate-900/40">
            <CardContent className="p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Context</div>
              <p className="text-sm leading-relaxed text-slate-400 font-medium">
                Keep track of booking IDs, transfer numbers, and local tips shared within your travel group.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Right: Notes Timeline */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-3xl bg-white/[0.03]" />)}
            </div>
          ) : notes.length === 0 ? (
            <EmptyState icon={BookText} title="No notes yet" description="Start documenting your trip by adding your first note on the left." />
          ) : (
            <div className="grid gap-4">
              {notes.map((note) => (
                <Card key={note.id} className="border-white/5 bg-slate-900/20 shadow-xl">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{formatRelative(note.created_at)}</div>
                        </div>
                        <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-200">{note.content}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => deleteMutation.mutate(note.id)} 
                        className="p-3 rounded-xl text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
};

export default TripNotes;
