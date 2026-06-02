import React, { useEffect, useState } from 'react';
import { Compass, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Verify({ setPage }) {
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get('status');
    const messageParam = params.get('message');

    if (statusParam === 'success') {
      setStatus('success');
    } else if (statusParam === 'failed') {
      setStatus('failed');
      setErrorMessage(messageParam || 'The verification link is invalid or has expired.');
    } else {
      setStatus('invalid');
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden py-12 font-sans">
      {/* Background Gradient Blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-glow"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 z-10 text-center animate-scale-up">
        
        {/* Branding Logo */}
        <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white/5 border border-white/5 text-teal-400 mb-6">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>

        {status === 'loading' && (
          <div className="py-6 space-y-4">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm font-semibold">Processing your verification...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
              Email Verified!
            </h2>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Your email has been verified successfully. Your WanderLust travel account is now active and ready for your next adventure.
            </p>
            
            <button
              onClick={() => {
                // Clear query params from browser URL to clean up interface
                window.history.replaceState({}, document.title, window.location.pathname);
                setPage('login');
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transform active:scale-[0.98]"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {(status === 'failed' || status === 'invalid') && (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/5 animate-bounce" style={{ animationDuration: '3s' }}>
              <AlertTriangle className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-200 to-rose-300 bg-clip-text text-transparent">
              Verification Failed
            </h2>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {errorMessage || 'This verification link is invalid, expired, or corrupted.'}
            </p>
            
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  window.history.replaceState({}, document.title, window.location.pathname);
                  setPage('signup');
                }}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>Back to Registration</span>
              </button>
              
              <button
                onClick={() => {
                  window.history.replaceState({}, document.title, window.location.pathname);
                  setPage('login');
                }}
                className="w-full py-2.5 px-4 text-teal-400 hover:text-teal-300 text-sm font-semibold transition"
              >
                Go to Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
