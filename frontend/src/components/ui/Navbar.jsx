import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Plane, Map, Users, Settings, LogOut, User,
  ChevronDown, Bell, BookMarked
} from 'lucide-react';

const Navbar = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [user, setUser]           = useState(null);
  const [dropOpen, setDropOpen]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const dropRef = useRef(null);

  /* ── fetch user on every route change ── */
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) { setUser(null); setLoading(false); return; }

    fetch('/api/auth/me/', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data))
      .catch(() => { setUser(null); })
      .finally(() => setLoading(false));
  }, [location.pathname]);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    setDropOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkCls = (path) =>
    `nav-tab${isActive(path) ? ' nav-tab--active' : ''}`;

  return (
    <header className="navbar">
      <div className="navbar__inner">

        {/* ── Logo ── */}
        <Link to={user ? '/dashboard' : '/'} className="navbar__logo">
          <div className="navbar__logo-icon">
            <Plane size={16} className="text-white" />
          </div>
          <span className="navbar__logo-text">Traveloop</span>
        </Link>

        {/* ── Nav links ── */}
        <nav className="navbar__nav">
          {user ? (
            /* Authenticated nav */
            <>
              <Link to="/dashboard"  className={navLinkCls('/dashboard')}>
                <Map size={15} /> Trips
              </Link>
              <Link to="/community"  className={navLinkCls('/community')}>
                <Users size={15} /> Community
              </Link>
            </>
          ) : (
            /* Public nav */
            <>
              <a href="/#features"      className="nav-link">Features</a>
              <a href="/#testimonials"  className="nav-link">Reviews</a>
              <a href="/#stats"         className="nav-link">About</a>
            </>
          )}
        </nav>

        {/* ── Right side ── */}
        <div className="navbar__right">
          {loading ? null : user ? (
            <>
              {/* Notification bell */}
              <button className="navbar__icon-btn" id="btn-notifications" title="Notifications">
                <Bell size={17} />
              </button>

              {/* Profile avatar + dropdown */}
              <div className="navbar__profile" ref={dropRef}>
                <button
                  id="btn-profile-avatar"
                  className="navbar__avatar"
                  onClick={() => setDropOpen(v => !v)}
                  title="Account menu"
                >
                  <span className="navbar__avatar-letter">
                    {(user.first_name || user.username || 'U')[0].toUpperCase()}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`navbar__avatar-caret${dropOpen ? ' navbar__avatar-caret--open' : ''}`}
                  />
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <div className="navbar__dropdown" id="profile-dropdown">
                    {/* User info */}
                    <div className="navbar__drop-header">
                      <div className="navbar__drop-avatar">
                        {(user.first_name || user.username || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="navbar__drop-name">
                          {user.first_name
                            ? `${user.first_name} ${user.last_name || ''}`.trim()
                            : user.username}
                        </div>
                        <div className="navbar__drop-email">{user.email}</div>
                      </div>
                    </div>

                    <div className="navbar__drop-divider" />

                    <button className="navbar__drop-item" id="btn-my-trips"
                      onClick={() => { navigate('/dashboard'); setDropOpen(false); }}>
                      <BookMarked size={14} /> My Trips
                    </button>
                    <button className="navbar__drop-item" id="btn-settings"
                      onClick={() => { navigate('/settings'); setDropOpen(false); }}>
                      <Settings size={14} /> Settings
                    </button>

                    <div className="navbar__drop-divider" />

                    <button className="navbar__drop-item navbar__drop-item--danger"
                      id="btn-logout" onClick={handleLogout}>
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged-out CTAs */
            <>
              <Link to="/login" className="navbar__ghost-btn" id="btn-login">
                Log in
              </Link>
              <Link to="/register" className="navbar__cta-btn" id="btn-signup">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
