import React, { useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Laptop, LogOut, Map, Menu, Moon, Plane, Search as SearchIcon, Sun, User2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';
import Container from './Container';

const guestLinks = [
  { label: 'Why Traveloop', href: '/#features' },
  { label: 'Destinations', href: '/#destinations' },
  { label: 'Pricing', href: '/#pricing' },
];

const appLinks = [
  { label: 'Explore', path: '/dashboard', icon: Map },
  { label: 'Search', path: '/search', icon: SearchIcon },
  { label: 'My Trips', path: '/trips', icon: Plane },
  { label: 'Profile', path: '/profile', icon: User2 },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  React.useEffect(() => {
    const handleClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  React.useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const initials = useMemo(() => {
    const name = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || 'T';
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [user]);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const onAnchorClick = (href) => {
    if (href.startsWith('/#') && location.pathname !== '/') {
      navigate(href);
      return;
    }
    const target = document.querySelector(href.replace('/', ''));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const themeIcon = theme === 'system' ? Laptop : resolvedTheme === 'light' ? Sun : Moon;
  const ThemeIcon = themeIcon;
  const nextTheme = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';

  const isLanding = location.pathname === '/';
  const showAppLinks = isAuthenticated && !isLanding;

  return (
    <header className="theme-nav fixed inset-x-0 top-0 z-50">
      <Container className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 shadow-glow">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-display text-lg font-extrabold theme-text">Traveloop</div>
              <div className="text-[11px] uppercase tracking-[0.28em] theme-text-muted">India Travel OS</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {(showAppLinks ? appLinks : guestLinks).map((item) => (
              'path' in item ? (
                <Link
                  key={item.path}
                  to={item.path}
                  className={[
                    'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                    location.pathname === item.path
                      ? 'bg-indigo-500/12 theme-text'
                      : 'theme-text-muted hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => onAnchorClick(item.href)}
                  className="rounded-2xl px-4 py-2 text-sm font-semibold theme-text-muted transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </button>
              )
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setTheme(nextTheme)}
            title={`Theme: ${theme}`}
            className="glass-panel flex h-11 w-11 items-center justify-center rounded-2xl theme-text-secondary"
          >
            <ThemeIcon className="h-4 w-4" />
          </button>
          {showAppLinks ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="glass-panel flex items-center gap-3 rounded-2xl px-3 py-2 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white">
                  {initials}
                </div>
                <div className="max-w-[140px]">
                  <div className="truncate text-sm font-semibold theme-text">
                    {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username}
                  </div>
                  <div className="truncate text-xs theme-text-muted">{user?.email}</div>
                </div>
                <ChevronDown className="h-4 w-4 theme-text-muted" />
              </button>

              {profileOpen ? (
                <div className="glass-panel absolute right-0 mt-3 w-56 rounded-3xl p-2">
                  <Link to="/trips" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm theme-text-secondary transition hover:bg-white/5 hover:text-white">
                    <Plane className="h-4 w-4" />
                    My Trips
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm theme-text-secondary transition hover:bg-white/5 hover:text-white">
                    <User2 className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              {isAuthenticated ? (
                <Link to="/dashboard"><Button>Dashboard</Button></Link>
              ) : (
                <>
                  <Link to="/login"><Button variant="ghost">Login</Button></Link>
                  <Link to="/register"><Button>Get Started</Button></Link>
                </>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="theme-surface-soft flex h-11 w-11 items-center justify-center rounded-2xl theme-text-secondary md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {menuOpen ? (
        <div className="theme-nav border-t md:hidden">
          <Container className="flex flex-col gap-2 py-4">
            <button
              type="button"
              onClick={() => setTheme(nextTheme)}
              className="theme-surface-soft rounded-2xl px-4 py-3 text-left text-sm font-semibold theme-text-secondary"
            >
              Theme: {theme}
            </button>
            {(showAppLinks ? appLinks : guestLinks).map((item) => (
              'path' in item ? (
                <Link key={item.path} to={item.path} className="rounded-2xl px-4 py-3 text-sm font-semibold theme-text-secondary hover:bg-white/5 hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => onAnchorClick(item.href)}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-semibold theme-text-secondary hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </button>
              )
            ))}
            {showAppLinks ? (
              <>
                <Link to="/profile" className="rounded-2xl px-4 py-3 text-sm font-semibold theme-text-secondary hover:bg-white/5 hover:text-white">
                  Account settings
                </Link>
                <button type="button" onClick={onLogout} className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-200 hover:bg-red-500/10">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="flex-1"><Button className="w-full">Dashboard</Button></Link>
                ) : (
                  <>
                    <Link to="/login" className="flex-1"><Button variant="secondary" className="w-full">Login</Button></Link>
                    <Link to="/register" className="flex-1"><Button className="w-full">Get Started</Button></Link>
                  </>
                )}
              </div>
            )}
          </Container>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
