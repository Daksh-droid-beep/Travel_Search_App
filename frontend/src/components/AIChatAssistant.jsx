import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Compass, Loader, ArrowDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: "Hi traveler! 🌍 I'm WanderLust AI, your personal travel assistant. Ask me anything about packing tips, budget estimates, visa info, or hidden gems anywhere in the world! Where are you planning to go?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: message.trim() };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/travel/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          chatHistory: chatHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => [...prev, { sender: 'bot', text: data.reply }]);
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
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/40">
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
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

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
                      ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
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
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-slate-900/40 flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
}
