import { useState } from 'react'
import axios from 'axios'

function App() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      const response = await axios.get(`${apiUrl}/health/`)
      setHealthStatus(response.data.status)
    } catch (err) {
      console.error('API Error:', err)
      setError('Failed to connect to API. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Traveloop
        </h1>
        <p className="text-xl text-slate-400">
          Your Premium Full-Stack Starter Template
        </p>
      </header>

      <main className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">System Integration Test</h2>
        
        <div className="flex flex-col gap-6">
          <button
            onClick={checkHealth}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 
              ${loading 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-500/20'
              }`}
          >
            {loading ? 'Checking...' : 'Test Backend Health'}
          </button>

          {healthStatus && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-emerald-400 font-medium">Status: {healthStatus}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-rose-400 font-medium">{error}</span>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 text-slate-500 text-sm">
        <p>Built with Django, React, PostgreSQL & Docker</p>
      </footer>
    </div>
  )
}

export default App
