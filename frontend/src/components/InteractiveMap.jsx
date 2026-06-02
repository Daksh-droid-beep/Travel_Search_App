import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Globe, Maximize2, Minimize2 } from 'lucide-react';

export default function InteractiveMap({ coordinates, query }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  const { lat, lon } = coordinates || { lat: 48.8566, lon: 2.3522 };

  useEffect(() => {
    // Check if Leaflet is loaded on window
    if (!window.L) {
      console.warn('Leaflet is not loaded on window.');
      setMapError(true);
      return;
    }

    const L = window.L;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current && mapContainerRef.current) {
      try {
        // Create Leaflet map instance
        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([lat, lon], 12);

        // Add CartoDB Dark Matter tiles (Perfect futuristic dark theme map!)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        // Custom neon glowing HTML marker matching our dark-teal theme
        const neonIcon = L.divIcon({
          className: 'custom-neon-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 bg-teal-500 rounded-full opacity-30 animate-ping" style="animation-duration: 3s;"></div>
              <div class="absolute w-5 h-5 bg-teal-500/50 rounded-full blur-sm"></div>
              <div class="relative w-4 h-4 bg-teal-400 border-2 border-white rounded-full shadow-[0_0_12px_rgba(45,212,191,0.8)]"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        // Add Marker
        const marker = L.marker([lat, lon], { icon: neonIcon })
          .addTo(map)
          .bindPopup(`<b style="color: #0F172A; font-family: sans-serif;">${query}</b>`, {
            closeButton: false,
            className: 'custom-map-popup'
          });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } catch (err) {
        console.error('Failed to initialize Leaflet Map:', err);
        setMapError(true);
      }
    } else if (mapInstanceRef.current) {
      // If map already exists, smoothly fly/pan to new coordinates and update marker
      try {
        const map = mapInstanceRef.current;
        map.flyTo([lat, lon], 12, {
          animate: true,
          duration: 1.5
        });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lon]);
          markerRef.current.getPopup().setContent(`<b style="color: #0F172A; font-family: sans-serif;">${query}</b>`);
        }
      } catch (err) {
        console.error('Error updating map coordinates:', err);
      }
    }

    // Cleanup map on unmount
    return () => {
      // We don't necessarily need to destroy it if the ref stays, but on unmount we should clean up
      if (mapInstanceRef.current) {
        // Leave cleanup to React or destroy explicitly
      }
    };
  }, [lat, lon, query]);

  // Clean up completely when component unmounts
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  if (mapError) {
    return (
      <div className="w-full h-80 rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-center text-center p-6 text-gray-400">
        <Globe className="w-12 h-12 text-teal-500/50 mb-3 animate-pulse" />
        <p className="font-semibold text-white">Interactive Map Offline</p>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">
          Could not load the interactive map tiles. Check your network connection.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col h-full hover:border-white/15 transition duration-300">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-base font-bold text-white flex items-center">
          <MapPin className="w-5 h-5 text-teal-400 mr-2.5 shrink-0" />
          Location Explorer
        </h3>
        {coordinates && (
          <span className="text-[11px] font-mono text-gray-400 bg-slate-900/60 border border-white/5 px-2.5 py-1 rounded-md shadow-sm">
            {lat.toFixed(4)}° N, {lon.toFixed(4)}° E
          </span>
        )}
      </div>

      {/* Map Element */}
      <div className="relative flex-1 min-h-[280px] rounded-xl overflow-hidden border border-white/5 shadow-inner">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
        
        {/* Futuristic Map Overlay HUD element */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/80 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center space-x-2 text-[10px] text-gray-300 shadow-md">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_#2dd4bf]"></div>
          <span className="font-bold tracking-wider uppercase">{query} Radar Active</span>
        </div>
      </div>
    </div>
  );
}
