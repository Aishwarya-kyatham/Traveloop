import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get email from router state if passed during registration
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setError('Email and verification code are required.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Verification failed. Please check your code.');
      } else {
        setMessage(data.message || 'Email verified successfully!');
        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email to resend the code.');
      return;
    }
    setResending(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/resend-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to resend code.');
      } else {
        setMessage(data.message || 'A new code has been sent to your email.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-4rem)] relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,132,248,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/30">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--text)]">Traveloop</span>
          </Link>
        </div>

        <Card glass className="shadow-glow border-[var(--border)]">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black tracking-tight text-[var(--text)] mb-1">Verify Email</h1>
              <p className="text-sm text-[var(--muted)]">Enter the 6-digit code sent to your email.</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                {error}
              </div>
            )}
            
            {message && !error && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email" type="email" label="Email address"
                placeholder="you@example.com" 
                value={email} onChange={(e) => setEmail(e.target.value)} required
                disabled={!!location.state?.email}
              />
              <Input
                id="otp" type="text" label="Verification Code"
                placeholder="123456" 
                maxLength="6"
                className="text-center text-xl tracking-widest font-mono"
                value={otp} onChange={(e) => setOtp(e.target.value)} required
              />
              <Button
                type="submit" variant="primary" size="lg"
                className="w-full mt-2 gap-2"
                disabled={loading}
              >
                {loading ? 'Verifying...' : <><span>Verify Account</span><ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
               <button 
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-[var(--primary)] hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`h-3 w-3 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Sending...' : 'Resend verification code'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTP;
