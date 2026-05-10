import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/ui/Navbar';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './router/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import Profile from './pages/Profile';
import Checklist from './pages/Checklist';
import TripNotes from './pages/TripNotes';
import BudgetView from './pages/BudgetView';
import ItineraryView from './pages/ItineraryView';
import PublicTripView from './pages/PublicTripView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--surface-strong)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-soft)',
                },
              }}
            />
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<VerifyOTP />} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
              <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
              <Route path="/trip/:tripId" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
              <Route path="/trip/:tripId/view" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
              <Route path="/trip/:tripId/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
              <Route path="/trip/:tripId/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
              <Route path="/trip/:tripId/budget" element={<ProtectedRoute><BudgetView /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              <Route path="/share/:token" element={<PublicTripView />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
