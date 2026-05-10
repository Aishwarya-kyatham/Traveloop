import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeIndianRupee, CalendarDays, CheckCircle2, Compass, Plane, ShieldCheck, Sparkles, Users } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { destinationCatalog, landingTestimonials, travelCategories } from '../data/india';
import { formatCompactCurrency } from '../lib/formatters';

const features = [
  {
    icon: CalendarDays,
    title: 'Timeline-first planning',
    description: 'Build day-by-day itineraries for group trips, family holidays, and college escapes without hopping across tools.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Rupee-first budget tracking',
    description: 'See category-wise spend, daily cost trends, and destination budgets in INR from day one.',
  },
  {
    icon: Users,
    title: 'Built for shared travel decisions',
    description: 'Share plans, align on activities, and keep everyone in sync whether it is a Goa reunion or a Ladakh ride.',
  },
];

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <AppShell>
      <section className="relative z-10 grid gap-16 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="animate-rise">
          <div className="section-label mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Premium India Travel OS
          </div>
          <h1 className="text-5xl font-black leading-[1.05] theme-text md:text-8xl">
            Plan smarter India trips with <span className="text-gradient">one clean SaaS workspace.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed theme-text-secondary">
            Traveloop brings itinerary planning, budget tracking, checklists, and notes into one polished platform designed for the modern Indian traveller.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/register"><Button size="xl" className="shadow-glow px-10">Start Planning <ArrowRight className="h-5 w-5 ml-2" /></Button></Link>
            <a href="#destinations"><Button size="xl" variant="secondary" className="px-10">Explore Destinations</Button></a>
          </div>
          <div className="mt-12 flex flex-wrap gap-6 text-sm theme-text-muted">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free to start</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-400" /> Secure auth flow</span>
            <span className="inline-flex items-center gap-2"><Plane className="h-4 w-4 text-indigo-400" /> India-first logic</span>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 blur-3xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          <Card className="relative overflow-hidden border-white/10 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative h-full min-h-[500px] bg-grid">
                <img
                  src="https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1600&auto=format&fit=crop"
                  alt="Taj Mahal abstract"
                  className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-slate-900" />
                <div className="relative flex h-full flex-col justify-between p-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="glass-panel rounded-3xl p-5 border-white/5">
                      <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Upcoming trip</div>
                      <div className="mt-3 text-2xl font-black text-white leading-tight">Goa - Gokarna loop</div>
                      <div className="mt-2 text-xs text-slate-400 font-medium">Shared with 4 friends · 5 days</div>
                    </div>
                    <div className="glass-panel rounded-3xl p-5 border-white/5">
                      <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Budget limit</div>
                      <div className="mt-3 text-2xl font-black text-white">{formatCompactCurrency(28500)}</div>
                      <div className="mt-2 text-xs text-emerald-400 font-bold">Remaining: {formatCompactCurrency(4500)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-10 grid gap-3">
                    {['Itinerary', 'Budget', 'Checklist', 'Notes'].map((label) => (
                      <div key={label} className="glass-panel flex items-center justify-between rounded-2xl px-5 py-4 border-white/5 transition hover:bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-glow" />
                          <span className="text-sm font-bold text-white tracking-tight">{label} Module</span>
                        </div>
                        <div className="rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-300">Live</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="mt-32 grid gap-8 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} hover className="border-white/5 bg-slate-900/20">
            <CardContent className="p-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-indigo-500/10 text-indigo-400">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-8 text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
              <p className="mt-4 text-sm leading-8 text-slate-400 font-medium">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="destinations" className="mt-32">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-label mb-4"><Compass className="h-3.5 w-3.5" /> India-first library</div>
            <h2 className="text-5xl font-black text-white tracking-tighter">Plan where you actually go.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {travelCategories.map((category) => (
              <span key={category} className="rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {destinationCatalog.map((destination) => (
            <Card key={destination.name} hover className="overflow-hidden border-white/5 bg-slate-900/40">
              <div className="relative h-64">
                <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute left-6 top-6 flex items-center gap-3">
                  <span className="rounded-full bg-indigo-600/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">{destination.category}</span>
                </div>
                <div className="absolute inset-x-6 bottom-6">
                  <div className="text-3xl font-black text-white tracking-tighter">{destination.name}</div>
                  <div className="mt-1 text-sm text-slate-400 font-medium">{destination.blurb}</div>
                </div>
              </div>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Average budget</div>
                  <div className="mt-1 text-xl font-black text-white">{formatCompactCurrency(destination.price)}</div>
                </div>
                <Link to="/register"><Button variant="secondary" size="sm" className="font-black uppercase tracking-widest text-[10px]">Plan now</Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="mt-32 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <Card className="border-white/5 bg-indigo-500/5">
          <CardContent className="p-10">
            <div className="section-label mb-6">Designed for teams</div>
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">No more spreadsheet chaos.</h2>
            <div className="mt-10 grid gap-4">
              {[
                'Single system for itinerary, cost, and notes',
                'Optimized for INR budgeting and Indian geography',
                'Shareable public links for quick group alignment',
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-5 transition hover:bg-white/5">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <span className="text-sm font-bold text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-glow border-indigo-500/20 bg-slate-950">
          <CardContent className="p-10 flex flex-col justify-center text-center">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Launch offer</div>
            <div className="mt-6 text-7xl font-black text-white">₹0</div>
            <div className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">Free forever</div>
            <p className="mt-6 text-sm leading-relaxed text-slate-400">Perfect for solo explorers, families, and friend groups planning their next escape.</p>
            <Link to="/register" className="mt-10 block"><Button className="w-full shadow-glow" size="xl">Create account</Button></Link>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-32 rounded-[40px] border border-white/5 bg-slate-900/20 px-8 py-12 text-center md:text-left">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-display text-3xl font-black text-white tracking-tighter">Traveloop</div>
            <div className="mt-2 text-sm font-medium text-slate-500">Modern travel planning OS for India-first journeys.</div>
          </div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest max-w-sm leading-relaxed">
            All-in-one workspace for itineraries, budgets, and shared memories.
          </div>
        </div>
      </footer>
    </AppShell>
  );
};

export default Landing;
