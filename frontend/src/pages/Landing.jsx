import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Calendar, CreditCard, ArrowRight,
  Globe2, Star, Users, TrendingUp, CheckCircle2, Zap, Shield
} from 'lucide-react';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import Card, { CardContent } from '../components/ui/Card';

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative flex flex-col items-center justify-center text-center pt-24 pb-20 px-4 overflow-hidden min-h-[90vh]">
    {/* background layers */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--hero-from),transparent)] pointer-events-none" />
    <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute top-40 right-1/4 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

    <Container className="max-w-5xl relative z-10">
      {/* badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-sm text-xs font-medium text-[var(--muted)] mb-8">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        New — AI-powered itinerary builder now live
      </div>

      {/* headline */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6">
        Plan multi-city trips<br />
        <span className="text-gradient">effortlessly.</span>
      </h1>

      <p className="text-lg md:text-xl text-[var(--muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
        Traveloop is the all-in-one workspace for ambitious travelers — build rich itineraries, track budgets, and share your trip with anyone.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/register">
          <Button variant="primary" size="xl" className="gap-2 shadow-xl shadow-blue-900/30 w-full sm:w-auto">
            Start planning free <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <a href="#features">
          <Button variant="secondary" size="xl" className="w-full sm:w-auto">
            See how it works
          </Button>
        </a>
      </div>

      {/* social proof micro-line */}
      <p className="mt-8 text-xs text-[var(--muted)]">
        No credit card required · Free forever for personal use
      </p>
    </Container>

    {/* floating map card visual */}
    <div className="relative mt-20 max-w-4xl w-full mx-auto px-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-1 shadow-2xl shadow-black/40">
        <div className="rounded-xl overflow-hidden bg-[var(--bg-secondary)] h-64 flex items-center justify-center">
          <div className="flex items-center gap-8">
            {[
              { city: "Paris", icon: "🇫🇷", days: "3 days" },
              { city: "Rome", icon: "🇮🇹", days: "4 days" },
              { city: "Barcelona", icon: "🇪🇸", days: "3 days" },
            ].map((stop, i) => (
              <React.Fragment key={stop.city}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-2xl shadow-lg animate-float" style={{ animationDelay: `${i * 0.8}s` }}>
                    {stop.icon}
                  </div>
                  <span className="font-semibold text-sm text-[var(--text)]">{stop.city}</span>
                  <span className="text-xs text-[var(--muted)]">{stop.days}</span>
                </div>
                {i < 2 && (
                  <div className="flex items-center gap-1 text-[var(--muted)]">
                    <div className="w-6 h-px bg-[var(--border)]" />
                    <MapPin className="h-3 w-3" />
                    <div className="w-6 h-px bg-[var(--border)]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {/* glow under preview */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-blue-600/20 blur-2xl rounded-full" />
    </div>
  </section>
);

// ─── Stats ────────────────────────────────────────────────────────────────────
const Stats = () => {
  const stats = [
    { value: "12K+", label: "Trips planned", icon: Globe2 },
    { value: "85+", label: "Countries covered", icon: MapPin },
    { value: "4.9★", label: "Average rating", icon: Star },
    { value: "98%", label: "Would recommend", icon: TrendingUp },
  ];

  return (
    <section id="stats" className="py-16 border-y border-[var(--border)]">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div className="text-3xl font-black text-[var(--text)]">{value}</div>
              <div className="text-sm text-[var(--muted)]">{label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: MapPin,
    title: "Multi-city Trip Builder",
    description: "Map out your entire journey across multiple cities. Add stops, reorder days, and visualize your route — all in one place.",
    bullets: ["Drag-and-drop stops", "Smart route optimization", "Map preview"],
    color: "from-blue-600/20 to-blue-600/0",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Calendar,
    title: "Itinerary Management",
    description: "Build detailed day-by-day itineraries with activities, restaurants, and accommodations. Share or export with a click.",
    bullets: ["Day-by-day planner", "Activity scheduling", "Share with travel mates"],
    color: "from-indigo-600/20 to-indigo-600/0",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
  },
  {
    icon: CreditCard,
    title: "Budget Tracking",
    description: "Know exactly what you're spending. Set budgets per city, track expenses by category, and stay on top of your travel costs.",
    bullets: ["Per-city budgets", "Multi-currency support", "Expense categories"],
    color: "from-violet-600/20 to-violet-600/0",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
];

const Features = () => (
  <section id="features" className="py-28">
    <Container>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--muted)] mb-4">
          <Zap className="h-3 w-3 text-[var(--primary)]" /> Everything you need
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text)] mb-4">
          Built for the way<br />travelers actually think
        </h2>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
          Stop juggling spreadsheets, notes apps, and browser tabs. Traveloop brings it all together.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, description, bullets, color, iconColor, iconBg }) => (
          <Card key={title} hover className="relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <CardContent className="relative z-10 p-8 flex flex-col gap-5">
              <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-2">{title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{description}</p>
              </div>
              <ul className="space-y-2 mt-auto">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Priya M.",
    role: "Backpacker, 12 countries",
    avatar: "PM",
    avatarColor: "from-pink-500 to-rose-600",
    quote: "Traveloop is the first app that actually made planning a 3-week Europe trip feel manageable. The budget tracker alone saved us hundreds.",
    stars: 5,
  },
  {
    name: "James K.",
    role: "Travel blogger",
    avatar: "JK",
    avatarColor: "from-blue-500 to-indigo-600",
    quote: "I've tried every travel app out there. Traveloop is the only one that doesn't feel like it was designed by someone who's never left their city.",
    stars: 5,
  },
  {
    name: "Aisha R.",
    role: "Frequent flyer, SE Asia",
    avatar: "AR",
    avatarColor: "from-emerald-500 to-teal-600",
    quote: "Planning solo trips used to give me anxiety. Now I open Traveloop and everything just clicks into place. The multi-city view is genius.",
    stars: 5,
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-28 bg-[var(--bg-secondary)]">
    <Container>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--muted)] mb-4">
          <Users className="h-3 w-3 text-[var(--primary)]" /> Loved by travelers
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text)] mb-4">
          Don't take our word for it
        </h2>
        <p className="text-lg text-[var(--muted)]">Real travelers, real trips, real results.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map(({ name, role, avatar, avatarColor, quote, stars }) => (
          <Card key={name} glass className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">"{quote}"</p>
            <div className="flex items-center gap-3 mt-auto">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">{name}</div>
                <div className="text-xs text-[var(--muted)]">{role}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

// ─── CTA Banner ───────────────────────────────────────────────────────────────
const CTABanner = () => (
  <section className="py-28">
    <Container>
      <div className="relative rounded-3xl border border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-violet-600/20" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 py-20 px-8 text-center flex flex-col items-center gap-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-900/40">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text)]">
            Your next adventure<br />starts here.
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-md">
            Join thousands of travelers who plan smarter, spend less, and explore more with Traveloop.
          </p>
          <Link to="/register">
            <Button variant="primary" size="xl" className="gap-2 shadow-xl shadow-blue-900/30">
              Create free account <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  </section>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-[var(--border)] py-12">
    <Container>
      <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[var(--text)]">Traveloop</span>
          </div>
          <p className="text-sm text-[var(--muted)]">The modern way to plan travel. Built for explorers who take their trips seriously.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { title: "Product", links: ["Features", "Pricing", "Changelog"] },
            { title: "Company", links: ["About", "Blog", "Careers"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div className="text-sm font-semibold text-[var(--text)] mb-3">{title}</div>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[var(--muted)]">
        <span>© 2025 Traveloop. All rights reserved.</span>
        <span>Made with ♥ for travelers everywhere</span>
      </div>
    </Container>
  </footer>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const Landing = () => (
  <div className="flex flex-col min-h-screen">
    <Hero />
    <Stats />
    <Features />
    <Testimonials />
    <CTABanner />
    <Footer />
  </div>
);

export default Landing;
