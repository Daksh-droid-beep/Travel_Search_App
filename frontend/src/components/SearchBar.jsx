import React, { useState } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (destination) => {
    setQuery(destination);
    onSearch(destination);
  };

  const suggestions = ['Tokyo', 'Paris', 'Bali', 'New York'];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-8 md:mt-12">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow backdrop effect */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-30 group-focus-within:opacity-50 transition duration-300"></div>
        
        {/* Input area */}
        <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl p-1.5 focus-within:border-teal-500/30 transition duration-300">
          <div className="flex items-center pl-4 pr-2 text-gray-400 shrink-0">
            <MapPin className="w-6 h-6 text-teal-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where is your next adventure? (e.g. Paris, Tokyo, Grand Canyon...)"
            className="w-full py-3.5 bg-transparent border-0 text-white placeholder-gray-400 outline-none focus:ring-0 text-lg"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-teal-900 disabled:to-cyan-900 text-slate-950 px-6 py-3.5 rounded-xl font-extrabold text-base transition-all duration-300 transform active:scale-95 shadow-md shadow-teal-500/10 active:duration-75 min-w-[120px]"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin text-slate-950" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 text-sm">
        <span className="text-gray-400 font-medium">Popular:</span>
        {suggestions.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => handleSuggestionClick(city)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-teal-500/10 hover:border-teal-500/25 hover:text-teal-300 text-gray-300 font-semibold transition-all duration-300"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
