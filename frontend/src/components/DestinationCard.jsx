import React from 'react';
import { Calendar, Compass, DollarSign, Award, Heart, CheckCircle2, Navigation } from 'lucide-react';

export default function DestinationCard({ destination }) {
  if (!destination || !destination.result) return null;

  const { query, result } = destination;
  const { overview, bestTime, attractions, estimatedBudget } = result;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-12 md:mt-16 animate-fade-in font-sans pb-16">
      {/* Destination Header Title */}
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between border-b border-white/5 pb-6">
        <div>
          <span className="text-teal-400 font-extrabold tracking-widest text-xs uppercase">Destination Guide</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-1 bg-gradient-to-r from-white via-teal-100 to-cyan-200 bg-clip-text text-transparent">
            {query}
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex justify-center md:justify-start space-x-3">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-bold shadow-sm shadow-teal-500/5">
            <Compass className="w-3.5 h-3.5 mr-1.5 animate-spin" style={{ animationDuration: '8s' }} /> Verified AI Guide
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Overview & Attractions (Spans 2 columns on desktop) */}
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
        </div>

        {/* Right Col: Best Time & Budgets (Spans 1 column) */}
        <div className="space-y-6">
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
    </div>
  );
}
