import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Favorites from './pages/Favorites';
import { Compass, Loader } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('home');
  const [searchResult, setSearchResult] = useState(null);

  // Handle initial page routing for email verification link redirects
  useEffect(() => {
    if (window.location.pathname === '/verify') {
      setPage('verify');
    }
  }, []);

  // Handle auto-routing transitions when auth state hydrates
  useEffect(() => {
    if (!loading) {
      if (user) {
        setPage('home');
      } else {
        // Allow browsing home as guest, but route to login/signup/verify correctly
        if (page === 'login' || page === 'signup' || page === 'verify') {
          // Stay on these pages
        } else {
          setPage('home');
        }
      }
    }
  }, [user, loading, page]);

  // Premium loading launcher screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        {/* Glow backdrop bubbles */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] animate-pulse-glow"></div>
        
        <div className="z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 mb-6 shadow-xl shadow-teal-500/25 animate-bounce">
            <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-teal-100 to-cyan-200 bg-clip-text text-transparent mb-2">
            WanderLust AI
          </h2>
          <p className="text-gray-400 font-medium text-sm tracking-wide mb-6">Initializing travel desk...</p>
          <Loader className="w-6 h-6 animate-spin text-teal-400" />
        </div>
      </div>
    );
  }

  // Router layout switcher
  switch (page) {
    case 'login':
      return <Login setPage={setPage} />;
    case 'signup':
      return <Signup setPage={setPage} />;
    case 'verify':
      return <Verify setPage={setPage} />;
    case 'favorites':
      return <Favorites setPage={setPage} setSearchResult={setSearchResult} />;
    case 'home':
    default:
      return <Home setPage={setPage} searchResult={searchResult} setSearchResult={setSearchResult} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
