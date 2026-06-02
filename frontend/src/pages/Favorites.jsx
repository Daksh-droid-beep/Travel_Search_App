import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Compass, Trash2, Heart, ArrowLeft, ArrowRight, Loader, Globe } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Favorites({ setPage, setSearchResult }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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

  // Remove a favorite
  const handleRemoveFavorite = async (e, favId) => {
    e.stopPropagation(); // Prevent triggering card selection click
    
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
    }
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
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-6">
          <div>
            <span className="text-teal-400 font-extrabold tracking-widest text-xs uppercase">Your Travel Shelf</span>
            <h1 className="text-4xl font-black text-white mt-1 bg-gradient-to-r from-white via-teal-100 to-cyan-200 bg-clip-text text-transparent">
              My Saved Bookmarks
            </h1>
          </div>
          <p className="text-gray-500 mt-2 sm:mt-0 text-sm font-semibold">
            {favorites.length} Saved {favorites.length === 1 ? 'Destination' : 'Destinations'}
          </p>
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
              Start searching for locations around the globe and click the heart icon on any guide page to build your custom bucket list!
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
              const { query, result, _id } = fav;
              const { overview, images } = result;
              
              const heroImg = images?.hero || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80';

              return (
                <div
                  key={_id}
                  onClick={() => handleSelectFavorite(fav)}
                  className="group relative glass-panel rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/5 flex flex-col h-80"
                >
                  {/* Card Header Hero Image background */}
                  <div className="h-40 overflow-hidden relative shrink-0">
                    <img
                      src={heroImg}
                      alt={query}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/50 to-transparent"></div>

                    {/* Delete Bookmark Button */}
                    <button
                      onClick={(e) => handleRemoveFavorite(e, _id)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/20 transition-all shadow-md z-20 backdrop-blur-md"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Title inside card overlay */}
                    <div className="absolute bottom-4 left-5 right-5">
                      <span className="text-teal-400 text-[10px] font-black uppercase tracking-widest block">Guide Persistent</span>
                      <h3 className="text-2xl font-black text-white leading-tight mt-0.5 tracking-tight group-hover:text-teal-300 transition-colors">
                        {query}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body - Snippet Description */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900/10">
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 font-normal">
                      {overview}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                      <span className="flex items-center text-teal-500/80 font-bold">
                        <Globe className="w-3.5 h-3.5 mr-1" /> AI PERSISTENT GUIDE
                      </span>
                      <span className="flex items-center text-gray-300 group-hover:text-teal-400 transition-colors">
                        View Guide <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-gray-500 bg-slate-950/20 mt-16 z-10">
        &copy; {new Date().getFullYear()} WanderLust AI. All rights reserved. Persistent travel guides desk.
      </footer>
    </div>
  );
}
