import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import HistorySidebar from '../components/HistorySidebar';
import AIChatAssistant from '../components/AIChatAssistant';
import { Compass, Shield, HelpCircle, Heart, Globe, DollarSign, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Home({ setPage }) {
  const { user } = useAuth();
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTrigger, setHistoryTrigger] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Core search function
  const handleSearch = async (query) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const res = await fetch(`${API_URL}/travel/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (res.ok) {
        setSearchResult(data);
        // Trigger sidebar search list refresh
        setHistoryTrigger((prev) => prev + 1);
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch destination details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-load result from clicking search history item
  const handleSelectHistory = (historyItem) => {
    setSearchResult({
      query: historyItem.query,
      result: historyItem.result,
    });
  };

  return (
    <div className="min-h-screen bg-darkBg text-gray-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Background blobs for modern dark-glow aesthetic */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Navbar Header */}
      <Navbar
        setPage={setPage}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isHistoryOpen={isHistoryOpen}
      />

      {/* Main Container */}
      <main className="flex-1 z-10">
        
        {/* Hero Section */}
        <section className="text-center pt-16 md:pt-24 px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>AI-Driven Travel Intelligence</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
            Discover Your Next{' '}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Get instant, AI-guided guides, attraction node mapping, and customized budget estimations for locations worldwide.
          </p>
        </section>

        {/* Search Bar Section */}
        <section className="pb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Error Notification */}
        {errorMsg && (
          <div className="max-w-md mx-auto px-4 mt-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm font-semibold rounded-xl text-center">
              {errorMsg}
            </div>
          </div>
        )}

        {/* Destination Results View OR Welcome Features Grid */}
        <section className="relative">
          {searchResult ? (
            <DestinationCard destination={searchResult} />
          ) : (
            // Welcome Features Grid - displayed when no searches have run
            <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-extrabold text-white">How WanderLust Helps You Plan</h3>
                <p className="text-gray-500 mt-2 text-sm font-medium">Explore premium travel assistance in one place</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-teal-500/20 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 border border-teal-500/20 group-hover:bg-teal-500/20 transition">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Global Explorations</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Search cities, nations, or ancient heritage monuments. WanderLust lists details instantly.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-teal-500/20 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Tiered Budget Systems</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Compare backpacker, standard, and high-end luxury price ranges for a fully informed trip plan.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-teal-500/20 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">AI Assistants</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Chat live with a helpful assistant about pack lists, local weather parameters, or travel guides.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Slide-out History Drawer Sidebar */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectHistory={handleSelectHistory}
        currentHistoryRefreshTrigger={historyTrigger}
      />

      {/* Persistent conversational chatbot assistant widget */}
      <AIChatAssistant />

      {/* Footer copyright */}
      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-gray-500 z-10 bg-slate-950/20">
        &copy; {new Date().getFullYear()} WanderLust AI. All rights reserved. Created for premium globetrotting.
      </footer>
    </div>
  );
}
