import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, ArrowUpDown, LayoutGrid,
  Plus, Heart, Eye, Share2, MapPin, Calendar,
  ChevronRight, Star
} from 'lucide-react';

/* ─── data ──────────────────────────────────────────────────── */
const TOP_REGIONS = [
  { id: 1, name: 'Bali', country: 'Indonesia', img: '/bali.png', rating: 4.9, tag: 'Tropical' },
  { id: 2, name: 'Paris', country: 'France', img: '/paris.png', rating: 4.8, tag: 'Romantic' },
  { id: 3, name: 'Tokyo', country: 'Japan', img: '/tokyo.png', rating: 4.9, tag: 'Urban' },
  { id: 4, name: 'Santorini', country: 'Greece', img: '/santorini.png', rating: 4.7, tag: 'Scenic' },
  { id: 5, name: 'Maldives', country: 'Indian Ocean', img: '/maldives.png', rating: 5.0, tag: 'Luxury' },
];

const PREV_TRIPS = [
  {
    id: 1, title: 'El Nido Guide', dest: 'Philippines',
    img: '/bali.png', author: 'Nata', likes: 3, views: 249,
    date: 'Mar 12 – Mar 19',
  },
  {
    id: 2, title: 'London Highlights', dest: 'United Kingdom',
    img: '/paris.png', author: 'libby', likes: 3, views: 182,
    date: 'Jan 5 – Jan 12',
  },
  {
    id: 3, title: '1 day in Gdańsk', dest: 'Poland',
    img: '/santorini.png', author: 'Emijia Bar', likes: 4, views: 235,
    date: 'Nov 20 – Nov 21',
  },
];

/* ─── sub-components ─────────────────────────────────────────── */
const RegionCard = ({ region }) => (
  <div className="region-card">
    <div className="region-card__img-wrap">
      <img src={region.img} alt={region.name} className="region-card__img" />
      <span className="region-card__tag">{region.tag}</span>
    </div>
    <div className="region-card__body">
      <div className="region-card__name">{region.name}</div>
      <div className="region-card__country">
        <MapPin size={11} /> {region.country}
      </div>
      <div className="region-card__rating">
        <Star size={11} fill="currentColor" /> {region.rating}
      </div>
    </div>
  </div>
);

const TripCard = ({ trip }) => (
  <div className="trip-card">
    <div className="trip-card__img-wrap">
      <img src={trip.img} alt={trip.title} className="trip-card__img" />
      <div className="trip-card__overlay">
        <button className="trip-card__action" title="Share">
          <Share2 size={13} /> Share
        </button>
        <button className="trip-card__action trip-card__action--icon" title="More">
          ···
        </button>
      </div>
    </div>
    <div className="trip-card__body">
      <h4 className="trip-card__title">{trip.title}</h4>
      <p className="trip-card__date">
        <Calendar size={12} /> {trip.date}
      </p>
      <div className="trip-card__footer">
        <span className="trip-card__author">{trip.author[0]}</span>
        <span className="trip-card__meta">
          <Heart size={12} /> {trip.likes}
        </span>
        <span className="trip-card__meta">
          <Eye size={12} /> {trip.views}
        </span>
      </div>
    </div>
  </div>
);

/* ─── main page ──────────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState(false);
  const [filterOpen, setFilter] = useState(false);
  const [sortOpen, setSort] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await fetch('/api/auth/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setUser(await res.json());
        else {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          navigate('/login');
        }
      } catch { navigate('/login'); }
    };
    fetchUser();
  }, [navigate]);



  if (!user) return null;

  return (
    <div className="db-root">

      {/* ── Banner ── */}
      <section className="db-banner">
        <img src="/banner.png" alt="Travel banner" className="db-banner__img" />
        <div className="db-banner__overlay" />
        <div className="db-banner__content">
          <h1 className="db-banner__greeting">
            Welcome back, <span className="db-banner__name">{user.first_name || user.username}</span> 👋
          </h1>
          <p className="db-banner__sub">Where are you heading next?</p>
        </div>

      </section>

      {/* ── Search / Toolbar ── */}
      <section className="db-toolbar-wrap">
        <div className="db-toolbar">
          <div className="db-search">
            <Search size={16} className="db-search__icon" />
            <input
              id="dashboard-search"
              className="db-search__input"
              placeholder="Search destinations, trips, guides…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="db-toolbar__actions">
            <button
              id="btn-groupby"
              className={`db-toolbar__btn${groupBy ? ' db-toolbar__btn--active' : ''}`}
              onClick={() => setGroupBy(v => !v)}
            >
              <LayoutGrid size={14} /> Group by
            </button>
            <button
              id="btn-filter"
              className={`db-toolbar__btn${filterOpen ? ' db-toolbar__btn--active' : ''}`}
              onClick={() => setFilter(v => !v)}
            >
              <SlidersHorizontal size={14} /> Filter
            </button>
            <button
              id="btn-sortby"
              className={`db-toolbar__btn${sortOpen ? ' db-toolbar__btn--active' : ''}`}
              onClick={() => setSort(v => !v)}
            >
              <ArrowUpDown size={14} /> Sort by
            </button>
          </div>
        </div>
      </section>

      <div className="db-body">

        {/* ── Top Regional Selections ── */}
        <section className="db-section">
          <div className="db-section__header">
            <h2 className="db-section__title">Top Regional Selections</h2>
            <button className="db-section__see-all" id="btn-see-all-regions">
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="db-regions">
            {TOP_REGIONS.map(r => <RegionCard key={r.id} region={r} />)}
          </div>
        </section>

        {/* ── Previous Trips ── */}
        <section className="db-section">
          <div className="db-section__header">
            <h2 className="db-section__title">Previous Trips</h2>
            <button className="db-section__see-all" id="btn-see-all-trips">
              See all <ChevronRight size={14} />
            </button>
          </div>

          {PREV_TRIPS.length === 0 ? (
            <div className="db-empty">
              <p>You haven't created anything yet. <span className="db-empty__link">Plan a new trip.</span></p>
            </div>
          ) : (
            <div className="db-trips">
              {PREV_TRIPS.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          )}
        </section>

      </div>

      {/* ── FAB ── */}
      <button className="db-fab" id="btn-plan-trip" onClick={() => navigate('/create-trip')}>
        <Plus size={16} /> Plan a trip
      </button>

    </div>
  );
};

export default Dashboard;
