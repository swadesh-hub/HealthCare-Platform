import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin, onBackToLanding }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: 'amit@healio.ai',
    password: 'password',
    agreeToTerms: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated network latency
    setTimeout(() => {
      if (isRegister) {
        if (!formData.name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (!formData.email.trim()) {
          setError('Please enter an email address');
          setLoading(false);
          return;
        }
        // Register successful, log in
        onLogin({
          name: formData.name,
          email: formData.email,
          age: 30,
          gender: "Male",
          bloodGroup: "O+",
          vitals: {
            systolicBP: 120,
            diastolicBP: 80,
            heartRate: 72,
            spO2: 99,
            weight: 70,
            height: 175
          },
          history: []
        });
      } else {
        // Validation check for mock credentials
        if (formData.email === 'amit@healio.ai' && formData.password === 'password') {
          onLogin(null); // passing null will trigger default user profile (Amit Sharma)
        } else if (formData.email.trim() && formData.password.length >= 6) {
          onLogin({
            name: formData.email.split('@')[0],
            email: formData.email,
            age: 35,
            gender: "Male",
            bloodGroup: "A+",
            vitals: {
              systolicBP: 122,
              diastolicBP: 82,
              heartRate: 75,
              spO2: 98,
              weight: 75,
              height: 180
            },
            history: []
          });
        } else {
          setError('Invalid email or password. Use amit@healio.ai / password');
        }
      }
      setLoading(false);
    }, 1200);
  };

  const handleGuestAccess = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: "Guest Patient",
        email: "guest@healio.ai",
        age: 25,
        gender: "Female",
        bloodGroup: "O-",
        vitals: {
          systolicBP: 118,
          diastolicBP: 78,
          heartRate: 68,
          spO2: 99,
          weight: 60,
          height: 165
        },
        history: []
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center relative p-6 overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-600/20 filter blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/20 filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Top logo/navigation */}
      <div className="absolute top-8 left-8 flex items-center gap-2.5 cursor-pointer z-10" onClick={onBackToLanding}>
        <div className="w-9 h-9 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="font-extrabold text-sm tracking-tight text-white leading-none">Healio</h2>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">AI Care Companion</span>
        </div>
      </div>

      <button 
        onClick={onBackToLanding}
        className="absolute top-8 right-8 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        ← Back to Home
      </button>

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-slate-950/60 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative z-10"
      >
        {/* Toggle Login/Register Tabs */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 mb-8">
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              !isRegister ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              isRegister ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Header */}
        <div className="mb-6 space-y-2">
          <h3 className="text-xl font-extrabold tracking-tight">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            {isRegister 
              ? 'Access symptom checking, report parsing and hospital booking securely.' 
              : 'Log in to view your health records, vitals telemetry and care recommendations.'}
          </p>
        </div>

        {/* Demo Credentials alert for evaluator */}
        {!isRegister && (
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl mb-6 flex items-start gap-2.5">
            <Sparkles className="w-4.5 h-4.5 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-slate-300">Demo Login Details:</p>
              <p className="text-[10px] text-slate-400 font-medium">Email: <span className="text-primary-400 font-bold">amit@healio.ai</span> / Password: <span className="text-primary-400 font-bold">password</span></p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4.5">
          {isRegister && (
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Amit Sharma"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs md:text-sm focus:outline-none focus:border-primary-500 text-white font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs md:text-sm focus:outline-none focus:border-primary-500 text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs md:text-sm focus:outline-none focus:border-primary-500 text-white font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms Agreement (Register only) */}
          {isRegister && (
            <div className="flex items-start gap-2.5 pt-1">
              <input 
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-0.5 rounded border-slate-800 bg-slate-900 text-primary-600 focus:ring-primary-500/20 w-4 h-4"
              />
              <label htmlFor="terms" className="text-[10px] text-slate-400 leading-normal">
                I agree to the local processing terms and HIPAA/GDPR data security policy.
              </label>
            </div>
          )}

          {/* Errors */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-2xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3.5 rounded-2xl text-xs md:text-sm shadow-lg shadow-primary-500/15 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Register & Enter Portal' : 'Login Securely'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-[1px] bg-slate-800 flex-1" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or</span>
          <div className="h-[1px] bg-slate-800 flex-1" />
        </div>

        {/* Guest access */}
        <button
          onClick={handleGuestAccess}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-extrabold py-3.5 rounded-2xl text-xs md:text-sm border border-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Enter as Guest (No Credentials)</span>
        </button>
      </motion.div>
    </div>
  );
}
