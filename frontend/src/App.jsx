import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/ui/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';
import CreateTrip from './pages/CreateTrip';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const apply = (e) => {
      document.documentElement.classList.toggle('light', e.matches);
    };
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="bottom-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip/:tripId" element={<TripDetails />} />
          <Route path="/create-trip" element={<CreateTrip />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}


export default App;
