import { useState } from "react";
import { 
  HeartPulse, 
  Activity, 
  Calendar, 
  FolderOpen, 
  Bot, 
  Stethoscope, 
  User, 
  Menu, 
  X,
  Sparkles,
  Accessibility,
  Headphones,
  Siren,
  Globe
} from "lucide-react";
import { Language, TRANSLATIONS } from "../localization";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: "patient" | "doctor";
  setUserRole: (role: "patient" | "doctor") => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  setUserRole,
  language,
  onLanguageChange
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const t = TRANSLATIONS[language];

  const patientTabs: { id: string; label: string; icon: any; highlight?: boolean }[] = [
    { id: "dashboard", label: t.dashboard, icon: Activity },
    { id: "appointments", label: t.appointments, icon: Calendar },
    { id: "vitals", label: t.vitals, icon: HeartPulse },
    { id: "records", label: t.records, icon: FolderOpen },
    { id: "ai-companion", label: t.aiCompanion, icon: Bot, highlight: true },
    { id: "voice-assistant", label: t.voiceAssistant, icon: Headphones },
    { id: "emergency-sos", label: t.emergencySos, icon: Siren, highlight: true },
    { id: "accessibility", label: t.accessibility, icon: Accessibility }
  ];


  const doctorTabs: { id: string; label: string; icon: any; highlight?: boolean }[] = [
    { id: "doctor-dashboard", label: "Simulated Doctor Portal", icon: Stethoscope }
  ];

  const activeTabsList = userRole === "patient" ? patientTabs : doctorTabs;

  return (
    <>
      {/* Mobile top navigation bar */}
      <div className="lg:hidden w-full bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">CarePlatform</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Mobile Language Selector */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="text-xs px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="hi">HI</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
          </select>
          {/* Role switcher on mobile */}
          <button
            onClick={() => {
              const newRole = userRole === "patient" ? "doctor" : "patient";
              setUserRole(newRole);
              setActiveTab(newRole === "patient" ? "dashboard" : "doctor-dashboard");
            }}
            className="text-xs px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 font-medium hover:bg-slate-100"
          >
            Switch to {userRole === "patient" ? "Doctor" : "Patient"}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 lg:sticky lg:top-0
        w-64 bg-slate-900 text-slate-300 border-r border-slate-800/80 h-screen flex flex-col justify-between
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        transition-transform duration-200 ease-in-out
      `}>
        {/* Header section */}
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight text-lg">CarePlatform</h1>
              <p className="text-xs text-slate-400 font-mono">HEALTH PORTAL v1.2</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {/* User profile card simulation */}
          <div className="mb-6 p-4 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center font-bold text-white shadow-xs">
              {userRole === "patient" ? "AM" : "DR"}
            </div>
            <div>
              <div className="text-sm font-semibold text-white truncate max-w-[130px]">
                {userRole === "patient" ? "Alex Mercer" : "Dr. Jenkins (Sim)"}
              </div>
              <div className="text-xs text-slate-400 capitalize">{userRole} Profile</div>
            </div>
          </div>

          {/* Desktop Language Selector */}
          <div className="mb-6 px-3 py-2 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Language</span>
            </div>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-slate-900 text-xs text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
              <option value="hi">हिंदी (HI)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
            </select>
          </div>

          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2 font-mono">
            Navigation Menu
          </div>

          {activeTabsList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/10" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }
                  ${tab.highlight && !isActive ? "border border-blue-500/30 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300" : ""}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white animate-pulse" : "text-slate-400 group-hover:text-white"}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.highlight && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Role toggler section */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
          <div className="text-[9px] font-bold tracking-wider text-slate-500 uppercase px-2 mb-2 font-mono">
            Simulated Persona Toggler
          </div>
          <button
            onClick={() => {
              const newRole = userRole === "patient" ? "doctor" : "patient";
              setUserRole(newRole);
              setActiveTab(newRole === "patient" ? "dashboard" : "doctor-dashboard");
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Switch to {userRole === "patient" ? "Doctor View" : "Patient View"}</span>
          </button>
          
          <div className="mt-4 text-center text-[10px] text-slate-500 font-mono">
            Logged in as swadeshnarwariya66@gmail.com
          </div>
        </div>
      </aside>
    </>
  );
}
