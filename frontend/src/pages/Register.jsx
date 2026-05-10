import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Globe, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', email: '',
    password: '', phone: '', city: '', country: '', additional_info: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      } else {
        navigate('/verify', { 
          state: { 
            email: formData.email, 
            message: 'Check your inbox! We sent a 6-digit code to your email.' 
          } 
        });
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12 min-h-[calc(100vh-4rem)] relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,132,248,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/30">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--text)]">Traveloop</span>
          </Link>
        </div>

        <Card glass className="shadow-glow">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black tracking-tight text-[var(--text)] mb-1">Create your account</h1>
              <p className="text-sm text-[var(--muted)]">Start planning your next great adventure</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <Input id="first_name" label="First name" placeholder="Jane" icon={User}
                  value={formData.first_name} onChange={handleChange} required />
                <Input id="last_name" label="Last name" placeholder="Doe"
                  value={formData.last_name} onChange={handleChange} required />
              </div>

              {/* Row 2 */}
              <Input id="username" label="Username" placeholder="janedoe"
                value={formData.username} onChange={handleChange} required />

              {/* Row 3 */}
              <Input id="email" type="email" label="Email address" placeholder="jane@example.com" icon={Mail}
                value={formData.email} onChange={handleChange} required />

              {/* Row 4 */}
              <Input id="password" type="password" label="Password" placeholder="Create a strong password" icon={Lock}
                hint="Use at least 8 characters with letters and numbers"
                value={formData.password} onChange={handleChange} required />

              {/* Row 5 */}
              <div className="grid grid-cols-2 gap-4">
                <Input id="phone" label="Phone" placeholder="+1 555 000 0000" icon={Phone}
                  value={formData.phone} onChange={handleChange} />
                <Input id="country" label="Country" placeholder="United States" icon={Globe}
                  value={formData.country} onChange={handleChange} />
              </div>

              {/* Row 6 */}
              <Input id="city" label="City" placeholder="San Francisco" icon={MapPin}
                value={formData.city} onChange={handleChange} />

              {/* Textarea */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="additional_info" className="text-sm font-medium text-[var(--text)]">About you (optional)</label>
                <textarea
                  id="additional_info" rows="2"
                  className="flex w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-transparent resize-none transition-all"
                  placeholder="Tell us about your travel style..."
                  value={formData.additional_info} onChange={handleChange}
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full gap-2 mt-2" disabled={loading}>
                {loading ? 'Creating account...' : <><span>Create account</span><ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-5 text-sm text-[var(--muted)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--primary)] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
