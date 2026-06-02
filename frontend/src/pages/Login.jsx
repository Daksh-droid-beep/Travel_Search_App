import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, ArrowRight, AlertCircle, Loader, MailCheck, RefreshCw } from 'lucide-react';

export default function Login({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendStatus, setResendStatus] = useState(''); // 'sending' | 'sent' | 'error'
  const [loading, setLoading] = useState(false);
  const { login, error, clearError, resendVerification } = useAuth();

  useEffect(() => {
    clearError();
    setLocalError('');
    setNeedsVerification(false);
    setResendStatus('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setNeedsVerification(false);
    setResendStatus('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setPage('home');
    } catch (err) {
      if (err.needsVerification) {
        setNeedsVerification(true);
        setVerificationEmail(err.email || email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendStatus('sending');
    try {
      await resendVerification(verificationEmail);
      setResendStatus('sent');
    } catch (err) {
      setResendStatus('error');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden py-12">
      {/* Background Gradient Blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-glow"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl glow-teal border border-white/10 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 text-black mb-4 shadow-lg shadow-teal-500/20">
            <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-teal-200 to-cyan-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2 font-medium">Log in to unlock your custom travel plans</p>
        </div>

        {/* Verification Required Warning Banner */}
        {needsVerification && (
          <div className="mb-6 p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-scale-up">
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                <MailCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-amber-200 text-sm font-bold mb-1">Email Not Verified</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Your account for <span className="text-amber-300 font-semibold">{verificationEmail}</span> needs email verification. Check your inbox or click below to resend the verification link.
                </p>
              </div>
            </div>

            {resendStatus === 'sent' ? (
              <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold bg-emerald-500/10 px-4 py-2.5 rounded-lg border border-emerald-500/20">
                <MailCheck className="w-4 h-4" />
                <span>Verification email resent! Check your inbox.</span>
              </div>
            ) : resendStatus === 'error' ? (
              <div className="text-rose-300 text-xs font-semibold bg-rose-500/10 px-4 py-2.5 rounded-lg border border-rose-500/20">
                Failed to resend. Please try again.
              </div>
            ) : (
              <button
                onClick={handleResendVerification}
                disabled={resendStatus === 'sending'}
                className="w-full py-2.5 px-4 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/25 text-amber-300 text-sm font-bold rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50"
              >
                {resendStatus === 'sending' ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Generic Errors (not verification-related) */}
        {!needsVerification && (localError || error) && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start space-x-3 text-rose-200 text-sm animate-pulse-glow" style={{ animationDuration: '6s' }}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 text-white placeholder-gray-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-300 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 text-white placeholder-gray-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In to WanderLust</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-gray-400">
          New to WanderLust?{' '}
          <button
            onClick={() => setPage('signup')}
            className="text-teal-400 hover:text-teal-300 font-bold transition-colors underline underline-offset-4"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
