import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, LogOut, History, User, Heart } from 'lucide-react';

export default function Navbar({ setPage, onToggleHistory, isHistoryOpen, hideHistoryToggle = false }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setPage('login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setPage('home')}>
            <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/10">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              WanderLust
            </span>
          </div>

          {/* User Section / Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Bookmarks link */}
                <button
                  onClick={() => setPage('favorites')}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10 text-sm font-semibold transition-all duration-300"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-500/20" />
                  <span className="hidden sm:inline">Bookmarks</span>
                </button>

                {/* Search History Toggle */}
                {!hideHistoryToggle && (
                  <button
                    onClick={onToggleHistory}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                      isHistoryOpen
                        ? 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">Search History</span>
                  </button>
                )}

                {/* Profile Bubble */}
                <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs font-bold border border-teal-500/30">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-semibold text-gray-300 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/20 text-rose-300 text-sm font-semibold transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPage('login')}
                  className="px-4 py-2 rounded-xl text-gray-300 hover:text-white text-sm font-bold transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setPage('signup')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-sm font-bold transition-all shadow-md shadow-teal-500/5 hover:shadow-teal-500/15"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
