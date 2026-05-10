import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import Button from './Button';
import Container from './Container';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl transition-colors duration-300">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/30 group-hover:shadow-blue-900/50 transition-shadow">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--text)]">Traveloop</span>
          </Link>

          {/* Nav Links - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Reviews</a>
            <a href="#stats" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">About</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
