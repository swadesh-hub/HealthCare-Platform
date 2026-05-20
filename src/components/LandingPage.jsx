import React, { useState } from 'react';
import { 
  Activity, Sparkles, Heart, Compass, Calendar, 
  FileText, ShieldAlert, ArrowRight, Star, Mail, MessageSquare, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage({ setView }) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  const landingFeatures = [
    { title: "AI Symptom Checker", desc: "Instantly analyze symptoms and receive dynamic clinical triage suggestions in seconds.", icon: Heart, color: "text-rose-500 bg-rose-50" },
    { title: "Smart Hospital Finder", desc: "Locate specialist facilities nearby based on real-time bed capacity, distance, and patient ratings.", icon: Compass, color: "text-blue-500 bg-blue-50" },
    { title: "Report Interpreter", desc: "Translate dense medical PDF reports into plain, easy-to-understand biomarker logs.", icon: FileText, color: "text-amber-500 bg-amber-50" },
    { title: "Instant SOS Distress", desc: "Single-tap emergency assistance that coordinates nearest ER routes and medical contact calls.", icon: ShieldAlert, color: "text-red-500 bg-red-50" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-primary-500 selection:text-white flex flex-col justify-between">
      {/* Navbar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-tight leading-none text-slate-900">Healio</h2>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">AI Care Companion</span>
          </div>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6.5 text-xs font-bold text-slate-500">
          <a href="#hero" className="hover:text-primary-600 transition-colors">Home</a>
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-primary-600 transition-colors">About Us</a>
          <a href="#testimonials" className="hover:text-primary-600 transition-colors">Testimonials</a>
          <a href="#contact" className="hover:text-primary-600 transition-colors">Contact</a>
        </nav>

        {/* Auth triggers */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('login')}
            className="text-xs font-extrabold text-slate-600 hover:text-slate-900 px-4 py-2"
          >
            Login
          </button>
          <button 
            onClick={() => setView('register')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-primary-500/10 transition-all transform hover:-translate-y-0.5"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative px-6 py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/50 bg-[size:30px_30px] pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-primary-100">
              <Sparkles className="w-4 h-4 text-primary-600" />
              On-Device Privacy First AI
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              Your Smart, Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">AI Health Copilot</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Healio integrates localized symptom checkers, emergency hospital finders, and medical report interpreters into one secure, seamless patient companion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3.5 pt-2">
              <button 
                onClick={() => setView('register')}
                className="bg-primary-600 hover:bg-primary-700 text-white font-extrabold px-7 py-4 rounded-2xl text-xs md:text-sm shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setView('login')}
                className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-7 py-4 rounded-2xl text-xs md:text-sm border border-slate-200 transition-colors shadow-sm"
              >
                Explore Portal
              </button>
            </div>
          </div>

          {/* Graphical Telemetry Side */}
          <div className="relative flex justify-center">
            <div className="absolute w-72 h-72 rounded-full bg-primary-200/35 filter blur-3xl -z-10 animate-pulse" />
            <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-premium max-w-md w-full relative">
              <div className="flex justify-between items-center pb-4.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">Vital Statistics</p>
                    <p className="text-[9px] text-slate-400 font-bold">Amit Sharma • 48M</p>
                  </div>
                </div>
                <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                  HEALTHY
                </span>
              </div>

              {/* Mock Vitals telemetry list */}
              <div className="grid grid-cols-2 gap-3 pt-5">
                {[
                  { label: "Blood Pressure", val: "134/85", unit: "mmHg", status: "Optimal" },
                  { label: "Glucose (Fasting)", val: "112", unit: "mg/dL", status: "Borderline" },
                  { label: "Heart Rate", val: "72", unit: "bpm", status: "Optimal" },
                  { label: "Oxygen Levels", val: "98", unit: "%", status: "Excellent" }
                ].map((vit, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[9px] text-slate-400 font-bold block">{vit.label}</span>
                    <span className="text-base font-extrabold text-slate-800 mt-1 block">{vit.val} <span className="text-[10px] font-normal text-slate-400">{vit.unit}</span></span>
                    <span className={`text-[8px] mt-1.5 font-bold block ${vit.status === 'Optimal' || vit.status === 'Excellent' ? 'text-emerald-600' : 'text-amber-600'}`}>{vit.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="px-6 py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3.5 max-w-2xl mx-auto">
            <span className="text-primary-600 text-[10px] font-black uppercase tracking-wider block">Comprehensive Clinical Care</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Designed For Patients, Built on Protocol
            </h2>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
              We leverage the standard Model Context Protocol (MCP) to access medical data securely and serve smart diagnostic solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {landingFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  onClick={() => setView('login')}
                  className="bg-slate-50 border border-slate-100/60 p-6 rounded-3xl hover:bg-white hover:shadow-premium hover:border-slate-100 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-5 shadow-sm`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base group-hover:text-primary-600 transition-colors">{feat.title}</h4>
                    <p className="text-slate-400 text-xs mt-2.5 leading-relaxed font-medium">{feat.desc}</p>
                  </div>
                  <span className="text-[10px] font-black text-primary-600 group-hover:underline mt-4 flex items-center gap-1">
                    Access Tool
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-primary-600 text-[10px] font-black uppercase tracking-wider block">Securing Your Future</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              On-Device Intelligence & Zero-Leak Privacy Policy
            </h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
              Unlike classical cloud assistants, Healio processes your biological records, symptoms, and appointment notes using on-device models and strict local storage. 
            </p>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
              We connect securely with local clinical providers through HL7 FHIR protocols, allowing you to generate time-limited QR access keys whenever you visit a doctor.
            </p>
            <div className="flex gap-6 pt-2 text-slate-700">
              <div>
                <h5 className="text-2xl font-black text-primary-600 leading-none">100%</h5>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Data Privacy</p>
              </div>
              <div>
                <h5 className="text-2xl font-black text-primary-600 leading-none">0s</h5>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Network Delay</p>
              </div>
              <div>
                <h5 className="text-2xl font-black text-primary-600 leading-none">24/7</h5>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Distress Standby</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium space-y-4">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">HL7 FHIR Interoperability Status</h4>
            <div className="space-y-3">
              {[
                { label: "Vitals Bundle Share", status: "Active (Encrypted)" },
                { label: "Patient Profile Token", status: "Secured Local-Only" },
                { label: "Diagnostic Report OCR", status: "Ready (On-Device)" }
              ].map((fhir, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-700">
                  <span>{fhir.label}</span>
                  <span className="text-emerald-600 font-extrabold">{fhir.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-primary-600 text-[10px] font-black uppercase tracking-wider block">Patient Feedback</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">What Users Say</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Amit S.", role: "Cardiac Recovery Patient", review: "The symptom checker accurately flagged my prehypertension and matched me with a cardiologist. Having reports explained in Hindi made it so easy!" },
              { name: "Sarah K.", role: "Working Mother", review: "Being able to upload medical PDFs and instantly see biomarker trends is fantastic. The appointment booking was complete in a click." },
              { name: "Dr. Arvind S.", role: "Metro Cardiac Clinic", review: "The QR code FHIR sharing system makes check-in a breeze. I scan my patient's vitals on my console instantly without manual key-in." }
            ].map((test, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between">
                <p className="text-slate-600 text-xs md:text-sm italic leading-relaxed">"{test.review}"</p>
                <div className="mt-5 pt-4.5 border-t border-slate-200/50 flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs">{test.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{test.role}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-premium space-y-6">
          <div className="text-center space-y-2">
            <Mail className="w-8 h-8 text-primary-600 mx-auto" />
            <h3 className="font-extrabold text-xl text-slate-800">Get in Touch</h3>
            <p className="text-slate-400 text-xs">Have questions or want developer API integrations? Send us a message.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
              <input 
                type="text" 
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
              <input 
                type="email" 
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Message</label>
              <textarea 
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Describe your inquiry..."
              />
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-2xl border border-emerald-100 text-center text-xs font-bold animate-pulse">
                Message Sent Successfully! We will respond shortly.
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold py-3.5 rounded-2xl text-xs md:text-sm shadow-md transition-colors"
              >
                Send Message
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8.5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-extrabold text-sm tracking-tight text-white">Healio</h3>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Your decentralized AI assistant bridging diagnostic checkers, clinical booking grids, and report interpreters.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-xs text-slate-300 mb-3.5">Product</h5>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><button onClick={() => setView('login')} className="hover:text-white">Symptom Checker</button></li>
              <li><button onClick={() => setView('login')} className="hover:text-white">Hospital Finder</button></li>
              <li><button onClick={() => setView('login')} className="hover:text-white">Report Interpreter</button></li>
              <li><button onClick={() => setView('login')} className="hover:text-white">Smart Booking</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs text-slate-300 mb-3.5">Security</h5>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><span className="text-slate-400">On-Device Encryption</span></li>
              <li><span className="text-slate-400">HL7 FHIR Certified</span></li>
              <li><span className="text-slate-400">GDPR Compliant</span></li>
              <li><span className="text-slate-400">HIPAA Compliant</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs text-slate-300 mb-3.5">Contact Support</h5>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary-500" /> +91 80 4991 2233</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary-500" /> support@healio.ai</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold">
          <span>&copy; 2026 Healio Inc. All rights reserved. Built with MCP.</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-white">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white">Terms of Use</span>
            <span className="cursor-pointer hover:text-white">Disclaimer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
