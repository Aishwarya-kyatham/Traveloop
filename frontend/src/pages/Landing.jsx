import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeIndianRupee, CalendarDays, CheckCircle2, Compass, Plane, ShieldCheck, Sparkles, Users } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
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

const Landing = () => (
  <AppShell>
    <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="animate-rise">
        <div className="section-label mb-5">
          <Sparkles className="h-3.5 w-3.5" />
          Premium Indian travel planning
        </div>
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] text-white md:text-7xl">
          Plan smarter India trips with <span className="text-gradient">one clean SaaS workspace.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Traveloop brings itinerary planning, budget tracking, checklists, and notes into one polished platform designed for Indian travellers, families, friend groups, and college trips.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/register"><Button size="xl">Start Planning <ArrowRight className="h-4 w-4" /></Button></Link>
          <a href="#destinations"><Button size="xl" variant="secondary">Explore Destinations</Button></a>
        </div>
        <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> No credit card required</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-400" /> Secure account flow</span>
          <span className="inline-flex items-center gap-2"><Plane className="h-4 w-4 text-indigo-300" /> India-first recommendations</span>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-full min-h-[420px] bg-grid">
            <img
              src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop"
              alt="India travel collage"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f1a]/45 via-[#0b0f1a]/72 to-[#0b0f1a]" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass-panel rounded-3xl p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Next up</div>
                  <div className="mt-3 text-2xl font-bold text-white">Goa - Gokarna loop</div>
                  <div className="mt-2 text-sm text-slate-400">4 friends, 5 days, split budget and beach-day planning.</div>
                </div>
                <div className="glass-panel rounded-3xl p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Budget pulse</div>
                  <div className="mt-3 text-2xl font-bold text-white">{formatCompactCurrency(28500)}</div>
                  <div className="mt-2 text-sm text-emerald-300">Staying under target by {formatCompactCurrency(4500)}</div>
                </div>
              </div>
              <div className="grid gap-3">
                {['Itinerary', 'Budget', 'Checklist', 'Notes'].map((label) => (
                  <div key={label} className="glass-panel flex items-center justify-between rounded-3xl px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{label}</div>
                      <div className="text-xs text-slate-500">Shared across your travel crew</div>
                    </div>
                    <div className="rounded-2xl bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-200">Live</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <section id="features" className="mt-20 grid gap-6 md:grid-cols-3">
      {features.map(({ icon: Icon, title, description }) => (
        <Card key={title} hover>
          <CardContent className="p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-500/12 text-indigo-200">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
          </CardContent>
        </Card>
      ))}
    </section>

    <section id="destinations" className="mt-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="section-label mb-4"><Compass className="h-3.5 w-3.5" /> Top Indian destinations</div>
          <h2 className="text-4xl font-extrabold text-white">Built around where Indian travellers actually go.</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {travelCategories.map((category) => (
            <span key={category} className="rounded-full border border-slate-700/60 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300">
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {destinationCatalog.map((destination) => (
          <Card key={destination.name} hover className="overflow-hidden">
            <div className="relative h-56">
              <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/30 to-transparent" />
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">{destination.category}</span>
                <span className="rounded-full bg-[#0b0f1a]/70 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md">{destination.vibe}</span>
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <div className="text-3xl font-bold text-white">{destination.name}</div>
                <div className="mt-1 text-sm text-slate-300">{destination.blurb}</div>
              </div>
            </div>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Typical trip budget</div>
                <div className="mt-2 text-lg font-bold text-white">{formatCompactCurrency(destination.price)}</div>
              </div>
              <Link to="/register"><Button variant="secondary" size="sm">Plan this</Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section id="pricing" className="mt-20 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardContent className="p-8">
          <div className="section-label mb-4">What teams love</div>
          <h2 className="text-4xl font-extrabold text-white">From rough idea to fully planned trip without chaos.</h2>
          <div className="mt-6 grid gap-4">
            {[
              'A single system for itinerary, cost, checklist, and notes',
              'Designed for friend groups, families, and budget-conscious travellers',
              'Consistent trip views across planning, tracking, and sharing',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-3xl border border-slate-700/60 bg-white/[0.03] p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
                <span className="text-sm leading-7 text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-300">Free to start</div>
          <div className="mt-4 text-5xl font-extrabold text-white">₹0</div>
          <p className="mt-3 text-sm leading-7 text-slate-400">Perfect for solo planning, family holiday prep, and group trip coordination.</p>
          <Link to="/register" className="mt-8 block"><Button className="w-full" size="lg">Create free account</Button></Link>
        </CardContent>
      </Card>
    </section>

    <section className="mt-20">
      <div className="section-label mb-4">Traveller feedback</div>
      <div className="grid gap-6 md:grid-cols-3">
        {landingTestimonials.map((item) => (
          <Card key={item.name}>
            <CardContent className="p-8">
              <p className="text-base leading-8 text-slate-200">"{item.quote}"</p>
              <div className="mt-6">
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-sm text-slate-500">{item.role}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <footer className="mt-20 rounded-[32px] border border-slate-800/70 bg-white/[0.02] px-6 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-display text-2xl font-extrabold text-white">Traveloop</div>
          <div className="mt-2 text-sm text-slate-500">Modern travel planning for India-first journeys.</div>
        </div>
        <div className="text-sm text-slate-500">Landing, auth, dashboard, planner, budget, profile, and sharing now follow one consistent visual system.</div>
      </div>
    </footer>
  </AppShell>
);

export default Landing;
