import React, { useState } from 'react';
import { 
  Activity, Heart, Search, Calendar, FileText, QrCode, 
  MessageSquare, Sparkles, User, ShieldCheck, Compass, HelpCircle, LogOut
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import SymptomChecker from './components/SymptomChecker';
import HospitalFinder from './components/HospitalFinder';
import AppointmentBooking from './components/AppointmentBooking';
import ReportInterpreter from './components/ReportInterpreter';
import FollowUpAgent from './components/FollowUpAgent';
import PatientCopilot from './components/PatientCopilot';
import MCPHub from './components/MCPHub';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import { INITIAL_USER_PROFILE } from './data/mockData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('landing');
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedReportKey, setSelectedReportKey] = useState('');
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [triageResult, setTriageResult] = useState(null);

  // Guided Journey Tracking State
  const [journeyStep, setJourneyStep] = useState(1);

  const handleUpdateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const navItems = [
    { id: 'copilot', label: 'AI Patient Copilot', icon: Sparkles },
    { id: 'dashboard', label: 'Wellness Hub', icon: Activity },
    { id: 'symptom_checker', label: 'Symptom Checker', icon: Heart },
    { id: 'finder', label: 'Hospital Finder', icon: Compass },
    { id: 'booking', label: 'Smart Bookings', icon: Calendar },
    { id: 'interpreter', label: 'Report Interpreter', icon: FileText },
    { id: 'followup', label: 'Care Assistant', icon: MessageSquare },
    { id: 'mcp_hub', label: 'MCP Developer Hub', icon: QrCode }
  ];

  // Helper to determine active step in the journey
  const getJourneyProgress = () => {
    let step = 1;
    if (view === 'symptom_checker') step = 2;
    if (triageResult) step = 3;
    if (view === 'finder' && triageResult) step = 4;
    if (view === 'booking' && selectedDoctor) step = 5;
    if (appointmentsList.length > 0) step = 6;
    if (view === 'interpreter') step = 7;
    if (userProfile.history.some(h => h.title.includes("June 2026"))) step = 9;
    return step;
  };

  const activeJourneyStep = getJourneyProgress();

  const journeySteps = [
    { label: "Describe Symptoms", stepNum: 2 },
    { label: "AI Triage", stepNum: 3 },
    { label: "Hospital Match", stepNum: 4 },
    { label: "Book Slot", stepNum: 5 },
    { label: "Consultation Done", stepNum: 6 },
    { label: "Interpret Report", stepNum: 7 },
    { label: "Auto-Saved to DHR", stepNum: 9 }
  ];

  if (!isAuthenticated) {
    if (view === 'login' || view === 'register') {
      return (
        <LoginPage 
          onLogin={(profile) => {
            if (profile) {
              setUserProfile(profile);
            } else {
              setUserProfile(INITIAL_USER_PROFILE);
            }
            setIsAuthenticated(true);
            setView('copilot');
          }}
          onBackToLanding={() => setView('landing')}
        />
      );
    }
    return (
      <LandingPage 
        setView={(targetView) => {
          if (targetView === 'login' || targetView === 'register') {
            setView(targetView);
          } else {
            setView('landing');
          }
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Activity className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight leading-none text-white">Healio</h2>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">AI Care Companion</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-primary-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate max-w-[110px]">{userProfile.name}</p>
                <p className="text-[10px] text-slate-500">{userProfile.bloodGroup} • Age {userProfile.age}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                setView('landing');
              }}
              className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-800">Healio AI</h3>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Home</span>
              <span>/</span>
              <span className="text-slate-800">
                {navItems.find(n => n.id === view)?.label}
              </span>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex items-center gap-4">
            {appointmentsList.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary-100">
                <Calendar className="w-3.5 h-3.5" />
                Consultation Scheduled
              </span>
            )}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-pulse" />
              On-Device AI Active
            </div>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setView('landing');
              }}
              className="text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation (Bottom Bar) */}
        <div className="md:hidden bg-slate-900 border-t border-slate-800 flex justify-around py-3 text-white z-40 shrink-0">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center gap-1 text-[9px] font-medium transition-all ${
                  isActive ? 'text-primary-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="scale-90">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Journey Progress Tracker */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
              <div>
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  Your Guided Healthcare Journey
                </h4>
                <p className="text-[10px] text-slate-400">Complete steps below to test the end-to-end integration</p>
              </div>

              {/* Reset journey button */}
              <button
                onClick={() => {
                  setTriageResult(null);
                  setSelectedSpecialty('');
                  setSelectedHospital(null);
                  setSelectedDoctor(null);
                  setAppointmentsList([]);
                  setSelectedReportKey('');
                  setUserProfile(INITIAL_USER_PROFILE);
                  setView('dashboard');
                }}
                className="text-[10px] font-bold text-slate-500 hover:text-primary-600 transition-colors"
              >
                Reset Flow Sandbox
              </button>
            </div>

            {/* Journey steps nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              {journeySteps.map((step, idx) => {
                const isActive = activeJourneyStep >= step.stepNum;
                const isCurrent = activeJourneyStep === step.stepNum || (activeJourneyStep === 1 && step.stepNum === 2);
                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      // Allow jumping in flow sandbox
                      if (step.stepNum === 2) setView('symptom_checker');
                      if (step.stepNum === 4) setView('finder');
                      if (step.stepNum === 5) setView('booking');
                      if (step.stepNum === 7) setView('interpreter');
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-[10px] flex flex-col justify-between items-center gap-1.5 ${
                      isActive 
                        ? 'bg-primary-50/20 border-primary-200 text-primary-700 font-bold' 
                        : isCurrent
                          ? 'border-amber-400 bg-amber-50/10 text-amber-700 font-bold animate-pulse'
                          : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold shadow-sm ${
                      isActive ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-full">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Render Active View */}
          {view === 'copilot' && (
            <PatientCopilot />
          )}

          {view === 'mcp_hub' && (
            <MCPHub />
          )}

          {view === 'dashboard' && (
            <Dashboard 
              userProfile={userProfile} 
              updateUserProfile={handleUpdateUserProfile} 
              setView={setView}
              setSelectedReport={setSelectedReportKey}
            />
          )}

          {view === 'symptom_checker' && (
            <SymptomChecker 
              setView={setView} 
              setSpecialtyFilter={setSelectedSpecialty} 
              setTriageResult={setTriageResult}
            />
          )}

          {view === 'finder' && (
            <HospitalFinder 
              userProfile={userProfile} 
              view={view}
              setView={setView}
              selectedSpecialty={selectedSpecialty}
              setSelectedHospital={setSelectedHospital}
              setSelectedDoctor={setSelectedDoctor}
              triageResult={triageResult}
            />
          )}

          {view === 'booking' && (
            <AppointmentBooking 
              userProfile={userProfile} 
              selectedHospital={selectedHospital} 
              selectedDoctor={selectedDoctor}
              setSelectedHospital={setSelectedHospital}
              setSelectedDoctor={setSelectedDoctor}
              setAppointmentsList={setAppointmentsList}
            />
          )}

          {view === 'interpreter' && (
            <ReportInterpreter 
              userProfile={userProfile} 
              updateUserProfile={handleUpdateUserProfile} 
              selectedReportKey={selectedReportKey}
              setSelectedReport={setSelectedReportKey}
            />
          )}

          {view === 'followup' && (
            <FollowUpAgent />
          )}
        </div>
      </main>
    </div>
  );
}
