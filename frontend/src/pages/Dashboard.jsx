import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, LogOut, Map } from 'lucide-react';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('/api/auth/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-secondary)] min-h-[calc(100vh-4rem)]">
      <div className="border-b border-[var(--border)] bg-[var(--card)] px-4 py-4">
        <Container className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[var(--text)]">Welcome back, {user.first_name || user.username}</h1>
            <p className="text-sm text-[var(--muted)]">Let's plan your next adventure.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Map className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text)] mb-2">No trips yet</h2>
              <p className="text-[var(--muted)] mb-6 max-w-sm">
                You haven't planned any trips yet. Create your first itinerary to get started.
              </p>
              <Button variant="primary">Create new trip</Button>
            </div>
          </div>
          <div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-400" /> Inspiration
              </h3>
              <div className="space-y-4">
                {[
                  { dest: "Tokyo & Kyoto", days: 10 },
                  { dest: "Italian Riviera", days: 7 },
                  { dest: "Bali Getaway", days: 14 }
                ].map((item) => (
                  <div key={item.dest} className="p-3 rounded-xl hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors border border-transparent hover:border-[var(--border)]">
                    <div className="font-medium text-[var(--text)] text-sm">{item.dest}</div>
                    <div className="text-xs text-[var(--muted)]">{item.days} days</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
