import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, IndianRupee, MapPin, Users2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import { destinationCatalog, quickTripTemplates } from '../data/india';
import { addDestination } from '../services/itineraryService';
import tripService from '../services/tripService';
import { formatCompactCurrency } from '../lib/formatters';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    place: '',
    start_date: '',
    end_date: '',
    budget_limit: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSuggestionClick = (destination) => {
    setFormData((current) => ({
      ...current,
      title: current.title || `${destination.name} ${destination.vibe.toLowerCase()}`,
      place: destination.name,
      budget_limit: current.budget_limit || destination.price,
    }));
    toast.success(`${destination.name} added to your draft`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.place || !formData.start_date || !formData.end_date) {
      toast.error('Please complete the trip basics before continuing.');
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast.error('End date cannot be before the start date.');
      return;
    }

    try {
      setLoading(true);
      const loadingToast = toast.loading('Creating your trip workspace...');
      const newTrip = await tripService.createTrip({
        title: formData.title,
        place: formData.place,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget_limit: formData.budget_limit || null,
      });

      await addDestination({
        trip: newTrip.id,
        city_name: formData.place,
        arrival_date: formData.start_date,
        departure_date: formData.end_date,
      });

      toast.dismiss(loadingToast);
      toast.success('Trip created successfully');
      navigate(`/trip/${newTrip.id}`);
    } catch (error) {
      toast.error('Could not create the trip. Please try again.');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="New trip"
        title="Create a polished trip workspace in a minute."
        description="Start with your destination, dates, and an optional INR budget. Traveloop will set up the itinerary shell for you."
      />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="shadow-glow">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Trip title" name="title" value={formData.title} onChange={handleChange} placeholder="Goa year-end getaway" required />
              <Input label="Primary destination" name="place" value={formData.place} onChange={handleChange} icon={MapPin} placeholder="Goa" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Start date" type="date" name="start_date" value={formData.start_date} onChange={handleChange} icon={CalendarDays} required />
                <Input label="End date" type="date" name="end_date" value={formData.end_date} onChange={handleChange} icon={CalendarDays} required />
              </div>
              <Input label="Budget limit (optional)" type="number" name="budget_limit" value={formData.budget_limit} onChange={handleChange} icon={IndianRupee} placeholder="25000" hint="Use INR for a cleaner cost dashboard later." />
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Create trip workspace <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardContent className="p-8">
              <div className="section-label mb-4">Quick templates</div>
              <div className="grid gap-4">
                {quickTripTemplates.map((template) => (
                  <button
                    key={template.title}
                    type="button"
                    onClick={() => setFormData((current) => ({
                      ...current,
                      title: template.title,
                      place: template.destination,
                      budget_limit: template.budget,
                    }))}
                    className="rounded-3xl border border-slate-700/60 bg-white/[0.03] p-4 text-left transition hover:border-slate-500/40 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold text-white">{template.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{template.destination} · {template.audience}</div>
                      </div>
                      <div className="text-sm font-semibold text-indigo-200">{formatCompactCurrency(template.budget)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="section-label mb-4">Popular Indian picks</div>
              <div className="grid gap-4 sm:grid-cols-2">
                {destinationCatalog.slice(0, 6).map((destination) => (
                  <button
                    key={destination.name}
                    type="button"
                    onClick={() => handleSuggestionClick(destination)}
                    className="overflow-hidden rounded-3xl border border-slate-700/60 bg-white/[0.03] text-left transition hover:border-slate-500/40"
                  >
                    <div className="relative h-32">
                      <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        {destination.category}
                      </div>
                      <div className="absolute inset-x-4 bottom-4">
                        <div className="text-lg font-bold text-white">{destination.name}</div>
                        <div className="text-xs text-slate-300">{destination.vibe}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-500/12 text-indigo-200">
                <Users2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Designed for group coordination</div>
                <div className="mt-2 text-sm leading-7 text-slate-400">Once the trip is created, you can move straight into itinerary planning, budget tracking, checklist prep, and trip notes without switching to a different UI pattern.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
};

export default CreateTrip;
