import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Loader,
  Trash2,
  Calendar,
  Sparkles,
  MessageSquarePlus,
  Lock
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AIChatAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState('chat'); // 'chat' | 'history'
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: "Hi traveler! 🌍 I'm WanderLust AI, your personal travel assistant. Ask me anything about packing tips, budget estimates, visa info, or hidden gems anywhere in the world! Where are you planning to go?",
    },
  ]);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && tab === 'chat') {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, tab]);

  // Load chat history when the 'history' tab is selected
  useEffect(() => {
    if (isOpen && tab === 'history' && user) {
      fetchChatHistory();
    }
  }, [isOpen, tab, user]);

  const fetchChatHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat/history`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userText = message.trim();
    const userMessage = { sender: 'user', text: userText };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const res = await fetch(`${API_URL}/travel/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: userText,
          chatHistory: chatHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => [...prev, { sender: 'bot', text: data.reply }]);
        
        // Asynchronously update history list if authenticated
        if (user) {
          fetchChatHistory();
        }
      } else {
        throw new Error('Chat failed');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Oops, I ran into a small turbulence while fetching your answer. Please check your internet connection or make sure the Gemini API key is configured in the backend .env file!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reopen a conversation from history
  const handleReopenConversation = (item) => {
    setChatHistory([
      {
        sender: 'bot',
        text: "Hi traveler! 🌍 I'm WanderLust AI, your personal travel assistant. Ask me anything about packing tips, budget estimates, visa info, or hidden gems anywhere in the world! Where are you planning to go?",
      },
      { sender: 'user', text: item.userQuestion },
      { sender: 'bot', text: item.aiResponse }
    ]);
    setTab('chat');
  };

  // Delete a specific chat entry
  const handleDeleteChat = async (e, id) => {
    e.stopPropagation(); // Prevent card selection click
    
    try {
      const res = await fetch(`${API_URL}/chat/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Delete chat failed:', err);
    }
  };

  // Clear all chat history
  const handleClearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear your entire AI chat history?')) return;

    try {
      const res = await fetch(`${API_URL}/chat/history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setHistoryList([]);
      }
    } catch (err) {
      console.error('Clear history failed:', err);
    }
  };

  const formatTimestamp = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-full shadow-2xl transition duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none glow-teal-hover"
        >
          <MessageSquare className="w-6 h-6 transform group-hover:rotate-6 transition-transform" />
          {/* Subtle notification indicator */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
          </span>
        </button>
      )}

      {/* Chat Drawer Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] glass-panel border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-slate-950/95 animate-scale-up">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/40 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/25">
                <Bot className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm tracking-tight">WanderLust AI</h4>
                <span className="text-[10px] text-teal-400 font-semibold flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping mr-1"></span> Live Travel Assistant
                </span>
              </div>
            </div>
            
            {/* Nav Tabs */}
            <div className="flex items-center space-x-1.5 bg-slate-900/80 p-1 rounded-lg border border-white/5 mr-3">
              <button
                onClick={() => setTab('chat')}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-md transition ${
                  tab === 'chat'
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setTab('history')}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-md transition ${
                  tab === 'history'
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                History
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* TAB 1: LIVE CHAT INTERACTIVE PANEL */}
          {tab === 'chat' && (
            <>
              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-950/40">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7.5 h-7.5 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                        msg.sender === 'user'
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                          : 'bg-teal-500/15 text-teal-300 border border-teal-500/20'
                      }`}
                    >
                      {msg.sender === 'user' ? 'U' : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`p-3.5 rounded-xl text-sm leading-relaxed max-w-[80%] ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-tr-none animate-scale-up'
                          : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none animate-scale-up'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* AI Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7.5 h-7.5 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/20 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl rounded-tl-none flex items-center space-x-2 text-gray-400">
                      <Loader className="w-4 h-4 animate-spin text-teal-400" />
                      <span className="text-xs font-semibold">WanderLust is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-slate-900/40 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask travel tips, pack lists, etc..."
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 text-white placeholder-gray-500 text-sm outline-none transition"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-teal-900 disabled:to-cyan-900 text-slate-950 transition duration-300"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: AI CHAT HISTORY SAVED PANEL */}
          {tab === 'history' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/40 p-4">
              {!user ? (
                /* Unauthenticated Locker panel */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-scale-up">
                  <div className="p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 animate-pulse">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">History Persistence Locked</h4>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-[240px]">
                    Sign in to your WanderLust account to securely persist, clear, and review your conversational AI chat history!
                  </p>
                </div>
              ) : historyLoading ? (
                /* Loading State */
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Loader className="w-8 h-8 animate-spin text-teal-400 mb-3" />
                  <p className="text-gray-400 text-xs font-semibold">Retrieving secure logs...</p>
                </div>
              ) : historyList.length === 0 ? (
                /* Empty logs list */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-scale-up">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-teal-400/50 mb-4">
                    <MessageSquarePlus className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">No Conversations Logged</h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed max-w-[200px]">
                    Chat with WanderLust AI on the chat tab and your queries will be saved dynamically here.
                  </p>
                </div>
              ) : (
                /* History logs list */
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* History Header options */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/5 shrink-0 mb-3">
                    <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase">Saved Conversations</span>
                    <button
                      onClick={handleClearAllHistory}
                      className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider flex items-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear All
                    </button>
                  </div>

                  {/* Scrollable logs list */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5">
                    {historyList.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleReopenConversation(item)}
                        className="group p-3 bg-white/5 border border-white/5 hover:border-teal-500/20 rounded-xl cursor-pointer transition duration-300 flex items-center justify-between hover:bg-slate-900/40"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="text-xs font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
                            {item.userQuestion}
                          </p>
                          <span className="text-[9px] text-gray-500 mt-1 flex items-center font-semibold">
                            <Calendar className="w-3 h-3 mr-1" /> {formatTimestamp(item.createdAt)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteChat(e, item._id)}
                          className="p-1.5 rounded-lg bg-slate-950/60 border border-white/5 text-gray-500 hover:text-rose-400 hover:border-rose-500/20 transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-md"
                          title="Delete Chat Log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
