import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Plane } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.id]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'Login failed. Please check your credentials.');
        return;
      }

      await login(data);
      navigate(location.state?.from || '/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-10">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Column: Branding & Info */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-glow mb-8">
              <Plane className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-5xl font-black text-white leading-tight uppercase tracking-tight mb-6">
              Pick up your <span className="text-gradient">India journey</span> exactly where you left it.
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-md">
              Access your shared itineraries, INR budgets, and travel checklists in one polished workspace.
            </p>
            
            <div className="space-y-4">
              {[
                'Real-time itinerary syncing',
                'INR budget tracking for group trips',
                'One-click sharing for travel crews'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Login Card */}
          <Card className="border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-8 md:p-12">
              <div className="mb-10 text-center lg:text-left">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Welcome back</div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Sign in</h2>
              </div>

              {error ? (
                <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-xs font-bold text-red-300 uppercase tracking-wide text-center">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                  id="email" 
                  label="Email address" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  icon={Mail} 
                  placeholder="rahul@traveloop.com" 
                  required 
                  className="bg-white/[0.02] border-white/5 focus:border-indigo-500/50"
                />
                <Input 
                  id="password" 
                  label="Password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  icon={Lock} 
                  placeholder="••••••••" 
                  required 
                  className="bg-white/[0.02] border-white/5 focus:border-indigo-500/50"
                />
                
                <div className="pt-2">
                  <Button type="submit" variant="primary" className="w-full font-black uppercase tracking-[0.2em] py-5 text-[11px]" loading={loading}>
                    Access Workspace <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>

              <p className="mt-10 text-center text-[11px] font-bold uppercase tracking-widest text-slate-500">
                New to Traveloop? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Create account</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default Login;
