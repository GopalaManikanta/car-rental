import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import { toast } from 'react-toastify';
import {
  Car,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Zap,
  ArrowRight,
  Sparkles,
  BarChart3,
  CalendarCheck,
  KeyRound,
  MousePointerClick
} from 'lucide-react';
import heroImg from '../assets/hero.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleFillDemo = () => {
    setEmail('admin@carrental.com');
    setPassword('password123');
    setError('');
    toast.info('⚡ Demo credentials auto-filled! Click "Sign In" below.', { autoClose: 2000 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = login(email, password);
      setIsSubmitting(false);

      if (result.success) {
        toast.success('✨ Login successful! Welcome to LEO Manager Portal.');
        navigate(from, { replace: true });
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row font-sans relative overflow-hidden">
      {/* Background Car Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroImg || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80'}
          alt="Luxury Fleet Background"
          className="w-full h-full object-cover object-center opacity-25 scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-orange-950/70"></div>
      </div>

      {/* LEFT PANEL: Showcase & Branding */}
      <div className="lg:w-7/12 relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80">
        {/* Glow Deco Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/30">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-white flex items-center gap-1.5">
                LEO <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
              </span>
              <p className="text-[10px] uppercase font-extrabold text-orange-400 tracking-widest">Enterprise Car Rentals</p>
            </div>
          </div>
        </div>

        {/* Main Pitch */}
        <div className="my-12 lg:my-0 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Rental Fleet Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Streamline your car rental fleet & customer operations
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Real-time vehicle availability tracking, automated digital rental agreements, instant billing, and fleet maintenance diagnostics in one unified portal.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Revenue Analytics</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Instant financial metrics & reporting</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fleet Booking</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated reservation calendar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Removed as requested */}
        <div></div>
      </div>

      {/* RIGHT PANEL: Form with Demo Auto-Fill Trigger */}
      <div className="lg:w-5/12 p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center relative z-10 bg-slate-950/80 backdrop-blur-xl">
        <div className="w-full max-w-md space-y-7">
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">Manager Sign In</h2>
            <p className="text-xs text-slate-400">Enter your credentials to access LEO manager portal</p>
          </div>

          {/* Quick Demo Auto-Fill Button */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900/80 to-amber-950/40 border border-orange-500/30">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-slate-200">Testing Demo Access</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <MousePointerClick className="w-3.5 h-3.5" /> Fill Demo Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold text-center animate-fadeIn">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/20 transition duration-200 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div className="pt-5 border-t border-slate-900 text-center">
            <p className="text-xs text-slate-400">
              Need a new enterprise account?{' '}
              <Link to="/register" className="font-bold text-orange-400 hover:text-orange-300 transition">
                Create Account <ArrowRight className="inline w-3.5 h-3.5 ml-0.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </div>
  );
};

export default LoginPage;
