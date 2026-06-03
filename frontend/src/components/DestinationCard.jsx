import React, { useState, useEffect } from 'react';
import { Calendar, Compass, DollarSign, Heart, Loader, Navigation, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WeatherCard from './WeatherCard';
import InteractiveMap from './InteractiveMap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DestinationCard({ destination }) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [favId, setFavId] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  if (!destination || !destination.result) return null;

  const { query, result } = destination;
  const { 
    overview, 
    bestTime, 
    attractions, 
    estimatedBudget, 
    images, 
    weather, 
    forecast, 
    coordinates,
    country 
  } = result;

  // Retrieve images fallbacks
  const heroImg = images?.hero || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80';
  const galleryImgs = images?.gallery || [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'
  ];

  // Check if destination is already saved in bookmarks
  useEffect(() => {
    const checkIsSaved = async () => {
      if (!user) {
        setIsSaved(false);
        setFavId(null);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/favorites`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (res.ok) {
          const favs = await res.json();
          // Match by case-insensitive query string
          const found = favs.find(
            (f) => f.query.toLowerCase().trim() === query.toLowerCase().trim()
          );
          
          if (found) {
            setIsSaved(true);
            setFavId(found._id);
          } else {
            setIsSaved(false);
            setFavId(null);
          }
        }
      } catch (err) {
        console.error('Error checking saved bookmarks:', err);
      }
    };

    checkIsSaved();
  }, [query, user]);

  // Toggle saving/removing bookmark
  const handleToggleBookmark = async () => {
    if (!user) {
      showToast('Please log in or sign up to bookmark destinations!', 'error');
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isSaved) {
        // Remove favorite
        const idToDelete = favId || query;
        const res = await fetch(`${API_URL}/favorites/${idToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (res.ok) {
          setIsSaved(false);
          setFavId(null);
          showToast('Destination removed from bookmarks!', 'success');
        } else {
          throw new Error('Failed to delete bookmark');
        }
      } else {
        // Save favorite
        const res = await fetch(`${API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            query,
            result,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setIsSaved(true);
          setFavId(data.favorite._id);
          showToast('Destination saved to bookmarks successfully!', 'success');
        } else {
          throw new Error('Failed to save bookmark');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to modify bookmarks. Please try again.', 'error');
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-8 md:mt-12 animate-fade-in font-sans pb-16">
      
      {/* 1. Large Scenic Hero Header Block */}
      <div className="relative h-64 md:h-[400px] rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl group shadow-teal-500/5">
        <img 
          src={heroImg} 
          alt={query} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms]"
        />
        {/* Futuristic dark-radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-darkBg/70 via-transparent to-transparent"></div>

        {/* Hero Overlay HUD Elements */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between z-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 font-extrabold tracking-widest text-[10px] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Active Travel Desk</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
              {query}
              {country && <span className="text-gray-400 text-lg md:text-2xl font-medium ml-2">, {country}</span>}
            </h1>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            {/* Save Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border font-bold text-xs transition-all duration-300 shadow-md backdrop-blur-md ${
                isSaved
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                  : 'bg-slate-950/70 border-white/10 text-gray-300 hover:text-white hover:border-teal-500/30'
              }`}
            >
              {bookmarkLoading ? (
                <Loader className="w-4 h-4 animate-spin text-teal-400" />
              ) : (
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-400' : 'text-gray-400'}`} />
              )}
              <span>{isSaved ? 'Saved in Bookmarks' : 'Save Destination'}</span>
            </button>

            <span className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-teal-300 text-xs font-bold shadow-md backdrop-blur-md">
              <Compass className="w-4 h-4 mr-1.5 animate-spin" style={{ animationDuration: '10s' }} /> AI Certified
            </span>
          </div>
        </div>
      </div>

      {/* 2. Overarching Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Overview & Attractions & Image Gallery) Spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-white/15 transition duration-300">
            <h3 className="text-lg font-bold text-white flex items-center mb-4">
              <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3"></span>
              Overview
            </h3>
            <p className="text-gray-300 leading-relaxed text-base font-normal">
              {overview}
            </p>
          </div>

          {/* Dynamic Live Weather Card (Upgraded Weather Feature) */}
          {weather && (
            <WeatherCard weather={weather} forecast={forecast} />
          )}

          {/* Attractions Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-white/15 transition duration-300">
            <h3 className="text-lg font-bold text-white flex items-center mb-6">
              <span className="w-1.5 h-6 bg-cyan-500 rounded-full mr-3"></span>
              Top Attractions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attractions && attractions.map((attraction, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start space-x-3.5 p-4 bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-teal-500/20 rounded-xl transition duration-300 group"
                >
                  <div className="flex items-center justify-center p-2 rounded-lg bg-teal-500/10 text-teal-300 group-hover:bg-teal-500/20 group-hover:text-teal-200 transition shrink-0">
                    <Navigation className="w-4 h-4 transform group-hover:rotate-45 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-wide">{attraction}</h4>
                    <span className="text-gray-400 text-xs mt-0.5 block">Must-visit landmark</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Gallery (Upgraded Image Feature) */}
          {galleryImgs && galleryImgs.length > 0 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-white/15 transition duration-300">
              <h3 className="text-lg font-bold text-white flex items-center mb-6">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
                Scenic Landmark Gallery
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {galleryImgs.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    className="relative h-44 rounded-xl overflow-hidden border border-white/5 shadow-md group"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Landmark ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-[10px] uppercase font-black tracking-wider text-teal-300">Explore Landmark</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Maps & Best Time & Budget) Spans 1 col */}
        <div className="space-y-6">
          
          {/* Interactive Leaflet Map (Upgraded Map Feature) */}
          {coordinates && (
            <InteractiveMap coordinates={coordinates} query={query} />
          )}

          {/* Best Time Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/80 to-teal-950/20">
            <h3 className="text-lg font-bold text-white flex items-center mb-4">
              <Calendar className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
              Best Time to Visit
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {bestTime}
            </p>
          </div>

          {/* Budget Breakdown */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center mb-6">
              <DollarSign className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />
              Estimated Budgets
            </h3>

            <div className="space-y-5">
              {/* Backpacker */}
              <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl hover:border-teal-500/10 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-teal-400 uppercase tracking-widest">Backpacker</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-bold border border-teal-500/20">Budget-friendly</span>
                </div>
                <p className="text-white font-bold text-sm">
                  {estimatedBudget?.backpacker || 'N/A'}
                </p>
              </div>

              {/* Mid-Range */}
              <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl hover:border-teal-500/10 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest">Mid-Range</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/20">Recommended</span>
                </div>
                <p className="text-white font-bold text-sm">
                  {estimatedBudget?.midRange || 'N/A'}
                </p>
              </div>

              {/* Luxury */}
              <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl hover:border-teal-500/10 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Luxury</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">Premium</span>
                </div>
                <p className="text-white font-bold text-sm">
                  {estimatedBudget?.luxury || 'N/A'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3.5 px-4 py-3 rounded-2xl border shadow-2xl animate-slide-in backdrop-blur-md ${
          notification.type === 'error'
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            : 'bg-teal-500/10 border-teal-500/20 text-teal-300'
        }`}>
          <div className={`p-1.5 rounded-lg ${
            notification.type === 'error' ? 'bg-rose-500/10' : 'bg-teal-500/10'
          }`}>
            <Heart className={`w-4 h-4 ${notification.type === 'error' ? 'text-rose-400' : 'text-teal-400 fill-teal-400/20'}`} />
          </div>
          <span className="text-xs font-bold tracking-wide">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
