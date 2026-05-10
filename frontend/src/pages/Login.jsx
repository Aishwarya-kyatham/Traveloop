import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Login failed. Please check your credentials.');
      } else {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        navigate('/dashboard');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-4rem)] relative">
      {/* background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,132,248,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/30">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--text)]">Traveloop</span>
          </Link>
        </div>

        <Card glass className="shadow-glow border-[var(--border)]">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black tracking-tight text-[var(--text)] mb-1">Welcome back</h1>
              <p className="text-sm text-[var(--muted)]">Sign in to continue planning your adventures</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email" type="email" label="Email address"
                placeholder="you@example.com" icon={Mail}
                value={formData.email} onChange={handleChange} required
              />
              <Input
                id="password" type="password" label="Password"
                placeholder="••••••••" icon={Lock}
                value={formData.password} onChange={handleChange} required
              />
              <Button
                type="submit" variant="primary" size="lg"
                className="w-full mt-2 gap-2"
                disabled={loading}
              >
                {loading ? 'Signing in...' : <><span>Sign in</span><ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-5 text-sm text-[var(--muted)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--primary)] font-semibold hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
