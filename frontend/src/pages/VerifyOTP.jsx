import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        return;
      }

      setMessage(data.message || 'Email verified successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Enter your email to resend the code.');
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
        return;
      }
      setMessage(data.message || 'A fresh code has been sent.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-10">
        <Card className="mx-auto w-full max-w-lg border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 shadow-glow">
              <ShieldCheck className="h-8 w-8" />
            </div>
            
            <div className="mb-10">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Security verification</div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Verify email</h1>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">Enter the 6-digit code sent to your inbox to activate your Traveloop workspace.</p>
            </div>

            {error ? (
              <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-xs font-bold text-red-300 uppercase tracking-wide">
                {error}
              </div>
            ) : null}

            {message && !error ? (
              <div className="mb-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-4 text-xs font-bold text-indigo-300 uppercase tracking-wide">
                {message}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <Input 
                id="email" 
                label="Email address" 
                type="email" 
                value={email} 
                onChange={(event) => setEmail(event.target.value)} 
                placeholder="you@traveloop.com" 
                disabled={Boolean(location.state?.email)} 
                required 
                className="bg-white/[0.02] border-white/5"
              />
              <Input 
                id="otp" 
                label="Verification code" 
                value={otp} 
                onChange={(event) => setOtp(event.target.value)} 
                placeholder="000 000" 
                maxLength="6" 
                className="text-center text-2xl font-black tracking-[0.5em] bg-white/[0.02] border-white/5 focus:border-indigo-500/50" 
                required 
              />
              
              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full font-black uppercase tracking-[0.2em] py-5 text-[11px]" loading={loading}>
                  Verify & Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>

            <div className="mt-10 flex flex-col items-center gap-6">
              <button 
                type="button" 
                onClick={handleResend} 
                className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors" 
                disabled={resending}
              >
                <RefreshCw className={['h-3.5 w-3.5', resending ? 'animate-spin' : ''].join(' ')} />
                {resending ? 'Sending Code...' : 'Resend Code'}
              </button>
              
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default VerifyOTP;
