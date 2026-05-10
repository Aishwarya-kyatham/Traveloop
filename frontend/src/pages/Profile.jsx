import React, { useEffect, useMemo, useState } from 'react';
import { LogOut, Mail, MapPin, Phone, Save, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useUpdateUser, useUser } from '../hooks/useUser';
import { useTrips } from '../hooks/useItinerary';

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: user, isLoading } = useUser();
  const { data: trips = [] } = useTrips();
  const updateMutation = useUpdateUser();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    country: '',
    additional_info: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        phone: user.phone ?? '',
        city: user.city ?? '',
        country: user.country ?? 'India',
        additional_info: user.additional_info ?? '',
      });
    }
  }, [user]);

  const initials = useMemo(() => {
    const name = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || 'T';
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateMutation.mutate(form);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <AppShell className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="glass-panel rounded-[28px] px-6 py-5 text-sm text-slate-300">Loading your profile...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Profile & settings"
        title="Manage your identity, travel preferences, and account settings."
        description="This profile follows the same polished system as the rest of the product, with a cleaner structure for personal info, trip history, and actions."
        actions={<Button variant="danger" onClick={handleLogout}><LogOut className="h-4 w-4" /> Logout</Button>}
      />

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-indigo-500 to-blue-500 text-2xl font-bold text-white">
                {initials}
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username}
                </div>
                <div className="mt-1 text-sm text-slate-500">{user?.email}</div>
                {user?.is_verified ? <div className="mt-3 inline-flex rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold text-emerald-200">Verified account</div> : null}
              </div>
            </div>

            <div className="mt-8 grid gap-3">
              {[
                { label: 'Trips planned', value: trips.length },
                { label: 'Home base', value: user?.city || 'Not added yet' },
                { label: 'Country', value: user?.country || 'India' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-3xl border border-slate-700/60 bg-white/[0.03] px-4 py-4">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-glow">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Settings className="h-5 w-5 text-indigo-300" />
              <div className="text-xl font-bold text-white">Personal details</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First name" icon={User} value={form.first_name} onChange={(event) => setForm((current) => ({ ...current, first_name: event.target.value }))} />
                <Input label="Last name" icon={User} value={form.last_name} onChange={(event) => setForm((current) => ({ ...current, last_name: event.target.value }))} />
              </div>
              <Input label="Email" icon={Mail} value={user?.email || ''} readOnly className="opacity-70" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Phone" icon={Phone} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="+91 98765 43210" />
                <Input label="City" icon={MapPin} value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} placeholder="Mumbai" />
              </div>
              <Input label="Country" value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} placeholder="India" />
              <div>
                <label htmlFor="additional_info" className="mb-2 block text-sm font-semibold text-slate-200">Travel profile</label>
                <textarea
                  id="additional_info"
                  rows="4"
                  className="w-full rounded-2xl border border-slate-700/60 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                  placeholder="Group trip planner, family traveller, weekend explorer..."
                  value={form.additional_info}
                  onChange={(event) => setForm((current) => ({ ...current, additional_info: event.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" loading={updateMutation.isPending}>
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
};

export default Profile;
