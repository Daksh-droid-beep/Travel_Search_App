import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Compass, Trash2, Heart, ArrowLeft, ArrowRight, Loader, Globe, Calendar, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Favorites({ setPage, setSearchResult }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Confirmation Modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'deleteSingle' | 'clearAll'
  const [targetFavId, setTargetFavId] = useState(null);
  const [targetFavName, setTargetFavName] = useState('');

  // Fetch bookmarks on mount
  useEffect(() => {
    if (!user) {
      setPage('login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_URL}/favorites`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        } else {
          throw new Error('Failed to fetch bookmarks');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load your bookmarks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, setPage]);

  // Navigate to saved destination details
  const handleSelectFavorite = (fav) => {
    setSearchResult({
      query: fav.query,
      result: fav.result,
    });
    setPage('home');
  };

  // Remove a single favorite
  const handleRemoveFavorite = async (favId) => {
    try {
      const res = await fetch(`${API_URL}/favorites/${favId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        // Remove from local list state
        setFavorites((prev) => prev.filter((fav) => fav._id !== favId));
      } else {
        throw new Error('Failed to remove bookmark');
      }
    } catch (err) {
      console.error(err);
      alert('Could not remove bookmark. Please try again.');
    } finally {
      setShowConfirm(false);
    }
  };

  // Clear all favorites
  const handleClearAllFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setFavorites([]);
      } else {
        throw new Error('Failed to clear bookmarks');
      }
    } catch (err) {
      console.error(err);
      alert('Could not clear bookmarks. Please try again.');
    } finally {
      setShowConfirm(false);
    }
  };

  // Trigger Deletion Confirmation Modal
  const triggerRemoveConfirm = (e, favId, name) => {
    e.stopPropagation();
    setConfirmAction('deleteSingle');
    setTargetFavId(favId);
    setTargetFavName(name);
    setShowConfirm(true);
  };

  const triggerClearAllConfirm = () => {
    setConfirmAction('clearAll');
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-darkBg text-gray-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Background blobs for modern dark-glow aesthetic */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Header */}
      <Navbar setPage={setPage} hideHistoryToggle={true} />

      <main className="flex-1 z-10 max-w-5xl w-full mx-auto px-4 py-12">
        {/* Back Link */}
        <button
          onClick={() => setPage('home')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Travel Desk</span>
        </button>

        {/* Title */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-6 gap-4">
          <div>
            <span className="text-teal-400 font-extrabold tracking-widest text-xs uppercase">Your Travel Shelf</span>
            <h1 className="text-4xl font-black text-white mt-1 bg-gradient-to-r from-white via-teal-100 to-cyan-200 bg-clip-text text-transparent">
              Saved Destinations
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 self-center sm:self-end">
            <p className="text-gray-500 text-sm font-semibold">
              {favorites.length} Saved {favorites.length === 1 ? 'Destination' : 'Destinations'}
            </p>
            
            {favorites.length > 0 && (
              <button
                onClick={triggerClearAllConfirm}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/15 hover:bg-rose-500/20 hover:border-rose-500/25 text-rose-300 text-xs font-bold transition-all shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Bookmarks</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader className="w-10 h-10 animate-spin text-teal-400 mb-4" />
            <p className="text-gray-400 font-semibold">Gathering your bookmarks...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm font-semibold rounded-xl text-center">
            {errorMsg}
          </div>
        ) : favorites.length === 0 ? (
          /* Empty Bookmarks Illustration */
          <div className="text-center py-20 px-4 glass-panel max-w-md mx-auto rounded-3xl border border-white/10 animate-scale-up">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-teal-500/10 text-teal-400 mb-6 border border-teal-500/20 shadow-lg shadow-teal-500/5">
              <Heart className="w-12 h-12 text-teal-400 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3">No Saved Places Yet</h3>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
              No saved destinations yet. Search and save destinations to build your travel wishlist.
            </p>
            
            <button
              onClick={() => setPage('home')}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20"
            >
              <span>Explore Places</span>
              <Compass className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* Bookmarks Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {favorites.map((fav) => {
              const { query, result, destinationName, country: favCountry, imageUrl: favImageUrl, savedAt, createdAt, _id } = fav;
              const { overview, images, country: resultCountry } = result || {};
              
              const name = destinationName || query;
              const country = favCountry || resultCountry || '';
              const heroImg = favImageUrl || images?.hero || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80';
              const dateToFormat = savedAt || createdAt || new Date();
              const dateSavedStr = new Date(dateToFormat).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={_id}
                  onClick={() => handleSelectFavorite(fav)}
                  className="group relative glass-panel rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/5 flex flex-col h-96"
                >
                  {/* Card Header Hero Image background */}
                  <div className="h-44 overflow-hidden relative shrink-0">
                    <img
                      src={heroImg}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/50 to-transparent"></div>

                    {/* Delete Bookmark Button (Shortcut top-right) */}
                    <button
                      onClick={(e) => triggerRemoveConfirm(e, _id, name)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/20 transition-all shadow-md z-20 backdrop-blur-md"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Title inside card overlay */}
                    <div className="absolute bottom-4 left-5 right-5">
                      <span className="text-teal-400 text-[10px] font-black uppercase tracking-widest block">Saved Destination</span>
                      <h3 className="text-2xl font-black text-white leading-tight mt-0.5 tracking-tight group-hover:text-teal-300 transition-colors">
                        {name}
                        {country && <span className="text-gray-400 text-sm font-medium ml-1.5">, {country}</span>}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body - Snippet Description & Metadata */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900/10">
                    <div className="space-y-3">
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 font-normal">
                        {overview}
                      </p>
                      
                      {/* Date Saved Indicator */}
                      <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-teal-500/5 border border-teal-500/10 text-teal-300 text-[11px] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Saved on {dateSavedStr}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center space-x-3 mt-4 border-t border-white/5 pt-3">
                      {/* View Details Button */}
                      <button
                        onClick={() => handleSelectFavorite(fav)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-teal-500/5 hover:shadow-teal-500/15"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Remove Favorite Button */}
                      <button
                        onClick={(e) => triggerRemoveConfirm(e, _id, name)}
                        className="py-2.5 px-3.5 rounded-xl bg-rose-500/10 border border-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/20 text-rose-300 text-xs font-bold flex items-center space-x-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl animate-scale-up">
            <div className="flex items-center space-x-3.5 mb-4">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {confirmAction === 'clearAll' ? 'Clear All Bookmarks' : 'Remove Bookmark'}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">Please confirm your action</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {confirmAction === 'clearAll'
                ? 'Are you sure you want to clear ALL saved destinations from your wishlist? This action cannot be undone.'
                : `Are you sure you want to remove "${targetFavName}" from your saved destinations?`}
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold border border-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction === 'clearAll') {
                    handleClearAllFavorites();
                  } else {
                    handleRemoveFavorite(targetFavId);
                  }
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white text-sm font-bold shadow-lg shadow-rose-500/10 transition-all"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-gray-500 bg-slate-950/20 mt-16 z-10">
        &copy; {new Date().getFullYear()} WanderLust AI. All rights reserved. Persistent travel guides desk.
      </footer>
    </div>
  );
}
