import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, MapPin, Loader, Calendar, Compass } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HistorySidebar({ isOpen, onClose, onSelectHistory, currentHistoryRefreshTrigger }) {
  const { user } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch history list
  const fetchHistory = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/history`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, currentHistoryRefreshTrigger, user]);

  // Delete history item
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Avoid triggering card reload onClick
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting history:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm glass-panel border-l border-white/10 shadow-2xl flex flex-col h-full bg-slate-950/95 animate-slide-in font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-900/40">
        <div className="flex items-center space-x-2.5">
          <Compass className="w-5 h-5 text-teal-400" />
          <h3 className="font-extrabold text-white text-lg tracking-tight">Your Search History</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* History Items list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3.5">
        {isLoading && historyList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader className="w-8 h-8 animate-spin text-teal-400" />
            <span className="text-gray-400 text-sm font-semibold">Retrieving history...</span>
          </div>
        ) : historyList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="p-4 bg-white/5 border border-white/5 rounded-full text-gray-500 mb-4 animate-pulse">
              <Compass className="w-8 h-8" />
            </div>
            <h4 className="text-gray-300 font-bold mb-1">No searches yet</h4>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">
              Perform a search to save your destinations here.
            </p>
          </div>
        ) : (
          historyList.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                onSelectHistory(item);
                onClose();
              }}
              className="group flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-teal-500/20 rounded-xl transition duration-300 cursor-pointer"
            >
              <div className="flex items-start space-x-3 truncate">
                <MapPin className="w-4.5 h-4.5 text-teal-400 mt-0.5 shrink-0" />
                <div className="truncate">
                  <h4 className="text-white font-bold text-sm tracking-wide group-hover:text-teal-300 transition truncate">
                    {item.query}
                  </h4>
                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Delete trash button */}
              <button
                onClick={(e) => handleDelete(e, item._id)}
                disabled={deletingId === item._id}
                className="p-2 rounded-lg bg-white/0 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 transition shrink-0"
              >
                {deletingId === item._id ? (
                  <Loader className="w-4 h-4 animate-spin text-rose-400" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
