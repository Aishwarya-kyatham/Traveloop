import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Globe2, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    country: 'India',
    additional_info: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.id]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError || 'Registration failed.');
        return;
      }

      navigate('/verify', {
        state: {
          email: formData.email,
          message: 'Check your inbox for the 6-digit verification code.',
        },
      });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-10">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left Column: Branding & Info */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="section-label mb-6 w-fit">
              <Compass className="h-3.5 w-3.5" />
              Join the movement
            </div>
            <h1 className="text-5xl font-black text-white leading-tight uppercase tracking-tight mb-6">
              Create your <span className="text-gradient">Traveloop</span> workspace.
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-md">
              Start planning your next Goa getaway, Ladakh ride, or Kerala family escape with India's most polished travel OS.
            </p>
            
            <div className="grid gap-4">
              {[
                'India-first destination inspiration',
                'Collaborative group itineraries',
                'Automatic INR budget breakdowns',
                'Secure account verification'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Register Card */}
          <Card className="border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-8 md:p-12">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Create account</h2>
                <p className="mt-2 text-sm font-medium text-slate-500 italic">One system for every traveller in your crew.</p>
              </div>

              {error ? (
                <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-xs font-bold text-red-300 uppercase tracking-wide text-center">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Input id="first_name" label="First name" value={formData.first_name} onChange={handleChange} icon={User} placeholder="Rahul" required className="bg-white/[0.02] border-white/5" />
                  <Input id="last_name" label="Last name" value={formData.last_name} onChange={handleChange} placeholder="Sharma" required className="bg-white/[0.02] border-white/5" />
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <Input id="username" label="Username" value={formData.username} onChange={handleChange} placeholder="rahultravels" required className="bg-white/[0.02] border-white/5" />
                  <Input id="email" type="email" label="Email address" value={formData.email} onChange={handleChange} icon={Mail} placeholder="rahul@example.com" required className="bg-white/[0.02] border-white/5" />
                </div>

                <Input id="password" type="password" label="Password" value={formData.password} onChange={handleChange} icon={Lock} placeholder="Use 8+ characters" required className="bg-white/[0.02] border-white/5" />

                <div className="grid gap-6 sm:grid-cols-2">
                  <Input id="phone" label="Phone number" value={formData.phone} onChange={handleChange} icon={Phone} placeholder="+91 98765 43210" className="bg-white/[0.02] border-white/5" />
                  <Input id="city" label="Home city" value={formData.city} onChange={handleChange} icon={MapPin} placeholder="Bengaluru" className="bg-white/[0.02] border-white/5" />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary" className="w-full font-black uppercase tracking-[0.2em] py-5 text-[11px]" loading={loading}>
                    Create free account <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>

              <p className="mt-10 text-center text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default Register;
